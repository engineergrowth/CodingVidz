import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, MenuItem, Select, SelectChangeEvent } from '@mui/material';
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
    likes: number;
    created_at: string;
    tags: { tag: { id: number; name: string } }[];
}

interface Bookmark {
    id: number;
    user_id: number;
    post_id: number;
}

const Watch: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [bookmarkedPostIds, setBookmarkedPostIds] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [sortOption, setSortOption] = useState<string>('newest');
    const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
    const [userVotes, setUserVotes] = useState<{ [key: number]: number }>({});

    const { userId } = useUser();
    const { tags, error: tagsError } = useFetchTags();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchPostsAndVotes = async () => {
            try {
                const postsResponse = await axios.get<Post[]>(`${apiUrl}/posts`);
                setPosts(postsResponse.data);

                if (userId) {
                    const bookmarksResponse = await axios.get<Bookmark[]>(`${apiUrl}/favorites/${userId}`);
                    setBookmarkedPostIds(bookmarksResponse.data.map((b) => b.post_id));

                    const votesResponse = await axios.get<{ postId: number; value: number }[]>(
                        `${apiUrl}/vote/${userId}`
                    );
                    const votesMap = votesResponse.data.reduce((acc, vote) => {
                        acc[vote.postId] = vote.value;
                        return acc;
                    }, {} as { [key: number]: number });
                    setUserVotes(votesMap);
                }
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPostsAndVotes();
    }, [userId, apiUrl]);

    const filteredPosts = useFilteredPosts(posts, selectedTagIds, sortOption);

    const handleTagChange = (selectedTagIds: number[]) => {
        setSelectedTagIds(selectedTagIds);
    };

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        setSortOption(event.target.value as string);
    };

    const handleUpvote = async (postId: number) => {
        try {
            const newVoteValue = userVotes[postId] === 1 ? 0 : 1;
            await axios.post(`${apiUrl}/vote`, {
                postId,
                userId,
                value: newVoteValue,
            });
            setUserVotes((prev) => ({ ...prev, [postId]: newVoteValue })); // Update UI
        } catch (error) {
            console.error('Failed to upvote post:', error);
        }
    };

    const handleDownvote = async (postId: number) => {
        try {
            const newVoteValue = userVotes[postId] === -1 ? 0 : -1; // Toggle between -1 and 0
            await axios.post(`${apiUrl}/vote`, {
                postId,
                userId,
                value: newVoteValue,
            });
            setUserVotes((prev) => ({ ...prev, [postId]: newVoteValue })); // Update UI
        } catch (error) {
            console.error('Failed to downvote post:', error);
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
        <div className="container mx-auto bg-gray-100 mb-20">
            <div className="mb-4 flex flex-col sm:flex-row items-center justify-center sm:space-x-4">
                <div className="w-full sm:w-64 mb-4 sm:mb-0">
                    <TagSelector tags={tags} onChange={handleTagChange} />
                </div>

                <div className="w-full sm:w-64">
                    <Select
                        value={sortOption}
                        onChange={handleSortChange}
                        displayEmpty
                        fullWidth
                        variant="outlined"
                    >
                        <MenuItem value="newest">Newest</MenuItem>
                        <MenuItem value="oldest">Oldest</MenuItem>
                        <MenuItem value="popular">Most Popular</MenuItem>
                    </Select>
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
                userVotes={userVotes} // Pass voting data
            />
        </div>
    );
};

export default Watch;
