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