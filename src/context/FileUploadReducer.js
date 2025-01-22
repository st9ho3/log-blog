/**
 * Initial state for file upload management
 * 
 * @constant
 * @type {Object}
 * @property {string} fileType - MIME type of the file
 * @property {string} fileName - Name of the file
 * @property {File|null} fileImg - File object for images
 * @property {string|null} fileURL - URL of the uploaded file
 * @property {number} uploadProgress - Upload progress percentage (0-100)
 * @property {string|null} uploadError - Error message if upload fails
 */

export const INITIAL_STATE = {
    fileType: "",
    fileName: "",
    fileImg: null,
    fileURL: null,
    uploadProgress: 0,
    uploadError: null
};

/**
 * Reducer function for managing file upload state
 * 
 * @function
 * @param {Object} state - Current state
 * @param {Object} action - Action object containing type and payload
 * @param {string} action.type - Type of action to perform
 * @param {*} action.payload - Data associated with the action
 * @returns {Object} - New state after applying the action
 * 
 * @example
 * const [state, dispatch] = useReducer(fileReducer, INITIAL_STATE);
 * dispatch({ type: 'SET_FILE_NAME', payload: 'example.jpg' });
 */

export const fileReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FILE_NAME':
            return {
                ...state,
                fileName: action.payload
            };
        case 'SET_FILE_TYPE':
            return {
                ...state,
                fileType: action.payload
            };
        case 'SET_FILE_URL':
            if (action.payload instanceof File || action.payload instanceof Blob) {
                return {
                    ...state,
                    [action.field]: URL.createObjectURL(action.payload)
                };
            } else {
                console.error('Invalid file object passed to SET_FILE_URL');
                return state;
            }
        case 'SET_UPLOAD_PROGRESS':
            return {
                ...state,
                uploadProgress: action.payload
            };
        case 'SET_UPLOAD_ERROR':
            return {
                ...state,
                uploadError: "Upload failed. Please try again."
            };
        case 'RESET_FILE_STATE':  // New case to reset the file state
            return {
                fileType: "",
                fileName: "",
                fileImg: null,
                fileURL: null,
                uploadProgress: 0,
                uploadError: null
            };
        default:
            return state;
    }
};