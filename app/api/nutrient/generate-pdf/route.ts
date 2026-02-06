import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { html, title } = await req.json();

    const apiKey = process.env.NUTRIENT_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Nutrient API key not configured" },
        { status: 500 }
      );
    }

    // Nutrient API expects multipart/form-data for the generate_pdf endpoint
    // or a JSON for the build endpoint. Let's use the build endpoint if available
    // or the processor endpoint. 
    // According to recent Nutrient docs, the 'build' endpoint is very powerful.
    
    // For simplicity and since we are sending HTML, we use the generate_pdf logic.
    // We'll use a FormData-like approach with axios.
    
    const formData = new FormData();
    const htmlBlob = new Blob([html], { type: "text/html" });
    formData.append("index.html", htmlBlob, "index.html");
    
    // Instruct Nutrient to generate PDF from the provided HTML
    // We can also provide a JSON instructions file for more control
    const instructions = JSON.stringify({
      parts: [
        {
          html: "index.html"
        }
      ]
    });
    formData.append("instructions", instructions);

    const response = await axios.post("https://api.nutrient.io/build", formData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "multipart/form-data",
      },
      responseType: "arraybuffer",
    });

    return new NextResponse(response.data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${title || "report"}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("PDF Generation Error:", error.response?.data?.toString() || error.message);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: error.message },
      { status: 500 }
    );
  }
}
