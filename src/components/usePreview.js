import { useEffect, useState } from "react";

export const usePreview = (files, setLoading) => {
    const [error, setError] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageSize, setImageSize] = useState(0); // New state for image size

    useEffect(() => {
        setError(null)
        if (!files || !files.length) {

            setLoading(false);
            setImageUrl(null)
            return;
        }

        const firstVideo = files[0];
        if (!firstVideo) {
            setLoading(false);
            return;
        }

        const url = URL.createObjectURL(firstVideo);
        const video = document.createElement("video");
        video.src = url;
        video.crossOrigin = "anonymous";


        const onSeeked = () => {
           
            const newCanvas = document.createElement("canvas");
            newCanvas.width = video.videoWidth;
            newCanvas.height = video.videoHeight;

            const ctx = newCanvas.getContext("2d");
            ctx.drawImage(video, 0, 0);
            const canvasToURL = newCanvas.toDataURL();

            setImageUrl(canvasToURL);

            // Convert base64 URL to Blob and calculate size
            const byteString = atob(canvasToURL.split(',')[1]);
            const byteArray = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) {
                byteArray[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([byteArray], { type: 'image/png' });
            setImageSize(blob.size);

            setLoading(false);
            URL.revokeObjectURL(url);  // Clean up the object URL
        };

        const onLoadMetadata = () => {
       
            setError(null);
            video.currentTime = 0;
        };

        const onError = (e) => {

            setError(e.target?.error?.message);
            // Fallback if metadata is not available
            const newCanvas = document.createElement("canvas");
            newCanvas.width = 640; // Default width
            newCanvas.height = 360; // Default height

            const ctx = newCanvas.getContext("2d");
            ctx.drawImage(video, 0, 0, newCanvas.width, newCanvas.height);
            const canvasToURL = newCanvas.toDataURL();

            setImageUrl(canvasToURL);

            // Convert base64 URL to Blob and calculate size
            const byteString = atob(canvasToURL.split(',')[1]);
            const byteArray = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) {
                byteArray[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([byteArray], { type: 'image/png' });
            setImageSize(blob.size);

            setLoading(false);
            URL.revokeObjectURL(url);  // Clean up the object URL
        };
      


        video.addEventListener("seeked", onSeeked);
       
     
        
        video.addEventListener("loadedmetadata", onLoadMetadata);
        video.addEventListener("error", onError);
        setLoading(true);


        return () => {
 


            video.removeEventListener("seeked", onSeeked);
            video.removeEventListener("loadedmetadata", onLoadMetadata);
            video.removeEventListener("error", onError);
            video.pause();
            video.src = "";
            URL.revokeObjectURL(url);  // Clean up the object URL
        };
    }, [files, setLoading]);

    return { error, imageUrl, imageSize }; // Return image size
};