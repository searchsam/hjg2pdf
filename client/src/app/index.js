import "./index.css";

const http = require("http");

document.getElementById("buscar").addEventListener("click", e => {
  let theme = document.getElementById("palabra").value;
  let url = `https://hjg.com.ar/vocbib/art/${theme}.html`;
  http
    .get("http://nodejs.org/dist/index.json", response => {
      const {statusCode} = response;
      alert(statusCode);
    })
    .on("error", e => {
      console.error(`Got error: ${e.message}`);
    });
});
