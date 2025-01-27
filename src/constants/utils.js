import { collection, setDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../db/Firebase";
import { nanoid } from "nanoid";
import { data, redirect } from "react-router";

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
    author: { id: author.id, name: author.name, img: author.profilePicture }, // Author's name
    likes: 0, // Initial likes count
    comments: [], // Initially an empty array for comments
    shares: 0, // Initial shares count
    saves: 0, // Initial saves count
    tags: tags, // Array of tags for categorization
    content: content, // Article content (blocks)
  };

  return article;
};

// Firestore-compatible sanitization function
const sanitizeForFirestore = (data) => {
  const sanitizeValue = (value) => {
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, sanitizeValue(v)])
      );
    }
    return value;
  };

  return data.map(block => {
    if (block.type === 'table') {
      return {
        ...block,
        content: {
          ...block.content,
          rows: block.content.rows.map(row => ({
            cells: row.cells.map(cell => ({
              cell: cell.map(item => sanitizeValue(item))
            }))
          }))
        }
      };
    }
    return block;
  });
};

// Updated desanitizeFromFirestore function
const desanitizeFromFirestore = (data) => {
  // Safety check for content array
  if (!data?.content || !Array.isArray(data.content)) {
    console.error('Invalid document structure:', data);
    return data; // Return original data as fallback
  }

  const restoreNestedArrays = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(restoreNestedArrays);
    }
    if (obj && typeof obj === 'object') {
      // Convert array-like objects to real arrays
      if (Object.keys(obj).every(key => !isNaN(key))) {
        return Object.values(obj).map(restoreNestedArrays);
      }
      // Recursively process object properties
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, restoreNestedArrays(value)])
      );
    }
    return obj;
  };

  // Process the content array specifically
  return {
    ...data,
    content: data.content.map(block => {
      if (block?.type === 'table') {
        return {
          ...block,
          content: {
            ...block.content,
            rows: block.content?.rows?.map(row => ({
              cells: (row.cells || []).map(cell =>
                restoreNestedArrays(cell?.cell || [])
              )
            })) || []
          }
        };
      }
      return block;
    })
  };
};
/**
 * @description Publishes an article to Firestore.
 * @async
 * @function PublishArticle
 * @returns {Promise<void>} A promise that resolves when the article is successfully published and storage is cleared.
 * @throws {Error} Throws an error if the article publishing fails.
 */
export const PublishArticle = async (tags, author) => {
  const JSONContent = sessionStorage.getItem('editorContent');
  const theContent = JSONContent ? JSON.parse(JSONContent) : undefined;

  // 1. Create deep copy of content
  const contentToSanitize = JSON.parse(JSON.stringify(theContent));

  // 2. Sanitize nested arrays for Firestore
  const sanitizedContent = sanitizeForFirestore(contentToSanitize);

  // 3. Create article with sanitized content
  const newArticle = createArticleObject(author, sanitizedContent, tags);

  // 4. Save to Firestore
  const docRef = await setDoc(doc(db, "articles", newArticle.id), newArticle);
  console.log("Document written with ID: ", newArticle.id);

  // 5. Clear storage
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

    if (!docSnap.exists()) {
      console.log("No document found with ID:", id);
      return null;
    }

    // Get raw data and desanitize
    const rawData = docSnap.data();
    const desanitizedData = desanitizeFromFirestore(rawData);

    // Return the processed data with document ID
    return {
      id: docSnap.id,
      ...desanitizedData,
      createdAt: rawData.createdAt?.toDate?.(), // Safe conversion
      updatedAt: rawData.updatedAt?.toDate?.()
    };

  } catch (error) {
    console.error("Error fetching document:", error);
    throw new Error("Failed to retrieve article. Please try again later.");
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
 * @description Retrieves all authors from Firestore.
 * @async
 * @function getAuthors
 * @returns {Promise<object[]>} A promise that resolves to an array of author data objects.
 * @throws {Error} Throws an error if the document retrieval fails.
 */
export const getAuthors = async () => {
  const querySnapshot = await getDocs(collection(db, "authors"));
  const authors = [];

  // Map through the documents and add them to the authors array
  querySnapshot.forEach((doc) => {
    authors.push({ id: doc.id, ...doc.data() });
  });

  return authors;
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

const signUp = async (email, password) => {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log('User registered:', user);
      return user.uid
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Registration error:', errorCode, errorMessage);
      throw error; // Re-throw the error for handling in the calling code
    });
};

