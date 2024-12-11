import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Tag {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    description: string;
    video_url: string;
    user_id: number;
    instructor: { name: string };
    tags: { tag: Tag }[];
}

interface PostCardProps {
    post: Post;
    onEdit: (post: Post) => void;
    onDelete: (postId: number) => void;
    getYouTubeEmbedUrl: (url: string) => string;
}

const MyPostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete, getYouTubeEmbedUrl }) => {
    return (
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
                    <h2 className="truncate text-xl font-semibold mb-1" title={post.title}>
                        {post.title}
                    </h2>
                    <p className="text-sm text-gray-600">{post.instructor.name}</p>
                </div>
                {/* Tags and Buttons Row */}
                <div className="flex justify-between items-center mt-4">
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
                    <div className="flex gap-10">
                        <button
                            className="text-blue-500 text-sm hover:text-blue-700 transition flex items-center gap-1"
                            onClick={() => onEdit(post)}
                        >
                            <FontAwesomeIcon icon={faEdit}/> Edit
                        </button>
                        <button
                            className="text-red-500 text-sm hover:text-red-700 transition flex items-center gap-1"
                            onClick={() => onDelete(post.id)}
                        >
                            <FontAwesomeIcon icon={faTrash}/> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default MyPostCard;
