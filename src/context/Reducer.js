import { INITIAL_STATE } from "./Context"

export const reducer = (state,action) => {
    switch (action.type) {
        case 'TOGGLE_SIDEBAR':
            return {
                ...state,
                isMenuOpen: action.payload
            }
        case 'SET_WINDOW_WIDTH':
            return {
                ...state,
                windowWidth: action.payload
            }
        case 'SET_SCROLL':
            return {
                ...state,
                isScrolling: true
            }
        case 'SET_ARTICLE':
            return {
                ...state,
                article: action.payload
            }
        case 'SHOW_MODAL':
            return {
                ...state,
                modal: {open: true, type: action.payload}
            }
        case 'CLOSE_MODAL':
            return {
                ...state,
                modal: {open: false, type: ''}
            }
        case 'SET_TAGS':
            if (!state.chosenTags.includes(action.payload)) {
                return {
                    ...state,
                    chosenTags: [...state.chosenTags, action.payload]
                };
            } else {
                return {
                    ...state,
                    chosenTags: state.chosenTags.filter((tag) => tag !== action.payload)
                }
            }
        case 'SET_USER':
            return {
                ...state,
                userLogedIn: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                userLogedIn: null
            }     
        case 'SET_AUTHORS': 
            return {
                ...state,
                authors: action.payload
            }     
          
        case 'CLEAN_TAGS':
            return {
                ...state,
                chosenTags:[]
            }
        case 'CLEAN':
            return {
                ...state,
                modal:{open: false, type: ''},
                isMenuOpen:false,
                isScrolling:false
            }

    }
}