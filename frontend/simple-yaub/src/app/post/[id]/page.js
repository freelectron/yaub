import React from 'react';
import PostPage from '@/components/PostPage';

export default async function PostPageWrapper({params}) {
    const {id} = await params;

    return <PostPage postId={id}/>;
}
