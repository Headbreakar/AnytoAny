export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolMeta {
  slug: string;
  name: string;
  title: string;
  description: string;
  category: "image" | "spreadsheet" | "document";
  fileSizeCap: number; // in MB
  allowedTypes: string[];
  howTo: string[];
  faqs: FAQItem[];
  icon: "Image" | "FileText" | "FileSpreadsheet" | "BarChart3" | "TrendingUp" | "Scissors" | "Crop" | "Link2" | "FileEdit";
}

export const TOOLS: Record<string, ToolMeta> = {
  "jpg-to-png": {
    slug: "jpg-to-png",
    name: "JPG to PNG",
    title: "Convert JPG to PNG Online - Free & Instant | AnytoAny",
    description: "Convert your JPG images to high-quality PNG format instantly. Processed entirely in your browser for 100% privacy and security.",
    category: "image",
    fileSizeCap: 15,
    allowedTypes: ["image/jpeg", "image/jpg"],
    howTo: [
      "Select or drag and drop your JPG file into the upload zone.",
      "The conversion runs instantly inside your browser.",
      "Click the Download button to save your converted PNG file."
    ],
    faqs: [
      {
        question: "Is this JPG to PNG converter free?",
        answer: "Yes, AnytoAny is 100% free and requires no registration or subscription."
      },
      {
        question: "Are my files uploaded to a server?",
        answer: "No. The conversion is performed directly in your browser using HTML5 Canvas. Your files never leave your device."
      },
      {
        question: "What is the maximum file size I can convert?",
        answer: "You can convert JPG files up to 15MB in size."
      }
    ],
    icon: "Image"
  },
  "png-to-jpg": {
    slug: "png-to-jpg",
    name: "PNG to JPG",
    title: "Convert PNG to JPG Online - Free & Instant | AnytoAny",
    description: "Convert your transparent or flat PNG images to JPG format. Fast, private, and runs completely client-side in your web browser.",
    category: "image",
    fileSizeCap: 15,
    allowedTypes: ["image/png"],
    howTo: [
      "Upload or drag your PNG image into the box.",
      "Our client-side tool will process and convert the PNG to JPG in milliseconds.",
      "Download your new JPG file instantly."
    ],
    faqs: [
      {
        question: "Will I lose transparency when converting PNG to JPG?",
        answer: "Yes. JPG files do not support transparency. Any transparent areas in your PNG will be converted to a solid white background."
      },
      {
        question: "Does AnytoAny save copies of my images?",
        answer: "Absolutely not. The converter runs locally on your machine. We do not transmit or store your files on any external servers."
      }
    ],
    icon: "Image"
  },
  "image-to-pdf": {
    slug: "image-to-pdf",
    name: "Image to PDF",
    title: "Convert Images to PDF - Combine Photos Online | AnytoAny",
    description: "Convert multiple JPG, PNG, or WebP images into a single, beautifully formatted PDF document. Highly secure and browser-only.",
    category: "image",
    fileSizeCap: 15,
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    howTo: [
      "Select one or more images (JPG, PNG, WebP) to upload.",
      "Reorder the images if necessary or adjust paper settings.",
      "Click 'Generate PDF' and download the compiled document."
    ],
    faqs: [
      {
        question: "Can I merge multiple images into one PDF?",
        answer: "Yes, you can upload multiple images and combine them into a single multi-page PDF document."
      },
      {
        question: "Does it support WebP format?",
        answer: "Yes, our converter supports JPG, PNG, and WebP image inputs."
      }
    ],
    icon: "FileText"
  },
  "xlsx-to-csv": {
    slug: "xlsx-to-csv",
    name: "XLSX to CSV",
    title: "Convert Excel XLSX to CSV - Free Sheet Selector | AnytoAny",
    description: "Convert Excel spreadsheets (.xlsx) to comma-separated CSV files. Select custom sheets dynamically from multi-sheet workbooks in-browser.",
    category: "spreadsheet",
    fileSizeCap: 20,
    allowedTypes: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    howTo: [
      "Choose your Excel (.xlsx) file.",
      "If your spreadsheet has multiple sheets, select the sheet you wish to extract from the pop-up menu.",
      "Save your converted CSV file instantly."
    ],
    faqs: [
      {
        question: "What happens if my Excel file has multiple sheets?",
        answer: "Our smart XLSX to CSV converter detects all sheets and prompts you with a clean selector so you can choose exactly which sheet to export."
      },
      {
        question: "Is sheet extraction secure?",
        answer: "Yes. All extraction happens in your local web browser using SheetJS. No spreadsheet data is sent over the internet."
      }
    ],
    icon: "BarChart3"
  },
  "csv-to-xlsx": {
    slug: "csv-to-xlsx",
    name: "CSV to Excel",
    title: "Convert CSV to Excel XLSX Online - Free & Secure | AnytoAny",
    description: "Turn your raw CSV files into formatted Excel spreadsheets (.xlsx) instantly. Pure client-side parsing ensures total data security.",
    category: "spreadsheet",
    fileSizeCap: 20,
    allowedTypes: ["text/csv", "application/csv", "application/vnd.ms-excel"],
    howTo: [
      "Drag and drop your .csv file into the upload zone.",
      "The tool processes the tabular data and builds an XLSX file.",
      "Click Download to open the formatted sheet in Excel."
    ],
    faqs: [
      {
        question: "Can this convert large CSV files?",
        answer: "Yes! You can convert CSV files up to 20MB directly in your browser."
      },
      {
        question: "Are commas the only separator supported?",
        answer: "Our parser is smart and automatically detects common delimiters like commas, semicolons, and tabs."
      }
    ],
    icon: "TrendingUp"
  },
  "background-remover": {
    slug: "background-remover",
    name: "Background Remover",
    title: "Free AI Background Remover - Remove Image Backgrounds | AnytoAny",
    description: "Remove image backgrounds instantly in-browser using next-gen serverless AI. Zero uploads, high precision, and complete privacy.",
    category: "image",
    fileSizeCap: 10,
    allowedTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    howTo: [
      "Select a JPG, PNG, or WebP photo.",
      "Wait for the serverless AI model to initialize and isolate the subject.",
      "Download your new transparent PNG cutout."
    ],
    faqs: [
      {
        question: "Does the AI run on a server?",
        answer: "No. The AI model runs directly inside your browser using WebAssembly (WASM). Your photos are never sent to external servers."
      },
      {
        question: "Why does the first removal take a few seconds?",
        answer: "On the first run, the browser downloads the lightweight neural network model (approx. 7MB) to your local cache. Subsequent removals are near-instantaneous."
      }
    ],
    icon: "Scissors"
  },
  "image-cropper": {
    slug: "image-cropper",
    name: "Image Cropper",
    title: "Crop Image Online - Free Aspect Ratio Presets | AnytoAny",
    description: "Crop and resize your images online. Select standard social media aspect ratios (1:1, 16:9, 4:3) with smooth real-time previews.",
    category: "image",
    fileSizeCap: 15,
    allowedTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    howTo: [
      "Upload your photo.",
      "Adjust the crop selection handles or pick a pre-set aspect ratio.",
      "Click 'Crop Image' and download your cropped photo."
    ],
    faqs: [
      {
        question: "What crop ratios are supported?",
        answer: "We support free cropping as well as common ratios: Square (1:1), Landscape (16:9, 4:3), Portrait (9:16), and Banner formats."
      },
      {
        question: "Is there a loss in image quality?",
        answer: "No. The cropping extracts original resolution pixels using high-quality canvas draw algorithms."
      }
    ],
    icon: "Crop"
  },
  "image-merger": {
    slug: "image-merger",
    name: "Image Merger",
    title: "Merge Images Online - Stitch Photos Together | AnytoAny",
    description: "Combine multiple images vertically or horizontally into a single picture. Choose custom borders, alignments, and output formats.",
    category: "image",
    fileSizeCap: 15,
    allowedTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    howTo: [
      "Upload two or more pictures.",
      "Choose 'Vertical' or 'Horizontal' layout orientation.",
      "Adjust border width, background color, and click 'Merge Images' to download."
    ],
    faqs: [
      {
        question: "Can I merge different image sizes?",
        answer: "Yes. Our tool automatically aligns and rescales images to fit the alignment grid perfectly."
      },
      {
        question: "How many images can I merge?",
        answer: "You can merge up to 10 images at once."
      }
    ],
    icon: "Link2"
  },
  "word-to-pdf": {
    slug: "word-to-pdf",
    name: "Word to PDF",
    title: "Convert Word DOCX to PDF Online - Free & Clean | AnytoAny",
    description: "Convert Microsoft Word document files (.docx) to clean, readable PDF files. Secure cloud processing with instant deletion.",
    category: "document",
    fileSizeCap: 25,
    allowedTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    howTo: [
      "Select a Word Document (.docx).",
      "Our system will securely convert it into a standard PDF.",
      "Download your converted PDF document instantly."
    ],
    faqs: [
      {
        question: "Are my documents secure?",
        answer: "Yes. Unlike client-side conversions, Word documents require secure server processing. Files are handled over SSL and deleted instantly post-conversion."
      },
      {
        question: "Does it support old .doc formats?",
        answer: "Currently, our tool supports modern .docx Word formats for maximum fidelity."
      }
    ],
    icon: "FileEdit"
  },
  "pdf-to-word": {
    slug: "pdf-to-word",
    name: "PDF to Word",
    title: "Convert PDF to Word DOCX Online - Edit PDFs Free | AnytoAny",
    description: "Convert PDF documents back to editable Microsoft Word files (.docx) online. Quick, accurate formatting reproduction.",
    category: "document",
    fileSizeCap: 25,
    allowedTypes: ["application/pdf"],
    howTo: [
      "Upload your PDF document.",
      "The service will extract text and rebuild your document into a DOCX format.",
      "Download and edit in Microsoft Word."
    ],
    faqs: [
      {
        question: "Can I convert password-protected PDFs?",
        answer: "If a PDF is password-protected, you must decrypt it or provide the key before converting. Our secure API prevents converting locked files."
      },
      {
        question: "Is the formatting preserved?",
        answer: "We make every effort to extract text and layouts to create an editable Word document with matching fonts and tables."
      }
    ],
    icon: "FileText"
  }
};
