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

  const resources = [
    {
      title: 'GitHub Guides',
      description: 'Official GitHub guides for contributing to open source',
      link: 'https://guides.github.com/',
      icon: '📖'
    },
    {
      title: 'First Contributions',
      description: 'A hands-on tutorial to make your first open source contribution',
      link: 'https://firstcontributions.github.io/',
      icon: '🚀'
    },
    {
      title: 'Git Documentation',
      description: 'Complete Git reference and tutorials',
      link: 'https://git-scm.com/doc',
      icon: '📘'
    },
    {
      title: 'Good First Issues',
      description: 'Find beginner-friendly issues across GitHub',
      link: 'https://goodfirstissues.com/',
      icon: '✨'
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
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Start Your Open Source Journey
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          New to open source? Don't worry! This comprehensive guide will help you make your first contribution with confidence. 
          Learn step-by-step how to find projects, fix issues, and become part of the open source community.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Beginner Issues
          </Link>
          <Link
            to="/bounty"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            Explore Bounty Issues
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

      {/* Resources Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Helpful Resources
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Additional resources to help you on your open source journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              target="_blank"
              rel="noreferrer"
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{resource.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {resource.description}
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          ))}
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
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Beginner Issues
          </Link>
          <Link
            to="/bounty"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            Explore Bounty Issues
          </Link>
        </div>
      </section>
    </main>
  )
}

export default BeginnerGuidePage

