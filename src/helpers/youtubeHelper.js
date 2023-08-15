const convertDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (match !== null) {
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        const seconds = parseInt(match[3]) || 0;
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
};

const getYouTubeVideoId = (url) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get("v");
};

const fetchVideoDuration = async (videoUrl) => {
    const API_KEY = process.env.API_KEY_YOUTUBE;
    const videoId = getYouTubeVideoId(videoUrl);
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=contentDetails`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const duration = data.items[0].contentDetails.duration;
        return convertDuration(duration);
    } catch (error) {
        console.error("Error retrieving video duration:", error);
        return "";
    }
};

module.exports = {
    fetchVideoDuration,
};
