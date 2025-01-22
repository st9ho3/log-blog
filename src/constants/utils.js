import { collection, setDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../db/Firebase";
import { nanoid } from "nanoid";

/**
 * @description Utility functions for managing articles and session storage.
 * 
 * Responsibilities:
 * 1. Manage session storage for editor content
 * 2. Create and publish articles to Firestore
 * 3. Retrieve articles and extract metadata (titles, subtitles, images)
 */

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
    id: nanoid(), // Generate a unique ID for the article
    metadata: {
      date: now.toLocaleDateString(), // Human-readable date
      time: now.toLocaleTimeString(), // Human-readable time
      updatetime: now.toISOString(), // ISO format for precise timestamps
    },
    author: author,
    likes: 0, // Initial likes count
    comments: [], // Initially an empty array for comments
    shares: 0, // Initial shares count
    saves: 0, // Initial saves count
    tags: tags, // Array of tags for categorization
    content: content, // Article content (blocks)
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

  // Create a new article object
  const newArticle = createArticleObject('Vilma', theContent, ['react', 'firebase', 'javascript']);

  // Save the article to Firestore
  const docRef = await setDoc(doc(db, "articles", newArticle.id), newArticle);
  console.log("Document written with ID: ", newArticle.id);

  // Clear session storage after publishing
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
  try {
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data(); // Return the article data
    } else {
      console.error("No such document!");
      return null; // Return null if the document doesn't exist
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return null; // Return null if an error occurs
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

  // Map through the documents and add them to the articles array
  querySnapshot.forEach((doc) => {
    articles.push({ id: doc.id, ...doc.data() });
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
  const firstContent = article.content.filter(
    (content) => content.type === 'image'
  );
  return firstContent.length > 0 ? firstContent[0].props.url : 'No image';
};


/**
 * Registers a new user with the provided email and password using Firebase Authentication.
 *
 * @param {string} email - The email address of the user to register.
 * @param {string} password - The password for the new user account.
 * @returns {Promise<void>} - A promise that resolves when the user is successfully registered.
 * @throws {Error} - Throws an error if registration fails. The error object contains:
 *   - `code` (string): The Firebase error code (e.g., "auth/email-already-in-use").
 *   - `message` (string): A human-readable error message.
 *
 * @example
 * try {
 *   await signUp('user@example.com', 'password123');
 *   console.log('User registered successfully!');
 * } catch (error) {
 *   console.error('Registration failed:', error.message);
 * }
 */
export const signUp = (email, password) => {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log('User registered:', user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Registration error:', errorCode, errorMessage);
      throw error; // Re-throw the error for handling in the calling code
    });
};

/**
 * Authenticates a user with the provided email and password using Firebase Authentication.
 *
 * @param {string} email - The email address of the user to authenticate.
 * @param {string} password - The password for the user account.
 * @returns {Promise<void>} - A promise that resolves when the user is successfully authenticated.
 * @throws {Error} - Throws an error if authentication fails. The error object contains:
 *   - `code` (string): The Firebase error code (e.g., "auth/user-not-found").
 *   - `message` (string): A human-readable error message.
 *
 * @example
 * try {
 *   await signIn('user@example.com', 'password123');
 *   console.log('User signed in successfully!');
 * } catch (error) {
 *   console.error('Sign-in failed:', error.message);
 * }
 */
export const signIn = (email, password) => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('User signed in:', user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Sign-in error:', errorCode, errorMessage);
      throw error; // Re-throw the error for handling in the calling code
    });
};
