import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, CircularProgress, Box } from "@mui/material";
import { FaHeart, FaComment } from "react-icons/fa";
import axios from "axios";

interface User {
    id: number;
    username: string;
    email: string;
    avatarUrl?: string;
}

interface Post {
    id: number;
    description: string;
    media_url?: string;
    media_type?: "image" | "video";
    reactions: { id: number; userId: number }[];
    comments: { id: number; text: string; userId: number }[];
    user: User;
}

const Food = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get<Post[]>("http://localhost:3000/api/posts");
                setPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="w-full">
                        <Card sx={{ maxWidth: "100%", borderRadius: "10px" }} className="bg-white shadow-lg">
                            {post.media_url && post.media_type === "image" && (
                                <div>
                                    <img
                                        src={post.media_url}
                                        alt="Post Media"
                                        className="w-full rounded-t-lg"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            console.error("Image failed to load:", target.src);
                                            target.src = 'https://www.simplyrecipes.com/thmb/pjYMLcsKHkr8D8tYixmaFNxppPw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__09__easy-pepperoni-pizza-lead-3-8f256746d649404baa36a44d271329bc.jpg';
                                        }}
                                    />

                                </div>
                            )}

                            {post.media_url && post.media_type === "video" && (
                                <video controls className="w-full rounded-t-lg">
                                    <source src={post.media_url} type="video/mp4"/>
                                    Your browser does not support the video tag.
                                </video>
                            )}


                            <CardContent sx={{ paddingTop: 2 }}>
                                <Typography variant="h6" className="font-semibold mb-2">
                                    {post.user?.username || "Anonymous"}
                                </Typography>

                                <Box display="flex" alignItems="center" mt={2}>
                                    <Box display="flex" alignItems="center" mr={2}>
                                        <FaHeart size={20} className="mr-1" />
                                        <Typography variant="body2">{post.reactions.length} Likes</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <FaComment size={20} className="mr-1" />
                                        <Typography variant="body2">{post.comments.length} Comments</Typography>
                                    </Box>
                                </Box>

                                <Button size="small" sx={{ mt: 2 }} variant="outlined">
                                    Comment
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </Box>
    );
};

export default Food;
