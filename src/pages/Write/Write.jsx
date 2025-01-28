import React, { useEffect, useState, useMemo, useContext, useCallback } from 'react';
import { BlockNoteEditor } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import useFileUpload from '../../hooks/UseFileUpload';
import { context } from '../../context/Context';
import './Write.css';
import { loadFromStorage, saveToStorage } from '../../constants/utils';
import {Modal} from '../../constants/components'


/**
 * A React component that provides a rich text editor using BlockNote for creating and editing content.
 * The editor supports file uploads, saves content to local storage, and integrates with a global context.
 *
 * @component
 * @returns {JSX.Element} - The rendered editor component or a loading message.
 *
 * @example
 * <Write />
 *
 * @description
 * This component:
 * 1. Initializes a BlockNote editor with content loaded from local storage.
 * 2. Handles file uploads for images.
 * 3. Saves changes to local storage automatically.
 * 4. Integrates with a global context for state management.
 */

const Write = () => {
  const { state, dispatch } = useContext(context);
  const [initialContent, setInitialContent] = useState('loading');
  const { uploadFile } = useFileUpload({
    storagePath: 'images',
    maxFileSize: 2 * 1024 * 1024,
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
  });

  useEffect(() => {
    const content = loadFromStorage();
    setInitialContent(content);
  }, []);

  const editor = useMemo(() => {
    if (initialContent === 'loading') {
      return undefined;
    }
    return BlockNoteEditor.create({
      initialContent: initialContent,
      uploadFile,
    });
  }, [initialContent]);

   // Modified save handler
   const handleEditorChange = useCallback(() => {
    // Save full document structure including tables
    const content = editor.topLevelBlocks;
    saveToStorage(content);
    
    // Optional: Also save HTML version if needed
    const htmlContent = editor.blocksToHTMLLossy(content);
    localStorage.setItem('editor-html', htmlContent);
  }, [editor]);

  if (editor === undefined) {
    return 'Loading content...';
  }

  return (
    <div className="writeEditor-container">
      
      <BlockNoteView
        onScroll={() => dispatch({ type: 'SET_SCROLL' })}
        data-changing-font-demo
        editor={editor}
        onChange={handleEditorChange}
        theme="light"
      />
    </div>
  );
};

export default Write;