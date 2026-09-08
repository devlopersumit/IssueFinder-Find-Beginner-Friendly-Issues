import React from 'react'
import { Link } from 'react-router-dom'
import { PRODUCT_NAME, TAGLINE } from '../constants/brand'

type FooterProps = {
  githubUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
}

const Footer: React.FC<FooterProps> = ({
  githubUrl = 'https://github.com/sumitjhacodes',
  linkedinUrl = 'https://www.linkedin.com/in/sumit-jha?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  twitterUrl = 'https://x.com/_sumitjha_?t=4nSWLPjfWOEhS06PoX9-Lg&s=09',
}) => {
  return (
    <footer className="mt-auto border-t border-paper-line bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="max-w-sm space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-semibold text-ink dark:text-white">{PRODUCT_NAME}</span>
          </div>
          <p className="text-sm leading-relaxed text-ink-muted">{TAGLINE}</p>
          <p className="text-xs text-ink-muted/80">© {new Date().getFullYear()} {PRODUCT_NAME}</p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft dark:text-zinc-300">
          <Link to="/issues" className="hover:text-ink dark:hover:text-white">Issues</Link>
          <Link to="/categories" className="hover:text-ink dark:hover:text-white">Categories</Link>
          <Link to="/repositories" className="hover:text-ink dark:hover:text-white">Repos</Link>
          <Link to="/beginner-guide" className="hover:text-ink dark:hover:text-white">Guide</Link>
        </nav>

        <div className="flex items-center gap-3 text-ink-muted">
          <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-ink dark:hover:text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.424 2.865 8.178 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.952 0-1.093.39-1.988 1.03-2.688-.104-.253-.447-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.546 1.377.203 2.394.1 2.647.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.696-4.566 4.945.359.309.679.92.679 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.019 10.019 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z" clipRule="evenodd" />
            </svg>
          </a>
          <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-ink dark:hover:text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0zM8.98 8.98H14v2.05h.07c.7-1.33 2.42-2.74 4.98-2.74 5.33 0 6.32 3.5 6.32 8.04V24h-5v-6.98c0-1.66-.03-3.8-2.32-3.8-2.32 0-2.68 1.8-2.68 3.68V24h-5z" />
            </svg>
          </a>
          <a href={twitterUrl} target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="hover:text-ink dark:hover:text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.227-8.451L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
