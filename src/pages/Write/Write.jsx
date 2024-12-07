import React, { useEffect, useState, useMemo, useContext } from 'react';
import { BlockNoteEditor } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import useFileUpload from '../../hooks/UseFileUpload';
import { context } from '../../context/Context';
import './Write.css';

export const loadFromStorage = () => {
  const storageString = localStorage.getItem('editorContent');
  return storageString ? JSON.parse(storageString) : undefined;
};

const Write = () => {
  const {state, dispatch} = useContext(context)
  const [initialContent, setInitialContent] = useState('loading');
  const { uploadFile } = useFileUpload({
    storagePath: 'images',
    maxFileSize: 2 * 1024 * 1024,
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
  });


  const saveToStorage = (jsonBlocks) => {
    localStorage.setItem('editorContent', JSON.stringify(jsonBlocks));
  };

  useEffect(() => {
    const content = loadFromStorage()
      setInitialContent(content);
  }, []);

  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    return BlockNoteEditor.create({ initialContent: initialContent, uploadFile });
  }, [initialContent]);
 
  if (editor === undefined) {
    return "Loading content...";
  }
console.log(state.isScrolling)

  return (
    <div className="writeEditor-container">
      <BlockNoteView
      data-changing-font-demo
      onScroll={() =>dispatch({type:'SET_SCROLL'})}
        editor={editor}
        onChange={() => saveToStorage(editor.document)}
        theme="light"
      />
    </div>
  );
};

export default Write;

