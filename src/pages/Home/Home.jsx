import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { HomeHeader, SideBar } from '../../constants/components';
import { context } from '../../context/Context';
import { getArticles, getTitles, getSubTitles, getImage } from '../../constants/utils';

const Home = () => {
  const { state } = useContext(context);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('type');
  const [articles, setArticles] = useState([]);

  const articlesToDisplay = useMemo(() => {
    if (!filter) return articles;
    return articles.filter((article) =>
      article.tags.include(filter)
    );
  }, [articles, filter]);

  useEffect(() => {
    const getArticlesAsync = async () => {
      const articles = await getArticles();
      setArticles(articles);
    }
    getArticlesAsync();
  }, []);

  const shouldShowSidebar = window.innerWidth < 1025 ? state.isMenuOpen : true;
  console.log(state.article)
  return (
    <div className="homepage">
      {!state.isMenuOpen && (
        <div className="home">
          {articlesToDisplay.length > 0 ? (
            articlesToDisplay.map((article) =>  (
              <HomeHeader
                key={article.id}
                id={article.id}
                title={getTitles(article)}
                subtitle={getSubTitles(article)}
                name={article?.author || 'Unknown'}
                image={getImage(article)}
                claps={article?.likes || 0}
                comments={article?.comments?.length || 0}
                saves={article?.saves || 0}
                tag={article.tags || []}
              />
            ))
          ) : (
            <h1>No articles found</h1>
          )}
        </div>
      )}
      {shouldShowSidebar && (
        <div className="sidebar">
          <SideBar />
        </div>
      )}
    </div>
  );
};

export default Home;