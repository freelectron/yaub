import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
import rehypeRaw from 'rehype-raw'

const renderMarkdown = (MarkdownContent) => {
    // This is slow/costly operation, remove logging later
    console.log(`Render raw post to string ${new Date().toLocaleString()}..`);
    return (
        <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeRaw]}>
            {MarkdownContent}
        </Markdown>
    );
};

export {renderMarkdown};

