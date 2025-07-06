"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import {Comment, handleTextSelection, handleAddComment, addReply, parseComments} from './Comments';
import NavigationBar from "@/components/NavBar";
import CommentForm from "@/components/CommentForm";

const PostPage = ({ postId, serverRenderedPost, session, rawComments }) => {
    const renderedPost = serverRenderedPost || '';
    const postComments = parseComments(rawComments);

    const [selectedText, setSelectedText] = useState('');
    const [comments, setComments] = useState(postComments);
    const [showCommentForm, setShowCommentForm] = useState(true);
    const [currentCommentsLength, setCurrentCommentsLength] = useState(comments.length);

    // Detect selected text
    const handleTextSelectionWrapper = () => handleTextSelection(setSelectedText, setShowCommentForm);
    const addReplyWrapper = (commentId, replyContent) => addReply(session.user.name, commentId, replyContent, comments, setComments);

    // Listen for text selection
    useEffect(() => {
        document.addEventListener('mouseup', handleTextSelectionWrapper);
        return () => {
            document.removeEventListener('mouseup', handleTextSelectionWrapper);
        };
    }, []);

    console.log("session in posts page: ", session)

    // This function will now be passed to CommentForm
    const handleAddCommentFromForm = (commentContent) => {
        // Call your original handleAddComment logic here
        handleAddComment(
            session.user.name,
            comments,
            setComments,
            commentContent, // Use the content passed from CommentForm
            selectedText,
            setSelectedText,
            setShowCommentForm,
            postId,
            currentCommentsLength,
            setCurrentCommentsLength
        );
    };

    //  If not logged, do not allow commenting
    if (!session || !session.user) {
        return (
            <div className="empty">
                <NavigationBar />
                <div className="post-container">
                    <div className="post-content">
                        {renderedPost}
                    </div>
                </div>
            </div>
        )
    }
    return (
        <>
        <div className="empty">
            <NavigationBar />
            <div className="post-container">
                <div className="post-content">
                    {renderedPost}
                </div>
            </div>
        </div>

        <div className="empty">
            {/* Comment Form */}
            {showCommentForm && (
                <CommentForm
                    session={session} // todo: this is not needed, double check
                    selectedText={selectedText}
                    onAddComment={handleAddCommentFromForm}
                    onCloseForm={() => setShowCommentForm(false)}
                />
            )}

            {/* Comments Section */}
            <h4>Comments</h4>
            {comments.length === 0 ? (
                <p>No comments yet. Highlight some text to add a comment!</p>
            ) : (
                comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} addReply={addReplyWrapper} />
                ))
            )}

            <Link href="/" className="btn back-btn">Back to Blog</Link>
        </div>
    </>
    );
};

export default PostPage;
