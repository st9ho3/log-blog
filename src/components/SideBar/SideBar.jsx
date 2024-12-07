import React, { useContext } from 'react'
import {TopWriters, PopularCategories, Button} from '../../constants/components'
import { context } from '../../context/Context'


const SideBar = () => {
  const {state, dispatch} = useContext(context)
  const cleanUp = () => {
    dispatch({type: 'CLEAN'})
  }
  return (
    <div>
      <PopularCategories
        action={cleanUp} />
      <TopWriters
        action={cleanUp} />
    </div>
  )
}

export default SideBar
