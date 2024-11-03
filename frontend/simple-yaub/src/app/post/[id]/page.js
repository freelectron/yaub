import React from 'react';
import PostPage from '@/components/PostPage';
import {fetchPostContent} from "@/components/Backend";

export default async function PostPageWrapper({params}) {
    const {id} = await params;
    const postContentResponse = await fetchPostContent({"postId":id})

    return <PostPage postContentResponse={postContentResponse}/>;
}
