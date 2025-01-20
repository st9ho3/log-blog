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
        case 'CLEAN':
            return {
                state: INITIAL_STATE
            }

    }
}