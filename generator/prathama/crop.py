# crop the Vision paragraph that best matches a text from a page image: python3 -I crop.py <ocr.json> <page.jpg> <text> <out.jpg>
import json,sys,subprocess
from difflib import SequenceMatcher
o,img,txt,out=sys.argv[1:5]
d=json.load(open(o)); best=(0,None)
for b in d['fullTextAnnotation']['pages'][0]['blocks']:
  for p in b['paragraphs']:
    t=''.join(''.join(s['text'] for s in w['symbols']) for w in p['words'])
    r=SequenceMatcher(None,txt.replace(' ',''),t).ratio()
    if r>best[0]: best=(r,p['boundingBox']['vertices'])
v=best[1]; xs=[a.get('x',0) for a in v]; ys=[a.get('y',0) for a in v]
x0,y0,x1,y1=max(0,min(xs)-20),max(0,min(ys)-15),max(xs)+20,max(ys)+15
subprocess.run(['sips','-c',str(y1-y0),str(x1-x0),'--cropOffset',str(y0),str(x0),img,'--out',out],capture_output=True)
print(round(best[0],2))
