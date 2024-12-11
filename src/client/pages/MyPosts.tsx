import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { useUser } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import MyPostCard from '../components/MyPostCard';
import PostModal from '../components/modals/PostModal';
import { getYouTubeEmbedUrl } from '../utils/videoUtils';


export interface Post {
    id: number;
    title: string;
    description: string;
    video_url: string;
    user_id: number;
    instructor: { name: string };
    tags: { tag: { id: number; name: string } }[];
    instructor_name?: string;
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
    }, [userId, navigate]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get<Post[]>(`${apiUrl}/posts`);
                setPosts(response.data.filter((post) => post.user_id === parseInt(userId || '', 10)));
            } catch (err) {
                setError('Failed to fetch posts');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [userId]);

    const handleEdit = (post: Post) => {
        setSelectedPost({
            ...post,
            user_id: userId ? parseInt(userId, 10) : -1 // Use -1 as a fallback
        });
        setOpenModal(true);
    };


    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPost(null);
    };

    const handleSave = async (updatedPost: Post) => {

        const payload = {
            title: updatedPost.title,
            video_url: updatedPost.video_url,
            description: updatedPost.description,
            instructor_name: updatedPost.instructor_name || updatedPost.instructor?.name,
            user_id: updatedPost.user_id,
        };


        try {
            await axios.put(`${apiUrl}/posts/${updatedPost.id}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === updatedPost.id ? { ...post, ...payload } : post
                )
            );
            handleCloseModal();
        } catch (err) {
            console.error("Save error:", err);
            setError('Failed to save post');
        }
    };



    const handleDelete = async (postId: number) => {
        try {
            await axios.delete(`${apiUrl}/posts/${postId}`);
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (err) {
            setError('Failed to delete post');
        }
    };

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
                {posts.map((post) => (
                    <MyPostCard
                        key={post.id}
                        post={post}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        getYouTubeEmbedUrl={getYouTubeEmbedUrl}
                    />
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
