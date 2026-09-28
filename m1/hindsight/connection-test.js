require("dotenv").config();

const { hindsight, bankId } = require("./client");

async function main() {
  console.log("Hindsight base URL:", process.env.HINDSIGHT_BASE_URL);
  console.log("Hindsight bank:", bankId);

  // We only verify that the SDK client can be constructed here.
  // The real memory test comes immediately after this.
  console.log("Hindsight client initialized successfully.");
}

main().catch((error) => {
  console.error("Hindsight connection setup failed.");
  console.error(error.message);
  process.exit(1);
});