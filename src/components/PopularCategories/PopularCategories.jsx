import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Ensure correct router import
import { trending } from "../../constants/utils";

/**
 * Sidebar component for displaying popular categories
 * 
 * @component
 * @param {Function} [props.action] - Click handler function for category links
 * @returns {JSX.Element} - A styled sidebar with trending categories
 */
const PopularCategories = ({ action }) => {
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingCategories = async () => {
      try {
        const categories = await trending();
        setTrendingCategories(categories);
      } catch (err) {
        setError("Failed to load trending categories");
        console.error(err);
      }
    };

    fetchTrendingCategories();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!trendingCategories.length) {
    return <div className="loading-message">Loading categories...</div>;
  }

  return (
    <aside className="sideBar-element" aria-label="Popular Categories">
      <h3 className="trending-title">Δημοφιλή</h3>
      <nav aria-label="Trending categories navigation">
        { trendingCategories.length > 0 ?
          <ul>
          {trendingCategories.map((tag) => (
            <li key={tag[0]}>
              <Link
                to={`?type=${tag[0]?.toLocaleLowerCase()}`}
                onClick={action}
                aria-label={`View articles in ${tag[0]}`}
              >
                <div className="trending-categories">
                  <h5>{tag[0]}</h5>
                  <p className="articles-number">{tag[1]} άρθρα</p>
                </div>
              </Link>
            </li>
          ))}
        </ul> : <div className="loading-message">Loading categories...</div>
        }
        
      </nav>
    </aside>
  );
};

export default PopularCategories;