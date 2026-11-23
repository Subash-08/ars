import urllib.request
import re
import os

# Search specifically for E-Luna on motorcycle portals
query = '"E-Luna" site:rushlane.com OR site:bikewale.com OR site:autocarindia.com'
url = f'https://www.bing.com/images/search?q={urllib.parse.quote(query)}&form=HDRSC2&first=1'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')

matches = re.findall(r'murl&quot;:&quot;(http[^&]+)&quot;', html)
print('Found matches:', len(matches))

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for i, m in enumerate(matches):
    print(f'{i}: {m}')
    # Must be from an automotive domain
    if any(auto in m.lower() for auto in ['rushlane', 'bikewale', 'autocar', 'zigwheels', 'motorbeam', 'overdrive', 'carandbike']):
        try:
            req_img = urllib.request.Request(m, headers=headers)
            with urllib.request.urlopen(req_img, timeout=8) as resp:
                data = resp.read()
                if len(data) > 40000:
                    with open('public/assets/bikes/commuter-family-hd.jpg', 'wb') as f:
                        f.write(data)
                    with open('public/assets/bikes/commuter-clean.jpg', 'wb') as f:
                        f.write(data)
                    print(f'Successfully downloaded REAL E-LUNA image: {m} ({len(data)} bytes)')
                    break
        except Exception as e:
            print(f'Error downloading {m}: {e}')
