#!/usr/bin/env node
import fs from "fs";
import { PDFDocument } from "pdf-lib";
import { Command } from "commander";

const program = new Command();

program
  .name("merge-pdf")
  .description("Merge multiple PDF files into one (write to stdout by default)")
  .version("1.0.0")
  .argument("<inputs...>", "Input PDF file paths")
  .option("-r, --reverse", "Merge in reverse order")
  .option("-o, --output <file>", "Output file path (optional)")
  .action(async (inputs, options) => {
    try {

      let outputPages = 0;

      if (options.reverse) {
        console.log("Merging in reverse order...");
        inputs.reverse();
      }

      for (const input of inputs) {
        // check existence of input files
        if (!fs.existsSync(input)) {
          throw new Error(`Input file not found '${input}'`);
        }
        // check for PDF file extension
        if (!input.toLowerCase().endsWith(".pdf")) {
          throw new Error(`Input file is not a PDF '${input}'`);
        }
        // check for non-empty file
        const stats = fs.statSync(input);
        if (stats.size === 0) {
          throw new Error(`Input file is empty '${input}'`);
        }
      }

      const mergedPdf = await PDFDocument.create();

      for (const input of inputs) {
        const bytes = fs.readFileSync(input);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        console.log(`Merging: ${input} (${pages.length} pages)`);
        pages.forEach((p) => mergedPdf.addPage(p));
      }

      outputPages = mergedPdf.getPageCount();
      const mergedBytes = await mergedPdf.save();

      if (options.output) {
        fs.writeFileSync(options.output, mergedBytes);
        console.error(`Merged PDF saved to: ${options.output} (${outputPages} pages)`);
      } else {
        // Write raw binary PDF to stdout
        process.stdout.write(Buffer.from(mergedBytes));
      }
    } catch (err) {
      console.error("Error merging PDFs:", err.message);
      process.exit(1);
    }
  });

program.parse();
