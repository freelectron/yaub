"use client";
import React, {useState} from 'react';

import { Container, Row, Col, Button, Badge, Card } from 'react-bootstrap';
import Link  from 'next/link';

import '../styles/App.css';
import '../styles/styles.css';

import NavigationBar from "./NavBar";

const getUniqueTags = (posts) => {
    if (posts && Array.isArray(posts)) {
        const uniqueTags = new Set(["All"]);
        posts.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach(tag => {
                    uniqueTags.add(tag);
                });
            }
        });

        return Array.from(uniqueTags);
    }
    return [];
};

const MainPage  = ({defaultPostsMetaInfo}) => {

    const posts = defaultPostsMetaInfo?.posts || [];
    const availableTags = getUniqueTags(posts);

    const [selectedTag, setSelectedTag] = useState('All');
    const handleFilterChange = (tag) => {
        setSelectedTag(tag);
    };

    const filteredPosts = selectedTag === 'All'
        ? posts
        : posts.filter((post) => post.tags.includes(selectedTag));

    return (
        <>

            {/*Navigation Bar*/}
            <NavigationBar />

            {/* Posts */}
            <Container style={{maxWidth: '700px', backgroundColor: 'transparent'}}>
                {/* Tag Filter */}
                <div className="d-flex justify-content-center mb-4">
                    {availableTags.map((tag) => (
                        <Button
                            key={tag}
                            // variant={selectedTag === tag ? 'success' : 'outline-success'}
                            className="mx-2"
                            onClick={() => handleFilterChange(tag)}
                            bsPrefix={'tag-button tag-button-container'}
                        >
                            {tag}
                        </Button>
                    ))}
                </div>

                <div className="bg-images-container">
                    <a href="https://www.freeiconspng.com/img/43112" title="Image from freeiconspng.com">
                        <img
                            className={'bg-image imgYao'}
                            src="https://www.freeiconspng.com/uploads/yao-ming-meme-png-3.png" width="350"
                            alt="Yao Ming Meme PNG"/>
                    </a>
                </div>

                <Row>
                    {filteredPosts.map((post) => (
                        <Col md={4} key={post.id} className="mb-4">
                            <Card className="custom-card">
                                <Card.Body>
                                    <Card.Title>{post.title}</Card.Title>
                                    <div>
                                        {post.tags.map((tag, index) => (
                                            <Badge
                                                bg="badge badge-container"
                                                key={index}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Card.Text className="mt-2">
                                        {post.content.slice(0, 100)}...
                                    </Card.Text>
                                    <Link href={`/post/${post.id}`} className="custom-btn custom-btn-main">
                                        Read More
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

        </>
    );
};

export default MainPage;
