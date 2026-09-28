const { HindsightClient } = require("@vectorize-io/hindsight-client");

const baseUrl = process.env.HINDSIGHT_BASE_URL;
const apiKey = process.env.HINDSIGHT_API_KEY;
const bankId = process.env.HINDSIGHT_BANK_ID || "forgemind-factory";

if (!baseUrl) {
  throw new Error("Missing HINDSIGHT_BASE_URL.");
}

if (!apiKey) {
  throw new Error("Missing HINDSIGHT_API_KEY.");
}

const hindsight = new HindsightClient({
  baseUrl,
  apiKey
});

module.exports = {
  hindsight,
  bankId
};