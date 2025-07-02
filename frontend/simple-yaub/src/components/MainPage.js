"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import NavigationBar from "./NavBar";
import Footer from "@/components/Footer";

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
        <div className="empty">

            <NavigationBar />

            <div className="content-holder-container">

                <div className="posts-header1">
                    {/*<p> Your selection </p>*/}
                </div>

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
                        <div className="col" key={post.id}>
                            <Link href={`/post/${post.id}`} className="card-link">
                                <div className="card">
                                    <img src={post.iconImage}/>
                                    <div className="card-body">
                                        <p className="card-title">{post.title}</p>
                                        <p className="card-details"> On {post.date} by By {post.author}</p>
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

            <Footer />

        </div>
    );
};

export default MainPage;