import React from 'react';
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'
import rehypeRaw from 'rehype-raw'

const renderMarkdown = (MarkdownContent: string): React.JSX.Element => {
    console.log(`Render raw post to string ${new Date().toLocaleString()}..`);
    return (
        <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeRaw]}>
            {MarkdownContent}
        </Markdown>
    );
};

export { renderMarkdown };
