"use strict";

import "./index.css";

const JSSoup = require("jssoup").default;

let getTheme = word => {
  const request = new XMLHttpRequest();

  let proxy = "https://cors-anywhere.herokuapp.com/";
  let url = `https://hjg.com.ar/vocbib/art/${word.toLowerCase()}.html`;

  request.open("GET", proxy + url, true);
  request.onload = () => {
    if (request.status == 200) {
      let soup = new JSSoup(request.responseText, false);
      let theme = soup.find("div", {id: "main"}).text;
      console.log(theme);
    } else {
      console.log("Tema no encontrado.");
    }
  };
  request.send();
};

document.getElementById("buscar").addEventListener("click", e => {
  getTheme("agua");
});
