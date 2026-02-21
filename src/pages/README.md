# Pages Documentation

## Overview

This document provides an overview of the pages structure in the web-quran application. The pages directory contains the main view components that represent different sections of the application, including the home page, surah details page, and a 404 page.

## Pages Structure

### 1. NotFoundPage (`NotFoundPage.tsx`)

- **Purpose**: Displays a 404 error page when a user navigates to a non-existent route
- **Functionality**:
  - Simple component that renders a "NotFoundPage" text
  - Serves as the fallback page for undefined routes
  - Basic implementation with no complex logic

### 2. Home Page (`home/index.tsx`)

- **Purpose**: Main landing page displaying a list of Quran surahs
- **Functionality**:
  - Fetches surah data from an external API (`https://quran-api.santrikoding.com/api/surah`)
  - Implements loading state with spinner animation
  - Displays surah information in a responsive grid layout
  - Each surah card links to the detailed view using React Router's NavLink
  - Shows surah number, latin name, and translation
  - Includes proper cleanup of async operations to prevent memory leaks

### 3. Surah Detail Page (`surah/index.tsx`)

- **Purpose**: Displays detailed information about a specific Quran surah
- **Functionality**:
  - Uses React Router's useParams to extract surah number from URL
  - Fetches detailed surah data from an external API (`https://quran-api.santrikoding.com/api/surah/{nomor}`)
  - Implements loading state with spinner animation
  - Displays surah details including name, translation, and audio player
  - Includes audio playback functionality for the surah
  - Responsive design that adapts to different screen sizes

## Key Features

### API Integration

- Both home and surah detail pages fetch data from the same external Quran API
- Proper error handling for network requests
- Loading states to improve user experience during data fetching

### Routing

- Uses React Router for navigation between pages
- Dynamic routing for surah details based on surah number
- Proper 404 handling for invalid routes

### Responsive Design

- Grid layout that adapts from 1 column on mobile to 4 columns on large screens
- Mobile-friendly components with appropriate spacing and sizing
- Consistent styling using Tailwind CSS classes

### State Management

- Uses React's useState and useEffect hooks for managing component state
- Proper cleanup of async operations to prevent memory leaks
- Loading state management for better user experience

## Implementation Details

### Component Communication

- Home page fetches data and passes it to the UI components
- Surah detail page receives surah number via route parameters
- Both pages use React Router for navigation

### Data Structure

- Surah data follows a consistent structure with properties like:
  - `nomor`: Surah number
  - `nama`: Arabic name of surah
  - `nama_latin`: Latin name of surah
  - `jumlah_ayat`: Number of verses
  - `tempat_turun`: Place of revelation
  - `arti`: Translation/meaning
  - `deskripsi`: Description
  - `audio`: Audio file URL

### File Structure

```
src/
└── pages/
    ├── NotFoundPage.tsx     # 404 error page
    ├── home/
    │   └── index.tsx        # Home page with surah list
    └── surah/
        └── index.tsx        # Surah detail page
```

## Usage

The pages are designed to be used as route components in the application's routing configuration. Each page represents a distinct view in the application and is connected to the layout system through the main Layout component.

## Implemented Improvements

1. **Enhanced Surah Information Display**
   - Added detailed surah metadata including revelation place, number of verses, and revelation order
   - Implemented comprehensive surah description and translation sections
   - Added visual elements with metadata tags for better information organization

2. **Advanced Search and Filtering**
   - Implemented comprehensive search functionality across surah names, translations, and content
   - Added filtering by revelation place with dropdown selector
   - Included sorting options for surahs (by number, name, revelation order)
   - Added quick filters for popular surahs or favorites

3. **Enhanced Audio Player**
   - Added advanced audio controls with play/pause functionality
   - Implemented progress bar with time tracking
   - Added time display for current position and total duration
   - Included responsive audio player with better user experience

4. **Improved Error Handling**
   - Created user-friendly 404 page with clear navigation options
   - Added better error handling and user feedback for API failures
   - Implemented proper loading states and visual feedback

5. **User Experience Improvements**
   - Enhanced NotFoundPage with better styling and navigation options
   - Improved responsive design for all page components
   - Added better visual hierarchy and information organization

## Future Improvements

1. **Offline Caching and Performance**
   - Implement service workers for offline access to previously loaded surah data
   - Add local storage caching for frequently accessed surahs
   - Implement data prefetching for better perceived performance
   - Add loading skeletons for improved perceived performance

2. **Quran-Related Features**
   - Implement bookmarking system for favorite surahs or verses
   - Add favorites management with tagging and categorization
   - Include reading progress tracking for surahs
   - Add note-taking functionality for personal annotations

3. **User Experience Improvements**
   - Add dark mode support for reading comfort
   - Implement customizable reading preferences (font size, line spacing)
   - Add reading statistics and progress tracking
   - Include accessibility features for visually impaired users

4. **Internationalization Support**
   - Add multi-language support for UI elements and surah information
   - Implement RTL (right-to-left) layout for Arabic text
   - Add language selector with automatic system preference detection
   - Include localization for all text content

5. **Analytics and Monitoring**
   - Add usage analytics for tracking user behavior and preferences
   - Implement performance monitoring for page load times
   - Add feature usage tracking for continuous improvement
   - Include error monitoring and alerting system
