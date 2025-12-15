"use client"

import { useState, useEffect, useRef } from 'react'

export function useScrollDirection() {
    const [isVisible, setIsVisible] = useState(true)
    const prevScrollY = useRef(0)
    // We track the last scroll position separately for logic to avoid state dependency

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            const lastScrollY = prevScrollY.current
            const diff = currentScrollY - lastScrollY
            const threshold = 15 // Increased threshold to reduce sensitivity/shaking

            // Don't update if difference is small
            if (Math.abs(diff) < threshold) return

            const isScrollingDown = diff > 0
            const isAtTop = currentScrollY < 50

            // Logic: 
            // 1. If at top, always show
            // 2. If scrolling down AND not at top, hide
            // 3. If scrolling up, show
            if (isAtTop) {
                setIsVisible(true)
            } else if (isScrollingDown) {
                setIsVisible(false)
            } else {
                // Only show if we scrolled up significantly or are at the top
                // This 'else' covers scrolling up.
                setIsVisible(true)
            }

            prevScrollY.current = currentScrollY
        }

        // Use passive listener and maybe throttle if needed, but threshold helps.
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, []) // Empty dependency array is crucial for performance

    return { isVisible }
}
