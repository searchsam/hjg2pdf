import "./index.css";

const fetch = require("node-fetch");
const Bluebird = require("bluebird");

fetch.Promise = Bluebird;

document.getElementById("buscar").addEventListener("click", e => {
  let theme = document.getElementById("palabra").value;
  const url = `https://hjg.com.ar/vocbib/art/${theme.toLowerCase()}.html`;
  let response = fetch(url, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*"
    }
  });

  console.log(response);
});
