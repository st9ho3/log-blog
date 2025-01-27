import React, { useContext, useEffect } from 'react';
import {SearchBar, Button, Modal} from '../../constants/components';
import { PublishArticle } from '../../constants/utils';
import { NavLink, useLocation, Outlet, Link } from 'react-router'; // Import Outlet
import { LuMenu } from 'react-icons/lu';
import { PiSignIn } from "react-icons/pi";
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
  const author = state.userLogedIn ? state.userLogedIn : null
  
  useEffect(() => {
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
      header.classList.toggle('fixed', window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const chooseTags = () => {
    setTimeout(() =>  dispatch({type:'SHOW_MODAL', payload: 'tags'}), 100 )
  }
  const publishNclean =  (tags, author ) => {
    console.log(author)
     PublishArticle(tags, author)
    dispatch({type: 'CLEAN_TAGS'})
  } 
console.log(state.modal)
  return (
    <div>
      <div className="header">
        <NavLink className="navlink" to="/" onClick={() => dispatch({type: 'CLEAN'})} >
          <h1 style={{ color: 'grey', fontFamily: 'Noto Serif Display' }}>
            Λ<span style={{ color: 'black' }}>og</span>
          </h1>
        </NavLink>

        {/* These components are likely intended to be outside the header <div> */}
        <SearchBar />
        
        {param !== '/write-article' ? (
          <Button param={param} icon="write" action={chooseTags} text="Write an article" />
        ) : (
          <Button param={param} action={() => publishNclean(state.chosenTags, author)} text="Publish it" />
        )}
  
        <LuMenu
          className="menu"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR', payload: !state.isMenuOpen })}
        />
        {state.userLogedIn ?
         <img
         onClick={() =>  dispatch({type:'SHOW_MODAL', payload: 'profile'})} 
         className="profile-info-pic top" 
         src={ state.userLogedIn.profilePicture } 
         alt="profile-pic"
          /> : <Link to='/login'>login</Link>}
      </div>
      {state.modal.open && <Modal type={state.modal.type} />}

      {/* Outlet is crucial for rendering nested routes! */}
      <Outlet />
    </div>
  );
};

export default Header;