const fetchPostComments = async (postId: string | number): Promise<any[]> => {
    const backendURL: string = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    let res: any[] = [];
    const urlQuery: string = `${backendURL}/api/get_comments?postId=${postId}`;
    try {
        const response = await fetch(urlQuery);
        res = await response.json();
    } catch (error: unknown) {
        console.log(`Error fetching comments from ${urlQuery},`, error);
    }
    return res;
};

const postPostComment = async (postId: string | number, comment: any): Promise<void> => {
    const backendURLPublic: string = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

    fetch(`${backendURLPublic}/api/post_comment?postId=${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.ok;
        })
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error: unknown) => {
            console.error('Error:', error);
        });
};

export { fetchPostComments, postPostComment };