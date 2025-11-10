declare module "pdf-parse/lib/pdf-parse.js" {
  interface PDFMetadata {
    title?: string;
  }

  interface PDFResult {
    text: string;
    metadata?: PDFMetadata;
  }

  type PDFParse = (dataBuffer: ArrayBuffer | Uint8Array) => Promise<PDFResult>;

  const parse: PDFParse;
  export default parse;
}
