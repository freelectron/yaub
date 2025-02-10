
const fetchPostComments = async (postId) => {
    const response = await fetch(`http://localhost:3001/api/get_comments?postId=${postId}`);
    return await response.json();
}

export {fetchPostComments}