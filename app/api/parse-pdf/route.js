import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve) => {
      // Initialize with 1 to get raw text
      const pdfParser = new PDFParser(null, 1);
      
      pdfParser.on("pdfParser_dataError", errData => {
        console.error('PDF parsing error:', errData.parserError);
        resolve(NextResponse.json(
          { error: 'Failed to parse PDF document' },
          { status: 500 }
        ));
      });

      pdfParser.on("pdfParser_dataReady", pdfData => {
        const text = pdfParser.getRawTextContent();
        resolve(NextResponse.json({
          text: text,
          pages: pdfData.Pages ? pdfData.Pages.length : 1,
        }));
      });

      pdfParser.parseBuffer(buffer);
    });

  } catch (error) {
    console.error('Error in PDF route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
