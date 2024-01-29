  'use client'
  import { useDraw } from "@/hooks/useDraw";
  import { useRef, useState } from "react";
  import {CanvasWithLetter} from "@/hooks/canvasWithLetter";

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

  function changeColor(color: any) {
    setColor(color.hex)}

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
    <div className="fixed top-0 left-0 right-0 flex flex-wrap gap-1 p-1 bg-white border-t justify-center items-center" >
        <button 
    type="button"
    onClick={() => changeColor({hex: '#FF0000'})}
    className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded w-1/12"
  >
    Red
  </button>

  <button
    type="button" 
    onClick={() => changeColor({hex: '#FF7F00'})}
    className="bg-orange-500 hover:bg-orange-700 text-white font-bold p-2 rounded w-1/12" 
  >
    Orange
  </button>

  <button
    type="button"
    onClick={() => changeColor({hex: '#FFFF00'})}
    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold p-2 rounded w-1/12"
  >
    Yellow
  </button>

  <button
    type="button"
    onClick={() => changeColor({hex: '#00FF00'})}
    className="bg-green-500 hover:bg-green-700 text-white font-bold p-2 rounded w-1/12"
  >
    Green
  </button>

  <button
    type="button"
    onClick={() => changeColor({hex: '#0000FF'})}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded w-1/12"
  >
    Blue
  </button>

  <button
    type="button" 
    onClick={() => changeColor({hex: '#4B0082'})}
    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold p-2 rounded w-1/12"
  > 
    Indigo
  </button>

  <button
    type="button"
    onClick={() => changeColor({hex: '#9400D3'})}
    className="bg-purple-500 hover:bg-purple-700 text-white font-bold p-2 rounded  w-1/12 "
  >
    Violet
  </button>

          </div>
          <div className="border border-black rounded-lg">
          <CanvasWithLetter drawLine={drawLine} />
          </div>


        
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