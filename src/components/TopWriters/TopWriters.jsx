import React from 'react';
import { Link } from 'react-router'; // Ensure this is correct for your setup
import { BsFeather } from 'react-icons/bs';
import { users } from '../../constants/data';

const TopWriters = ({ action }) => {
  const usersToDisplay = users.slice(0, 7);

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
                    src={user.profilePic}
                    alt={`Profile picture of ${user.name}`}
                  />
                  <div className="trending-categories writers">
                    <h5>{user.name}</h5>
                    <p className="articles-number">{user.articles.length} άρθρα</p>
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