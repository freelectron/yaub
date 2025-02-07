import React from 'react';
import {fetchPostContent} from "@/components/PublicFiles";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import PostPage from '@/components/PostPage';

import '../../../styles/global.css';
import '../../../styles/nav-bar.scss';
import '../../../styles/footer.scss';
import './page.scss';

export default async function PostPageWrapper({params}) {
    const {id} = await params;
    const postContentResponse = await fetchPostContent(id)

    const session = await getServerSession(authOptions);

    return (
        <PostPage postContentResponse={postContentResponse} session={session}/>
    );
}
