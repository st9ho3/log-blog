import {React, useContext} from 'react';
import { Tag } from '../../constants/components';
import { FaHandsClapping, FaRegBookmark } from 'react-icons/fa6';
import { FaComment } from 'react-icons/fa';
import { Link } from 'react-router';
import { context } from '../../context/Context';

function HomeHeader({id, title, subtitle, name, claps, comments, saves, profile, tag, image}) {
  
  const {state, dispatch} = useContext(context)
  
  return (
    <div onClick={() => dispatch({type: 'SET_ARTICLE', payload: {id, title, subtitle, name,claps,comments,saves,profile,tag,image} }) } className="home-header-container">
      <div className="home-header">
        <div className="info-container">
          <img
            className="profile-info-pic"
            src={profile}
            alt="profile-pic"
          />
          <span className="by">by</span>
          {/* Profile link */}
          <Link to={`${name}`} className="profile-name">
            {name}
          </Link>
          {tag.map((cat) => <Tag key={cat} text= {cat} />)} 
        </div>

        {/* Article link */}
        <Link to={`${name}/${title}`}className="article-link">
          <h1 className="title">{title}</h1>
          <p className="subtitle">
            {subtitle}
          </p>
        

        <div className="social-icons">
          <p className="social-icon date">08 Δεκ</p>
          <div className="social-container">
            <FaHandsClapping className="social-icon" />
            <span className="social-number">{claps}</span>
          </div>
          <div className="social-container">
            <FaComment className="social-icon" />
            <span className="social-number">{comments}</span>
          </div>
          <div className="social-container">
            <FaRegBookmark className="social-icon" />
            <span className="social-number">{saves}</span>
          </div>
        </div>
        </Link>
      </div>
      

      {/* Article image link */}
      <Link to="/ταπεινό-χαμομηλάκι/άρθρο" className="image-link">
        <img
          className="article-image"
          src={image}
          alt="article image"
        />
      </Link>
    </div>
  );
}

export default HomeHeader;