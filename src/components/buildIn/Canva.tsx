"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

type Props = {
  data: Array<{
    department: string;
    value: number;
  }>;
};

export default function Canva({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  // Function to draw the chart
  const drawChartIT = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, hoveredIndex: number | null) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Calculate center and radius
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    // Starting angle
    let startAngle = -Math.PI / 2;

    // Colors for each segment
    const colors = ["hsl(0, 68%, 27%)", "hsl(0, 68%, 35%)", "hsl(0, 68%, 43%)"];

    // Draw segments
    data.forEach((item, index) => {
      const sliceAngle = (2 * Math.PI * item.value) / total;

      // Calculate offset for hovered segment
      const offset = index === hoveredIndex ? 20 : 0;
      const segmentCenterAngle = startAngle + sliceAngle / 2;
      const offsetX = Math.cos(segmentCenterAngle) * offset;
      const offsetY = Math.sin(segmentCenterAngle) * offset;

      // Draw pie segment
      ctx.beginPath();
      ctx.moveTo(centerX + offsetX, centerY + offsetY);
      ctx.arc(centerX + offsetX, centerY + offsetY, radius, startAngle, startAngle + sliceAngle);
      ctx.lineTo(centerX + offsetX, centerY + offsetY);
      ctx.closePath();
      ctx.fillStyle = colors[index];
      ctx.fill();

      // Draw label
      const labelAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 0.7;
      const labelX = centerX + Math.cos(labelAngle) * labelRadius + offsetX;
      const labelY = centerY + Math.sin(labelAngle) * labelRadius + offsetY;

      ctx.fillStyle = "white";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText(`${Math.round((item.value / total) * 100)}%`, labelX, labelY);

      startAngle += sliceAngle;
      
    })

    // Draw legend
    const legendY = canvas.height - 30
    let legendX = 20

    data.forEach((item, index) => {
      // Draw color box
      ctx.fillStyle = colors[index]
      ctx.fillRect(legendX, legendY, 15, 15)

      // Draw text
      ctx.fillStyle = "white"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(item.department, legendX + 20, legendY + 7)

      legendX += ctx.measureText(item.department).width + 40
    }

);
  };

  const handleMouseMove = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    const angle = Math.atan2(y - centerY, x - centerX);
    let mouseAngle = angle + Math.PI / 2;
    if (mouseAngle < 0) mouseAngle += Math.PI * 2;

    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    if (distance <= radius) {
      let currentAngle = 0;
      const total = data.reduce((sum, item) => sum + item.value, 0);

      for (let i = 0; i < data.length; i++) {
        const sliceAngle = (2 * Math.PI * data[i].value) / total;
        if (mouseAngle >= currentAngle && mouseAngle <= currentAngle + sliceAngle) {
          setHoveredSegment(i);
          return;
        }
        currentAngle += sliceAngle;
      }
    } else {
      setHoveredSegment(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    drawChartIT(ctx, canvas, hoveredSegment);

    // Add event listeners
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hoveredSegment, drawChartIT]);

  return (
    <Card className="bg-gray-800 rounded-xl border-none">
      <CardContent className="flex justify-center">
        <canvas
          id="drawChartIT"
          ref={canvasRef}
          className="max-w-[100%] h-auto cursor-pointer"
          onMouseLeave={handleMouseLeave}
        />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}