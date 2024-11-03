import React from 'react';
import PostPage from '@/components/PostPage';
import {fetchPostContent} from "@/components/Backend";

import '../../../styles/global.css';

export default async function PostPageWrapper({params}) {
    const {id} = await params;
    const postContentResponse = await fetchPostContent({"postId":id})

    return <PostPage postContentResponse={postContentResponse}/>;
}
