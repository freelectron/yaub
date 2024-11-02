import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

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
        <div className="mb-3">
            <p>
                <strong>{comment.user}</strong>: {comment.content} <br />
                <small>Highlighted Text: "{comment.highlightedText}"</small>
            </p>
            <Button variant="link" size="sm" onClick={() => setShowReplyForm(!showReplyForm)}>
                Reply
            </Button>

            {showReplyForm && (
                <Form onSubmit={handleReplySubmit} className="mt-2">
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-2">
                        Submit Reply
                    </Button>
                </Form>
            )}

            {comment.replies && comment.replies.map((reply) => (
                <div className="ml-4 mt-3" key={reply.id}>
                    <Comment comment={reply} addReply={addReply} />
                </div>
            ))}
        </div>
    );
};

const handleTextSelection = (setSelectedText, setShowCommentForm) => {
    const selection = window.getSelection().toString();
    if (selection) {
        setSelectedText(selection);
        setShowCommentForm(true);  // Show the form when text is selected
    }
};

const handleAddComment = (e, comments, setComments, newComment, setNewComment, selectedText, setSelectedText, setShowCommentForm) => {
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
    setShowCommentForm(false);  // Hide the form after submission
};

// Recursive function to handle reply addition
const addReply = (commentId, replyContent, comments, setComments) => {
    const addReplyRecursive = (commentsArray) => {
        return commentsArray.map((comment) => {
            // If this is the comment we're replying to
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [
                        ...comment.replies,
                        { id: Date.now(), user: 'User', content: replyContent, highlightedText: '', replies: [] }
                    ]
                };
            }
            // If the comment has replies, apply recursion to its children
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