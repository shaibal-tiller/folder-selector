import { useEffect, useState } from "react";

export const usePreview = (files) => {
    let url = null
    if (files && files.length) {
        const firstVideo = files.find(file => file.type.startsWith('video/'));
        if (firstVideo) {
            url = URL.createObjectURL(firstVideo);

        } 
    }

    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const video = document.createElement("video");
        video.src = url;
        video.crossOrigin = "anonymous";

        const onSeeked = () => {
            const newCanvas = document.createElement("canvas");
            newCanvas.width = video.videoWidth;
            newCanvas.height = video.videoHeight;
            const ctx = newCanvas.getContext("2d");
            ctx.drawImage(video, 0, 0);
            const CanvasToURL = newCanvas.toDataURL()
           
            setImageUrl(CanvasToURL);
        };

        video.addEventListener("seeked", onSeeked);

        const onLoadMetadata = () => video.currentTime = 0;

        video.addEventListener("loadedmetadata", onLoadMetadata);

        return () => {
            video.removeEventListener("seeked", onSeeked);
            video.removeEventListener("loadedmetadata", onLoadMetadata);
            video.pause();
            video.src = "";
        };
    }, [url]);
    
    return imageUrl;
};