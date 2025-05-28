# React Blog Project

This is the **initial** React application built with Vite, designed for creating and managing blog posts. It features a rich text editor using BlockNote, Firebase for backend services (authentication, database, storage), and React Router for navigation. This project was subsequently refactored and transformed into a Next.js project.

## Features

  * **Framework**: Built with React and bootstrapped with Vite for a fast development experience.
  * **Authentication**: User authentication (Sign Up, Sign In, Sign Out) is handled using Firebase Authentication.
  * **Content Creation**: A rich text editor using [Blocknote](https://www.google.com/search?q=https://www.blocknote.dev/) is provided for writing articles.
      * Supports various block types including headings, paragraphs, lists (bulleted, numbered, checklist), code blocks, tables, and images.
      * Image uploads are handled via a custom hook (`useFileUpload`) that integrates with Firebase Storage.
  * **Content Rendering**: A custom HTML renderer is used to display Blocknote content, ensuring proper styling and structure for articles.
  * **Database**: Firestore is used as the database for storing articles and author information.
  * **Routing**: Implemented with React Router for seamless navigation between pages like Home, Write Article, Profile, and individual Article views.
  * **State Management**: Utilizes React Context API for global state management, including user authentication, UI state (like modals and sidebars), and article data.
  * **Styling**: Uses CSS with a combination of global styles and component-specific stylesheets.

## Current Status and Future Enhancements

This project is currently unfinished. Key areas requiring further development include:

  * **Profile Page**: The user profile page (`src/pages/Profile/Profile.jsx`) needs to be fully built out to display user-specific information and articles.
  * **Social Icons Functionality**: The social icons across the application currently lack full functionality and need to be integrated with relevant actions (e.g., sharing, liking, commenting).


