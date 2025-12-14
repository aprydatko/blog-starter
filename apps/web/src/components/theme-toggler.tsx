// components/ThemeToggler.tsx
'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from 'lucide-react' // Example icons

const ThemeToggler = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()

  // Ensure component is mounted before rendering UI that depends on the theme
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <button className='flex items-center justify-center rounded-full h-9 w-9 border border-border bg-gray-100 dark:bg-accent/15 hover:dark:bg-accent hover:bg-accent/15 cursor-pointer' onClick={toggleTheme} aria-label="Toggle Theme Button">
      {resolvedTheme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  )
}

export default ThemeToggler
