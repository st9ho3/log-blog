import React from 'react';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { FiShare } from 'react-icons/fi';
import { Link } from 'react-router'; // Import react-router-dom

const Button = ({ text, action, param, icon }) => {
  return (
    <div className="button" onClick={param === '/write-article' ? action : undefined}> 
      <Link to={param !== '/write-article' ? '/write-article' : null}> 
        {icon === 'write' ? <FaRegPenToSquare className='write-icon' /> : <FiShare className='write-icon' />}
        <span>{text}</span>
      </Link>
         
    </div>
  );
};

export default Button;