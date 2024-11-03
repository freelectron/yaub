import axios from "axios";

const fetchPostContent = async (postId) => {
    const postIdParam = new URLSearchParams(postId).toString();
    try {
        const response = await axios.get(`http://localhost:3001/api/get_post?${postIdParam}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the post:', error);
        return {content: ''};
    }
};

const fetchPostsMetaInfo = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/posts_meta_info');
        if (!response.ok) {
            throw new Error(`Error fetching meta info: ${response.statusText}`);
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching meta info:', error.message);
        return {posts: []}; // Return a default structure to prevent errors
    }
}

export {fetchPostContent, fetchPostsMetaInfo}

