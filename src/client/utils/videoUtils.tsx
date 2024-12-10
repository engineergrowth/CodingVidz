/**
 * Extracts the YouTube embed URL from a given video URL.
 * @param {string} url - The YouTube video URL.
 * @returns {string} - The embed URL or the original URL if invalid.
 */
export const getYouTubeEmbedUrl = (url: string): string => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.*|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
};