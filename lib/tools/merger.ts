export interface MergeOptions {
  direction: "vertical" | "horizontal";
  borderWidth: number; // in px
  borderColor: string; // hex
}

/**
 * Combines multiple image files into a single image in-browser using HTML5 Canvas.
 */
export function mergeImages(
  files: File[],
  options: MergeOptions
): Promise<{ blob: Blob; url: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      const { direction, borderWidth, borderColor } = options;

      // Load all images in parallel
      const loadedImages = await Promise.all(
        files.map((file) => {
          return new Promise<HTMLImageElement>((res, rej) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
              URL.revokeObjectURL(url);
              res(img);
            };
            img.onerror = () => {
              URL.revokeObjectURL(url);
              rej(new Error(`Failed to load image: ${file.name}`));
            };
            img.src = url;
          });
        })
      );

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not create canvas 2D context.");
      }

      // Calculate canvas dimensions
      let totalWidth = 0;
      let totalHeight = 0;

      if (direction === "horizontal") {
        const maxHeight = Math.max(...loadedImages.map((img) => img.naturalHeight));
        totalHeight = maxHeight + borderWidth * 2;
        totalWidth =
          loadedImages.reduce((sum, img) => sum + img.naturalWidth, 0) +
          borderWidth * (loadedImages.length + 1);

        canvas.width = totalWidth;
        canvas.height = totalHeight;

        // Draw background border
        ctx.fillStyle = borderColor;
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        // Draw images
        let currentX = borderWidth;
        loadedImages.forEach((img) => {
          // Center vertically if image is shorter than maxHeight
          const yOffset = borderWidth + (maxHeight - img.naturalHeight) / 2;
          ctx.drawImage(img, currentX, yOffset);
          currentX += img.naturalWidth + borderWidth;
        });
      } else {
        const maxWidth = Math.max(...loadedImages.map((img) => img.naturalWidth));
        totalWidth = maxWidth + borderWidth * 2;
        totalHeight =
          loadedImages.reduce((sum, img) => sum + img.naturalHeight, 0) +
          borderWidth * (loadedImages.length + 1);

        canvas.width = totalWidth;
        canvas.height = totalHeight;

        // Draw background border
        ctx.fillStyle = borderColor;
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        // Draw images
        let currentY = borderWidth;
        loadedImages.forEach((img) => {
          // Center horizontally if image is narrower than maxWidth
          const xOffset = borderWidth + (maxWidth - img.naturalWidth) / 2;
          ctx.drawImage(img, xOffset, currentY);
          currentY += img.naturalHeight + borderWidth;
        });
      }

      // Export canvas as Blob (PNG to preserve quality)
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to export merged canvas."));
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
      }, "image/png");

    } catch (error) {
      reject(error);
    }
  });
}
