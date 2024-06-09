import { useEffect, useState } from "react";

export const usePreview = (files) => {
    let url = null;

    if (files && files.length) {
        const firstVideo = files[0];

        if (firstVideo) {
            url = URL.createObjectURL(firstVideo);
            console.log(url);
        }
    }

    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (!url) {
            console.log("returning");
            return;
        }

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
        };

        const onLoadMetadata = () => {
            video.currentTime = 0;
        };

        const onError = (e) => {

            console.log(e);
            // Fallback if metadata is not available
            const newCanvas = document.createElement("canvas");
            newCanvas.width = 640; // Default width
            newCanvas.height = 360; // Default height

            const ctx = newCanvas.getContext("2d");
            ctx.drawImage(video, 0, 0, newCanvas.width, newCanvas.height);
            const canvasToURL = newCanvas.toDataURL();

            setImageUrl(canvasToURL);
        };

        video.addEventListener("seeked", onSeeked);
        video.addEventListener("loadedmetadata", onLoadMetadata);
        video.addEventListener("error", onError);

        return () => {
            video.removeEventListener("seeked", onSeeked);
            video.removeEventListener("loadedmetadata", onLoadMetadata);
            video.removeEventListener("error", onError);
            video.pause();
            video.src = "";
        };
    }, [url]);

    console.log(imageUrl);
    return imageUrl;
};
