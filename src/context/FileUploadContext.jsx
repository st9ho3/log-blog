import React, { createContext, useReducer } from 'react';
import { fileReducer, INITIAL_STATE } from './FileUploadReducer';

export const fileUploadContext = createContext()

const FileUploadProvider = ({children}) => {
const [fileState, uploadDispatch] = useReducer(fileReducer, INITIAL_STATE)
    return (
        <fileUploadContext.Provider value={{fileState, uploadDispatch}}>
            {children}
        </fileUploadContext.Provider>
        
    );
};
export default FileUploadProvider
