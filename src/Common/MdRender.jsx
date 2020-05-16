/* eslint-disable react/display-name */
import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function MdRender({ source, className }) {
  return (
    <ReactMarkdown
      source={source}
      className={className}
      renderers={{
        link: ({ href, children }) => (
          <a href={href} className="underline text-green-600">
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <div className="pl-4 border-l-4 border-gray-500 text-gray-700 mb-4 mt-4">{children}</div>
        ),
        code: ({ value }) => (
          <pre className="bg-gray-200 font-mono text-xs rounded-md mb-4 mt-4 py-3 px-4">
            <code>{value}</code>
          </pre>
        ),
        inlineCode: ({ children }) => (
          <code className="font-mono bg-gray-200 p-1 text-xs rounded-sm">{children}</code>
        ),
        list: ({ ordered, children }) => {
          if (ordered) {
            return <ol className="pl-2 mt-2 mb-2 list-decimal list-inside">{children}</ol>;
          }
          return <ul className="pl-2 mt-2 mb-2 list-disc list-inside">{children}</ul>;
        },
        listItem: ({ children }) => <li className="mb-1">{children}</li>,
        paragraph: ({ children }) => <p className="mb-2">{children}</p>,
        heading: ({ level, children }) => {
          switch (level) {
            case 1:
              return <h1 className="font-extrabold text-3xl mb-2">{children}</h1>;
            case 2:
              return <h2 className="font-extrabold text-2xl mb-2 mt-4">{children}</h2>;
            case 3:
              return <h3 className="font-bold text-xl mb-1 mt-3">{children}</h3>;
            default:
              return <span className="font-bold text-lg">{children}</span>;
          }
        },
      }}
    />
  );
}
