'use client'
import Image from "next/image";
import { useDraw } from "@/hooks/useDraw";
import { useRef, useState } from "react";
import { ChromePicker } from "react-color";

export default function Home() {
  const { canvasRef } = useDraw(drawLine);
  const [color, setColor] = useState<string>('#000')

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const linecolor = color;
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = linecolor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();
    ctx.fillStyle = linecolor;

    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function downloadImage() {
    if (canvasRef.current) {
      const canvasImage = canvasRef.current.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = canvasImage;
      downloadLink.download = 'canvas-image.png'; // Set the download filename
      document.body.appendChild(downloadLink);
      downloadLink.click(); // Programmatically click the link to trigger the download
      document.body.removeChild(downloadLink);
    } else {
      console.error('The canvas is not available.');
    }
  }

  async function shareImage() {
    if (canvasRef.current) {
      canvasRef.current.toBlob(blob => {
        if (blob && navigator.share) {
          navigator.share({
            files: [new File([blob], 'canvas-image.png', { type: 'image/png' })],
            title: 'Canvas Image',
            text: 'See See See!'
          }).then(() => {
            console.log('Image shared successfully');
          }).catch((error) => {
            console.error('Error sharing the image', error);
          });
        } else {
          console.error('The canvas or share functionality is not available.');
        }
      }, 'image/png'); 
    } else {
      console.error('The canvas is not available.');
    }
  }

  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center relative">
    <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
      <canvas ref={canvasRef} id="canvas" width={400} height={600}
        className="border border-black rounded-lg" />
      
      <div className="fixed bottom-0 left-0 right-0 flex p-4 bg-white border-t justify-center items-center" >
        <button
          type="button"
          onClick={downloadImage}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Download Image
        </button>
        <button
          type="button"
          onClick={shareImage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Share Image
        </button>
      </div>
    </div>
  );
}