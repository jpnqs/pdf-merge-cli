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
      if (options.reverse) {
        inputs.reverse();
      }

      const mergedPdf = await PDFDocument.create();

      for (const input of inputs) {
        const bytes = fs.readFileSync(input);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => mergedPdf.addPage(p));
      }

      const mergedBytes = await mergedPdf.save();

      if (options.output) {
        fs.writeFileSync(options.output, mergedBytes);
        console.error(`Merged PDF saved to: ${options.output}`);
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
