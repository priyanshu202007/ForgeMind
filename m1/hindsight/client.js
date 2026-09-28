const { HindsightClient } = require("@vectorize-io/hindsight-client");

const baseUrl = process.env.HINDSIGHT_BASE_URL;

if (!baseUrl) {
  throw new Error(
    "Missing HINDSIGHT_BASE_URL environment variable."
  );
}

const bankId = process.env.HINDSIGHT_BANK_ID || "forgemind-factory";

const hindsight = new HindsightClient({
  baseUrl
});

module.exports = {
  hindsight,
  bankId
};