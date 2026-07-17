"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type {Session} from 'next-auth'

import {
  Comment,
  handleTextSelection,
  handleAddComment,
  addReply,
  parseComments,
  CommentType
} from './Comments';
import NavigationBar from '@/components/NavBar';
import CommentForm from '@/components/CommentForm';


interface PostPageProps {
  postId: string;
  serverRenderedPost: React.JSX.Element;
  session?: Session;
  rawComments: any;
}

const PostPage: React.FC<PostPageProps> = ({
  postId,
  serverRenderedPost,
  session,
  rawComments
}) => {
  const renderedPost = serverRenderedPost || '';
  const postComments = parseComments(rawComments);

  const [selectedText, setSelectedText] = useState<string>('');
  const [comments, setComments] = useState<CommentType[]>(postComments);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(true);
  const [currentCommentsLength, setCurrentCommentsLength] = useState<number>(
    comments.length
  );

  const handleTextSelectionWrapper = () =>
    handleTextSelection(setSelectedText, setShowCommentForm);

  const addReplyWrapper = (commentId: string | number, replyContent: string) =>
    addReply(
      session?.user?.name || '',
      commentId,
      replyContent,
      comments,
      setComments
    );

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelectionWrapper);
    return () => {
      document.removeEventListener('mouseup', handleTextSelectionWrapper);
    };
  }, []);

  console.log('session in posts page: ', session);

  const handleAddCommentFromForm = (commentContent: string) => {
    if (!session?.user?.name) return;

    handleAddComment(
      session.user.name,
      comments,
      setComments,
      commentContent,
      selectedText,
      setSelectedText,
      setShowCommentForm,
      postId,
      currentCommentsLength,
      setCurrentCommentsLength
    );
  };

  if (!session || !session.user) {
    return (
      <div className="empty">
        <NavigationBar />
        <div className="post-container">
          <div className="post-content">{renderedPost}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="empty">
        <NavigationBar />
        <div className="post-container">
          <div className="post-content">{renderedPost}</div>
        </div>
      </div>

      <div className="empty">
        {showCommentForm && (
          <CommentForm
            session={session}
            selectedText={selectedText}
            onAddComment={handleAddCommentFromForm}
            onCloseForm={() => setShowCommentForm(false)}
          />
        )}

        <h4>Comments</h4>
        {comments.length === 0 ? (
          <p>No comments yet. Highlight some text to add a comment!</p>
        ) : (
          comments.map((comment) => (
            <Comment key={comment.id} comment={comment} addReply={addReplyWrapper} />
          ))
        )}

        <Link href="/" className="btn back-btn">
          Back to Blog
        </Link>
      </div>
    </>
  );
};

export default PostPage;
