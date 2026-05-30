import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Unescape AI output like \*\*bold\*\* → **bold** */
export function normalizeMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\\([*_`#[\]()])/g, '$1')
    .replace(/\r\n/g, '\n');
}

const linkClass =
  'text-primary underline decoration-primary/40 underline-offset-2 hover:text-primary/80';

export default function ChatMarkdown({ content, variant = 'assistant' }) {
  const isUser = variant === 'user';

  return (
    <div
      className={`accio-markdown text-[15px] leading-relaxed ${
        isUser ? 'text-slate-900 dark:text-white' : 'text-slate-200'
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="mb-3 last:mb-0 [&:not(:first-child)]:mt-0">{children}</p>
          ),
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-white mt-4 mb-2 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold text-white mt-4 mb-2 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[15px] font-semibold text-white mt-4 mb-2 first:mt-0 flex items-center gap-1.5">
              {children}
            </h3>
          ),
          strong: ({ children }) => (
            <strong className={`font-semibold ${isUser ? 'text-slate-900 dark:text-white' : 'text-white'}`}>
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic text-slate-300">{children}</em>,
          ul: ({ children }) => (
            <ul className="my-2 ml-1 space-y-1.5 list-none">{children}</ul>
          ),
          ol: ({ children }) => <ol className="accio-markdown-ol">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = className?.includes('language-');
            if (isBlock) {
              return (
                <code
                  className="block my-2 overflow-x-auto rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-[13px] font-mono text-slate-300"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded-md bg-black/30 border border-white/10 px-1.5 py-0.5 text-[13px] font-mono text-primary/90"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-2 overflow-x-auto rounded-lg bg-black/40 border border-white/10 p-3 text-[13px]">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-primary/50 pl-3 text-slate-400 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-white/10" />,
        }}
      >
        {normalizeMarkdown(content)}
      </ReactMarkdown>
    </div>
  );
}
