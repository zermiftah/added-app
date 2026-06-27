/**
 * @typedef {Object} Article
 * @property {number} id
 * @property {string} title
 * @property {string} slug
 * @property {number} topic_id
 * @property {string} topic_name
 * @property {number} author_id
 * @property {string} author_name
 * @property {string|null} author_photo
 * @property {string|null} thumbnail
 * @property {string} content
 * @property {"published"|"draft"} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Topic
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {number} is_default
 */
