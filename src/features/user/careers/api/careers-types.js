/**
 * @typedef {Object} PublicJob
 * @property {string} id
 * @property {string} title
 * @property {string} department
 * @property {string} location
 * @property {string} type
 * @property {string} description
 * @property {string} requirements
 * @property {string} deadline
 * @property {string|null} thumbnail
 * @property {string} created_at
 */

/**
 * @typedef {Object} ApplyRequest
 * @property {string} job_id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} phone
 * @property {string} [linkedin]
 * @property {string} [portfolio]
 * @property {string} [years_experience]
 * @property {string} [source]
 * @property {string} [cover_letter]
 * @property {File} cv
 */
