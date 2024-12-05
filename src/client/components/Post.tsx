import { useEffect, useState } from 'react';
import axios from 'axios';
import TagSelector from './TagSelector';
import useFetchTags from '../hooks/useFetchTags';
import { useUser } from '../context/userContext';
import { TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

const PostForm: React.FC = () => {
    const { userId, token } = useUser();
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [instructorName, setInstructorName] = useState('');
    const [tags, setTags] = useState<number[]>([]);
    const { tags: allTags, error } = useFetchTags();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [userId, navigate])

    const handleTagChange = (selectedTagIds: number[]) => {
        setTags(selectedTagIds);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId || !token) {
            console.error('User not authenticated');
            return;
        }

        const userIdInt = parseInt(userId, 10);

        console.log('Form Data to Send:', {
            title,
            video_url: videoUrl,
            description,
            user_id: userIdInt,
            instructor_name: instructorName,
            tags,
        });

        try {
            const response = await axios.post(
                'http://localhost:3000/posts',
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

            // Log the response from the server
            console.log('Post created:', response.data);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-4">
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

            <div>
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

