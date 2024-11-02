import axios from "axios";

const fetchPostContent = async (postId, setPostContents) => {
    console.log(`fetchPostContent is called at ${new Date().toLocaleString()}..`);
    const postIdParam = new URLSearchParams(postId).toString();

    console.log("Going to fetch from: ", `http://localhost:3001/api/get_post?${postIdParam}`)
    try {
        const response = await axios.get(`http://localhost:3001/api/get_post?${postIdParam}`);
        setPostContents(response.data);
    } catch (error) {
        console.error('Error fetching the post:', error);
    }
};

const fetchPostsMetaInfo = async () => {
    console.log(`fetchPostsMetaInfo is called at ${new Date().toLocaleString()}..`);

    try {
        const response = await fetch('http://localhost:3001/api/posts_meta_info');
        if (!response.ok) {
            throw new Error(`Error fetching the post: ${response.statusText}`);
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching the post:', error.message);
        return {posts: []}; // Return a default structure to prevent errors
    }
}

export {fetchPostContent, fetchPostsMetaInfo}

