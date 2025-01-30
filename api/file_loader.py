from dataclasses import dataclass
from pathlib import Path
from pypdfium2 import PdfDocument

TEXT_FILE_PATTERN = r"*.txt"
MD_FILE_PATTERN = r"*.md"
PDF_FILE_PATTERN = r"*.pdf"


@dataclass
class File:
    name: str
    content: str


def extract_pdf_content(file_path: Path) -> str:
    pdf = PdfDocument(file_path)
    content = ''
    for page in pdf:
        text_page = page.get_textpage()
        content += f'{text_page.get_text_bounded()}\n'

    return content


def load_files(file_directory: Path) -> list[File]:
    files = []
    txt_paths = \
        list(file_directory.glob(TEXT_FILE_PATTERN)) + \
        list(file_directory.glob(MD_FILE_PATTERN))

    for f in txt_paths:
        files.append(File(
            name=f.name,
            content=f.read_text()
        ))

    for path in file_directory.glob(PDF_FILE_PATTERN):
        files.append(File(
            name=path.name,
            content=extract_pdf_content(path)
        ))

    return files
