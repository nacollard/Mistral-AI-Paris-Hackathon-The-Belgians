import requests

response = requests.get('https://raw.githubusercontent.com/run-llama/llama_index/main/docs/docs/examples/data/paul_graham/paul_graham_essay.txt')
text = response.text


#print(text[:1000])

link1 = 'https://ws.vlpar.be:443/e/opendata/verg/volledig/zoek/datums/2021-10-01/2021-10-31'
link2 = 'https://ws.vlpar.be:443/e/opendata/verg/zoek?year=2024&month=4'
link3 = 'https://ws.vlpar.be:443/e/opendata/verg/45/hand?idPrsHighlight=0'

response2 = requests.get(link3)
print(response2.text)
#print(response2.json())