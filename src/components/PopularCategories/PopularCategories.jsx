import React, { useContext } from 'react';
import {Link} from 'react-router';
import { trendingCategories } from '../../constants/data';
import { context } from '../../context/Context';

const PopularCategories = ({action}) => {
  
  return (
    <div className="sideBar-element">
      <h3 className="trending-title">Δημοφιλή</h3>
      {trendingCategories.map((cat) => (
        <Link key={cat.id} to={`?type=${cat.category.toLocaleLowerCase()}`}>
          <div onClick={action} key={cat.category} className="trending-categories">
            <h5>{cat.category}</h5>
            <p className="articles-number">{cat.posts} άρθρα</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PopularCategories;