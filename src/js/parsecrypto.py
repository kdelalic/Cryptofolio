import json
import pprint
f = open('cryptocompare.json', 'w')

import urllib, json
url = "https://www.cryptocompare.com/api/data/coinlist/"
response = urllib.urlopen(url)
data = json.loads(response.read())

output = "[\n" 

for key in data["Data"]:
    if(data["Data"].keys()[-1] != key):
        output += ("\t{ \"label\": \"" + data["Data"][key]["CoinName"].lstrip() + " (" + data["Data"][key]["Symbol"] + ")" + "\" },\n").encode('utf-8')
    else:
        output += ("\t{ \"label\": \"" + data["Data"][key]["CoinName"].lstrip() + " (" + data["Data"][key]["Symbol"] + ")" + "\" }\n]").encode('utf-8')


f.write(output)

    
f.close()
