import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface MessageMarkdownIProps {
  children: string;
}

const MessageMarkdown = ({ children }: MessageMarkdownIProps) => {
  return <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]}>{children}</ReactMarkdown>;
};

export default MessageMarkdown;
