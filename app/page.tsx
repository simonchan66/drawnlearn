'use client'
import Image from "next/image";
import { useDraw } from "@/hooks/useDraw";
import { useRef } from "react";

export default function Home() {
  const { canvasRef } = useDraw(drawLine);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const color = "#000";
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  function handleSend() {
    if (canvasRef.current) {
      const canvasImage = canvasRef.current.toDataURL('image/png');
      if (textAreaRef.current) {
        const textArea = textAreaRef.current;
        textArea.value = canvasImage; // Set the value of the textarea to the image data URL
        textArea.select(); // Select the content
        document.execCommand('copy'); // Copy the selected content to the clipboard
        alert('Image URL copied to clipboard! You can now paste it to your friend.');
      } else {
        console.error('The text area is not available.');
      }
    } else {
      console.error('The canvas is not available.');
    }
  }
  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center relative">
      <canvas ref={canvasRef} id="canvas" width={400} height={600}
        className="border border-black rounded-lg" />
      
      <textarea ref={textAreaRef} className="absolute opacity-0 pointer-events-none"></textarea>

      <button
        type="button"
        onClick={handleSend}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Copy Image URL
      </button>
    </div>
  );
}