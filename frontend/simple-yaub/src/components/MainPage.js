"use client";
import React, { useState } from 'react';
import Link from 'next/link';
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

const MainPage = ({ defaultPostsMetaInfo }) => {
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
            <NavigationBar />

            <div className="container">
                <div className="button-group center">
                    {availableTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleFilterChange(tag)}
                            className="filter-button"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
                <div className="row">
                    {filteredPosts.map((post) => (
                        <div className="col" key={post.id} style={{ flex: '0 0 60%', maxWidth: '60%' }}>
                            <Link href={`/post/${post.id}`} className="card-link">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{post.title}</h5>
                                        <div className="badge-group">
                                            {post.tags.map((tag, index) => (
                                                <span className="badge" key={index}>
                                                    {"#" + tag}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="card-text">
                                            {post.content.slice(0, 100)}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MainPage;