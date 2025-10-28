# merge-pdf

A simple Node.js CLI tool to merge multiple PDF files into one.

## Requirements

- [Node.js](https://nodejs.org/) v12 or higher
- [npm](https://www.npmjs.com/)

## Installation

```bash
git clone https://github.com/jpnqs/pdf-merge-cli

cd pdf-merge-cli

npm install
```

## Usage

```bash
# Merge two or more PDFs into one file
node pdf-merger-cli.js file1.pdf file2.pdf -o merged.pdf

# Merge in reverse order
node pdf-merger-cli.js file1.pdf file2.pdf --reverse -o merged.pdf
```

## Options

| Option                | Description                     |
| --------------------- | ------------------------------- |
| `-o, --output <file>` | Specify the output file name    |
| `--reverse`           | Merge the PDFs in reverse order |
| `-h, --help`          | Display help information        |
| `-v, --version`       | Display the version number      |
