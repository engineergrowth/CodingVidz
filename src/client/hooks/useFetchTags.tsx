import { useState, useEffect } from 'react';
import axios from 'axios';

interface Tag {
    id: number;
    name: string;
}

const useFetchTags = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = import.meta.env.VITE_API_URL;


    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get<Tag[]>(`${apiUrl}/tags`);

                if (Array.isArray(response.data)) {
                    setTags(response.data);
                } else {
                    console.error("Expected an array but received:", response.data);
                    setError('Received unexpected data format.');
                }
            } catch (err: any) {
                console.error("API Error:", err);
                setError(err.response?.data?.error || 'Failed to fetch tags.');
            }
        };

        fetchTags();
    }, []);

    return { tags, error };
};

export default useFetchTags;
