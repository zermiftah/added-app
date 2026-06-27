/**
 * @typedef {Object} Job
 * @property {string} id
 * @property {string} title
 * @property {string} department
 * @property {string} location
 * @property {string} type
 * @property {string} description
 * @property {string} requirements
 * @property {string} deadline
 * @property {"active"|"draft"|"closed"} status
 * @property {string|null} thumbnail
 * @property {string} created_at
 */

/**
 * @typedef {Object} Department
 * @property {number} id
 * @property {string} name
 * @property {number} is_default
 */

/**
 * @typedef {Object} JobFormData
 * @property {string} title
 * @property {string} department
 * @property {string} location
 * @property {string} type
 * @property {string} description
 * @property {string} requirements
 * @property {string} deadline
 * @property {"active"|"draft"|"closed"} status
 * @property {File|null} [thumbnail]
 */
