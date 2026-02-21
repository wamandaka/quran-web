# Router Documentation

## Overview

This document provides an overview of the routing system in the web-quran application. The router configuration uses React Router to manage navigation between different pages and views in the application.

## Router Configuration (`router.tsx`)

### Purpose

The router serves as the central configuration for all application routes, defining how users navigate between different views and pages.

### Key Features

#### Nested Routing

- Implements nested routing with the Layout component as the parent route
- The main Layout component wraps all application pages, ensuring consistent navigation structure
- Child routes are defined within the Layout route

#### Route Structure

- **Root Route (`/`)**: Points to the Layout component as the parent
  - **Index Route (`/`)**: Renders the Home page component
  - **Surah Detail Route (`/surah/:nomor`)**: Renders the Surah detail page with dynamic parameter for surah number

#### Implementation Details

- Uses React Router's `Routes` and `Route` components
- Implements proper component imports from their respective directories
- Uses dynamic routing with `:nomor` parameter for surah identification
- Maintains clean, readable route structure

## Integration with Application Structure

### Relationship with Layout

- The Layout component serves as the main wrapper for all pages
- This ensures consistent navigation (navbar and sidebar) across all views
- The layout system is applied to all routes except the 404 page (which would be handled separately)

### Relationship with Pages

- Routes directly map to page components in the `src/pages` directory
- Home page is displayed at the root path
- Surah detail page is accessed via dynamic route `/surah/:nomor`

## Key Components Used

### React Router Components

- `Routes`: Container for all route definitions
- `Route`: Defines individual routes with path and element properties
- `Outlet`: Used within Layout to render child routes (implicitly handled by React Router)

### Dynamic Parameters

- `:nomor` parameter in `/surah/:nomor` allows for dynamic surah identification
- Enables navigation to specific surah details based on surah number

## File Structure

```
src/
└── router/
    └── router.tsx     # Main router configuration
```

## Usage

The router is the entry point for application navigation. It's imported and used in the main application component (likely in `src/App.tsx`) to define the complete routing structure of the application.

## Future Improvements

1. Add a dedicated 404 route for handling undefined paths
2. Implement route protection for authenticated sections
3. Add route meta-data for SEO and navigation purposes
4. Consider implementing lazy loading for better performance
5. Add route validation and error handling
6. Implement proper breadcrumb navigation
7. Add route-based code splitting for better bundle management
