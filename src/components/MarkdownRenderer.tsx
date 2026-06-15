'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  currentPage: number; // Accept currentPage as a prop
  pages: string[]; // Accept pages as a prop
}

export default function MarkdownRenderer({ content, currentPage, pages }: MarkdownRendererProps) {
  const parseMarkdown = (text: string) => {
    // Split by double newlines for paragraphs
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length === 0) return;

      const paraText = currentParagraph.join('\n');

      // Headers
      if (paraText.startsWith('# ')) {
        elements.push(
          <h2 key={elements.length} className="text-2xl font-bebas-neue font-bold mt-6 mb-4 text-current font-serif">
            {paraText.replace('# ', '')}
          </h2>
        );
      } else if (paraText.startsWith('## ')) {
        elements.push(
          <h3 key={elements.length} className="text-xl font-bebas-neue font-bold mt-5 mb-3 text-current font-serif">
            {paraText.replace('## ', '')}
          </h3>
        );
      } else if (paraText.startsWith('### ')) {
        elements.push(
          <h4 key={elements.length} className="text-lg font-barlow font-semibold mt-4 mb-2 text-current font-serif">
            {paraText.replace('### ', '')}
          </h4>
        );
      } else if (paraText.startsWith('> ')) {
        // Blockquote
        elements.push(
          <blockquote
            key={elements.length}
            className="border-l-4 border-gray-400 pl-3 py-2 my-3 italic text-current bg-yellow-50 rounded-r"
          >
            {paraText.split('\n').map((line, i) => (
              <div key={i} className="text-sm">{line.replace('> ', '')}</div>
            ))}
          </blockquote>
        );
      } else if (paraText.startsWith('- ') || paraText.startsWith('* ')) {
        // List
        const items = paraText.split('\n').filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
        elements.push(
          <ul key={elements.length} className="list-disc list-inside my-3 space-y-1 text-current">
            {items.map((item, i) => (
              <li key={i} className="ml-2 text-sm">
                {item.replace(/^[-*]\s/, '')}
              </li>
            ))}
          </ul>
        );
      } else if (paraText.trim().length > 0) {
        // Regular paragraph with formatting
        let formatted = paraText
          .replace(/\*\*(.+?)\*\*/g, '<strong class="font-barlow font-bold">$1</strong>')
          .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
          .replace(/__(.+?)__/g, '<strong class="font-barlow font-bold">$1</strong>')
          .replace(/_(.+?)_/g, '<em class="italic">$1</em>')
          .replace(/`(.+?)`/g, '<code class="bg-gray-200 px-1.5 py-0.5 rounded text-gray-800 font-mono text-xs">$1</code>');

        elements.push(
          <p
            key={elements.length}
            className="text-current leading-relaxed mb-3 text-sm font-serif"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      }

      currentParagraph = [];
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim() === '') {
        flushParagraph();
      } else {
        currentParagraph.push(line);
      }
    }

    flushParagraph();
    return elements;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Reading Progress Bar */}
      <div className="w-full h-1 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300 ease-out progress-bar"
          style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
        />
      </div>

      <div className="flex-grow space-y-4 min-h-[400px]">
        {parseMarkdown(pages[currentPage] || '')}
      </div>
    </div>
  );
}
