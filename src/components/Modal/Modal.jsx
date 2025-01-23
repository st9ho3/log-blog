import {React, useContext, useEffect, useState} from 'react'
import { IoClose } from "react-icons/io5";
import { context } from '../../context/Context';

const Modal = ({initialContent = [
  "Technology",
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
  "Automotive"
]}) => {
 
  const {state, dispatch} = useContext(context)
  const [isOpen, setIsOpen] = useState(true);
  const [tags, setTags] = useState(initialContent);
  const [newTag, setNewTag] = useState("");
  

  const handleAddTag = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen])
  return (
    <div className='ModalBackground'>

      {state.modal && isOpen && (
        <div className="tags-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="tags-modal-content" onClick={(e) => e.stopPropagation()}>
            <IoClose 
              className="tags-modal-close-btn"
              onClick={() => dispatch({type: 'CLEAN'})}
              aria-label="Close modal"
            />
            <h3 className="tags-modal-title">Choose category
            </h3>
            
            <div className="tags-container">
              {tags.map((tag) => (
                <span key={tag}
                onClick={() => dispatch({type:'SET_TAGS', payload: tag})}
                className={`tag-pill ${state.chosenTags.includes(tag) ? 'selected' : ''}`}>
                  {tag}
                </span>
              ))}
            </div>
             {/* <input
              type="text"
              placeholder="Add tag..."
              className="tags-input"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
            /> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default Modal
