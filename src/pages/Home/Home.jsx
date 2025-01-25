import React, { useContext, useMemo, Suspense } from 'react';
import { Link, useLoaderData, useSearchParams } from 'react-router';
import { HomeHeader, SideBar } from '../../constants/components';
import { context } from '../../context/Context';
import { getArticles, getTitles, getSubTitles, getImage, getUser } from '../../constants/utils';

/**
 * React Router loader function for the Home page
 * 
 * Responsibilities:
 * 1. Fetches articles data from the API/backend
 * 2. Returns the raw articles data for the component
 */
export const loader = () => {
  return getArticles(); // Fetch all articles from the API
};

/**
 * Home Component
 * 
 * Responsibilities:
 * 1. Displays a list of articles
 * 2. Filters articles based on URL query parameters
 * 3. Manages layout (articles list + sidebar)
 * 
 * Data Flow:
 * Loader → Filter Articles → Render Articles → Display Layout
 */
const Home = () => {
  // Access global state from context (e.g., sidebar visibility)
  const { state } = useContext(context);
  console.log(state.userLogedIn)
  // Access URL search parameters for filtering
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('type'); // Example: /home?type=tech

  // Access pre-fetched articles data from the loader
  const articles = useLoaderData();

  /**
   * Filtered Articles List
   * - Filters articles based on the URL query parameter
   * - Memoized to avoid unnecessary recalculations
   */
  const articlesToDisplay = useMemo(() => {
    if (!filter) return articles; // No filter applied, return all articles
    return articles.filter((article) => article.tags.includes(filter)); // Filter by tag
  }, [articles, filter]);

  /**
   * Sidebar Visibility Logic
   * - Shows sidebar on wider screens by default
   * - Toggles sidebar on smaller screens based on state
   */
  const shouldShowSidebar = window.innerWidth < 1025 ? state.isMenuOpen : true;

  return (
    <div className="homepage">
      <Suspense fallback={ <h2>Loading...</h2> }>
      {/* Main Content Area */}
      {!state.isMenuOpen && (
        <div className="home">
          {/* Conditional Rendering for Articles */}
          {articlesToDisplay.length > 0 ? (
            articlesToDisplay.map((article) => (
              <HomeHeader
                key={article.id} // Unique key for React rendering
                id={article.id} // Article ID for navigation
                title={getTitles(article)} // Processed title
                subtitle={getSubTitles(article)} // Processed subtitle
                name={article?.author || 'Unknown'} // Author name with fallback
                image={getImage(article)} // Processed image URL
                claps={article?.likes || 0} // Likes count with fallback
                comments={article?.comments?.length || 0} // Comments count with fallback
                saves={article?.saves || 0} // Saves count with fallback
                tag={article.tags || []} // Tags array with fallback
              />
            ))
          ) : (
            // Fallback UI when no articles match the filter
            <h1>No articles found</h1>
          )}
        </div>
      )}
    </Suspense>
      {/* Sidebar Area */}
      {shouldShowSidebar && (
        <div className="sidebar">
          <SideBar />
        </div>
      )}
    </div>
  );
};

export default Home;