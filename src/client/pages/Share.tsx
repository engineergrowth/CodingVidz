import { useEffect, useState } from 'react';
import axios from 'axios';
import TagSelector from '../components/TagSelector';
import useFetchTags from '../hooks/useFetchTags';
import { useUser } from '../context/userContext';
import { TextField, Button, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";

const PostForm: React.FC = () => {
    const { userId, token } = useUser();
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [instructorName, setInstructorName] = useState('');
    const [tags, setTags] = useState<number[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const { tags: allTags, error } = useFetchTags();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [userId, navigate]);

    const handleTagChange = (selectedTagIds: number[]) => {
        setTags(selectedTagIds);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId || !token) {
            setMessage({ type: 'error', text: 'You must be logged in to create a post.' });
            return;
        }

        const userIdInt = parseInt(userId, 10);

        try {
            const response = await axios.post(
                `${apiUrl}/posts`,
                {
                    title,
                    video_url: videoUrl,
                    description,
                    user_id: userIdInt,
                    instructor_name: instructorName,
                    tags,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage({ type: 'success', text: 'Post created successfully!' });


            setTimeout(() => {
                navigate(`/watch-vidz`);
            }, 1000);
        } catch (error) {
            console.error('Error creating post:', error);
            setMessage({ type: 'error', text: 'There was an error creating your post. Please try again.' });
        }
    };


    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-6 bg-white shadow-md rounded-md">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Share Content</h2>
                <p className="text-gray-600">Thank you for contributing to our community!</p>
            </div>

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                </label>
                <TextField
                    id="title"
                    label="Enter the title of your post"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="video-url" className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                </label>
                <TextField
                    id="description"
                    label="Write a brief description of the video"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={e => {
                        const value = e.target.value;
                        setDescription(value.slice(0, 40)); // Trim value to the first 40 characters
                    }}
                    helperText={`${description.length}/40 characters`}
                />

            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description (max 40 characters)
                </label>
                <TextField
                    id="description"
                    label="Write a brief description of the video"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={e => {
                        const value = e.target.value;
                        if (value.length <= 40) {
                            setDescription(value);
                        }
                    }}
                    helperText={`${description.length}/40 characters`}
                />
            </div>


            <div>
                <label htmlFor="instructor-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor Name
                </label>
                <TextField
                    id="instructor-name"
                    label="Who is the instructor?"
                    variant="outlined"
                    fullWidth
                    value={instructorName}
                    onChange={e => setInstructorName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                </label>
                <TagSelector tags={allTags} onChange={handleTagChange} />
            </div>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ padding: '10px', marginTop: '1rem' }}
            >
                Submit Post
            </Button>
        </form>
    );

};

export default PostForm;

