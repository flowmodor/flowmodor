import ReactMarkdown from 'react-markdown';

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      className="pointer-events-none inline-block"
      components={{
        h1: ({ ...props }) => <p {...props} />,
        h2: ({ ...props }) => <p {...props} />,
        h3: ({ ...props }) => <p {...props} />,
        h4: ({ ...props }) => <p {...props} />,
        h5: ({ ...props }) => <p {...props} />,
        h6: ({ ...props }) => <p {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
