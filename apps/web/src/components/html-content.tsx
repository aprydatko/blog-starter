'use client'

import { useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'

interface HtmlContentProps {
  content: string
  className?: string
}

export function HtmlContent({ content, className = '' }: HtmlContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      // Sanitize the HTML content to prevent XSS attacks
      const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
          'p',
          'br',
          'strong',
          'em',
          'u',
          's',
          'a',
          'ul',
          'ol',
          'li',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'blockquote',
          'pre',
          'code',
          'span',
          'div',
          'hr',
          'img',
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style', 'src', 'alt'],
      })
      contentRef.current.innerHTML = sanitizedContent
    }
  }, [content])

  return <div ref={contentRef} className={`prose dark:prose-invert max-w-none ${className}`} />
}
