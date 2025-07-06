"use client"

import React, { useState, useEffect } from 'react';

const CommentForm = ({ session, selectedText, onAddComment, onCloseForm }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return; // Prevent empty comments
        onAddComment(newComment); // Pass newComment up to parent
        setNewComment(''); // Clear the form
    };

    // If selectedText changes, you might want to reset newComment or some other behavior
    // useEffect(() => {
    //     setNewComment('');
    // }, [selectedText]);

    return (
        <form onSubmit={handleSubmit} className="comment-form">
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
            <button type="button" className="btn secondary-btn" onClick={onCloseForm}>
                Cancel
            </button>
        </form>
    );
};

export default CommentForm;