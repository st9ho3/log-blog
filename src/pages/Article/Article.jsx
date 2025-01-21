import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { loadFromStorage } from '../../constants/utils';
import { BlockNoteEditor } from '@blocknote/core';
import { users } from '../../constants/data';
import { Button } from '../../constants/components';
import { BsDot } from "react-icons/bs";
import { getArticle } from '../../constants/utils';
import { context } from '../../context/Context';


const Article = () => {
  const [html, setHtml] = useState('Loading...');
  const [title, setDoc] = useState();
  const {state} = useContext(context);
  /* const locale = locales['en']; */
  const location = useLocation(); // Use useLocation directly
  const param = location.pathname;
  const articleID = param.trim().split("/")[2]
  
  
  const showDoc = async (id) => {
    try {
      const content = await getArticle(id);
      const data = content?.content;
  
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid document structure.");
      }
  
      let firstHeading1Found = false;
      let firstImageFound = false;
  
      // Step 1: Filter the document
      const filteredDocument = data.filter((block) => {
        if (block.type === "heading" && block.props.level === 1) {
          if (!firstHeading1Found) {
            firstHeading1Found = true;
            return false; // Exclude the first heading
          }
        }
  
        if (block.type === "image") {
          if (!firstImageFound) {
            firstImageFound = true;
            return false; // Exclude the first image
          }
        }
  
        return true; // Include all other blocks
      });
  
      // Step 2: Extract and set the first heading for the title
      const selectedDoc = data.filter(
        (d) => d.type === "heading" && d.props.level === 1
      );
      setDoc(selectedDoc?.[0]?.content?.[0]?.text || "Untitled");
  
      // Step 3: Process blocks into HTML
      const editor = BlockNoteEditor.create();
      const customBlockToHTML = async (block) => {
        if (block.type === "image") {
          const imageUrl = block.props?.url || "";
          return `<div style="display: flex; justify-content: center; align-items: center;">
            <img 
              src="${imageUrl}" 
              alt="${block.props?.alt || ""}" 
              style="width: 600px; height: 500px; object-fit: contain;" 
            />
          </div>`;
        }
        return await editor.blocksToFullHTML([block]);
      };
  
      // Convert the filtered document into HTML
      const newDoc = await Promise.all(
        filteredDocument.map((block) => customBlockToHTML(block))
      ).then((blocks) => blocks.join(""));
      setHtml(newDoc);
    } catch (error) {
      console.error("Error rendering document:", error);
      setHtml("Failed to load content.");
    }
  };

  useEffect(() => {
    if (state.article) {
      showDoc(articleID);
    }
  }, [articleID]);
  console.log(state.article.id);
  return (
    <div className="writeEditor-container">
      <div className="article-header">
        <h1 style={{ fontFamily: 'Helvetica', fontSize: '2.2rem' }}>{title}</h1>
        
        <div
          className="author-details"
          style={{
            display: 'flex',
            gap: '1rem',
            fontFamily: 'Inter',
            margin: '2rem 0 1.5rem 0',
          }}
        >
          <img
            style={{ width: '2.7rem' }}
            src='/assets/profile1.png'
            alt="profile-picture"
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: "rgb(55,55,55)",
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Inter, HELVETICA', fontSize:".9rem" }}>Ταπεινό Χαμομηλάκι</div>
              <BsDot />
              <p>follow</p>
            </div>
            <div>
              <p style={{fontSize: ".9rem", marginTop: '.3rem'}}>02/12/2024</p>
            </div>
          </div>
        </div>
        <hr style={{ border: 'solid thin grey', opacity: '.3' }} />
        <img
          style={{
            width: '39.5rem',
            marginTop: '3rem',
            marginBottom: '3rem',
          }}
          src={state.article?.image}
          alt="image"
        />
        <hr style={{ border: 'solid thin grey', opacity: '.2' }} />
      </div>
      <div
        className="bn-default-styles"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default Article;