import React from 'react';
import { fetchPostContent } from '@/components/PublicFiles';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PostPage from '@/components/PostPage';
import '../../../styles/global.css';
import '../../../styles/nav-bar.scss';
import '../../../styles/footer.scss';
import './page.scss';
import { renderMarkdown } from '@/components/MDRenderer';
import { fetchPostComments } from '@/components/CommentsBackend';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPageWrapper({ params }: PageProps) {
  const { id } = await params;
  const renderedPost = renderMarkdown(fetchPostContent(id));

  const session = await getServerSession(authOptions);

  let comments: unknown[] = [];
  if (session) {
    comments = await fetchPostComments(id);
  }

  return (
    <PostPage postId={id} serverRenderedPost={renderedPost} session={session} rawComments={comments} />
  );
}
