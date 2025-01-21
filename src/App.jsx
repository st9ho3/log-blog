import { Header, Home, Profile, Article, Write, SideBar } from './constants/components';
import { createBrowserRouter, RouterProvider } from 'react-router';
import './App.css';
import { useContext } from 'react';
import { context } from './context/Context';
import { createRoutesFromElements, Route } from 'react-router';

function App() {
  const { state } = useContext(context);

  const router = createBrowserRouter(
      createRoutesFromElements(
          <>
              <Route path="/" element={<Header />}>
                <Route index element={<Home />} />
                <Route path="write-article" element={<Write />} />
                <Route path=":name" element={<Profile />} />
                <Route path=":name/:articleID" element={<Article />} />
              </Route>
         </>
      )
  );

  return <RouterProvider router={router} />;
}

export default App;