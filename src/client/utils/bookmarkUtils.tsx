import axios from 'axios';

export const toggleBookmark = async (
    postId: number,
    userId: number | null,
    bookmarkedPostIds: number[],
    setBookmarkedPostIds: React.Dispatch<React.SetStateAction<number[]>>,
    apiUrl: string
    ): Promise<void> => {
    if (!userId) {
        console.error('User ID is null or undefined');
        return;
    }

    try {
        const isBookmarked = bookmarkedPostIds.includes(postId);

        if (isBookmarked) {
            await axios.delete(`${apiUrl}/favorites/${userId}/${postId}`);
            setBookmarkedPostIds((prev) => prev.filter((id) => id !== postId));
        } else {
            const response = await axios.post(`${apiUrl}/favorites/${userId}`, {
                post_id: postId,
            });
            if (response.status === 201) {
                setBookmarkedPostIds((prev) => [...prev, postId]);
            }
        }
    } catch (err) {
        console.error('Failed to toggle bookmark', err);
    }
};
