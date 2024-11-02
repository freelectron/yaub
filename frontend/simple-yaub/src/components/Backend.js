import axios from "axios";

const fetchPostContent = async (postId, setPostContents) => {
    console.log(`fetchPostContent is called at ${new Date().toLocaleString()}..`);
    const postIdParam = new URLSearchParams(postId).toString();

    console.log("Going to fetch from: ", `https://localhost:3001/api/get_post?${postIdParam}`)
    try {
        const response = await axios.get(`https://localhost:3001/api/get_post?${postIdParam}`);
        setPostContents(response.data);
    } catch (error) {
        console.error('Error fetching the post:', error);
    }
};

function fetchPostsMetaInfo() {
    console.log(`fetchPostsMetaInfo is called at ${new Date().toLocaleString()}..`);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://localhost:3001/api/posts_meta_info', false); // false makes the request synchronous
    xhr.send(null);

    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        console.error('Error fetching the post:', xhr.statusText);
        return [];
    }
}

export {fetchPostContent, fetchPostsMetaInfo}

