import json
import pprint
f = open('coins.json', 'w')

import urllib, json
url = "https://www.cryptocompare.com/api/data/coinlist/"
response = urllib.urlopen(url)
data = json.loads(response.read())

outputList = []

output = "[\n" 
for key in data["Data"]:
    outputList.append((data["Data"][key]["CoinName"].lstrip() + " (" + data["Data"][key]["Symbol"] + ")").encode('utf-8'))

outputList.sort()

for i in outputList:
    if(outputList[-1] != i):
        output += ("\t{ \"label\": \"" + i + "\" },\n")
    else:
        output += ("\t{ \"label\": \"" + i + ")" + "\" }\n]")


f.write(output)

    
f.close()
