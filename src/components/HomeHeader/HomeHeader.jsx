import React, { Suspense, useContext } from 'react';
import { Link } from 'react-router';
import { FaHandsClapping, FaRegBookmark } from 'react-icons/fa6';
import { FaComment } from 'react-icons/fa';

import { Tag } from '../../constants/components';
import { context } from '../../context/Context';

/**
 * Article header component for the home page
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.id - Article ID
 * @param {string} props.title - Article title
 * @param {string} props.subtitle - Article subtitle
 * @param {string} props.name - Author name
 * @param {number} props.claps - Number of claps
 * @param {number} props.comments - Number of comments
 * @param {number} props.saves - Number of saves
 * @param {string} props.profile - URL of the author's profile picture
 * @param {string[]} props.tag - Array of tags/categories
 * @param {string} props.image - URL of the article image
 * @returns {JSX.Element} - Returns a styled article header with links and metadata
 * 
 * @example
 * <HomeHeader
 *   id="123"
 *   title="Sample Article"
 *   subtitle="This is a sample article"
 *   name="John Doe"
 *   claps={42}
 *   comments={5}
 *   saves={10}
 *   profile="/profile.jpg"
 *   tag={['Tech', 'React']}
 *   image="/article.jpg"
 * />
 */


function HomeHeader({
  id,
  title,
  subtitle,
  name,
  claps,
  comments,
  saves,
  profile,
  tag,
  image,
}) {
  const { state, dispatch } = useContext(context);

  return (
    <div
      onClick={() =>
        dispatch({
          type: 'SET_ARTICLE',
          payload: {
            id,
            title,
            subtitle,
            name,
            claps,
            comments,
            saves,
            profile,
            tag,
            image,
          },
        })
      }
      className="home-header-container"
    >
      <div className="home-header">
        <div className="info-container">
          <img className="profile-info-pic" src={profile} alt="profile-pic" /> 
          <span className="by">by</span>
          {/* Profile link */}
          <Link to={`${name}`} className="profile-name">
            {name}
          </Link>
          {tag.slice(0,2).map((cat) => (
            <Tag key={cat} text={cat} />
          ))}
        </div>

        {/* Article link */}
        <Link to={`${name}/${id}`} className="article-link">
          <h1 className="title">{title}</h1>
          <p className="subtitle">{subtitle}</p>

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
      <Link to={`${name}/${id}`} className="image-link">
        <img className="article-image" src={image} alt="article image" />
      </Link>
      {/* Article image link */}
      

    </div>
  );
}

export default HomeHeader;