export const INITIAL_STATE = {
    fileType: "",
    fileName: "",
    fileImg: null,
    fileURL: null,
    uploadProgress: 0,
    uploadError: null
};

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