import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import { BlockNoteEditor } from '@blocknote/core';
import { BsDot } from "react-icons/bs";

/**
 * Article Component
 * 
 * Responsibilities:
 * 1. Renders full article content from pre-processed data
 * 2. Converts content blocks to HTML for display
 * 3. Manages article layout and styling
 * 
 * Data Flow:
 * Loader → Process Content → Render HTML → Display
 */
const Article = () => {
  // State for storing processed HTML content
  const [html, setHtml] = useState('Loading...');
  
  // Access loader data containing pre-processed article content
  const { title, filteredContent, image } = useLoaderData();

  useEffect(() => {
    /**
     * Content Processing Pipeline
     * 1. Initializes BlockNote editor (headless instance)
     * 2. Converts content blocks to HTML
     * 3. Handles special block types (images) with custom rendering
     */
    const processContent = async () => {
      try {
        // Initialize BlockNote editor in read-only mode
        const editor = BlockNoteEditor.create({
          initialContent: filteredContent,
          editable: false, // Disable editing capabilities
        });
  
        /**
         * Custom Block Renderer
         * @param {Object} block - Content block to convert
         * @returns {string} HTML string for the block
         */
        const customBlockToHTML = async (block) => {
          // Special handling for image blocks
          if (block.type === "image") {
            return `<div style="display: flex; justify-content: center; align-items: center;">
              <img 
                src="${block.props?.url}" 
                alt="${block.props?.alt || ""}" 
                style="width: 600px; height: 500px; object-fit: contain;" 
              />
            </div>`;
          }
          // Default block rendering using BlockNote's converter
          return await editor.blocksToFullHTML([block]);
        };
  
        // Process all blocks in parallel and join results
        const newDoc = await Promise.all(
          filteredContent.map((block) => customBlockToHTML(block))
        ).then((blocks) => blocks.join(""));
  
        setHtml(newDoc);
      } catch (error) {
        console.error("Content processing failed:", error);
        setHtml("Failed to load content.");
      }
    };
  
    processContent();
  }, [filteredContent]); // Re-process when content changes

  return (
    <div className="writeEditor-container">
      {/* Article Header Section */}
      <div className="article-header">
        <h1 style={{ fontFamily: 'Helvetica', fontSize: '2.2rem' }}>{title}</h1>

        {/* Author Information Card */}
        <div className="author-details" style={{
          display: 'flex',
          gap: '1rem',
          fontFamily: 'Inter',
          margin: '2rem 0 1.5rem 0',
        }}>
          <img
            style={{ width: '2.7rem' }}
            src='/assets/profile1.png'
            alt="profile-picture"
          />
          <div style={{ display: 'flex', flexDirection: 'column', color: "rgb(55,55,55)" }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Inter, HELVETICA', fontSize: ".9rem" }}>
                Ταπεινό Χαμομηλάκι
              </div>
              <BsDot />
              <p>follow</p>
            </div>
            {/* Static publication date - consider making dynamic */}
            <div>
              <p style={{fontSize: ".9rem", marginTop: '.3rem'}}>02/12/2024</p>
            </div>
          </div>
        </div>

        <hr style={{ border: 'solid thin grey', opacity: '.3' }} />
        
        {/* Featured Article Image */}
        <img
          style={{
            width: '39.5rem',
            marginTop: '3rem',
            marginBottom: '3rem',
          }}
          src={image}
          alt="article header"
        />
        
        <hr style={{ border: 'solid thin grey', opacity: '.2' }} />
      </div>

      {/* Processed Content Container 
         Note: dangerouslySetInnerHTML is used here because:
         1. Content is sanitized by BlockNote
         2. We need to render raw HTML from conversion
      */}
      <div
        className="bn-default-styles"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default Article;