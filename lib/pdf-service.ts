/**
 * Utility to generate a PDF report using the Nutrient API proxy.
 */
export async function generatePDFReport(
  elementId: string, 
  title: string, 
  options: { preview?: boolean, orientation?: 'portrait' | 'landscape' } = {}
) {
  const orientation = options.orientation || 'portrait';
  const element = document.getElementById(elementId);
  if (!element) return;

  // Clone the element to avoid modifying the UI
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Basic cleanup for the report
  clone.querySelectorAll('.no-pdf').forEach(el => (el as HTMLElement).style.display = 'none');

  // Collect all styles
  let styles = '';
  const styleElements = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
  
  for (const el of styleElements) {
    if (el.tagName === 'STYLE') {
      styles += el.innerHTML;
    } else if (el.tagName === 'LINK') {
      const href = (el as HTMLLinkElement).href;
      if (href) {
        try {
          const res = await fetch(href);
          const css = await res.text();
          styles += css;
        } catch (e) {
          console.warn('Could not fetch external stylesheet:', href);
        }
      }
    }
  }

  const currentDate = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          ${styles}
          @page {
            size: ${orientation};
            margin: 15mm;
          }
          body { 
            background: white; 
            color: #0f172a;
            font-family: 'Inter', sans-serif;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
          }
          .report-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 15px;
            margin-bottom: 30px;
          }
          .logo-text { font-size: 24px; font-weight: 800; color: #1e40af; }
          .report-meta { text-align: right; color: #64748b; font-size: 12px; }
          /* Global removal of shadows and rings for PDF */
          * { 
            box-shadow: none !important; 
            -webkit-box-shadow: none !important;
            ring-width: 0 !important;
            outline: none !important;
            --tw-ring-offset-shadow: 0 0 #0000 !important;
            --tw-ring-shadow: 0 0 #0000 !important;
            --tw-shadow: 0 0 #0000 !important;
            --tw-shadow-colored: 0 0 #0000 !important;
          }

          .card, .card-wrapper, .pdf-no-split { 
            break-inside: avoid-page !important; 
            page-break-inside: avoid !important;
            border: 1px solid #e2e8f0 !important; 
            border-radius: 12px !important;
            margin-bottom: 20px !important;
            box-shadow: none !important;
            display: block !important;
            background-color: white !important;
          }

          /* Keep blue background for special cards but remove ring */
          .bg-blue-600 {
            background-color: #2563eb !important;
            border: none !important;
          }

          /* Force children of grid to not split */
          .grid-pdf > div, .grid-pdf-3 > div, [id^="wellbeing-section-"] > div {
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
          }

          .pdf-no-split {
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
          }
          
          /* Responsive Layout for orientation */
          .grid-pdf {
            display: grid !important;
            grid-template-columns: ${orientation === 'portrait' ? '1fr' : '1fr 1fr'} !important;
            gap: 20px !important;
          }

          .grid-pdf-3 {
            display: grid !important;
            grid-template-columns: ${orientation === 'portrait' ? '1fr 1fr' : 'repeat(3, 1fr)'} !important;
            gap: 20px !important;
          }
          
          /* Forced Layout Fixes for PDF */
          .md\\:grid-cols-2, .lg\\:grid-cols-5, .lg\\:grid-cols-2, .lg\\:grid-cols-3 {
            display: grid !important;
            grid-template-columns: ${orientation === 'portrait' ? '1fr' : '1fr 1fr'} !important;
            gap: 20px !important;
          }
          
          .recharts-responsive-container { 
            width: 100% !important; 
            height: 300px !important; 
            display: block !important;
          }
          
          .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            font-size: 10px;
            color: #94a3b8;
            text-align: center;
            border-top: 1px solid #f1f5f9;
            padding-top: 10px;
          }

          h1, h2, h3 { color: #0f172a; }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="logo-text">WellB</div>
          <div class="report-meta">
            <div style="font-weight: 700; color: #1e293b;">REPORT WELLBEING AZIENDALE</div>
            <div>Generato il ${currentDate} (${orientation === 'portrait' ? 'Verticale' : 'Orizzontale'})</div>
          </div>
        </div>

        <div class="max-w-[${orientation === 'portrait' ? '800px' : '1200px'}] mx-auto">
          ${clone.innerHTML}
        </div>

        <div class="footer">
          Documento Riservato - WellBe &copy; 2026 - www.wellbe.io
        </div>
      </body>
    </html>
  `;

  try {
    const response = await fetch('/api/nutrient/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: htmlContent,
        title: title
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    if (options.preview) {
        return url;
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
