import { useContext, useRef } from 'react'; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; 
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'; 
import { storage, db } from '../db/Firebase'; 
import { fileUploadContext } from '../context/FileUploadContext';

const useFileUpload = (options = {}) => {
    const {
      storagePath,
      updateUserData,
      Field,
      onUploadSuccess,
      maxFileSize,
      allowedFileTypes,
    } = options;
 
    const { fileState, uploadDispatch } = useContext(fileUploadContext);
 
    const fileInputRef = useRef(null);
    const selectedRef = useRef('');
 
    // Function to handle the file upload process
    const uploadFile = async (file) => {
      const storageRef = ref(storage, `${storagePath}/${new Date().getTime()}${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
 
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Update progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploadDispatch({ type: 'SET_UPLOAD_PROGRESS', payload: progress });
          },
          (error) => {
            // Handle errors
            console.error(error);
            uploadDispatch({ type: 'SET_UPLOAD_ERROR' });
            reject(error);
          },
          () => {
            // On successful upload, get download URL and resolve promise
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              // Invoke the success callback, if provided
              if (onUploadSuccess) {
                onUploadSuccess(downloadURL);
              }
              resolve(downloadURL);
            });
          }
        );
      });
    };
 
    return {
      uploadFile,
    };
 };
 export default useFileUpload