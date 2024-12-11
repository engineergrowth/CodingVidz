import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { useUser } from '../../context/userContext';

interface PostModalProps {
    post?: {
        id: number;
        title: string;
        description: string;
        video_url: string;
        instructor: { name: string };
        user_id: number;
    };
    onClose: () => void;
    onSave: (post: any) => void;
}


const PostModal: React.FC<PostModalProps> = ({ post, onClose, onSave }) => {
    const { userId } = useUser();

    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [instructorName, setInstructorName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newPost = {
            id: post?.id,
            title,
            video_url: videoUrl,
            description,
            instructor_name: instructorName,
            user_id: post?.user_id || userId,
        };

        onSave(newPost);
        onClose();
    };


    useEffect(() => {
        if (post) {
            setTitle(post.title || '');
            setVideoUrl(post.video_url || '');
            setDescription(post.description || '');
            setInstructorName(post.instructor?.name || '');
        }
    }, [post]);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    &times;
                </button>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <TextField
                            label="Video URL"
                            variant="outlined"
                            fullWidth
                            value={videoUrl}
                            onChange={e => setVideoUrl(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <TextField
                            label="Description (optional)"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <TextField
                            label="Instructor Name"
                            variant="outlined"
                            fullWidth
                            value={instructorName}
                            onChange={e => setInstructorName(e.target.value)}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ padding: '10px', marginTop: '1rem' }}
                    >
                        Save Post
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default PostModal;
