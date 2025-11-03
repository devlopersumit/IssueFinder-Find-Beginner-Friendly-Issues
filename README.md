# IssueFinder

A modern, full-stack web application that helps developers discover the best GitHub issues and repositories to contribute to. Whether you're a beginner or an experienced developer, IssueFinder makes it easy to find open-source opportunities filtered by category, language, and interests.

## 🚀 Live Demo

**[View Live Application](https://issuefinder.fun)**

## 📋 Features

### 🔍 Issue Discovery
- **Smart Search**: Real-time search across GitHub issues with intelligent filtering
- **Unassigned Issues**: Focus on opportunities that are available for contribution
- **Multiple Categories**: Filter by bug, feature, enhancement, documentation, and more
- **Language Filter**: Find issues in your preferred programming language (20+ languages)
- **Debounced Search**: Optimized performance with search debouncing

### 📚 Repository Explorer
- **Advanced Search**: Search repositories by name or owner/repo format (e.g., `facebook/react`)
- **Trending Repos**: Discover popular repositories sorted by stars, forks, or recent activity
- **Detailed Views**: View comprehensive repository information including:
  - Star count, forks, and open issues
  - Topics and tags
  - Last updated timestamp
  - Repository description and language
- **Repository Details Modal**: Deep-dive into repository information

### 🎨 User Experience
- **Dark Mode**: Seamless dark/light theme switching with system preference detection
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Infinite Scroll**: Load more issues/repositories with ease
- **Loading States**: Beautiful skeleton loaders and loading indicators
- **Error Handling**: Graceful error messages and handling
- **Accessibility**: ARIA labels and keyboard navigation support

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
- **GitHub REST API** - Search repositories and issues
  - No authentication required for public data
  - Rate limits handled gracefully

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
│   │   │   ├── RepositoryList.tsx
│   │   │   ├── RepositoryModal.tsx
│   │   │   └── Footer.tsx
│   │   ├── contexts/      # React contexts
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── useFetchIssues.ts
│   │   │   ├── useFetchRepositories.ts
│   │   │   ├── useFetchRepositoryDetails.ts
│   │   │   └── useSearchRepository.ts
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

### State Management
- **Local State**: React hooks for component-level state
- **Context API**: Theme management across the application
- **Memoization**: Optimized re-renders with useMemo and useCallback

### API Integration
- **GitHub REST API**: Direct integration for issue and repository data
- **Error Handling**: Comprehensive error states and user feedback
- **Rate Limiting**: Graceful handling of API rate limits
- **Abort Controllers**: Request cancellation for better UX

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large tap targets and swipe gestures
- **Adaptive Layout**: Grid and flexbox layouts

## 🌟 Use Cases

- **Beginner Developers**: Find "good first issue" tags to start contributing
- **Open Source Contributors**: Discover projects in your tech stack
- **Project Maintainers**: Find repositories that need help
- **Learning**: Explore codebases and coding patterns

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
- **Components**: 7+ reusable components
- **Hooks**: 4 custom React hooks
- **API Endpoints**: GitHub REST API
- **Build Size**: Optimized for production

---

**Made with ❤️ by Sumit Jha**

