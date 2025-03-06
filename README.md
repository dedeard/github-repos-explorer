# GitHub Repositories Explorer

A React application that allows users to search for GitHub users and explore their repositories.

## 🌟 Features

- Search for GitHub users (up to 5 users shown)
- View detailed user information
- Explore user repositories with descriptions and star counts
- Keyboard navigation support
- Responsive design
- Loading states and error handling
- Accessible UI components

## 🛠️ Tech Stack

- **Frontend Framework**: React
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: react-icons
- **State Management**: React Context API
- **Testing**: Vitest with React Testing Library
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/github-repos-explorer.git
cd github-repos-explorer
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 📦 Building for Production

```bash
npm run build
# or
yarn build
```

## 🧪 Running Tests

```bash
npm test
# or
yarn test
```

## 🎯 Key Features Explained

### 1. User Search

- Real-time search functionality
- Keyboard shortcuts (/ or Ctrl+P) to focus search
- Shows up to 5 matching GitHub users
- Loading states during API requests
- Error handling for failed requests

### 2. Repository Explorer

- Expandable user cards
- Displays user's public repositories
- Repository information includes:
  - Repository name with link
  - Description
  - Topics (up to 5 shown)
  - Star count
- Loading states for repository fetching
- Error handling for failed repository requests

### 3. Keyboard Navigation

- Arrow Up/Down: Navigate through users
- Enter: Toggle user details
- Escape: Close expanded user panel
- Focus management for accessibility

### 4. User Interface

- Clean and modern design
- Mobile-responsive layout
- Loading indicators
- Error messages
- Keyboard shortcut hints
- External links to GitHub profiles

## 🎨 Component Structure

- **App**: Main application component
- **SearchBar**: Handles user search input and controls
- **UserList**: Displays search results and manages user selection
- **RepositoryList**: Shows repository information for selected users
- **ErrorMessage**: Displays error states
- **Header**: Application header and branding

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile devices

## ⚡ Performance Considerations

- Efficient state management using Context API
- Optimized re-renders
- Lazy loading of repository data
- Debounced search input
- Proper error boundaries

## 🔒 Error Handling

The application handles various error scenarios:

- Network errors
- API rate limiting
- User not found
- Repository fetch failures
- Invalid input validation

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
