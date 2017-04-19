export const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8000'
export const SOUNDCLOUD_API = process.env.SOUNDCLOUD_API

// config should use named export as there can be different exports,
// just need to export default also because of eslint rules
export { SERVER_URL as default }
