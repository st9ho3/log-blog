import React, { useContext, useMemo, Suspense } from 'react';
import { Link, useLoaderData, useSearchParams } from 'react-router';
import { HomeHeader, SideBar } from '../../constants/components';
import { context } from '../../context/Context';
import { getArticles, getTitles, getSubTitles, getImage, getAuthors } from '../../constants/utils';
import { getAuth } from 'firebase/auth';

/**
 * React Router loader function for the Home page
 * 
 * Responsibilities:
 * 1. Fetches articles data from the API/backend
 * 2. Returns the raw articles data for the component
 */
export const loader = async () => {
  const articles = await getArticles();
  const authors = await getAuthors()
  return { articles, authors }; // Return both datasets // Fetch all articles from the API
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
  const { state, dispatch } = useContext(context);
  // Access URL search parameters for filtering
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('type'); // Example: /home?type=tech

  // Access pre-fetched articles data from the loader
  const {articles, authors} = useLoaderData();

  const processedArticles = useMemo(() => {
    // Handle initial empty state
    if (!articles?.length || !authors?.length) return [];
    
    return articles.map(article => {
      const authorProfile = authors.find(author => 
        author.name?.toLowerCase() === article.author?.toLowerCase()
      ) || { 
        name: 'Unknown Author',
        avatar: '/default-avatar.png' 
      };
  
      return {
        ...article,
        title: getTitles(article),
        subtitle: getSubTitles(article),
        image: getImage(article),
        profile: authorProfile.profilePicture
      };
    });
  }, [articles, authors]);

  /* getAuthDetails(articles[0], authors) */
  /**
   * Filtered Articles List
   * - Filters articles based on the URL query parameter
   * - Memoized to avoid unnecessary recalculations
   */
  const articlesToDisplay = useMemo(() => {
    if (!filter) return processedArticles; // No filter applied, return all articles
    return processedArticles.filter((article) => article.tags.includes(filter)); // Filter by tag
  }, [processedArticles, filter]);

  /**
   * Sidebar Visibility Logic
   * - Shows sidebar on wider screens by default
   * - Toggles sidebar on smaller screens based on state
   */
  const shouldShowSidebar = useMemo(() => 
    window.innerWidth < 1025 ? state.isMenuOpen : true,
    [window.innerWidth, state.isMenuOpen]
  );
  
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
                title={article?.title} // Processed title
                subtitle={article?.subtitle} // Processed subtitle
                name={article?.author || 'Unknown'} // Author name with fallback
                image={article?.image} // Processed image URL
                claps={article?.likes || 0} // Likes count with fallback
                comments={article?.comments?.length || 0} // Comments count with fallback
                saves={article?.saves || 0} // Saves count with fallback
                tag={article.tags || []} // Tags array with fallback
                profile={article?.profile}
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