import React from "react";
import {
  Image,
  FileText,
  FileSpreadsheet,
  BarChart3,
  TrendingUp,
  Scissors,
  Crop,
  Link2,
  FileEdit,
  LucideProps
} from "lucide-react";

export type IconType =
  | "Image"
  | "FileText"
  | "FileSpreadsheet"
  | "BarChart3"
  | "TrendingUp"
  | "Scissors"
  | "Crop"
  | "Link2"
  | "FileEdit";

interface ToolIconProps extends Omit<LucideProps, "ref"> {
  name: IconType;
}

export default function ToolIcon({ name, ...props }: ToolIconProps) {
  switch (name) {
    case "Image":
      return <Image {...props} />;
    case "FileText":
      return <FileText {...props} />;
    case "FileSpreadsheet":
      return <FileSpreadsheet {...props} />;
    case "BarChart3":
      return <BarChart3 {...props} />;
    case "TrendingUp":
      return <TrendingUp {...props} />;
    case "Scissors":
      return <Scissors {...props} />;
    case "Crop":
      return <Crop {...props} />;
    case "Link2":
      return <Link2 {...props} />;
    case "FileEdit":
      return <FileEdit {...props} />;
    default:
      return <Image {...props} />;
  }
}
