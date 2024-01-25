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
  // async function shareImage() {
  //   if (canvasRef.current) {
  //     canvasRef.current.toBlob(blob => {
  //       if (blob && navigator.share) {
  //         navigator.share({
  //           files: [new File([blob], 'canvas-image.png', { type: 'image/png' })],
  //           title: 'Canvas Image',
  //           text: 'Check out this drawing!'
  //         }).then(() => {
  //           console.log('Image shared successfully');
  //         }).catch((error) => {
  //           console.error('Error sharing the image', error);
  //         });
  //       } else {
  //         console.error('The canvas or share functionality is not available.');
  //       }
  //     }, 'image/png');
  //   } else {
  //     console.error('The canvas is not available.');
  //   }
  // }

  async function shareImage() {
    if (canvasRef.current) {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          console.error('Could not retrieve the blob from the canvas');
          return;
        }

        const file = new File([blob], 'canvas-image.png', { type: 'image/png' });
        const shareData = {
          files: [file],
          title: 'Canvas Image',
          text: 'Check out this drawing!'
        };

        try {
          if (navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
          } else {
            // Fallback for devices where navigator.canShare is not available or doesn't support sharing files
            const url = URL.createObjectURL(file);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = file.name;
            anchor.click();
            URL.revokeObjectURL(url);
            alert('Your device does not support sharing images directly. The image has been downloaded instead. Please share it manually.');
          }
        } catch (error) {
          console.error('Error sharing the image', error);
          // Fallback to manual download if the share fails
          const url = URL.createObjectURL(file);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = file.name;
          anchor.click();
          URL.revokeObjectURL(url);
          alert('There was an issue sharing the image. The image has been downloaded instead. Please share it manually.');
        }
      }, 'image/png');
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
        onClick={shareImage} // We trigger the share instead of download
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Share Image
      </button>
    </div>
  );
}
