import { 
  createBrowserRouter, 
  RouterProvider, 
  createRoutesFromElements, 
  Route, 
  redirect,
  Navigate
} from 'react-router'; // React Router imports for routing
import { Header, Home, Write, Profile, Article, LoginPage, SignupPage } from './Constants/Components.js'; // Import components
import { loader as homeLoader } from './pages/Home/Home.jsx'; // Home page loader function
import { articleLoader } from './constants/articleLoader.js'; // Article page loader function
import { loginLoader, actionLogin } from './pages/Auth/LoginPage.jsx';
import './App.css'; // Global styles
import { requireAuth } from './constants/utils.js';
import { useContext, useState } from 'react';
import { context } from './context/Context.jsx';


/**
 * App Component
 * 
 * Responsibilities:
 * 1. Defines the application's routing structure
 * 2. Provides the RouterProvider to enable routing
 * 3. Sets up loaders for data fetching on specific routes
 * 
 * Data Flow:
 * URL → Router → Loader → Component
 */
function App() {
  
  // Create the router configuration
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
         // Root route with Header as the layout component
      <Route path="/" element={<Header />}>
        {/* Home route (index route) */}
        <Route 
          index 
          element={<Home />} 
          loader={homeLoader} // Pre-fetch data for the Home page
        />
        
        {/* Write Article route */}
        <Route 
          path="write-article" 
          element={ <Write /> } // Render the Write component
          loader={ async ({request}) => await requireAuth({request}) }
        />
        
        {/* Profile route */}
        <Route 
          path=":name" 
          element={<Profile />} // Render the Profile component
          loader={ async ({request}) => await requireAuth({request}) }
        />
        
        {/* Article route */}
        <Route 
          path=":name/:articleID" 
          element={<Article />} // Render the Article component
          loader={articleLoader} // Pre-fetch data for the Article page
        />
         <Route path="/login" 
        element={<LoginPage />}
        loader= {loginLoader}
        action={actionLogin}
         />
        <Route path="/signup"
         element={<SignupPage />}
         loader= {loginLoader} />

      </Route>
      </>
    )
  );

  // Render the RouterProvider with the configured router
  return (
    <>
      <RouterProvider router={router} /> 
      
    </>
  );
}

export default App;