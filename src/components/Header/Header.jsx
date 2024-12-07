import React, { useContext, useEffect } from 'react';
import { SearchBar, Button } from '../../constants/components';
import { Link, NavLink, useLocation, useSearchParams } from 'react-router';
import { LuMenu } from "react-icons/lu";
import { context } from '../../context/Context'

const Header = () => {
  const {state, dispatch} = useContext(context)
  const loc = useLocation()
  const param = loc.pathname
  
  useEffect(() => {
    const header = document.querySelector('.header');

    const handleScroll = () => {
      if (window.scrollY > 0) {
        header.classList.add('fixed'); // Add the "fixed" class
      } else {
        header.classList.remove('fixed'); // Remove the "fixed" class
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="header">
      <NavLink className="navlink" to="/">
        <h1 onClick={()=>dispatch({type:'CLEAN'})} style={{color:'grey', fontFamily: 'Noto Serif Display'}}>Λ<span style={{color:'black'}}>og</span></h1>
      </NavLink>

      {<SearchBar />}
     
      {param === "/write-article" ? <Button text="Publish it" /> : <Button text="Write an article" />}
      
      
      { <LuMenu className='menu' onClick={() => dispatch({type: 'TOGGLE_SIDEBAR', payload: !state.isMenuOpen})}/>}
        
      
    </div>
  );
};

export default Header;