require("dotenv").config();

const Groq = require("groq-sdk");

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("Missing GROQ_API_KEY.");
}

const groq = new Groq({
  apiKey
});

module.exports = {
  groq
};