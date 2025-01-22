import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router';
import { Header, Home, Profile, Article, Write } from './constants/components';
import { loader as homeLoader } from './pages/Home/Home.jsx';
import { articleLoader } from './constants/articleLoader.js';
import './App.css';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Header />}>
        <Route index element={<Home />} loader={homeLoader} />
        <Route path="write-article" element={<Write />} />
        <Route path=":name" element={<Profile />} />
        <Route 
          path=":name/:articleID" 
          element={<Article />} 
          loader={articleLoader}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;