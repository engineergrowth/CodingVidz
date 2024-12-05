import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { useUser } from '../context/userContext';
import useFetchTags from '../hooks/useFetchTags';
import TagSelector from './TagSelector';

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

const Collection: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [bookmarkedPostIds, setBookmarkedPostIds] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const { userId } = useUser();
    const { tags, error: tagsError } = useFetchTags();

    const getYouTubeEmbedUrl = (url: string) => {
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.*|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(youtubeRegex);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return url;
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get<Post[]>('http://localhost:3000/posts');
                setPosts(response.data);

                if (userId) {
                    const bookmarksResponse = await axios.get<Bookmark[]>(`http://localhost:3000/favorites/${userId}`);
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

    const toggleBookmark = async (postId: number) => {
        try {
            const isBookmarked = bookmarkedPostIds.includes(postId);

            if (isBookmarked) {
                await axios.delete(`http://localhost:3000/favorites/${userId}/${postId}`);
                setBookmarkedPostIds(prev => prev.filter(id => id !== postId));
            } else {
                const response = await axios.post(`http://localhost:3000/favorites/${userId}`, {
                    post_id: postId,
                });
                if (response.status === 201) {
                    setBookmarkedPostIds(prev => [...prev, postId]);
                }
            }
        } catch (err) {
            console.error('Failed to toggle bookmark', err);
        }
    };

    const filteredPosts = posts.filter(post => bookmarkedPostIds.includes(post.id))
        .filter(post =>
            selectedTagIds.length === 0 || post.tags.some(tagRel => selectedTagIds.includes(tagRel.tag.id))
        );

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
        <div className="container mx-auto p-4">
            <div className="mb-4 flex flex-col sm:flex-row items-center justify-center sm:space-x-4">
                <div className="w-full sm:w-64 mb-4 sm:mb-0">
                    <TagSelector tags={tags} onChange={handleTagChange} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
                {filteredPosts.map(post => (
                    <div key={post.id} className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                        <iframe
                            src={getYouTubeEmbedUrl(post.video_url)}
                            title={post.title}
                            className="w-full h-56"
                            allowFullScreen
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
                            <p className="text-sm text-gray-600">{post.instructor.name}</p>
                            <p className="mt-1 text-gray-700">{post.description}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {post.tags.map(tagRel => (
                                    <span
                                        key={tagRel.tag.id}
                                        className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                                    >
                                        {tagRel.tag.name}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-end">
                                <FontAwesomeIcon
                                    icon={bookmarkedPostIds.includes(post.id) ? solidBookmark : regularBookmark}
                                    size="lg"
                                    className="cursor-pointer text-blue-600"
                                    onClick={() => toggleBookmark(post.id)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Collection;
