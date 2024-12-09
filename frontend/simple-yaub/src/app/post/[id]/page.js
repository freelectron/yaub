import React from 'react';
import PostPage from '@/components/PostPage';
import {fetchPostContent} from "@/components/PublicFiles";

import '../../../styles/global.css';
import './page.scss';

export default async function PostPageWrapper({params}) {
    const {id} = await params;
    const postContentResponse = await fetchPostContent(id)

    return <PostPage postContentResponse={postContentResponse}/>;
}
