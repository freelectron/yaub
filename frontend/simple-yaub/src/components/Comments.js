import React, { useState } from 'react';

// Recursive Comment component for rendering comments and threads
const Comment = ({ comment, addReply }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleReplySubmit = (e) => {
        e.preventDefault();
        addReply(comment.id, replyContent);
        setReplyContent('');
        setShowReplyForm(false);
    };

    return (
        <div className="comment-container">
            <p>
                <strong>{comment.user}</strong>: {comment.content} <br />
                <small>Highlighted Text: "{comment.highlightedText}"</small>
            </p>
            <button
                className="reply-button"
                onClick={() => setShowReplyForm(!showReplyForm)}
            >
                Reply
            </button>

            {showReplyForm && (
                <form onSubmit={handleReplySubmit} className="reply-form">
                    <input
                        type="text"
                        className="reply-input"
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <button type="submit" className="submit-reply-button">
                        Submit Reply
                    </button>
                </form>
            )}

            {comment.replies && comment.replies.map((reply) => (
                <div className="reply-container" key={reply.id}>
                    <Comment comment={reply} addReply={addReply} />
                </div>
            ))}
        </div>
    );
};

// Helper functions for handling text selection and adding comments
const handleTextSelection = (setSelectedText, setShowCommentForm) => {
    const selection = window.getSelection().toString();
    if (selection) {
        setSelectedText(selection);
        setShowCommentForm(true);
    }
};

const handleAddComment = (
    e,
    comments,
    setComments,
    newComment,
    setNewComment,
    selectedText,
    setSelectedText,
    setShowCommentForm
) => {
    e.preventDefault();
    const newCommentObject = {
        id: comments.length + 1,
        user: 'User', // Replace with real user in a real app
        content: newComment,
        highlightedText: selectedText,
        replies: []
    };
    setComments([...comments, newCommentObject]);
    setNewComment('');
    setSelectedText('');
    setShowCommentForm(false);
};

// Recursive function to handle reply addition
const addReply = (commentId, replyContent, comments, setComments) => {
    const addReplyRecursive = (commentsArray) => {
        return commentsArray.map((comment) => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [
                        ...comment.replies,
                        { id: Date.now(), user: 'User', content: replyContent, highlightedText: '', replies: [] }
                    ]
                };
            }
            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: addReplyRecursive(comment.replies)
                };
            }
            return comment;
        });
    };
    setComments(addReplyRecursive(comments));
};

export { handleTextSelection, handleAddComment, addReply, Comment };
