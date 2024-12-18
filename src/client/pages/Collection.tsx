import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { useUser } from '../context/userContext';
import useFetchTags from '../hooks/useFetchTags';
import useFilteredPosts from '../hooks/useFilteredPosts';
import { toggleBookmark } from '../utils/bookmarkUtils';
import TagSelector from '../components/TagSelector';
import PostGrid from '../components/PostGrid';
import { getYouTubeEmbedUrl } from '../utils/videoUtils';

interface Post {
    id: number;
    title: string;
    description: string;
    video_url: string;
    instructor: { name: string };
    tags: { tag: { id: number; name: string } }[];
    likes: number;
    created_at: string;
}


interface Bookmark {
    id: number;
    user_id: number;
    post_id: number;
}

const Collection: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [bookmarkedPostIds, setBookmarkedPostIds] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
    const [userVotes, setUserVotes] = useState<{ [key: number]: number }>({});

    const { userId } = useUser();
    const { tags, error: tagsError } = useFetchTags();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!userId) return;

        const fetchPostsAndVotes = async () => {
            console.log(`${apiUrl}/vote/${userId}`);
            try {
                // Fetch posts and bookmarks
                const postsResponse = await axios.get<Post[]>(`${apiUrl}/posts`);
                setPosts(postsResponse.data);

                const bookmarksResponse = await axios.get<Bookmark[]>(`${apiUrl}/favorites/${userId}`);
                setBookmarkedPostIds(bookmarksResponse.data.map((b) => b.post_id));

                console.log('userId' + userId);
                // Fetch user votes
                const votesResponse = await axios.get<{ [key: string]: { postId: number; value: number } }>(
                    `${apiUrl}/vote/${userId}`
                );
                const votesData = Array.isArray(votesResponse.data)
                    ? votesResponse.data
                    : Object.values(votesResponse.data); // Convert object to array if necessary
                console.log('votesData:', votesData);

                const votesMap = votesData.reduce((acc, vote) => {
                    acc[vote.postId] = vote.value;
                    return acc;
                }, {} as { [key: number]: number });

                setUserVotes(votesMap);

            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchPostsAndVotes();
    }, [userId]);

    const filteredPosts = useFilteredPosts(
        posts.filter((post) => bookmarkedPostIds.includes(post.id)),
        selectedTagIds,
        'newest'
    );

    const handleTagChange = (selectedTagIds: number[]) => {
        setSelectedTagIds(selectedTagIds);
    };

    const handleUpvote = async (postId: number) => {
        try {
            const newVoteValue = userVotes[postId] === 1 ? 0 : 1; // Toggle between 1 and 0
            await axios.post(`${apiUrl}/vote`, {
                postId,
                userId,
                value: newVoteValue, // Send 1 to upvote or 0 to remove the vote
            });
            // Update the UI state
            setUserVotes((prev) => ({ ...prev, [postId]: newVoteValue }));
        } catch (error) {
            console.error('Failed to handle upvote:', error);
        }
    };

    const handleDownvote = async (postId: number) => {
        try {
            const newVoteValue = userVotes[postId] === -1 ? 0 : -1; // Toggle between -1 and 0
            await axios.post(`${apiUrl}/vote`, {
                postId,
                userId,
                value: newVoteValue, // Send -1 to downvote or 0 to remove the vote
            });
            // Update the UI state
            setUserVotes((prev) => ({ ...prev, [postId]: newVoteValue }));
        } catch (error) {
            console.error('Failed to handle downvote:', error);
        }
    };



    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (error || tagsError) {
        return <div>{error || tagsError}</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-gray-100 mb-20">
            <div className="mb-4 flex flex-col sm:flex-row items-center justify-center sm:space-x-4">
                <div className="w-full sm:w-64 mb-4 sm:mb-0">
                    <TagSelector tags={tags} onChange={handleTagChange} />
                </div>
            </div>
            <PostGrid
                posts={filteredPosts}
                userId={userId ? parseInt(userId, 10) : null}
                bookmarkedPostIds={bookmarkedPostIds}
                toggleBookmark={(postId) =>
                    toggleBookmark(postId, userId ? parseInt(userId, 10) : null, bookmarkedPostIds, setBookmarkedPostIds, apiUrl)
                }
                setSelectedDescription={setSelectedDescription}
                selectedDescription={selectedDescription}
                getYouTubeEmbedUrl={getYouTubeEmbedUrl}
                handleUpvote={handleUpvote}
                handleDownvote={handleDownvote}
                userVotes={userVotes}
                            />
        </div>
    );
};

export default Collection;

