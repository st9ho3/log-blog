import React from 'react'
import { HiMagnifyingGlass } from "react-icons/hi2"; 

const SearchBar = () => {
  return (
    <div className='searchbar'>
      <input placeholder='Search' className='search-input' type="text" />
      <div className='circle-button'>
      <HiMagnifyingGlass  className='search-icon' />
      </div>
      

    </div>
  )
}

export default SearchBar
