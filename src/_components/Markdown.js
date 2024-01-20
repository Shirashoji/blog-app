import ReactMarkdown from "react-markdown";
import matter from "gray-matter";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";

import "@/styles/markdown.css";

function Markdown(props) {
  const { content } = props;
  const { data, content: markdownContent } = matter(content);
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkParse, remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeStringify]}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}

export default Markdown;
