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
                modal: true
            }
        case 'SET_TAGS':
            if (!state.chosenTags.includes(action.payload)) {
                return {
                    ...state,
                    chosenTags: [...state.chosenTags, action.payload]
                };
            }
            return state; // If the tag already exists, return the state unchanged
        case 'CLEAN_TAGS':
            return {
                ...state,
                chosenTags:[]
            }
        case 'CLEAN':
            return {
                ...state,
                modal:false,
                isMenuOpen:false,
                isScrolling:false
            }

    }
}