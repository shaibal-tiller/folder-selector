import React, { useEffect, useState, useRef } from 'react';

const Base_2 = ({ markers_,setMarkers_, imageUrl, imageSize, }) => {
    console.log(markers_);
    
    
    const canvasRef = useRef(null);
    const [baseImage, setBaseImage] = useState(null);
    const [markers, setMarkers] = useState(markers_ ||[]);
    const [currentPoints, setCurrentPoints] = useState([]);
    const [log, setLog] = useState([]);

    

    const updateRectangleLog = () => {
        const newMarker = { p1: currentPoints[0], p2: currentPoints[1], p3: currentPoints[2], p4: currentPoints[3] };
        const rectangleLog = {
            timestamp: new Date(),
            rectIndex: markers.length + 1,
            message: 'Rectangle success',
            marker: newMarker
        };

        setLog((prevLog) => {
            const updatedLog = [...prevLog, rectangleLog];
            return updatedLog;
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const image = new Image();
        image.src = imageUrl;

        image.onload = () => {
            const containerWidth = canvas.parentNode.offsetWidth;
            const containerHeight = canvas.parentNode.offsetHeight;

            const imageAspectRatio = image.width / image.height;
            const containerAspectRatio = containerWidth / containerHeight;

            let canvasWidth, canvasHeight;

            // if (imageAspectRatio > containerAspectRatio) {
            //     canvasWidth = containerWidth;
            //     canvasHeight = canvasWidth / imageAspectRatio;
            // } else {
                canvasHeight = containerHeight;
                canvasWidth = canvasHeight //* imageAspectRatio;
            // }

            canvas.width =600;
            canvas.height = 800;

            context.drawImage(image, 0, 0, 600, 800);
            setBaseImage(context.getImageData(0, 0, 600, 800));
        };

        image.onerror = () => {
            console.error("Failed to load image.");
        };
    }, [imageUrl]);

    const drawRectangle = (context, rectangle) => {
        const { p1, p2, p3, p4 } = rectangle;

        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.strokeStyle = '#1FC173';
        context.lineWidth = 1.5;
        context.stroke();

        context.beginPath();
        context.moveTo(p2.x, p2.y);
        context.lineTo(p3.x, p3.y);
        context.strokeStyle = 'red';
        context.lineWidth = 1.5;
        context.stroke();

        context.beginPath();
        context.moveTo(p3.x, p3.y);
        context.lineTo(p4.x, p4.y);
        context.strokeStyle = '#1FC173';
        context.lineWidth = 1.5;
        context.stroke();

        context.beginPath();
        context.moveTo(p4.x, p4.y);
        context.lineTo(p1.x, p1.y);
        context.strokeStyle = 'red';
        context.lineWidth = 1.5;
        context.stroke();
    };

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

    const drawIntermediateLines = (context, points) => {
        points.forEach((point, index) => {
            drawMarker(context, point, 'blue');
            if (index > 0) {
                context.beginPath();
                context.moveTo(points[index - 1].x, points[index - 1].y);
                context.lineTo(points[index].x, points[index].y);
                context.strokeStyle = (index % 2 === 0) ? 'red' : '#1FC173';
                context.lineWidth = 2;
                context.stroke();
            }
        });
    };

    const updateCanvas = (markers, points) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (baseImage) {
            context.putImageData(baseImage, 0, 0);
        }

        markers.forEach((marker) => {
            drawRectangle(context, marker);
        });

        if (points.length > 0) {
            drawIntermediateLines(context, points);
        }
    }
    const handleMouseDown = (event) => {
        if (event.button === 2) { // Right click
            setCurrentPoints((prevPoints) => {
                if (prevPoints.length > 0) {
                    const updatedPoints = prevPoints.slice(0, -1);
                    setMarkers_([...markers,
                    Object.fromEntries(updatedPoints.map((updatedPoint, ind) => [`p${ind + 1}`, updatedPoint]))
                    ]);
                    return updatedPoints;
                }
                return prevPoints;
            });
            return;
        } else if (event.button === 0) { // Left click
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const newPoint = { x: mouseX, y: mouseY };

            setCurrentPoints((prevPoints) => {
                const newPoints = [...prevPoints, newPoint];
                setMarkers_([...markers,
                    Object.fromEntries(newPoints.map((newPoint, ind) => [`p${ind + 1}`, newPoint]))
                    ]);
                if (newPoints.length === 4) {
                    const newMarker = { p1: newPoints[0], p2: newPoints[1], p3: newPoints[2], p4: newPoints[3] };
                    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
                    updateRectangleLog();
                    return [];
                }
                
                return newPoints;
            });
        }
    };
    useEffect(() => {
        updateCanvas(markers, currentPoints);
    }, [markers, currentPoints, baseImage])

    return <div className='flex justify-center items-center h-full ' >
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <canvas
            className='absolute top-0 left-1/2 -translate-x-1/2'
                onMouseDown={handleMouseDown}
                onContextMenu={(e) => e.preventDefault()}
                ref={canvasRef}
                
            />
        </div>
    </div>

};

export default Base_2;