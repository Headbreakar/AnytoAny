import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded.", code: "NO_FILE" },
        { status: 400 }
      );
    }

    // Validate size limit (25MB)
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 25) {
      return NextResponse.json(
        { success: false, error: "File exceeds 25MB limit.", code: "FILE_TOO_LARGE" },
        { status: 400 }
      );
    }

    const apiKey = process.env.CLOUDMERSIVE_API_KEY || process.env.CONVERT_API_KEY;

    if (apiKey) {
      // Direct Cloudmersive integration
      const cloudmersiveUrl = "https://api.cloudmersive.com/convert/docx/to/pdf";
      
      const apiFormData = new FormData();
      apiFormData.append("inputFile", file);

      const response = await fetch(cloudmersiveUrl, {
        method: "POST",
        headers: {
          Apikey: apiKey,
        },
        body: apiFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { success: false, error: `Cloud API failed: ${errorText}`, code: "API_ERROR" },
          { status: response.status }
        );
      }

      const pdfBuffer = await response.arrayBuffer();
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${file.name.replace(/\.docx$/i, ".pdf")}"`,
        },
      });
    } else {
      // Robust Local Mock Mode
      // Simulate conversion delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const fileName = file.name;
      const pdfText = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /Resources <</Font <</F1 4 0 R>>>> /MediaBox [0 0 612 792] /Contents 5 0 R>> endobj
4 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
5 0 obj <</Length 350>> stream
BT
/F1 18 Tf
50 700 Td
(AnytoAny Converter - Mock Mode Active) Tj
/F1 12 Tf
0 -30 Td
(Converted document: ${fileName}) Tj
0 -20 Td
(File size: ${(file.size / 1024).toFixed(1)} KB) Tj
0 -40 Td
(Status: SUCCESS) Tj
0 -20 Td
(To enable live conversion, add CLOUDMERSIVE_API_KEY in your env.) Tj
ET
endstream
endobj
trailer <</Size 6 /Root 1 0 R>>
%%EOF`;

      const encoder = new TextEncoder();
      const pdfBuffer = encoder.encode(pdfText);

      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${fileName.replace(/\.docx$/i, ".pdf")}"`,
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
export const runtime = "nodejs";
