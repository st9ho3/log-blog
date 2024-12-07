import React, { createContext, useEffect, useReducer } from 'react'
import { reducer } from './Reducer'

export const INITIAL_STATE = {
    isMenuOpen: false,
    windowWidth: window.innerWidth,
    isScrolling: false
}
export const context = createContext()

const ContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
    useEffect(() => {
      // Update the window width on resize
      const handleResize = () => dispatch({type: 'SET_WINDOW_WIDTH', payload: window.innerWidth});
    
      window.addEventListener('resize', handleResize);
    
      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    },[])

  return (
    <context.Provider value={{state, dispatch}}>
        {children}
    </context.Provider>
      
    
  )
}

export default ContextProvider
