import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const BeginnerGuidePage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  const popularLanguages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust',
    'C++', 'C', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart',
    'HTML/CSS', 'React', 'Vue', 'Angular', 'Node.js'
  ]

  const steps = [
    {
      number: 1,
      title: 'Set Up Your Development Environment',
      description: 'Install Git, create a GitHub account, and set up your local development environment.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      details: [
        'Install Git on your computer',
        'Create a free GitHub account',
        'Set up SSH keys for secure authentication',
        'Install your preferred code editor (VS Code, IntelliJ, etc.)',
        'Learn basic Git commands (clone, commit, push, pull)'
      ]
    },
    {
      number: 2,
      title: 'Find Beginner-Friendly Issues',
      description: 'Look for issues labeled with "good first issue", "beginner-friendly", or "help wanted".',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      details: [
        'Use our IssueFinder to search for beginner-friendly issues',
        'Filter by "good first issue" label',
        'Look for issues with clear descriptions',
        'Check if the issue is still open and unassigned',
        'Read the project\'s contributing guidelines'
      ]
    },
    {
      number: 3,
      title: 'Fork and Clone the Repository',
      description: 'Create your own copy of the project and download it to your computer.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      details: [
        'Click the "Fork" button on the repository page',
        'Clone your forked repository: git clone <your-fork-url>',
        'Add the original repo as upstream: git remote add upstream <original-url>',
        'Create a new branch for your changes: git checkout -b fix/issue-description',
        'Make sure you\'re working on the latest code'
      ]
    },
    {
      number: 4,
      title: 'Make Your Changes',
      description: 'Read the code, understand the issue, and implement your solution.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      details: [
        'Read the project\'s README and documentation',
        'Understand the codebase structure',
        'Write clean, readable code following project conventions',
        'Add comments where necessary',
        'Test your changes thoroughly',
        'Follow the project\'s coding style guide'
      ]
    },
    {
      number: 5,
      title: 'Test and Commit Your Changes',
      description: 'Ensure your code works correctly and commit with a clear message.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      details: [
        'Run the project\'s test suite',
        'Test your changes manually',
        'Commit with descriptive messages: git commit -m "Fix: description of fix"',
        'Keep commits focused and atomic',
        'Write meaningful commit messages'
      ]
    },
    {
      number: 6,
      title: 'Create a Pull Request',
      description: 'Submit your changes for review and collaborate with maintainers.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
      details: [
        'Push your branch: git push origin fix/issue-description',
        'Click "New Pull Request" on GitHub',
        'Write a clear PR description explaining your changes',
        'Reference the issue: "Fixes #123" or "Closes #123"',
        'Be responsive to feedback and suggestions',
        'Update your PR if maintainers request changes'
      ]
    }
  ]

  const tips = [
    {
      title: 'Start Small',
      description: 'Begin with documentation fixes, typo corrections, or small bug fixes. These are great confidence builders!',
      icon: '🌟'
    },
    {
      title: 'Read Before You Code',
      description: 'Thoroughly read the issue description, project documentation, and existing code before making changes.',
      icon: '📚'
    },
    {
      title: 'Ask Questions',
      description: 'Don\'t hesitate to ask questions in issue comments or project discussion forums. The community is helpful!',
      icon: '💬'
    },
    {
      title: 'Follow Code Style',
      description: 'Match the existing code style and conventions. Consistency is key in open source projects.',
      icon: '🎨'
    },
    {
      title: 'Be Patient',
      description: 'Maintainers are volunteers. Be patient with reviews and responses. Keep learning while you wait!',
      icon: '⏳'
    },
    {
      title: 'Celebrate Small Wins',
      description: 'Every contribution matters, even small ones. Celebrate your first merged PR - it\'s a big achievement!',
      icon: '🎉'
    }
  ]

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Back to Home Button */}
      <div className="mb-6 flex justify-start">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-6">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Beginner-Friendly Guide
        </div>
        <h1 className="font-display text-4xl font-medium text-ink dark:text-white sm:text-5xl mb-4">
          Land your first PR faster
        </h1>
        <p className="text-lg text-ink-muted max-w-3xl mx-auto leading-relaxed">
          A short path from setup to your first contribution. Find fresh beginner-friendly issues, then open them on GitHub.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/issues?difficulty=beginner"
            className="btn-primary"
          >
            Find beginner issues
          </Link>
          <Link
            to="/issues?category=good%20first%20issue"
            className="btn-secondary"
          >
            Good first issues
          </Link>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Step-by-Step Guide
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Follow these 6 simple steps to make your first contribution
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 mt-1 text-emerald-600 dark:text-emerald-400">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-24 sm:top-20 w-0.5 h-8 bg-gradient-to-b from-emerald-400 to-teal-500 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Pro Tips for Beginners
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn from the community's best practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">{tip.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {tip.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Language Filter Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Find Issues by Language
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Filter beginner-friendly issues by your preferred programming language
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <div className="flex flex-wrap gap-3 mb-6">
            {popularLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(selectedLanguage === lang ? null : lang)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedLanguage === lang
                    ? 'bg-emerald-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          {selectedLanguage && (
            <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-emerald-800 dark:text-emerald-300 font-medium mb-2">
                Selected: {selectedLanguage}
              </p>
              <Link
                to={`/?language=${encodeURIComponent(selectedLanguage.toLowerCase())}`}
                className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold"
              >
                Find {selectedLanguage} issues
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-8 sm:p-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Ready to Make Your First Contribution?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          You've learned the basics. Now it's time to put your knowledge into practice! 
          Find your first issue and start contributing today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/issues?difficulty=beginner"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
          >
            Find beginner issues
          </Link>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Browse categories
          </Link>
        </div>
      </section>
    </main>
  )
}

export default BeginnerGuidePage

