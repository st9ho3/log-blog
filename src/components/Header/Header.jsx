import React, { useContext, useEffect } from 'react';
import {SearchBar, Button} from '../../constants/components';
import { PublishArticle } from '../../constants/utils';
import { NavLink, useLocation, Outlet } from 'react-router'; // Import Outlet
import { LuMenu } from 'react-icons/lu';
import { context } from '../../context/Context';

/**
 * Application header component with navigation, search, and dynamic actions
 * 
 * @component
 * @returns {JSX.Element} - Returns a styled header with navigation and interactive elements
 * 
 * @example
 * <Header />
 */

const Header = () => {
  const { state, dispatch } = useContext(context);
  const location = useLocation(); // Use useLocation directly
  const param = location.pathname;

  useEffect(() => {
    const header = document.querySelector('.header');

    const handleScroll = () => {
      header.classList.toggle('fixed', window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <div className="header">
        <NavLink className="navlink" to="/" /*Removed a CLEAN dispatch*/ >
          <h1 style={{ color: 'grey', fontFamily: 'Noto Serif Display' }}>
            Λ<span style={{ color: 'black' }}>og</span>
          </h1>
        </NavLink>

        {/* These components are likely intended to be outside the header <div> */}
        <SearchBar />

        {param !== '/write-article' ? (
          <Button param={param} icon="write" text="Write an article" />
        ) : (
          <Button param={param} action={PublishArticle} text="Publish it" />
        )}

        <LuMenu
          className="menu"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR', payload: !state.isMenuOpen })}
        />
      </div>

      {/* Outlet is crucial for rendering nested routes! */}
      <Outlet />
    </div>
  );
};

export default Header;