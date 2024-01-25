'use client'
import Image from "next/image";
import { useDraw } from "@/hooks/useDraw";

export default function Home() {
  const {canvasRef} = useDraw(drawLine);

  function drawLine({prevPoint, currentPoint,ctx}:Draw) {
    const {x:currX,y:currY} = currentPoint;
    const color = "#000";
    const lineWidth = 5;

    let startPoint = prevPoint?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.moveTo(startPoint.x,startPoint.y);
    ctx.lineTo(currX,currY);
    ctx.stroke();
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y,2,0,Math.PI*2);
    ctx.fill();
  }



  return (
<div className="w-screen h-screen bg-white flex justify-center items-center">
<canvas  ref= {canvasRef} id="canvas" width={600} height={600}
className="border border-black rounded-lg"  

/>



</div>


  );
}
