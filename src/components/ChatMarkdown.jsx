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
        isUser ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="mb-3 last:mb-0 [&:not(:first-child)]:mt-0">{children}</p>
          ),
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mt-4 mb-2 first:mt-0 flex items-center gap-1.5">
              {children}
            </h3>
          ),
          strong: ({ children }) => (
            <strong className={`font-semibold ${isUser ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic text-slate-600 dark:text-slate-300">{children}</em>,
          ul: ({ children }) => (
            <ul className="my-2 ml-5 space-y-1.5 list-disc">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 ml-5 space-y-1.5 list-decimal">{children}</ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
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
                  className="block my-2 overflow-x-auto rounded-lg bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 px-3 py-2 text-[13px] font-mono text-slate-700 dark:text-slate-300"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded-md bg-slate-200 dark:bg-black/30 border border-slate-300 dark:border-white/10 px-1.5 py-0.5 text-[13px] font-mono text-primary/90"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-2 overflow-x-auto rounded-lg bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 p-3 text-[13px]">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-primary/50 pl-3 text-slate-500 dark:text-slate-400 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-slate-200 dark:border-white/10" />,
          table: ({ children }) => (
            <div className="my-4 w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-white/10">
              <table className="w-full text-left border-collapse min-w-max">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {children}
            </tbody>
          ),
          tr: ({ children }) => <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">{children}</tr>,
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white text-[13px] whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-[13px] text-slate-700 dark:text-slate-300 align-top whitespace-nowrap">
              {children}
            </td>
          ),
        }}
      >
        {normalizeMarkdown(content)}
      </ReactMarkdown>
    </div>
  );
}
