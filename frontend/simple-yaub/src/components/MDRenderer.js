import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
import rehypeRaw from 'rehype-raw'

const renderMarkdown = (MarkdownContent) => {
    console.log(`renderMarkdown is called at ${new Date().toLocaleString()}..`);
    return (
        <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeRaw]}>
            {MarkdownContent}
        </Markdown>
    );
};

export {renderMarkdown};

