import React from 'react';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { FiShare } from 'react-icons/fi';
import { Link } from 'react-router'; // Import react-router-dom

/**
 * Reusable button component with icon and optional routing
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.text - Button text
 * @param {Function} [props.action] - Click handler function
 * @param {string} [props.param] - Route parameter for navigation
 * @param {string} [props.icon] - Icon type ('write' or 'share')
 * @returns {JSX.Element} - Returns a styled button with optional icon and routing
 * 
 * @example
 * <Button 
 *   text="Write Article" 
 *   icon="write" 
 *   action={() => console.log('Clicked!')} 
 *   param="/write-article" 
 * />
 */

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