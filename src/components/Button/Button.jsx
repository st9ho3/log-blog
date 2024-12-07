import React from 'react'
import { FaRegPenToSquare } from "react-icons/fa6";
import { Link } from 'react-router';

const Button = ({text, action}) => {
  return (
    
    <div onClick={action} className='button'>
      <Link to='/write-article'>
      <FaRegPenToSquare className='write-icon' />
      {text}
      </Link>
      
    </div>
    
    
  )
}

export default Button
