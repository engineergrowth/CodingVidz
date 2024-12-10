import { useMemo } from 'react';

interface Post {
    id: number;
    title: string;
    description: string;
    video_url: string;
    instructor: { name: string };
    likes: number;
    created_at: string;
    tags: { tag: { id: number; name: string } }[];
}

const useFilteredPosts = (posts: Post[], selectedTagIds: number[], sortOption: string): Post[] => {
    return useMemo(() => {
        return posts
            .filter((post) =>
                selectedTagIds.length === 0 || post.tags.some((tagRel) => selectedTagIds.includes(tagRel.tag.id))
            )
            .sort((a, b) => {
                if (sortOption === 'newest') {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                } else if (sortOption === 'oldest') {
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                } else if (sortOption === 'popular') {
                    return b.likes - a.likes;
                }
                return 0;
            });
    }, [posts, selectedTagIds, sortOption]);
};

export default useFilteredPosts;
