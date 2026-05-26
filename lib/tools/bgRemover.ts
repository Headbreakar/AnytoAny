import { removeBackground, type Config } from "@imgly/background-removal";

/**
 * Removes the background of an image using serverless AI in-browser via WASM.
 */
export async function removeImageBackground(
  file: File,
  onProgress?: (step: string, percent: number) => void
): Promise<{ blob: Blob; url: string }> {
  const config: Config = {
output: {
      format: "image/png",
      quality: 0.95,
      // Removed 'type' property to resolve the TypeScript error
    },
    progress: (key: string, current: number, total: number) => {
      // key can be: 'fetch' (downloading model), 'onnx' (initializing runtime), 'compute' (running model)
      const percent = total > 0 ? Math.round((current / total) * 100) : 0;
      if (onProgress) {
        onProgress(key, percent);
      }
    },
  };

  const resultBlob = await removeBackground(file, config);
  const url = URL.createObjectURL(resultBlob);
  return { blob: resultBlob, url };
}
