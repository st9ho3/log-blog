import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/SearchBar/SearchBar.css'
import './components/Button/Button.css'
import './components/HomeHeader/HomeHeader.css'
import './components/SideBar/SideBar.css'
import './components/Tag/Tag.css'
import './components/TopWriters/TopWriters.css'
import './components/PopularCategories/PopularCategories.css'
import './pages//Home/Home.css'
import './pages//Write/Write.css'
import './pages//Article/Article.css'
import './pages/Auth/AuthPages.css'
import App from './App.jsx'
import ContextProvider from './context/Context.jsx'
import FileUploadProvider from './context/FileUploadContext.jsx'


createRoot(document.getElementById('root')).render(
  
  <FileUploadProvider>
  <ContextProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </ContextProvider>
  </FileUploadProvider>
  
)
