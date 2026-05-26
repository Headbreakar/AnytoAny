import Cropper from "cropperjs";

export interface CropOptions {
  aspectRatio?: number;
  viewMode?: number;
  dragMode?: "crop" | "move" | "none";
}

/**
 * Helper to extract a cropped Blob and Object URL from an active Cropper instance.
 */
export function getCroppedBlob(
  cropper: Cropper,
  mimeType = "image/png",
  quality = 0.95
): Promise<{ blob: Blob; url: string }> {
  return new Promise((resolve, reject) => {
    const canvas = cropper.getCroppedCanvas({
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    if (!canvas) {
      reject(new Error("Failed to generate cropped canvas."));
      return;
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to export cropped canvas as Blob."));
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
      },
      mimeType,
      quality
    );
  });
}
