# IssueFinder

A modern, full-stack web application that helps developers discover the best GitHub issues and repositories to contribute to. Whether you're a beginner or an experienced developer, IssueFinder makes it easy to find open-source opportunities filtered by category, language, and interests.

**Perfect for beginners!** Includes a comprehensive step-by-step guide to help you make your first contribution, find beginner-friendly issues, and navigate the open source world with confidence.

**New Features:** Live contribution feed, AI-powered issue matching engine, and contribution impact tracker with shareable profiles!

## 🚀 Live Demo

**[View Live Application](https://issuefinder.fun)**

## 📋 Features

### 🔍 Issue Discovery
- **Smart Search**: Real-time search across GitHub issues with intelligent filtering
- **Unassigned Issues**: Focus on opportunities that are available for contribution
- **Multiple Categories**: Filter by bug, feature, enhancement, documentation, and more
- **Language Filter**: Find issues in your preferred programming language (20+ languages)
- **Debounced Search**: Optimized performance with search debouncing
- **Pagination**: Navigate through pages of issues with Previous/Next controls
- **Comprehensive Fetching**: Fetches up to 8,000 potential issues across multiple queries

### 💰 Bounty Issues
- **Real Bounty Issues Only**: Strict filtering to show only issues with actual bounty labels
- **Label-Based Filtering**: Only displays issues with verified bounty labels (bounty, bountysource, funded, sponsor, paid, issuehunt, etc.)
- **Multi-Page Fetching**: Fetches up to 10 pages per query (100 items/page) to get all available bounty issues
- **Comprehensive Coverage**: Searches across 8 different bounty label queries
- **Pagination Support**: Full pagination through all available bounty issues
- **Smart Caching**: Caches all fetched issues for fast reload and pagination
- **Repository Validation**: Verifies repositories are legitimate before displaying issues
- **Strong CTAs**: Compelling call-to-action sections encouraging contributions

### 📖 Beginner Guide
- **Comprehensive 6-Step Guide**: Complete walkthrough from setup to first pull request
  - Step 1: Set Up Your Development Environment
  - Step 2: Find Beginner-Friendly Issues
  - Step 3: Fork and Clone the Repository
  - Step 4: Make Your Changes
  - Step 5: Test and Commit Your Changes
  - Step 6: Create a Pull Request
- **Pro Tips Section**: 6 helpful tips for beginners
- **Language Filter**: Filter beginner issues by 19+ popular programming languages
- **External Resources**: Links to GitHub Guides, First Contributions, Git Docs, and more
- **Language-Agnostic**: Works for all programming languages
- **Visual Step Indicators**: Numbered badges and icons for each step

### 📚 Repository Explorer
- **Advanced Search**: Search repositories by name or owner/repo format (e.g., `facebook/react`)
- **Trending Repos**: Discover popular repositories sorted by stars, forks, or recent activity
- **Detailed Views**: View comprehensive repository information including:
  - Star count, forks, and open issues
  - Topics and tags
  - Last updated timestamp
  - Repository description and language
- **Repository Details Modal**: Deep-dive into repository information
- **Back to Home Navigation**: Easy navigation back to homepage

### 🔥 Live Contribution Feed
- **Real-Time Activity**: See global open source contributions as they happen
- **Live Updates**: Auto-refreshes every 30 seconds to show the latest activity
- **Multiple Event Types**: Track commits, pull requests, issues, and repository creation
- **Contributor Profiles**: View avatars and usernames of active contributors
- **Repository Tracking**: See which repositories are most active
- **Statistics Dashboard**: View counts of commits, PRs, issues, and unique contributors
- **Trending Repositories**: Discover the most active repositories in real-time
- **Terminal-Style UI**: Developer-friendly interface with GitHub-inspired design
- **Theme-Aware**: Seamlessly adapts to light and dark modes

### 🤖 AI-Powered Issue Matching Engine
- **Profile Analysis**: Analyzes your GitHub profile to understand your skills and interests
- **Personalized Recommendations**: Get issues matched to your programming languages and repositories
- **Match Scoring**: See how well each issue matches your profile (0-100% match score)
- **Match Reasons**: Understand why issues are recommended (language match, repository familiarity, etc.)
- **Smart Filtering**: Automatically filters issues based on your expertise
- **No Authentication Required**: Works with just your GitHub username
- **Real-Time Matching**: Instant recommendations as you enter your username
- **Terminal-Style Interface**: Developer-centric UI with match indicators and badges

### 📊 Contribution Impact Tracker
- **Impact Score**: Get a personalized impact score (0-100) based on your contributions
- **Contribution Statistics**: Track total contributions, repositories, languages, and more
- **Achievement Badges**: Earn badges for milestones and achievements
- **Contribution Streaks**: Track your daily contribution streaks
- **Visual Timeline**: See your contribution history in a beautiful timeline view
- **Shareable Profile Cards**: Generate and share beautiful profile cards on social media
- **Public Profile Pages**: Create shareable profile URLs (e.g., `/contributor/username`)
- **Comprehensive Metrics**: View detailed breakdowns of your open source impact
- **Mobile-Responsive**: Fully optimized for all devices

### 🎨 User Experience
- **Dark Mode**: Seamless dark/light theme switching with system preference detection
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Pagination**: Navigate through pages with Previous/Next buttons and page counters
- **Loading States**: Beautiful skeleton loaders and loading indicators
- **Error Handling**: Graceful error messages and handling
- **Accessibility**: ARIA labels and keyboard navigation support
- **Smooth Animations**: Hover effects, transitions, and transform animations
- **Soothing UI**: Modern gradient backgrounds and calming color schemes
- **Navigation**: Consistent "Back to Home" buttons across all pages

### 🎯 Filtering System
- **Issue Categories**:
  - ✨ Good First Issue
  - 🆘 Help Wanted
  - 🐛 Bug
  - ⚡ Enhancement
  - 🚀 Feature
  - 📝 Documentation
  - ♻️ Refactor
  - Performance
  - 🧪 Testing
  - ❓ Question

- **Programming Languages**: JavaScript, TypeScript, Python, Java, Go, Rust, C++, C, C#, PHP, Ruby, Swift, Kotlin, Dart, HTML, CSS, Scala, Lua, Shell, R, and more

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern UI library
- **TypeScript 5.2.2** - Type-safe JavaScript
- **Vite 5.1.0** - Next-generation build tool
- **TailwindCSS 3.4.1** - Utility-first CSS framework
- **React Context API** - State management for theme

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.1.0** - Web framework
- **MongoDB/Mongoose 8.19.2** - Database and ODM
- **CORS 2.8.5** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - Type-aware linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **Nodemon** - Development server auto-reload

### APIs
- **GitHub REST API** - Comprehensive integration with multiple endpoints
  - **Search API**: Repositories and issues search
  - **Events API**: Real-time public events and contributions
  - **Users API**: User profiles and repository data
  - **Issues API**: Issue details and metadata
  - No authentication required for public data
  - Rate limits handled gracefully with smart caching

## 📁 Project Structure

```
IssueHub/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── FiltersPanel.tsx
│   │   │   ├── IssueList.tsx
│   │   │   ├── BountyIssues.tsx
│   │   │   ├── RepositoryList.tsx
│   │   │   ├── RepositoryModal.tsx
│   │   │   ├── DifficultyBadge.tsx
│   │   │   ├── LiveContributionFeed.tsx
│   │   │   ├── PersonalizedIssues.tsx
│   │   │   ├── ImpactMetrics.tsx
│   │   │   ├── ContributionTimeline.tsx
│   │   │   ├── ShareableCard.tsx
│   │   │   ├── AchievementBadges.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── BountyIssuesPage.tsx
│   │   │   ├── BeginnerGuidePage.tsx
│   │   │   ├── SearchResultsPage.tsx
│   │   │   ├── RepositoriesPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── ContributorProfile.tsx
│   │   ├── contexts/      # React contexts
│   │   │   ├── ThemeContext.tsx
│   │   │   └── SearchContext.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── useFetchIssues.ts
│   │   │   ├── useFetchRepositories.ts
│   │   │   ├── useFetchRepositoryDetails.ts
│   │   │   ├── useSearchRepository.ts
│   │   │   ├── useLiveContributions.ts
│   │   │   ├── usePersonalizedIssues.ts
│   │   │   └── useContributorProfile.ts
│   │   ├── utils/         # Utility functions
│   │   │   ├── queryBuilder.ts
│   │   │   ├── difficulty.ts
│   │   │   ├── languageDetection.ts
│   │   │   ├── repoLanguages.ts
│   │   │   ├── issueMatcher.ts
│   │   │   ├── contributionTracker.ts
│   │   │   └── security.ts
│   │   ├── App.tsx        # Main application component
│   │   ├── main.tsx       # Application entry point
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── vite.config.ts
├── server/                # Backend Node.js application
│   ├── app.js            # Express server
│   └── package.json
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/devlopersumit/Issuefinder.git
   cd IssueHub
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables** (if needed)
   ```bash
   # Create .env file in server directory
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

5. **Run the development server**
   
   Frontend (Terminal 1):
   ```bash
   cd client
   npm run dev
   ```
   
   Backend (Terminal 2):
   ```bash
   cd server
   npm run dev
   ```

6. **Open your browser**
   ```
   Frontend: http://localhost:5173
   Backend:  http://localhost:5000
   ```

### Building for Production

**Frontend:**
```bash
cd client
npm run build
```

The production build will be in the `client/dist` directory.

**Backend:**
```bash
cd server
node app.js
```

## 🎯 Key Features Implementation

### Search Functionality
- **Issues**: Debounced search with multi-category filtering
- **Repositories**: Real-time search with owner/repo format support
- **Query Optimization**: GitHub API query string construction for efficient searches
- **Bounty Issues**: Multi-query fetching with label-based filtering

### Bounty Issues System
- **Multi-Page Fetching**: Fetches up to 10 pages per query (100 items/page)
- **Comprehensive Coverage**: 8 different bounty label queries
- **Strict Filtering**: Only shows issues with verified bounty labels
- **Repository Validation**: Checks repository legitimacy before display
- **Smart Caching**: Caches all fetched issues for fast pagination
- **Rate Limit Handling**: Graceful degradation with delays between requests

### Pagination
- **Client-Side Pagination**: Paginates through cached results
- **Page Controls**: Previous/Next buttons with proper disabled states
- **Page Counter**: Shows current page and total pages
- **Total Count Display**: Shows total number of issues when available
- **Smooth Scrolling**: Auto-scrolls to top on page change

### Beginner Guide
- **Step-by-Step Instructions**: 6 comprehensive steps with detailed actions
- **Visual Indicators**: Numbered badges, icons, and connector lines
- **Pro Tips**: 6 helpful tips for successful contributions
- **Language Filtering**: Interactive language selection with 19+ options
- **External Resources**: Links to learning materials and tutorials
- **Responsive Layout**: Optimized for all screen sizes

### State Management
- **Local State**: React hooks for component-level state
- **Context API**: Theme and search state management across the application
- **Memoization**: Optimized re-renders with useMemo and useCallback
- **Refs for Caching**: useRef for storing fetched data and pagination state

### API Integration
- **GitHub REST API**: Direct integration for issue and repository data
- **Error Handling**: Comprehensive error states and user feedback
- **Rate Limiting**: Graceful handling of API rate limits with delays
- **Abort Controllers**: Request cancellation for better UX
- **Multi-Query Strategy**: Parallel queries with deduplication
- **Caching Strategy**: localStorage caching with expiration

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large tap targets and swipe gestures
- **Adaptive Layout**: Grid and flexbox layouts
- **Breakpoint Optimization**: Tailored layouts for sm, md, lg, xl screens

### Live Contribution Feed
- **GitHub Events API**: Real-time integration with GitHub's public events endpoint
- **Auto-Refresh**: Automatic updates every 30 seconds
- **Event Filtering**: Filters and displays relevant contribution events
- **Statistics Calculation**: Real-time stats for commits, PRs, issues, and contributors
- **Repository Tracking**: Identifies trending repositories from live activity
- **Performance Optimized**: Efficient data fetching and rendering

### AI-Powered Issue Matching
- **Profile Fetching**: Retrieves user profile data from GitHub API
- **Language Analysis**: Extracts programming languages from user repositories
- **Repository Matching**: Matches issues to user's familiar repositories
- **Scoring Algorithm**: Calculates match scores based on multiple factors
- **Reason Generation**: Provides explanations for each match recommendation
- **Input Validation**: Secure username validation and sanitization

### Contribution Impact Tracker
- **GitHub API Integration**: Fetches comprehensive contribution data
- **Impact Calculation**: Advanced algorithm to calculate contribution impact score
- **Timeline Generation**: Builds chronological timeline of contributions
- **Achievement System**: Tracks and awards badges for milestones
- **Streak Tracking**: Monitors daily contribution streaks
- **Shareable Cards**: Generates visual cards for social media sharing
- **URL Routing**: Dynamic routing for public profile pages
- **Security**: Input validation and URL sanitization for safe navigation

## 🌟 Use Cases

- **Beginner Developers**: 
  - Comprehensive beginner guide with step-by-step instructions
  - Find "good first issue" tags to start contributing
  - Language-specific filtering for all skill levels
  - Learn the complete contribution workflow
  - Get AI-powered personalized issue recommendations
  - Track your contribution impact and showcase achievements
- **Open Source Contributors**: 
  - Discover projects in your tech stack
  - Find bounty issues with real rewards
  - Filter by difficulty, type, and framework
  - Watch live contributions from the global community
  - Get personalized issue matches based on your skills
  - Track and share your contribution impact
- **Project Maintainers**: 
  - Find repositories that need help
  - Discover contributors looking for projects
  - Monitor live contribution activity
  - Identify trending repositories and active contributors
- **Learning**: 
  - Explore codebases and coding patterns
  - Learn from real-world open source projects
  - Understand contribution workflows
  - See real-time examples of contributions
  - Get matched with issues that match your learning goals

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Sumit Jha**

- GitHub: [@devlopersumit](https://github.com/devlopersumit)
- LinkedIn: [Sumit Jha](https://www.linkedin.com/in/sumit-jha)
- Twitter: [@_sumitjha_](https://x.com/_sumitjha_)

## 🙏 Acknowledgments

- GitHub for providing the amazing API
- React and Vite teams for excellent developer tools
- TailwindCSS for the beautiful utility classes
- The open-source community for inspiration

## 📊 Project Stats

- **Languages**: TypeScript, JavaScript, HTML, CSS
- **Dependencies**: 50+ packages
- **Components**: 15+ reusable components
- **Pages**: 7 main pages (Home, Bounty Issues, Beginner Guide, Search, Repositories, Dashboard, Contributor Profile)
- **Hooks**: 7 custom React hooks
- **API Endpoints**: GitHub REST API (Issues, Repositories, Events, Users)
- **Build Size**: Optimized for production
- **Security**: Input validation, XSS prevention, URL sanitization, security headers
- **Features**: 
  - Issue discovery with advanced filtering
  - Bounty issues with comprehensive fetching
  - Beginner guide with step-by-step instructions
  - Repository explorer with detailed views
  - Live contribution feed with real-time updates
  - AI-powered personalized issue matching
  - Contribution impact tracker with shareable profiles
  - Full pagination support
  - Dark mode and responsive design
  - Terminal-style developer dashboard

---

**Made with ❤️ by Sumit Jha**

