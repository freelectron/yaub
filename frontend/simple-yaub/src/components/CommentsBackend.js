
const fetchPostComments = async (postId) => {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendURL}/api/get_comments?postId=${postId}`);
    return await response.json();
}

const postPostComment = async (postId, comment) => {
    const backendURLPublic = process.env.NEXT_PUBLIC_BACKEND_URL_PUBLIC || 'http://localhost:3001';

    fetch(`${backendURLPublic}/api/post_comment?postId=${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.ok;
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

export {fetchPostComments, postPostComment}