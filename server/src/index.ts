import request from "request";

const options = {
  method: "GET",
  url: "https://taylorcfse.ca1.qualtrics.com/API/v3/surveys/SV_79eEMf5sfGy2DiZ",
  headers: {
    "x-api-token": "JwyfF35aDOdKa7ArCN9nEd87riLiPAofYMy9a1II"
  }
};

request(options, function(error, response, body) {
  if (response.statusCode === 200) {
    console.log(body);
  }
  if (error) throw new Error(error);
  // run some code
});
