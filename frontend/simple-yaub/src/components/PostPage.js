"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import {Comment, handleTextSelection, handleAddComment, addReply, parseComments} from './Comments';
import NavigationBar from "@/components/NavBar";

const PostPage = ({ postId, serverRenderedPost, session, rawComments }) => {
    const renderedPost = serverRenderedPost || '';
    const postComments = parseComments(rawComments);

    const [selectedText, setSelectedText] = useState('');
    const [comments, setComments] = useState(postComments);
    const [newComment, setNewComment] = useState('');
    const [showCommentForm, setShowCommentForm] = useState(true);
    const [currentCommentsLength, setCurrentCommentsLength] = useState(comments.length);

    // Detect selected text
    const handleTextSelectionWrapper = () => handleTextSelection(setSelectedText, setShowCommentForm);
    const handleAddCommentWrapper = (e) => handleAddComment(e, session.user.name, comments, setComments, newComment, setNewComment, selectedText, setSelectedText, setShowCommentForm, postId, currentCommentsLength, setCurrentCommentsLength);
    const addReplyWrapper = (commentId, replyContent) => addReply(session.user.name, commentId, replyContent, comments, setComments);

    // Listen for text selection
    useEffect(() => {
        document.addEventListener('mouseup', handleTextSelectionWrapper);
        return () => {
            document.removeEventListener('mouseup', handleTextSelectionWrapper);
        };
    }, []);

    //  If not logged, do not allow commenting
    if (!session) {
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
                <form onSubmit={handleAddCommentWrapper} className="comment-form">
                    <h5>Comment on: "{selectedText}"</h5>
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Write your comment here..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn primary-btn">Add Comment</button>
                    <button type="button" className="btn secondary-btn" onClick={() => setShowCommentForm(false)}>
                        Cancel
                    </button>
                </form>
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
