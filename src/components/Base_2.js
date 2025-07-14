import React, { useEffect, useState, useRef } from "react";

const Base_2 = ({
  markers_,
  setMarkers_,
  imageUrl,
  imageSize,
  log,
  setLog,
}) => {
  const canvasRef = useRef(null);
  const [baseImage, setBaseImage] = useState(null);
  const [currentPoints, setCurrentPoints] = useState([]);

  // Draw a rectangle given 4 points
  const drawRectangle = (context, rectangle, index) => {
    const { p1, p2, p3, p4 } = rectangle;
    const label = `Rec-${index + 1}`;

    // Draw four sides with different colors
    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.strokeStyle = "red";
    context.lineWidth = 1.5;
    context.stroke();

    context.beginPath();
    context.moveTo(p2.x, p2.y);
    context.lineTo(p3.x, p3.y);
    context.strokeStyle = "green";
    context.lineWidth = 1.5;
    context.stroke();

    context.beginPath();
    context.moveTo(p3.x, p3.y);
    context.lineTo(p4.x, p4.y);
    context.strokeStyle = "black";
    context.lineWidth = 1.5;
    context.stroke();

    context.beginPath();
    context.moveTo(p4.x, p4.y);
    context.lineTo(p1.x, p1.y);
    context.strokeStyle = "yellow";
    context.lineWidth = 1.5;
    context.stroke();

    // Draw rectangle number with background
    const padding = 4;
    context.font = "16px Arial";
    const textWidth = context.measureText(label).width;
    const textHeight = 16;

    context.fillStyle = "rgba(0, 0, 0, 0.6)";
    context.fillRect(
      p1.x,
      p1.y - textHeight - padding,
      textWidth + padding * 2,
      textHeight + padding
    );

    context.fillStyle = "white";
    context.fillText(label, p1.x + padding, p1.y - padding);
  };

  // Draw a marker (circle)
  const drawMarker = (context, point, color) => {
    const outerRadius = 8;
    context.beginPath();
    context.arc(point.x, point.y, outerRadius, 0, 2 * Math.PI, false);
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.stroke();

    const innerRadius = 4;
    context.beginPath();
    context.arc(point.x, point.y, innerRadius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
  };

  // Draw lines between points while drawing a new rectangle
  const drawIntermediateLines = (context, points) => {
    points.forEach((point, index) => {
      drawMarker(context, point, "blue");
      if (index > 0) {
        context.beginPath();
        context.moveTo(points[index - 1].x, points[index - 1].y);
        context.lineTo(points[index].x, points[index].y);
        context.strokeStyle = index % 2 === 0 ? "red" : "#1FC173";
        context.lineWidth = 2;
        context.stroke();
      }
    });
  };

  // Redraw everything
  const updateCanvas = (markers, points) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");

    // Clear and redraw base image
    if (baseImage) {
      context.putImageData(baseImage, 0, 0);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Draw all rectangles
    markers.forEach((marker, index) => {
      drawRectangle(context, marker, index);
    });

    // Draw in-progress points/lines
    if (points.length > 0) {
      drawIntermediateLines(context, points);
    }
  };

  // Load image and set as base
  useEffect(() => {
    if (!imageUrl) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = new window.Image();
    image.src = imageUrl;

    image.onload = () => {
      // You can adjust these to match your needs
      const width = 600;
      const height = 800;
      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);
      setBaseImage(context.getImageData(0, 0, width, height));
    };

    image.onerror = () => {
      console.error("Failed to load image.");
    };
  }, [imageUrl]);

  // Redraw on marker or image change
  useEffect(() => {
    updateCanvas(markers_, currentPoints);
  }, [markers_, currentPoints, baseImage]);

  // Handle mouse events for drawing new rectangles
  const updateRectangleLog = (newMarker) => {
    const rectangleLog = {
      timestamp: new Date(),
      rectIndex: markers_.length + 1,
      message: "Rectangle success",
      marker: newMarker,
    };
    setLog((prevLog) => [...prevLog, rectangleLog]);
  };
  const handleMouseDown = (event) => {
    if (event.button === 2) {
      // Right click: remove last point
      setCurrentPoints((prevPoints) => prevPoints.slice(0, -1));
      return;
    } else if (event.button === 0) {
      // Left click: add point
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const newPoint = { x: mouseX, y: mouseY };
      setCurrentPoints((prevPoints) => {
        const newPoints = [...prevPoints, newPoint];
        if (newPoints.length === 4) {
          // Add new rectangle to markers
          const newMarker = {
            p1: newPoints[0],
            p2: newPoints[1],
            p3: newPoints[2],
            p4: newPoints[3],
          };
          setMarkers_([...markers_, newMarker]);
          updateRectangleLog(newMarker);
          return [];
        }
        return newPoints;
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <canvas
          className="absolute top-0 left-1/2 -translate-x-1/2"
          onMouseDown={handleMouseDown}
          onContextMenu={(e) => e.preventDefault()}
          ref={canvasRef}
        />
      </div>
    </div>
  );
};

export default Base_2;
