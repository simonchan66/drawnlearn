import { useEffect, useState, useRef } from "react";

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<Point | null>(null);

  const onStart = (point: Point) => {
    setIsDrawing(true);
    prevPoint.current = point;
  };

  const onEnd = () => {
    setIsDrawing(false);
    prevPoint.current = null;
  };

  const onMove = (point: Point) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    onDraw({ ctx, currentPoint: point, prevPoint: prevPoint.current });
    prevPoint.current = point;
  };

  const computePointInCanvas = (clientX: number, clientY: number): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };
  useEffect(() => {
    const canvasElem = canvasRef.current;
    
    const mouseDownHandler = (e: MouseEvent) => {
      const point = computePointInCanvas(e.clientX, e.clientY);
      if (point) onStart(point);
    };
  
    const touchStartHandler = (e: TouchEvent) => {
      const touch = e.touches[0];
      const point = computePointInCanvas(touch.clientX, touch.clientY);
      
      // Check if the touchstart event is on a button or outside the canvas
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON') {
        return; // If it's a button, don't start drawing
      }
      
      if (point) {
        e.preventDefault();
        onStart(point);
      }
    };
  
    const touchMoveHandler = (e: TouchEvent) => {
      const touch = e.touches[0];
      const point = computePointInCanvas(touch.clientX, touch.clientY);
      if (point) {
        e.preventDefault();
        onMove(point);
      }
    };
  
    const mouseMoveHandler = (e: MouseEvent) => {
      if (!isDrawing) return;
      const point = computePointInCanvas(e.clientX, e.clientY);
      if (point) onMove(point);
    };
  
    const mouseUpHandler = () => onEnd();
    const touchEndHandler = () => onEnd();
  
    // Attach mouse event listeners to the canvas element
    canvasElem?.addEventListener("mousedown", mouseDownHandler);
    // Attach touch event listeners to the canvas element with { passive: false }
    canvasElem?.addEventListener("touchstart", touchStartHandler, { passive: false });
    canvasElem?.addEventListener("touchmove", touchMoveHandler, { passive: false });
  
    // Mousemove and mouseup events should be attached to the window to handle drag/release outside the canvas
    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler);
    // Touchend should also be attached to the window
    window.addEventListener("touchend", touchEndHandler, { passive: false });
  
    // Cleanup function to remove event listeners
    return () => {
      canvasElem?.removeEventListener("mousedown", mouseDownHandler);
      canvasElem?.removeEventListener("touchstart", touchStartHandler);
      canvasElem?.removeEventListener("touchmove", touchMoveHandler);
  
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
      window.removeEventListener("touchend", touchEndHandler);
    };
  }, [onDraw]); // Make sure to add all external dependencies in this array

  return { canvasRef };
};