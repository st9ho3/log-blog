import { useContext, useRef } from 'react'; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; 
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'; 
import { storage, db } from '../db/Firebase'; 
import { fileUploadContext } from '../context/FileUploadContext';

/**
 * Custom hook for handling file uploads to Firebase Storage
 * 
 * @param {Object} options - Configuration options for the upload process
 * @param {string} options.storagePath - Firebase Storage path where files will be uploaded
 * @param {boolean} [options.updateUserData] - Whether to update user data in Firestore
 * @param {string} [options.Field] - Firestore field to update with the file URL
 * @param {Function} [options.onUploadSuccess] - Callback function triggered on successful upload
 * @param {number} [options.maxFileSize] - Maximum allowed file size in bytes
 * @param {string[]} [options.allowedFileTypes] - Array of allowed MIME types for files
 * 
 * @returns {Object} - Returns an object containing the upload function
 * @property {Function} uploadFile - Function to initiate file upload
 * 
 * @example
 * const { uploadFile } = useFileUpload({
 *   storagePath: 'user-uploads',
 *   onUploadSuccess: (url) => console.log('File uploaded:', url),
 *   maxFileSize: 5 * 1024 * 1024, // 5MB
 *   allowedFileTypes: ['image/png', 'image/jpeg']
 * });
 */

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