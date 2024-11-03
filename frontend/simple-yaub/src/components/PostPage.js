"use client";
import React, { useState, useEffect } from 'react';

import { useParams } from 'next/navigation';
import Link from 'next/link';

import { Container, Button, Form } from 'react-bootstrap';

import { Comment, handleTextSelection, handleAddComment, addReply } from './Comments';

import {fetchPostContent} from "./Backend";
import {renderMarkdown} from "./MDRenderer";

import '../styles/global.css';


const PostPage = () => {
    const { id } = useParams();
    console.log('PostPage id:', id);


    const [selectedText, setSelectedText] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showCommentForm, setShowCommentForm] = useState(false);

    const [postContent, setPostContents] = useState(null);

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

    const fetchPostContentWrapper =   () => fetchPostContent({"postId":id}, setPostContents);

    useEffect(() => { fetchPostContentWrapper().catch(
            error => console.error('Error fetching post content:', error)); }
        );

    return (
        <>

    <Container className="mt-2" style={{backgroundColor: 'transparent'}} >
        {renderMarkdown(postContent)}
    </Container>

    <Container className="mt-0">
        {/* Comment Form */}
        {showCommentForm && (
                <Form onSubmit={handleAddCommentWrapper} className="mt-0">
                    <h5>Comment on: "{selectedText}"</h5>
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Write your comment here..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-2">
                        Add Comment
                    </Button>
                    <Button variant="secondary" className="mt-2 ms-2" onClick={() => setShowCommentForm(false)}>
                        Cancel
                    </Button>
                </Form>
            )}

            {/* Comments Section */}
            <h4 className="mt-0">Comments</h4>
            {comments.length === 0 ? (
                <p>No comments yet. Highlight some text to add a comment!</p>
            ) : (
                comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} addReply={addReplyWrapper}/>
                ))
            )}

            <Link href="/" className="btn btn-secondary mt-4">Back to Blog</Link>
        </Container>

        </>
    );
};

export default PostPage;
