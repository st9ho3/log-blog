import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Ensure correct import
import { BsFeather } from 'react-icons/bs';
import { context } from '../../context/Context';

const TopWriters = ({ action }) => {
  const { state } = useContext(context);
  const [usersToDisplay, setUsersToDisplay] = useState([]);

  useEffect(() => {

    if (state.authors?.length) {
      const sortedUsers = state.authors.sort((a, b) => b.articles.length - a.articles.length);
      const users = sortedUsers.slice(0, 7);
      console.log('Users being set:', users); // Debug log
      setUsersToDisplay(users);
    }
  }, [state.authors]);

  if (!usersToDisplay || usersToDisplay.length === 0) {
    // Render a loading message if no users are available
    return <div className="loading-message">Loading writers...</div>;
  }

  return (
    <aside className="sideBar-element" aria-label="Top Writers">
      <h3 className="trending-title">
        Top writers <BsFeather style={{ fontSize: '1rem' }} />
      </h3>
      <nav aria-label="Top writers navigation">
        <ul>
          {usersToDisplay.map((user) => (
            <li key={user.id}>
              <Link
                to={`/${user.name}`}
                onClick={action}
                aria-label={`View articles by ${user.name}`}
              >
                <div className="trending-writers">
                  <img
                    className="profile-info-pic"
                    src={user.profilePicture}
                    alt={`Profile picture of ${user.name}`}
                  />
                  <div className="trending-categories writers">
                    <h5>{user.name}</h5>
                    <p className="articles-number">
                      {user.articles?.length || 0} άρθρα
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default TopWriters;