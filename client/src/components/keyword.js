import fetch from "node-fetch"

async function runQuery(text) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/abid/indonesia-bioner",
        {
          headers: {
            Authorization: "Bearer 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",
          },
          method: "POST",
          body: JSON.stringify({
            "inputs": text,
          }),
        }
      );
      const result = await response.json();
      console.log(JSON.stringify(result));
    } 
    catch (error) {
      console.error(error);
    }
  }

export {runQuery}