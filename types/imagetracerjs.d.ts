declare module "imagetracerjs" {
  export interface ImageTracerOptions {
    corsenabled?: boolean;
    ltres?: number;
    qtres?: number;
    pathomit?: number;
    colorsampling?: number;
    numberofcolors?: number;
    mincolorratio?: number;
    colorquantcycles?: number;
    scale?: number;
    strokewidth?: number;
    linefilter?: boolean;
    [key: string]: unknown;
  }

  const ImageTracer: {
    imagedataToSVG: (imgData: ImageData, options?: ImageTracerOptions) => string;
    imageToSVG: (url: string, callback: (svgString: string) => void, options?: ImageTracerOptions) => void;
  };

  export default ImageTracer;
}
