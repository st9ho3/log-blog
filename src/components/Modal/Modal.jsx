import React, { useContext, useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { context } from '../../context/Context';

const Modal = ({ type, initialContent = ["Technology",
  "Design",
  "Programming",
  "Business",
  "Science",
  "Health & Wellness",
  "Education",
  "Travel",
  "Lifestyle",
  "Finance",
  "Arts & Culture",
  "Environment",
  "Politics",
  "Sports",
  "Food & Cooking",
  "Gaming",
  "Fashion",
  "Self-Improvement",
  "History",
  "Parenting",
  "Photography",
  "Music",
  "Film & TV",
  "Career Advice",
  "Relationships",
  "DIY & Crafts",
  "Pets",
  "Spirituality",
  "Real Estate",
  "Automotive"] }) => {
  const { state, dispatch } = useContext(context)
  const [tags, setTags] = useState(initialContent);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        dispatch({type: 'CLOSE_MODAL'})
      };
    };

    if (state.modal.open) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [state.modal.open])

  return (
    <>
    
      {state.modal.open && state.userLogedIn && (
      <div className={`ModalBackground-${type}`}>
        <div className={`${type}-modal-overlay`} onClick={() => dispatch({type: 'CLOSE_MODAL'})}>
          <div className={`tags-modal-content`} onClick={(e) => e.stopPropagation()}>
            <IoClose 
              className="tags-modal-close-btn"
              onClick={() => dispatch({ type: 'CLEAN' })}
              aria-label="Close modal"
            />
            
            {type === 'tags' ? (
              <>
                <h3 className="tags-modal-title">Choose category</h3>
                <div className="tags-container">
                  {tags.map((tag) => (
                    <span 
                      key={tag}
                      onClick={() => dispatch({ type: 'SET_TAGS', payload: tag })}
                      className={`tag-pill ${state.chosenTags.includes(tag) ? 'selected' : ''}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            ) : type === 'profile' ? (
              <div className="profile-modal-content">
                {state.userLogedIn && (
                  <>
                    <img 
                      src={state.userLogedIn.profilePicture} 
                      alt="Profile" 
                      className="profile-modal-image"
                    />
                    <h2 className="profile-modal-name">
                      {state.userLogedIn.name || 'User Name'}
                    </h2>
                    
                    <button 
                      className="profile-logout-btn"
                      onClick={() => {
                        localStorage.removeItem('authorizedUser');
                        dispatch({ type: 'LOGOUT' });
                        dispatch({ type: 'CLEAN' })
                      }}
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
        </div>
      )}
      </>
    
  )
}

export default Modal;