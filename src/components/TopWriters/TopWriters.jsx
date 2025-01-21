import React from 'react';
import { Link } from 'react-router';
import { BsFeather } from 'react-icons/bs';

import { users } from '../../constants/data';

const TopWriters = ({ action }) => {
  const usersToDisplay = users.slice(0, 7);

  return (
    <div className="sideBar-element">
      <h3 className="trending-title">
        Top writers <BsFeather style={{ fontSize: '1rem' }} />
      </h3>
      {usersToDisplay.map((user) => (
        <Link key={user.id} to={`/${user.name}`}>
          <div className="trending-writers">
            <img
              className="profile-info-pic"
              src={user.profilePic}
              alt="trending-profile-picture"
            />
            <div onClick={action} key={user.id} className="trending-categories writers">
              <h5>{user.name}</h5>
              <p className="articles-number">{user.articles.length} άρθρα</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TopWriters;