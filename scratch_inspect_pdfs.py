import fitz
import os

pdf_dir = r"C:\Users\user\.gemini\antigravity\brain\6b021028-fd42-4366-a9e3-f783f9237035\.user_uploaded"
for fname in sorted(os.listdir(pdf_dir)):
    if fname.endswith(".pdf"):
        fpath = os.path.join(pdf_dir, fname)
        try:
            doc = fitz.open(fpath)
            print(f"=== {fname} ({len(doc)} pages) ===")
            for pno in range(len(doc)):
                page = doc[pno]
                images = page.get_images(full=True)
                print(f"Page {pno+1}: {len(images)} images")
                for img in images:
                    xref = img[0]
                    base_img = doc.extract_image(xref)
                    w = base_img["width"]
                    h = base_img["height"]
                    ext = base_img["ext"]
                    print(f"   xref {xref}: {w}x{h} ({ext})")
        except Exception as e:
            print(f"Error {fname}: {e}")
