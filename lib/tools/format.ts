/**
 * Converts a file (image) to a target format (PNG or JPEG) using the HTML5 Canvas API in-browser.
 */
export function convertImageFormat(
  file: File,
  targetFormat: "image/png" | "image/jpeg" | "image/webp",
  quality = 0.95
): Promise<{ blob: Blob; url: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not create canvas 2D context."));
        return;
      }

      // If converting to JPEG, paint a white background to avoid black transparency fill
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to generate file blob from canvas."));
            return;
          }
          const url = URL.createObjectURL(blob);
          resolve({ blob, url });
        },
        targetFormat,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image. Make sure it is a valid image file."));
    };

    img.src = objectUrl;
  });
}
