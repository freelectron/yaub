
const fetchPostComments = async (postId) => {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    let res = [];
    const urlQuery = `${backendURL}/api/get_comments?postId=${postId}`;
    try {
        const response = await fetch(urlQuery);
        res = await response.json();
    } catch (error) {
        console.log(`Error fetching comments from ${urlQuery},`, error);
    }
    return res;
}

const postPostComment = async (postId, comment) => {
    const backendURLPublic = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

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