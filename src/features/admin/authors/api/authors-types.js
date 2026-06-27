/**
 * @typedef {Object} Author
 * @property {number} id
 * @property {string} name
 * @property {string|null} title
 * @property {string|null} photo
 * @property {string} description
 * @property {string} education
 * @property {string} awards
 * @property {number} article_count
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} AuthorArticle
 * @property {number} id
 * @property {string} title
 * @property {string} slug
 * @property {"published"|"draft"} status
 * @property {string} created_at
 * @property {string} topic_name
 */
