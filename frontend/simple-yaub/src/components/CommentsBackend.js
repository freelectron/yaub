
const fetchPostComments = async (postId) => {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendURL}/api/get_comments?postId=${postId}`);
    return await response.json();
}

export {fetchPostComments}