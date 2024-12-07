import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Button } from '@mui/material';
import { useUser } from '../context/userContext';
import PostModal from '../components/modals/PostModal';
import { useNavigate } from 'react-router-dom';

interface Post {
    id: number;
    title: string;
    description: string;
    video_url: string;
    user_id: number;
    instructor: { name: string };
    tags: { tag: { id: number; name: string } }[];
}


const MyPosts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const { userId } = useUser();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;


    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [userId, navigate])

    const userIdAsNumber = userId ? parseInt(userId) : null;

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
                const response = await axios.get<Post[]>(`${apiUrl}/posts`);
                setPosts(response.data);
            } catch (err) {
                setError('Failed to fetch posts');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleEditClick = (post: Post) => {
        if (post.id) {
            setSelectedPost(post);
            setOpenModal(true);
        } else {
            console.error('Post does not have a valid ID');
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPost(null);
    };

    const handleSave = async (updatedPost: Post) => {
        try {
            if (selectedPost && selectedPost.id) {
                const postId = selectedPost.id;

                if (userIdAsNumber === null) {
                    setError('User is not logged in');
                    return;
                }

                const { user_id, tags, ...postData } = updatedPost;

                const finalPostData = { ...postData, user_id: userIdAsNumber };

                const response = await axios.put(
                    `${apiUrl}/posts/${postId}`,
                    finalPostData
                );

                setPosts((prevPosts) => {
                    return prevPosts.map((post) =>
                        post.id === postId ? { ...post, ...finalPostData } : post
                    );
                });

                setOpenModal(false);
            } else {
                setError('Selected post is required to update');
            }
        } catch (err) {
            setError('Failed to save post');
        }
    };

    const handleDelete = async (postId: number) => {
        try {
            await axios.delete(`${apiUrl}/posts/${postId}`);
            setPosts(posts.filter(post => post.id !== postId)); // Remove deleted post from state
        } catch (err) {
            setError('Failed to delete post');
        }
    };

    const userPosts = posts.filter(post => post.user_id === userIdAsNumber);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-10">

                {userPosts.map(post => (
                    <div key={post.id}
                         className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                        <iframe
                            src={getYouTubeEmbedUrl(post.video_url)}
                            title={post.title}
                            className="w-full h-56"
                            allowFullScreen
                        />
                        <div className="p-4 flex-grow">
                            <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
                            <p className="text-sm text-gray-600">{post.instructor.name}</p>
                            <p className="mt-1 text-gray-700">{post.description || "No description provided."}</p>
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
                        </div>
                        <div className="p-4 mt-auto flex justify-between gap-4">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEditClick(post)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleDelete(post.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {openModal && selectedPost && (
                <PostModal
                    post={selectedPost}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default MyPosts;
