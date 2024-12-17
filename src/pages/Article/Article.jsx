import React, { useEffect, useState } from 'react';
import { loadFromStorage } from '../Write/Write';
import { BlockNoteEditor } from '@blocknote/core';
import { users } from '../../constants/data';
import { Button } from '../../constants/components';
import { BsDot } from "react-icons/bs";


const Article = () => {
  const [html, setHtml] = useState('Loading...');
  const [title, setDoc] = useState();

  /* const locale = locales['en']; */

  const showDoc = async () => {
    try {
      const document = loadFromStorage();
      const editor = BlockNoteEditor.create();

      // Step 1: Filter out the first Heading 1 block
      let firstHeading1Found = false;
      const filteredDocument = document.filter((block) => {
        if (block.type === 'heading' && block.props.level === 1) {
          if (!firstHeading1Found) {
            firstHeading1Found = true; // Mark the first Heading 1 as found
            return false; // Exclude this block
          }
        }
        return true; // Include all other blocks
      });

      // Step 2: Extract and set the first Heading 1 content (if needed)
      const selectedDoc = document.filter(
        (d) => d.type === 'heading' && d.props.level === 1
      );
      setDoc(selectedDoc[0]?.content[0]?.text || '');

      // Step 3: Convert remaining blocks to HTML.
      const customBlockToHTML = async (block) => {
        if (block.type === 'image') {
          // Handle image block specifically
          const imageUrl = block.props.url; // Assuming the image URL is stored in block.props.url
          return `<div style="display: flex; justify-content: center; align-items: center;">
            <img 
              src="${imageUrl}" 
              alt="${block.props.alt || ''}" 
              style="width: 600px; height: 500px; object-fit: contain;" 
            />
          </div>`;
        }

        // Fallback to default conversion for other block types
        return await editor.blocksToFullHTML([block]);
      };

      // Process the filtered document
      const newDoc = await Promise.all(
        filteredDocument.map(async (block) => await customBlockToHTML(block))
      ).then((blocks) => blocks.join('')); // Join blocks without a separator

      // Update state with the rendered HTML
      setHtml(newDoc);
    } catch (error) {
      console.error('Error rendering document:', error);
      setHtml('Failed to load content.');
    }
  };

  useEffect(() => {
    showDoc();
  }, []);

  return (
    <div className="writeEditor-container">
      <div className="article-header">
        <h1 style={{ fontFamily: 'Helvetica' }}>{title}</h1>
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
            src="/assets/profile1.png"
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
          src="/assets/photos/tec1.jpeg"
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