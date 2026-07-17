import React, { useState } from 'react';
import { postPostComment } from '@/components/CommentsBackend';

export interface CommentType {
    id: number;
    user: string;
    content: string;
    highlightedText: string;
    replies: CommentType[];
}

export const parseComments = (rawComments: any[]): CommentType[] => {
    if (!rawComments || rawComments.length === 0) {
        return [];
    }

    return rawComments.map((rawComment: any) => ({
        id: rawComment._id,
        user: rawComment.User,
        content: rawComment.Content,
        highlightedText: rawComment.HighlightedText,
        replies: parseComments(rawComment.Replies)
    }));
};

type CommentProps = {
    comment: CommentType;
    addReply: (commentId: number, replyContent: string) => void;
};

export const Comment: React.FC<CommentProps> = ({ comment, addReply }) => {
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const [replyContent, setReplyContent] = useState<string>('');

    const handleReplySubmit = (e: React.FormEvent) => {
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

export const handleTextSelection = (
    setSelectedText: (text: string) => void,
    setShowCommentForm: (show: boolean) => void
) => {
    const selection = window.getSelection()?.toString() || '';
    if (selection) {
        setSelectedText(selection);
        setShowCommentForm(true);
    }
};

export const handleAddComment = async (
    user: string,
    comments: CommentType[],
    setComments: (c: CommentType[]) => void,
    newComment: string,
    selectedText: string,
    setSelectedText: (text: string) => void,
    setShowCommentForm: (show: boolean) => void,
    postId: string,
    currentCommentsLength: number,
    setCurrentCommentsLength: (n: number) => void
) => {
    const newLength = currentCommentsLength + 1;
    setCurrentCommentsLength(newLength);

    const newCommentObject: CommentType = {
        id: newLength,
        user,
        content: newComment,
        highlightedText: selectedText,
        replies: []
    };

    await postPostComment(postId, newCommentObject).then((r: any) => console.log(r));

    setComments([...comments, newCommentObject]);
    setSelectedText('');
    setShowCommentForm(true);
};

export const addReply = (
    user: string,
    commentId: string | number,
    replyContent: string,
    comments: CommentType[],
    setComments: (c: CommentType[]) => void
) => {
    const addReplyRecursive = (commentsArray: CommentType[]): CommentType[] => {
        return commentsArray.map((comment) => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [
                        ...comment.replies,
                        {
                            id: Date.now(),
                            user,
                            content: replyContent,
                            highlightedText: '',
                            replies: []
                        }
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
