import io
from pypdf import PdfReader
from fastapi import UploadFile


def extract_text_from_pdf(file: UploadFile) -> str:
    content = io.BytesIO(file.file.read())
    reader = PdfReader(content)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text
