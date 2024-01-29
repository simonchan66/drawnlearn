import { useRef, useEffect } from 'react';

export const CanvasWithLetter = ({ drawLine }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(new Image());
  let prevPoint = null;

  // Load the letter image
  useEffect(() => {
    imageRef.current.onload = () => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.globalAlpha = 0.1
      ctx.drawImage(imageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.globalAlpha = 1.0;
    };
    imageRef.current.src = './lettera.png'; // The path to your dotted letter images

  }, []);

  // Initialize the drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    const startDrawing = (event) => {
      prevPoint = { x: event.offsetX, y: event.offsetY };
      canvas.addEventListener('mousemove', drawing);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);
    };

    const drawing = (event) => {
      const currentPoint = { x: event.offsetX, y: event.offsetY };
      drawLine({ prevPoint, currentPoint, ctx });

      // Update prevPoint for the next drawLine call
      prevPoint = currentPoint;
    };

    const stopDrawing = () => {
      prevPoint = null;
      canvas.removeEventListener('mousemove', drawing);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };

    canvas.addEventListener('mousedown', startDrawing);
    
    // Cleanup function to remove event listeners
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', drawing);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, [drawLine]);

  return (
    <canvas ref={canvasRef} width={400} height={600}
      className="border border-black rounded-lg" />
  );
};