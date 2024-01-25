'use client'
import Image from "next/image";
import { useDraw } from "@/hooks/useDraw";
import { useRef, useState } from "react";


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

  // function downloadImage() {
  //   if (canvasRef.current) {
  //     const canvasImage = canvasRef.current.toDataURL('image/png');
  //     const downloadLink = document.createElement('a');
  //     downloadLink.href = canvasImage;
  //     downloadLink.download = 'canvas-image.png'; // Set the download filename
  //     document.body.appendChild(downloadLink);
  //     downloadLink.click(); // Programmatically click the link to trigger the download
  //     document.body.removeChild(downloadLink);
  //   } else {
  //     console.error('The canvas is not available.');
  //   }
  // }
  // async function shareImage() {
  //   if (canvasRef.current) {
  //     // Specify 'image/jpeg' instead of 'image/png' for JPEG format
  //     canvasRef.current.toBlob(blob => {
  //       if (blob && navigator.share) {
  //         navigator.share({
  //           // Change the filename extension to '.jpg' and set the type to 'image/jpeg'
  //           files: [new File([blob], 'canvas-image.jpg', { type: 'image/jpeg' })],
  //           title: 'Canvas Image',
  //           text: 'See what I drew!'
  //         }).then(() => {
  //           console.log('Image shared successfully');
  //         }).catch((error) => {
  //           console.error('Error sharing the image', error);
  //         });
  //       } else {
  //         console.error('The canvas or share functionality is not available.');
  //       }
  //     }, 'image/jpeg'); // Specify JPEG image format here
  //   } else {
  //     console.error('The canvas is not available.');
  //   }
  // }
  async function shareImage() {
    if (canvasRef.current) {
      // Specify 'image/jpeg' instead of 'image/png' for JPEG format
      canvasRef.current.toBlob(blob => {
        if (blob && navigator.share) {
          navigator.share({
            // Change the filename extension to '.jpg' and set the type to 'image/jpeg'
            files: [new File([blob], 'canvas-image.jpg', { type: 'image/jpeg' })],
            title: 'Canvas Image',
            text: 'See what I drew!'
          }).then(() => {
            console.log('Image shared successfully');
          }).catch((error) => {
            console.error('Error sharing the image', error);
          });
        } else {
          console.error('The canvas or share functionality is not available.');
        }
      }, 'image/jpeg'); // Specify JPEG image format here
    } else {
      console.error('The canvas is not available.');
    }
  }
  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center relative">
      <canvas ref={canvasRef} id="canvas" width={400} height={600}
        className="border border-black rounded-lg" />
      
      <button
        type="button"
        onClick={shareImage} // Here, we trigger the download instead of copying
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Share Image
      </button>
    </div>
  );
}