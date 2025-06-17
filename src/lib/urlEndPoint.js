const dotenv = require("dotenv");

dotenv.config({
  path: "../../.env",
});
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_PRODUCTION;
console.log("libs:", apiBaseUrl);
module.exports = apiBaseUrl;
