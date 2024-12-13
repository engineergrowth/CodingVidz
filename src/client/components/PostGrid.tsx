import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import DescriptionModal from './modals/DescriptionModal';

interface Tag {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    description: string;
    video_url: string;
    instructor: { name: string };
    tags: { tag: Tag }[];
}

interface PostGridProps {
    posts: Post[];
    userId?: number | null;
    bookmarkedPostIds: number[];
    toggleBookmark: (postId: number) => void;
    setSelectedDescription: (description: string | null) => void;
    selectedDescription: string | null;
    getYouTubeEmbedUrl: (url: string) => string;
    handleUpvote: (postId: number) => void;
    handleDownvote: (postId: number) => void;
    userVotes: { [key: number]: number };
}

const PostGrid: React.FC<PostGridProps> = ({
                                               posts,
                                               userId,
                                               bookmarkedPostIds,
                                               toggleBookmark,
                                               setSelectedDescription,
                                               selectedDescription,
                                               getYouTubeEmbedUrl,
                                               handleUpvote,
                                               handleDownvote,
                                               userVotes,
                                           }) => {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-14">
                {posts.map((post) => {
                    const userVote = userVotes && post.id in userVotes ? userVotes[post.id] : 0;

                    return (
                        <div
                            key={post.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[420px]"
                        >
                            {/* Embedded video */}
                            <iframe
                                src={getYouTubeEmbedUrl(post.video_url)}
                                title={post.title}
                                className="w-full h-[60%]"
                                allowFullScreen
                            />
                            <div className="flex flex-col justify-between flex-grow p-4">
                                {/* Title and Instructor */}
                                <div>
                                    <h2
                                        className="truncate text-xl font-semibold mb-1"
                                        title={post.title}
                                    >
                                        {post.title}
                                    </h2>
                                    <p className="text-sm text-gray-600">{post.instructor.name}</p>
                                </div>

                                {/* Description */}
                                <div className="mt-2">
                                    <div className="hidden md:block">
                                        <Tooltip
                                            title={post.description || 'No description available'}
                                            arrow
                                        >
                                            <span className="text-blue-500 text-sm cursor-pointer">
                                                Description
                                            </span>
                                        </Tooltip>
                                    </div>
                                    <div className="block md:hidden">
                                        <button
                                            className="text-blue-500 text-sm hover:text-blue-700 transition"
                                            onClick={() => setSelectedDescription(post.description)}
                                        >
                                            View Description
                                        </button>
                                    </div>
                                </div>

                                {/* Tags and Actions */}
                                <div className="flex justify-between items-center mt-auto">
                                    {/* Tags */}
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

                                    {/* Voting and Bookmark Actions */}
                                    {userId && (
                                        <div className="flex items-center gap-4">
                                            {/* Upvote */}
                                            <FontAwesomeIcon
                                                icon={faArrowUp}
                                                size="lg"
                                                className={`cursor-pointer ${
                                                    userVote === 1
                                                        ? 'text-green-500'
                                                        : 'text-gray-600'
                                                }`}
                                                onClick={() => handleUpvote(post.id)}
                                            />

                                            {/* Downvote */}
                                            <FontAwesomeIcon
                                                icon={faArrowDown}
                                                size="lg"
                                                className={`cursor-pointer ${
                                                    userVote === -1
                                                        ? 'text-red-500'
                                                        : 'text-gray-600'
                                                }`}
                                                onClick={() => handleDownvote(post.id)}
                                            />

                                            {/* Bookmark */}
                                            <FontAwesomeIcon
                                                icon={
                                                    bookmarkedPostIds.includes(post.id)
                                                        ? solidBookmark
                                                        : regularBookmark
                                                }
                                                size="lg"
                                                className="cursor-pointer text-blue-600"
                                                onClick={() => toggleBookmark(post.id)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Description Modal */}
            {selectedDescription && (
                <DescriptionModal
                    description={selectedDescription}
                    onClose={() => setSelectedDescription(null)}
                />
            )}
        </>
    );
};

export default PostGrid;
