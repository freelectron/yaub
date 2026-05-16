'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';

interface CommentFormProps {
    session: any;
    selectedText: string;
    onAddComment: (comment: string) => void;
    onCloseForm: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ selectedText, onAddComment, onCloseForm }) => {
    const [newComment, setNewComment] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (newComment.trim() === '') return;
        onAddComment(newComment);
        setNewComment('');
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <h5>Comment on: \"{selectedText}\"</h5>
            <div className="form-group">
                <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Write your comment here..."
                    value={newComment}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
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
