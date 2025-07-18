import React, { useState } from 'react';
import {postPostComment} from "@/components/CommentsBackend";

const parseComments = (rawComments) => {
    if (!rawComments || rawComments.length === 0) {
        return [];
    }
    return rawComments.map((rawComment) => ({
        id: rawComment._id,
        user: rawComment.User,
        content: rawComment.Content,
        highlightedText: rawComment.HighlightedText,
        replies: parseComments(rawComment.Replies)
    }));
};

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

const handleAddComment = async (
    user,
    comments,
    setComments,
    newComment,
    selectedText,
    setSelectedText,
    setShowCommentForm,
    postId,
    currentCommentsLength,
    setCurrentCommentsLength
) => {
    setCurrentCommentsLength(currentCommentsLength + 1);
    const newCommentObject = {
        id: currentCommentsLength + 1,
        user: user,
        content: newComment,
        highlightedText: selectedText,
        replies: []
    };
    // send post request to backend to save the comment
    await postPostComment(postId, newCommentObject).then(r => console.log(r));
    setComments([...comments, newCommentObject]);
    setSelectedText('');
    setShowCommentForm(true);
};

// Recursive function to handle reply addition
const addReply = (user, commentId, replyContent, comments, setComments) => {
    const addReplyRecursive = (commentsArray) => {
        return commentsArray.map((comment) => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [
                        ...comment.replies,
                        { id: Date.now(), user: user, content: replyContent, highlightedText: '', replies: [] }
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

export { handleTextSelection, handleAddComment, addReply, Comment, parseComments};
