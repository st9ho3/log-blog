import {Header, Home, Profile, Article, Write, SideBar} from './constants/components'
import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'
import { useContext } from 'react'
import { context } from './context/Context'

function App() {
const {state} = useContext(context)
  return (
    <>
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='write-article' element={<Write />}/>
        <Route path=':name' element={<Profile />} />
        <Route path=':name/:article' element={<Article />} />
      </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
