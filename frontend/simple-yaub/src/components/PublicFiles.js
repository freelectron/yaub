import fs from 'fs';

const fetchPostContent = async (postId) => {
    const filePath = `public/posts/${postId}/post.md`;
    try {
        return  fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error('Error fetching the post:', error);
        return {content: ''};
    }
};

const fetchPostsMetaInfo = async () => {
    const filePath = `public/posts/meta_info.json`;
    try {
        return  JSON.parse( fs.readFileSync(filePath, 'utf-8') );
    } catch (error) {
        console.error('Error fetching file:', error);
        return  JSON.parse( "{}" );
    }
}

export {fetchPostContent, fetchPostsMetaInfo}

