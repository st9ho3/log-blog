import React from 'react';
import { Link } from 'react-router'; // Assuming this is correct for your setup
import { trendingCategories } from '../../constants/data';
import { context } from '../../context/Context';

/**
 * Sidebar component for displaying popular categories
 * 
 * @component
 * @param {Function} [props.action] - Click handler function for category links
 * @returns {JSX.Element} - Returns a styled sidebar with trending categories
 * 
 * @example
 * <PopularCategories action={() => console.log('Category clicked!')} />
 */

const PopularCategories = ({ action }) => {
  return (
    <aside className="sideBar-element" aria-label="Popular Categories">
      <h3 className="trending-title">Δημοφιλή</h3>
      <nav aria-label="Trending categories navigation">
        <ul>
          {trendingCategories.map((cat) => (
            <li key={cat.id}>
              <Link 
                to={`?type=${cat.category.toLocaleLowerCase()}`} 
                onClick={action} 
                aria-label={`View articles in ${cat.category}`}
              >
                <div className="trending-categories">
                  <h5>{cat.category}</h5>
                  <p className="articles-number">{cat.posts} άρθρα</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default PopularCategories;