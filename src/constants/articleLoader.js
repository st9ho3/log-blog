import { getArticle } from "./utils";

/**
 * React Router loader function for article pages
 * 
 * Responsibilities:
 * 1. Fetches article data based on URL parameters
 * 2. Processes raw content into structured format
 * 3. Prepares data for the article component
 * 
 * Data Flow:
 * URL -> Router params -> API call -> Data processing -> Component props
 */
export const articleLoader = async ({ params }) => {
  // Extract article ID from URL parameters
  // Example URL: /author-name/article-123 → articleID = "article-123"
  const { articleID } = params;

  // Fetch raw article data from API/backend
  // getArticle returns { content: [...] } where content is an array of block objects
  const content = await getArticle(articleID);
  const data = content?.content; // Array of content blocks
  const author = content?.author; // Object: Author 
  const meta = content?.metadata; // Object: Metadata
  
  // Validate data structure
  if (!data || !Array.isArray(data)) {
    throw new Error("Invalid document structure. Expected array of content blocks.");
  }

  // CONTENT PROCESSING PHASE

  // 1. TITLE EXTRACTION
  // Find first heading block (level 1) for article title
  const titleBlock = data.find(
    block => block.type === "heading" && block.props.level === 1
  );
  // Extract text from first content element of heading block
  const title = titleBlock?.content?.[0]?.text || "Untitled"; // Fallback title

  // 2. IMAGE EXTRACTION
  // Find first image block for featured image
  const firstImage = data.find(block => block.type === "image");
  // Extract image URL with empty string fallback
  const image = firstImage?.props?.url || ''; 

  // 3. CONTENT FILTERING
  // Remove first heading (used as title) and first image (used as featured image)
  let firstHeadingFound = false;
  let firstImageFound = false;
  
  const filteredContent = data.filter(block => {
    // Filter out first H1 heading
    if (block.type === "heading" && 
        block.props.level === 1 && 
        !firstHeadingFound) {
      firstHeadingFound = true;
      return false;
    }

    // Filter out first image
    if (block.type === "image" && !firstImageFound) {
      firstImageFound = true;
      return false;
    }

    // Keep all other blocks
    return true;
  });

  // Return processed data structure for component consumption
  return { 
    title,         // String: Article title
    filteredContent, // Array: Content without first heading/image
    image,          // String: URL of featured image,
    author,
    meta
  };
};