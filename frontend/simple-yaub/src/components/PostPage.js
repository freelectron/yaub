"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Comment, handleTextSelection, handleAddComment, addReply } from './Comments';
import { renderMarkdown } from "./MDRenderer";
import NavigationBar from "@/components/NavBar";

const PostPage = ({ postContentResponse }) => {
    const postContent = postContentResponse || '';

    const [selectedText, setSelectedText] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showCommentForm, setShowCommentForm] = useState(false);

    // Detect selected text
    const handleTextSelectionWrapper = () => handleTextSelection(setSelectedText, setShowCommentForm);
    const handleAddCommentWrapper = (e) => handleAddComment(e, comments, setComments, newComment, setNewComment, selectedText, setSelectedText, setShowCommentForm);
    const addReplyWrapper = (commentId, replyContent) => addReply(commentId, replyContent, comments, setComments);

    // Listen for text selection
    useEffect(() => {
        document.addEventListener('mouseup', handleTextSelectionWrapper);
        return () => {
            document.removeEventListener('mouseup', handleTextSelectionWrapper);
        };
    }, []);

    return (
        <div className="empty">
            <NavigationBar />
            <div className="post-container">
                <div className="post-content">
                    {renderMarkdown(postContent)}
                </div>

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

        </div>

    );
};

export default PostPage;
