import React from 'react';
import {fetchPostContent} from "@/components/PublicFiles";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import PostPage from '@/components/PostPage';

import '../../../styles/global.css';
import '../../../styles/nav-bar.scss';
import '../../../styles/footer.scss';
import './page.scss';
import {renderMarkdown} from "@/components/MDRenderer";
import {fetchPostComments} from "@/components/CommentsBackend";

export default async function PostPageWrapper({params}) {
    const {id} = await params;
    const postContentResponse = await fetchPostContent(id)
    const renderedPost = renderMarkdown(postContentResponse);

    const session = await getServerSession(authOptions);

    let comments = [];
    if (!session) {
        comments = [];
    } else{
        comments =  await fetchPostComments(id);
    }


    return (
        <PostPage postId={id} serverRenderedPost={renderedPost} session={session} rawComments = {comments}/>
    );
}
