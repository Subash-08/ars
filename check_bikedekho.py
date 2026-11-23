import urllib.request
import re

url = "https://www.bikedekho.com/kinetic-green-bikes/e-luna/360-view"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
        found = set(re.findall(r'https://[^\s\"\'<>]+\.jpg', html))
        for u in sorted(found):
            if any(k in u.lower() for k in ["360", "luna", "kinetic"]):
                print(u)
except Exception as e:
    print("Error:", e)
