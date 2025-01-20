import { collection, addDoc, getDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../db/Firebase";

/**
 * @description Loads content from the session storage.
 * @function loadFromStorage
 * @returns {object|undefined} The parsed JSON object from session storage, or undefined if the key 'editorContent' is not found.
 */
export const loadFromStorage = () => {
  const storageString = sessionStorage.getItem('editorContent');
  return storageString ? JSON.parse(storageString) : undefined;
};

/**
 * @description Saves content to the session storage as a JSON string.
 * @function saveToStorage
 * @param {object} jsonBlocks - The content to be saved, typically an object representing editor content.
 */
export const saveToStorage = (jsonBlocks) => {
  sessionStorage.setItem('editorContent', JSON.stringify(jsonBlocks));
};

/**
 * @description Clears the 'editorContent' item from session storage.
 * @function clearStorage
 */
const clearStorage = () => {
  sessionStorage.removeItem('editorContent');
};

/**
 * @description Creates an article object with metadata, author, and content.
 * @function createArticleObject
 * @param {string} author - The author of the article.
 * @param {object} content - The content of the article, typically an object representing editor content.
 * @param {string[]} tags - An array of tags associated with the article.
 * @returns {object} An article object with metadata, author, content, and initial engagement metrics.
 */
const createArticleObject = (author, content, tags) => {
  const now = new Date();

  const article = {
    metadata: {
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      updatetime: now.toISOString(), // ISO format for precise timestamps
    },
    author: author,
    likes: 0,
    comments: [], // Initially an empty array
    shares: 0,
    saves: 0,
    tags: tags,
    content: content,
  };

  return article;
};

/**
 * @description Publishes an article to Firestore.
 * @async
 * @function PublishArticle
 * @returns {Promise<void>} A promise that resolves when the article is successfully published and storage is cleared.
 * @throws {Error} Throws an error if the article publishing fails.
 */
export const PublishArticle = async () => {
  const JSONContent = sessionStorage.getItem('editorContent');
  const theContent = JSONContent ? JSON.parse(JSONContent) : undefined;
  console.log('Publishing article:', theContent);
  const newArticle = createArticleObject('Vilma', theContent, ['react', 'firebase', 'javascript']);
  const docRef = await addDoc(collection(db, "articles"), newArticle);
  console.log("Document written with ID: ", docRef.id);
  clearStorage();
};

/**
 * @description Retrieves a specific article from Firestore by its ID.
 * @async
 * @function getArticle
 * @param {string} id - The ID of the article to retrieve.
 * @returns {Promise<object|null>} A promise that resolves to the article data if found, or null if not found.
 * @throws {Error} Throws an error if the document retrieval fails.
 */
export const getArticle = async (id) => {
  const docRef = await getDoc(doc(db, "articles", id));
  if (docRef.exists()) {
    console.log("Document data:", docRef.data());
    return docRef.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

/**
 * @description Retrieves all articles from Firestore.
 * @async
 * @function getArticles
 * @returns {Promise<object[]>} A promise that resolves to an array of article data objects.
 * @throws {Error} Throws an error if the document retrieval fails.
 */
export const getArticles = async () => {
  const querySnapshot = await getDocs(collection(db, "articles"));
  const articles = [];
  querySnapshot.forEach((doc) => {
    articles.push({id: doc.id, ...doc.data()});
  });
 
  return articles;
};