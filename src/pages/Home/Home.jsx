import React, { useContext } from 'react'
import { Link, useSearchParams } from 'react-router'
import { HomeHeader, SideBar,Header } from '../../constants/components'
import {users} from '../../constants/data'
import { context } from '../../context/Context'

const Home = () => {
  const {state} =useContext(context)
  const [searchParams] = useSearchParams()
  const filter = (searchParams.get('type'))
  const usersToDisplay =
  filter ? users.filter((user) => user.articles[0].tag.toLocaleLowerCase() === filter )
  : users

  return (
    <div className='homepage'>
      {!state.isMenuOpen && <div className='home'>
        {usersToDisplay.map((user) => <HomeHeader
        key={user.id}
        title={user.articles[0].title}
        subtitle={user.articles[0].subtitle}
        name={user.name}
        claps={user.articles[0].social.claps}
        comments={user.articles[0].social.comments}
        saves={user.articles[0].social.saves}
        profile={user.profilePic}
        tag={user.articles[0].tag}
        image={user.articles[0].img} />)} 
    </div>}
    {window.innerWidth < 1025 ? state.isMenuOpen
     && <div className='sidebar'>
    <SideBar />
    </div> 
    : <div className='sidebar'>
    <SideBar />
    </div>}
    
    
    </div>
    
  )
}

export default Home
