import React from 'react';
import PostPage from '@/components/PostPage';

export default function PostPageWrapper({ params }) {
    const { id } = params;

    return <PostPage postId={id} />;
}
