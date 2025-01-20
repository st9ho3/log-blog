import { collection, addDoc,setDoc, getDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../db/Firebase";
import { nanoid } from "nanoid";

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
    id: nanoid(),
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
  const docRef = await setDoc(doc(db, "articles", newArticle.id ), newArticle);
  console.log("Document written with ID: ", newArticle.id);
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

/**
 * @description Extracts the main title (h1 heading) from an article's content.
 * @function getTitles
 * @param {object} article - The article object.
 * @param {object[]} article.content - An array of content blocks representing the article's content.
 * @returns {string} The text content of the first h1 heading found in the article, or an empty string if no h1 is found.
 */
export const getTitles = (article) => {
  const firstContent = article.content.filter(
    (content) => content.type === 'heading' && content.props.level === 1
  );
  const filteredHeading = firstContent[0];
  // Return empty string if no title is found, prevents errors when accessing properties of undefined
  const title = filteredHeading?.content[0]?.text || ""; 
  return title;
};

/**
 * @description Extracts the first subtitle (h2 or h3 heading) from an article's content.
 * @function getSubTitles
 * @param {object} article - The article object.
 * @param {object[]} article.content - An array of content blocks representing the article's content.
 * @returns {string} The text content of the first h2 or h3 heading found in the article, or 'No subtitle' if none is found.
 */
export const getSubTitles = (article) => {
  const firstContent = article.content.filter(
    (content) =>
      content.type === 'heading' &&
      (content.props.level === 2 || content.props.level === 3)
  );
  const filteredHeading = firstContent?.[0] || 'No subtitle';
  return filteredHeading === 'No subtitle'
    ? 'No subtitle'
    : filteredHeading.content[0].text;
};

/**
 * @description Extracts the URL of the first image from an article's content.
 * @function getImage
 * @param {object} article - The article object.
 * @param {object[]} article.content - An array of content blocks representing the article's content.
 * @returns {string} The URL of the first image found in the article, or 'No image' if none is found.
 */
export const getImage = (article) => {
  console.log(article.content);
  const firstContent = article.content.filter(
    (content) => content.type === 'image'
  );
  console.log(firstContent);
  firstContent.length > 0
    ? console.log(firstContent[0].props.url)
    : console.log('No image');
  return firstContent.length > 0 ? firstContent[0].props.url : 'No image';
};


  