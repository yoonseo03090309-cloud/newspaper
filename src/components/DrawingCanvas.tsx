import React, { useRef, useState, useEffect } from "react";
import { Undo, Trash2, Palette, Smile } from "lucide-react";

interface DrawingCanvasProps {
  onSave: (base64Data: string) => void;
  initialData?: string;
  placeholderText?: string;
}

const BRUSH_COLORS = [
  { value: "#000000", label: "검정" },
  { value: "#5c5c5c", label: "회색" },
  { value: "#8B5A2B", label: "갈색" },
  { value: "#FF3B30", label: "빨강" },
  { value: "#FF9500", label: "주황" },
  { value: "#FFCC00", label: "노랑" },
  { value: "#34C759", label: "초록" },
  { value: "#007AFF", label: "파랑" },
  { value: "#5856D6", label: "보라" },
  { value: "#FFFFFF", label: "지우개" },
];

export function DrawingCanvas({ onSave, initialData, placeholderText }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(4);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);

  // Initialize canvas with white background and load initial drawing if exists
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high resolution or adjust bounds
    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const parentWidth = rect?.width || 400;
      const parentHeight = 240; // fixed height for nice layout

      // Keep backup of image
      const tempImage = canvas.toDataURL();

      canvas.width = parentWidth;
      canvas.height = parentHeight;

      // Fill light paper-wood background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Restore backup if it wasn't empty
      if (!isCanvasEmpty || initialData) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = initialData || tempImage;
        setIsCanvasEmpty(false);
      } else {
        // Draw dashed grid guide or text
        ctx.strokeStyle = "#e2e8f0";
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
        ctx.setLineDash([]);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    setIsDrawing(true);
    if (isCanvasEmpty) {
      // Clear guides on start drawing
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setIsCanvasEmpty(false);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveCanvasData();
  };

  const saveCanvasData = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const base64 = canvas.toDataURL("image/png");
    onSave(base64);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw dashed empty guide again
    ctx.strokeStyle = "#e2e8f0";
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
    ctx.setLineDash([]);

    setIsCanvasEmpty(true);
    onSave("");
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-700 font-medium text-sm">
          <Palette className="w-4.5 h-4.5 text-amber-500" />
          <span>신라와 조선의 장인이 되어 직접 그리기!</span>
        </div>
        <button
          onClick={clearCanvas}
          type="button"
          className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>지우기</span>
        </button>
      </div>

      <div
        ref={containerRef}
        className="w-full relative rounded-xl border border-dashed border-slate-300 overflow-hidden bg-white shadow-sm touch-none"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full cursor-crosshair display-block"
        />
        {isCanvasEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 p-4 text-center">
            <Smile className="w-8 h-8 text-slate-300 stroke-1.5 mb-1 animate-bounce" />
            <span className="text-xs font-medium">{placeholderText || "마우스나 터치로 그림을 그려보세요!"}</span>
            <span className="text-[11px] text-slate-350 mt-0.5">그림이 완성되면 신문에 자동으로 업데이트됩니다!</span>
          </div>
        )}
      </div>

      {/* Toolbox */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
        {/* Color Palette */}
        <div className="flex flex-wrap items-center gap-1.5">
          {BRUSH_COLORS.map((bc) => (
            <button
              key={bc.value}
              onClick={() => setColor(bc.value)}
              title={bc.label}
              type="button"
              className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                bc.value === "#FFFFFF" ? "border border-slate-300" : ""
              } ${
                color === bc.value
                  ? "ring-2 ring-amber-400 ring-offset-1 scale-110"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: bc.value }}
            />
          ))}
        </div>

        {/* Thickness / Size */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">선 굵기:</label>
          <div className="flex items-center gap-1">
            {[2, 4, 8, 12].map((size) => (
              <button
                key={size}
                onClick={() => setLineWidth(size)}
                type="button"
                className={`px-2 py-1 text-[11px] font-bold rounded-md cursor-pointer transition ${
                  lineWidth === size
                    ? "bg-slate-700 text-white"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                }`}
              >
                {size === 2 ? "얇게" : size === 4 ? "중간" : size === 8 ? "굵게" : "아주굵게"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
