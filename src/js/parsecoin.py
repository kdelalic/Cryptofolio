import json
from pprint import pprint

f = open('coins.json', 'w')

import urllib, json
url = "https://api.coinmarketcap.com/v1/ticker/?limit=0"
response = urllib.urlopen(url)
data = json.loads(response.read())

output = "[\n" 

for i in range(len(data)):
    if(i != len(data) - 1):
        output += "\t{ \"label\": \"" + data[i]["name"] + " (" + data[i]["symbol"] + ")" + "\" },\n"
    else:
        output += "\t{ \"label\": \"" + data[i]["name"] + " (" + data[i]["symbol"] + ")" + "\" }\n]"

f.write(output.replace("-", " "))
f.close()
