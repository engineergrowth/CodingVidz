import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { useUser } from '../context/userContext';
import useFetchTags from '../hooks/useFetchTags';
import TagSelector from '../components/TagSelector';
import DescriptionModal from '../components/modals/DescriptionModal';
import Tooltip from '@mui/material/Tooltip';
import { getYouTubeEmbedUrl } from '../utils/videoUtils';

interface Instructor {
    name: string;
}

interface Post {
    id: number;
    title: string;
    description: string;
    video_url: string;
    instructor: Instructor;
    likes: number;
    created_at: string;
    tags: { tag: { id: number; name: string } }[];
}

interface Bookmark {
    id: number;
    user_id: number;
    post_id: number;
}

const WatchVidz: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [bookmarkedPostIds, setBookmarkedPostIds] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [sortOption, setSortOption] = useState<string>('newest');
    const {userId} = useUser();
    const {tags, error: tagsError} = useFetchTags();
    const apiUrl = import.meta.env.VITE_API_URL;

    const [selectedDescription, setSelectedDescription] = useState<string | null>(null);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get<Post[]>(`${apiUrl}/posts`);
                setPosts(response.data);

                if (userId) {
                    const bookmarksResponse = await axios.get<Bookmark[]>(`${apiUrl}/favorites/${userId}`);
                    setBookmarkedPostIds(bookmarksResponse.data.map((b) => b.post_id));
                } else {
                    console.warn('No userId provided for fetching bookmarks.');
                }
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [userId]);

    const handleTagChange = (selectedTagIds: number[]) => {
        setSelectedTagIds(selectedTagIds);
    };

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        setSortOption(event.target.value as string);
    };

    const toggleBookmark = async (postId: number) => {
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

    const filteredPosts = posts
        .filter((post) =>
            selectedTagIds.length === 0 || post.tags.some((tagRel) => selectedTagIds.includes(tagRel.tag.id))
        )
        .sort((a, b) => {
            if (sortOption === 'newest') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else if (sortOption === 'oldest') {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            } else if (sortOption === 'popular') {
                return b.likes - a.likes;
            }
            return 0;
        });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress/>
            </div>
        );
    }

    if (error || tagsError) {
        return <div>{error || tagsError}</div>;
    }

    return (
        <div className="container mx-auto bg-gray-100">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
                {filteredPosts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[420px]"
                    >

                        <iframe
                            src={getYouTubeEmbedUrl(post.video_url)}
                            title={post.title}
                            className="w-full h-[60%]"
                            allowFullScreen
                        />
                        <div className="flex flex-col justify-between flex-grow p-4">
                            <div>
                                <h2
                                    className="truncate text-xl font-semibold mb-1"
                                    title={post.title}
                                >
                                    {post.title}
                                </h2>

                                <p className="text-sm text-gray-600">{post.instructor.name}</p>
                            </div>
                            <div className="mt-2">
                                {/* Tooltip for larger screens */}
                                <div className="hidden md:block">
                                    <Tooltip title={post.description || "No description available"} arrow>
                                    <span className="text-blue-500 text-sm cursor-pointer">
                                        Description
                                    </span>
                                    </Tooltip>
                                </div>
                                {/* Button for smaller screens */}
                                <div className="block md:hidden">
                                    <button
                                        className="text-blue-500 text-sm hover:text-blue-700 transition"
                                        onClick={() => setSelectedDescription(post.description)}
                                    >
                                        View Description
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-auto">
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tagRel) => (
                                        <span
                                            key={tagRel.tag.id}
                                            className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                                        >
                                        {tagRel.tag.name}
                                    </span>
                                    ))}
                                </div>
                                {userId && (
                                    <FontAwesomeIcon
                                        icon={bookmarkedPostIds.includes(post.id) ? solidBookmark : regularBookmark}
                                        size="lg"
                                        className="cursor-pointer text-blue-600"
                                        onClick={() => toggleBookmark(post.id)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedDescription && (
                <DescriptionModal
                    description={selectedDescription}
                    onClose={() => setSelectedDescription(null)}
                />
            )}
        </div>
    );


}

export default WatchVidz;