const createAuthorObject = (userid, name) => {
  const possibleNames = [
    "https://firebasestorage.googleapis.com/v0/b/the-notes-app-cfe0c.appspot.com/o/images%2F1737994837627profile2.png?alt=media&token=b95062e9-5880-404f-a66e-c257898bb36e",
    "https://firebasestorage.googleapis.com/v0/b/the-notes-app-cfe0c.appspot.com/o/images%2F1737994768589profile1.png?alt=media&token=00e935ed-e88e-4e6c-8d85-643c069407a4",
    "https://firebasestorage.googleapis.com/v0/b/the-notes-app-cfe0c.appspot.com/o/images%2F1737995076503profile3.png?alt=media&token=71ae0765-afd6-470b-bf4e-b712deb294c1",
    "https://firebasestorage.googleapis.com/v0/b/the-notes-app-cfe0c.appspot.com/o/images%2F1737995091638profile4.png?alt=media&token=72d06828-601e-45ad-bf19-d678ee5eca3b"
  ];
  const now = new Date()
  function getRandom0To3() {
    return Math.floor(Math.random() * 4);
  }
  const randomIndex = getRandom0To3()
  const author = {
    id: userid, // Unique ID for the author
    name: name, // Author's full name
    email: "", // Author's email
    password: "", // Hashed password for security
    profilePicture: possibleNames[randomIndex], // URL to profile picture
    bio: "", // Short bio
    articles: [], // Array of article IDs written by the author
    categories: [], // Categories the author is interested in
    socialLinks: {
      twitter: "",
      linkedin: "",
      github: "",
    },
    createdAt: now.toISOString(), // Timestamp when the author profile was created
    updatedAt: now.toISOString(), // Timestamp when the author profile was last updated
  };

  return author
}

export const registerUser = async (email, password, name) => {
  const id = await signUp(email, password)
  console.log(id)
  const newUser = createAuthorObject(id, name)
  console.log(newUser)

  // Save the user to Firestore
const docRef = await setDoc(doc(db, "authors", id), newUser);
console.log("Document written with ID: ", id);
}

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
export const signIn = async (email, password) => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('User signed in:', user.uid);
      return user.uid
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Sign-in error:', errorCode, errorMessage);
      throw error; // Re-throw the error for handling in the calling code
    });
};

export const requireAuth = async ({ request }) => {
  const user = localStorage.getItem('authorizedUser');
  const url = new URL(request.url);
  
  if (!user) {
    throw redirect(`/login?message=Please login first&redirectTo=${encodeURIComponent(url.pathname)}`);
  }
  return null;
};

export const getUser = async (userId) => {
  try {
    const docRef = doc(db, "authors", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data(); // Return the user data
    } else {
      console.error("No such document!");
      return null; // Return null if the user doesn't exist
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return null; // Return null if an error occurs
  }
};

export const trending = async() => {
  const articles = await getArticles();
  const tags = []
  articles.forEach((article) => { 
     article.tags.forEach((tag) => {
      tags.push(tag)
     })
  })
  const tagsCount = tags.reduce((accumulator, currentValue) => {
    accumulator[currentValue] = (accumulator[currentValue] || 0) + 1;
    return accumulator;
  }, {}); // Initial value is an empty object
  console.log(tagsCount)
  const sortedTags = Object.entries(tagsCount).sort((a, b) => b[1] - a[1]);
  console.log(sortedTags)
  return sortedTags
}
