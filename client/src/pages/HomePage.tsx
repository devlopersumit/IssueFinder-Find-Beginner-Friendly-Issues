import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import { TAGLINE } from '../constants/brand'

const steps = [
  {
    n: '01',
    title: 'Filter by what you know',
    detail: 'Language, difficulty, and category — so every issue fits your skills.',
  },
  {
    n: '02',
    title: 'Only fresh, healthy projects',
    detail: 'We hide stale tickets and abandoned repos. What you see still ships.',
  },
  {
    n: '03',
    title: 'Open on GitHub and contribute',
    detail: 'One click to the issue. Fork, fix, and land your PR with confidence.',
  },
]

const languages = [
  { label: 'JavaScript', q: 'javascript' },
  { label: 'TypeScript', q: 'typescript' },
  { label: 'Python', q: 'python' },
  { label: 'Go', q: 'go' },
  { label: 'Rust', q: 'rust' },
  { label: 'Java', q: 'java' },
  { label: 'C++', q: 'cpp' },
  { label: 'Ruby', q: 'ruby' },
]

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />

      <main>
        {/* Why it exists */}
        <section className="border-t border-paper-line bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-medium text-ink dark:text-white sm:text-4xl">
                GitHub is noisy. Your next PR shouldn’t be.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-muted">
                Most “good first issues” are months old or sit in repos that barely merge. IssueFinder
                surfaces work that’s recent, on maintained projects, and filtered to your stack.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-paper-line dark:border-zinc-800">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              How it works
            </p>
            <h2 className="mt-3 text-center font-display text-3xl font-medium text-ink dark:text-white">
              Three steps. One contribution.
            </h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {steps.map((step) => (
                <div key={step.n}>
                  <span className="font-display text-3xl font-medium text-zinc-200 dark:text-zinc-700">
                    {step.n}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-medium text-ink dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="border-t border-paper-line bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-display text-3xl font-medium text-ink dark:text-white">
                  Start with your language
                </h2>
                <p className="mt-2 max-w-md text-ink-muted">
                  Jump into fresh issues in the stack you already write every day.
                </p>
              </div>
              <Link
                to="/issues"
                className="text-sm font-semibold text-accent transition hover:text-accent-dark"
              >
                Browse all languages →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {languages.map((lang) => (
                <Link
                  key={lang.q}
                  to={`/issues?language=${lang.q}`}
                  className="group rounded-lg border border-paper-line bg-paper px-4 py-5 transition hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
                >
                  <span className="font-display text-lg font-medium text-ink transition group-hover:text-accent dark:text-white">
                    {lang.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="border-t border-paper-line dark:border-zinc-800">
          <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-24">
            <h2 className="font-display text-3xl font-medium text-ink dark:text-white sm:text-4xl">
              Ready when you are.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-ink-muted">{TAGLINE}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/issues" className="btn-primary px-7 py-3 text-base">
                Browse fresh issues
              </Link>
              <Link to="/categories" className="btn-secondary px-7 py-3 text-base">
                Explore categories
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default HomePage
