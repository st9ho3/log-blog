import React, { createContext, useEffect, useReducer } from 'react'
import { reducer } from './Reducer'

export const INITIAL_STATE = {
    isMenuOpen: false,
    windowWidth: window.innerWidth,
    isScrolling: false,
    article: {}
}
export const context = createContext()

/**
 * Context provider for managing global application state
 * 
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to be wrapped by the provider
 * @returns {JSX.Element} - Returns a context provider wrapping the application
 * 
 * @example
 * <ContextProvider>
 *   <App />
 * </ContextProvider>
 */

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
