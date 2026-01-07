import { useEffect, useRef, useState } from "react";
import DrawCanvas from "./DrawCanvas";
import { Document, Page } from "react-pdf";
import { Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

type Props = {
  file: File;
  tool: string;
  color: string;
  size: number;
};

export default function PDFViewer({ file, tool, color, size }: Props) {
  const [page, setPage] = useState(1);
  const fileUrl = URL.createObjectURL(file);
  return (
    <div className="viewer">
      <Viewer fileUrl={fileUrl} defaultScale={SpecialZoomLevel.PageWidth} />
    </div>
  );
}
