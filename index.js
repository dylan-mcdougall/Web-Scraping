const { inputNumArticles } = require("./js/primaryFunctionality/inputNumArticles");
const { parseRequest } = require("./js/primaryFunctionality/parseRequest");

async function launchScript() {
  try {
    const input = await inputNumArticles();
    console.log(`Now processing top ${input} articles!`);
    await parseRequest(input);
  } catch (e) {
    console.error("There was an error executing script: ", e)
  }
}

(async () => {
  await launchScript();
})();
