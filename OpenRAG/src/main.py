"""
File: main.py
Author: Nathan Collard <ncollard@openblackbox.be>
Contact: opensource@openblackbox.be
License: MIT License
Project URL: https://github.com/OpenBlackBoxLab/OpenRAG

Brief description of this file's purpose.

Copyright (c) 2024 Open BlackBox

This file is part of OpenRAG and is released under the MIT License.
See the LICENSE file in the root directory of this project for details.
"""
import time
import json
import os
from pymilvus import DataType, FieldSchema, utility
from openrag.chunk_vectorization import chunk_vectorization
from openrag.text_chunking import text_chunking
from openrag.text_extraction import text_extraction
from openrag.utils import azure_queue_handler, azure_storage_handler
from openrag.vectordb.milvus_adapter import init_milvus_connection
from openrag.vectordb.store_vectors import create_collection_schema, store_vectors
from tqdm import tqdm
import requests

print("OpenRAG is running...")

directory_path = "Data/Internal/Company StIT"
file_extensions = ['.docx']
            
vectors = []
sources = []
global_indexing = dict()

# Loop over every file in the directory
for filename in os.listdir(directory_path):
    if any(filename.endswith(ext) for ext in file_extensions):
        file_path = os.path.join(directory_path, filename)
        
        print(f"Processing file: {filename}")

        pages_text = text_extraction.extract_docx_text(file_path)
        processed_text = [text_extraction.preprocess_text(page) for page in pages_text]
        data = [{"text": text, "page": index + 1} for index, text in enumerate(pages_text)]
        pages = [(entry["text"], entry["page"]) for entry in data]
        chunks = text_chunking.overlapping_chunking(pages, text_chunking.CHUNK_SIZE_TOKENS_MIN, text_chunking.CHUNK_SIZE_TOKENS_MAX, text_chunking.OVERLAP_SIZE_TOKENS)

        json_filename = filename.replace('.docx', '_chunks.json')
        json_file_path = os.path.join(directory_path, json_filename)
        with open(json_file_path, "w") as f:
            json.dump(chunks, f)

        index_data = dict()
        index_data["len"] = len(chunks)
        index_data["start"] = len(vectors)

        chunks = [chunk['text'] for chunk in chunks.values()]

        for chunk in tqdm(chunks, desc="Vectorizing chunks"):
            vectorizer = chunk_vectorization.MistralVectorizer()
            vectorized_text = vectorizer.vectorize(chunk)
            vectors.append(vectorized_text)
            sources.append("Internal")

        index_data["end"] = len(vectors) - 1

        global_indexing_key = filename.split('.')[0].upper()
        global_indexing[global_indexing_key] = index_data

print("Processing complete.")
    
with open("global_indexing.json", "w") as f:
    json.dump(global_indexing, f)

init_milvus_connection()

collection_name = "mistral_collection"

if collection_name in utility.list_collections():
    utility.drop_collection(collection_name)

index_field = FieldSchema(name="index", dtype=DataType.INT64, is_primary=True)
vector_field = FieldSchema(name="vector", dtype=DataType.FLOAT_VECTOR, dim=1024)
source_field = FieldSchema(name="source", dtype=DataType.VARCHAR, max_length=256)
schema = create_collection_schema([index_field, vector_field, source_field])

store_vectors(collection_name, schema, vectors, vector_field.name, sources)