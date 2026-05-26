import { jsPDF } from "jspdf";

/**
 * Compiles a list of image files into a single PDF document in-browser using jsPDF.
 * Automatically sizes each PDF page to match the corresponding image's resolution.
 */
export function imagesToPdf(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; url: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      // Initialize with default settings, we will override pages dynamically
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
        compress: true,
      });

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Load image to get original dimensions
        const { img, objectUrl } = await new Promise<{ img: HTMLImageElement; objectUrl: string }>((res, rej) => {
          const imgObj = new Image();
          const objUrl = URL.createObjectURL(file);
          imgObj.onload = () => res({ img: imgObj, objectUrl: objUrl });
          imgObj.onerror = () => {
            URL.revokeObjectURL(objUrl);
            rej(new Error(`Failed to load image: ${file.name}`));
          };
          imgObj.src = objUrl;
        });

        const width = img.naturalWidth;
        const height = img.naturalHeight;

        // Add page to match image size exactly
        if (i > 0) {
          pdf.addPage([width, height], width > height ? "l" : "p");
        } else {
          // Remove default a4 first page and insert custom size page
          pdf.deletePage(1);
          pdf.addPage([width, height], width > height ? "l" : "p");
        }

        // Draw image onto canvas to standardize to JPEG format
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          throw new Error("Could not create canvas context.");
        }
        ctx.drawImage(img, 0, 0);

        const imgData = canvas.toDataURL("image/jpeg", 0.90);
        pdf.addImage(imgData, "JPEG", 0, 0, width, height);

        URL.revokeObjectURL(objectUrl);

        if (onProgress) {
          onProgress(Math.round(((i + 1) / files.length) * 100));
        }
      }

      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      resolve({ blob: pdfBlob, url: pdfUrl });
    } catch (error) {
      reject(error);
    }
  });
}
