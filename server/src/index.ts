import request from "request";
import { config } from "dotenv";

config();
console.log(process.env);

const options = {
  method: "GET",
  url: [process.env.CAP_BASE_URL!, "surveys", process.env.TEST_SURVEY_ID!].join(
    "/"
  ),
  headers: {
    "x-api-token": process.env.CAP_API_TOKEN
  }
};

request(options, function(error, response, body) {
  if (error) {
    throw new Error(error);
  }
  if (response.statusCode === 200) {
    console.log(body);
  } else {
    console.log(body);
  }
});
