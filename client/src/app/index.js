"use strict";

import "./index.css";

var requestify = require("requestify");

// document.getElementById("buscar").addEventListener("click", e => {
  let theme = 'agua'; //document.getElementById("palabra").value;
  const url = `https://hjg.com.ar/vocbib/art/${theme.toLowerCase()}.html`;

  requestify.get(url).then(response => {
    console.log(response.code);
  });
// });
