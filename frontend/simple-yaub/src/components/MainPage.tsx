"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import NavigationBar from "./NavBar";
import Footer from "@/components/Footer";

interface Post {
    id: string | number;
    tags: string[];
    iconImage: string;
    title: string;
    date: string;
    author: string;
    content: string;
}

interface MainPageProps {
    defaultPostsMetaInfo?: {
        posts?: Post[];
    };
}

const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getUniqueTags = (posts: Post[]): string[] => {
    if (posts && Array.isArray(posts)) {
        const uniqueTags = new Set<string>(['All']);
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

const MainPage: React.FC<MainPageProps> = ({ defaultPostsMetaInfo }) => {
    const posts = defaultPostsMetaInfo?.posts || [];
    const availableTags = getUniqueTags(posts);

    const [selectedTag, setSelectedTag] = useState<string>('All');

    const handleFilterChange = (tag: string) => {
        setSelectedTag(tag);
    };

    const filteredPosts = selectedTag === 'All'
        ? posts
        : posts.filter((post) => post.tags.includes(selectedTag));

    return (
        <div className="empty">
            <NavigationBar />

            <div className="content-holder-container">
                <div className="posts-header1" />

                <div className="button-group center">
                    {availableTags.map((tag: string) => (
                        <button
                            key={tag}
                            onClick={() => handleFilterChange(tag)}
                            className={`filter-button${selectedTag === tag ? ' filter-button-active' : ''}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <div className="row">
                    {filteredPosts.map((post: Post) => (
                        <div className="col" key={post.id}>
                            <Link href={`/post/${post.id}`} className="card-link">
                                <div className="card">
                                    <div className="card-img-wrap">
                                        <img src={post.iconImage} />
                                    </div>
                                    <div className="card-body">
                                        <p className="card-title">{post.title}</p>
                                        <p className="card-details">{formatDate(post.date)} · {post.author}</p>
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
