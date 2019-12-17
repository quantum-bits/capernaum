const got = require("got");
const http = require("http");
const https = require("https");

const ProxyAgent = require("https-proxy-agent");
const proxyAgent = new ProxyAgent("http://10.120.160.77:3128");

function tryTwo() {
  console.log("TRY TWO");
  const request = http.request(
    {
      method: "GET",
      host: "cse.taylor.edu",
      port: 80,
      path: "/",
      agent: proxyAgent
    },
    response => {
      response.setEncoding("UTF-8");
      response.on("data", chunk => console.log("CHUNK", chunk));
      response.on("end", () => console.log("DONE"));
    }
  );

  request.on("error", err => console.log("ERROR", err));
  request.end();
}

async function tryThree() {
  const response = await got("http://nurknet.com", {
    agent: proxyAgent
  });
  console.log("RESPONSE", response.body);
}

async function tryThreeBee() {
  const response = await got("https://cse.taylor.edu", {
    followRedirect: false,
    agent: proxyAgent
  });
  console.log("RESPONSE", response.body);
}

async function tryFour() {
  const response = await got(
    "https://taylorcfse.ca1.qualtrics.com/API/v3/organizations/taylorcfse",
    {
      followRedirect: false,
      headers: { "x-api-token": "NxUnm3Bd9ohFKd6PA4t1AxTu2L63PgbRRLuzktv7" },
      agent: proxyAgent
    }
  );
  console.log("RESPONSE", response.body);
}

tryFour();
