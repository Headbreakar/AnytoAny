import ImageTracer from "imagetracerjs";

/**
 * Traces a PNG/raster image file into a true SVG vector string using HTML5 Canvas & ImageTracer.
 */
export function convertPngToSvg(file: File): Promise<{ blob: Blob; url: string; svgString: string }> {
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
        reject(new Error("Failed to initialize canvas 2D context."));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      try {
        // High quality tracing options
        const options = {
          corsenabled: false,
          ltres: 1,
          qtres: 1,
          pathomit: 8,
          colorsampling: 2, // 2 = High quality sampling
          numberofcolors: 32,
          mincolorratio: 0.02,
          colorquantcycles: 3,
          scale: 1,
          strokewidth: 0,
          linefilter: true,
        };

        const svgString = ImageTracer.imagedataToSVG(imgData, options);
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        resolve({ blob, url, svgString });
      } catch (err) {
        reject(new Error(err instanceof Error ? err.message : "Failed to vectorize PNG image."));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image file."));
    };

    img.src = objectUrl;
  });
}
