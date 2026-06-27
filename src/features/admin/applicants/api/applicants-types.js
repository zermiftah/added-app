/**
 * @typedef {Object} Application
 * @property {string} id
 * @property {string} job_id
 * @property {string} job_title
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} phone
 * @property {string} [linkedin]
 * @property {string} [portfolio]
 * @property {string} [years_experience]
 * @property {string} [source]
 * @property {string} [cover_letter]
 * @property {string} cv_path
 * @property {"pending"|"reviewing"|"shortlisted"|"rejected"|"hired"} status
 * @property {string} [admin_notes]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ApplicationFilter
 * @property {string} [status]
 * @property {string} [job_id]
 * @property {string} [search]
 */

/**
 * @typedef {Object} UpdateStatusRequest
 * @property {string} status
 * @property {string} [notes]
 */
