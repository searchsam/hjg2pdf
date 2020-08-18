import "./index.css";

const http = require("http");

document.getElementById("buscar").addEventListener("click", e => {
  let theme = document.getElementById("palabra").value;
  let url = `https://hjg.com.ar/vocbib/art/${theme}.html`;
  http
    .get(url, response => {
      const {statusCode} = response;
      alert(statusCode);
    })
    .on("error", e => {
      alert(`Got error: ${e.message}`);
    });
});
