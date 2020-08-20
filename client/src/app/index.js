"use strict";

import "./index.css";
import fs from "fs";
import Helvetica from "!!raw-loader!pdfkit/js/data/Helvetica.afm";

const blobStream = require("blob-stream");
const JSSoup = require("jssoup").default;
const PDFDocument = require("pdfkit").default;

fs.writeFileSync("data/Helvetica.afm", Helvetica);

const doc = new PDFDocument({size: "LETTER"});
const request = new XMLHttpRequest();
const stream = doc.pipe(blobStream());

const createObjectURL = object => {
  return window.URL
    ? window.URL.createObjectURL(object)
    : window.webkitURL.createObjectURL(object);
};

const a = document.createElement("a");
document.body.appendChild(a);
a.style = "display: none";

let getTheme = word => {
  let proxy = "https://cors-anywhere.herokuapp.com/";
  let url = `https://hjg.com.ar/vocbib/art/${word.toLowerCase()}.html`;

  request.open("GET", proxy + url, false);
  request.send(null);

  if (request.status == 200) {
    let soup = new JSSoup(request.responseText, false);
    let theme = soup.find("div", {id: "main"}).text;
    doc.text(theme);
    doc.end();

    stream.on("finish", () => {
      let blob = stream.toBlob("application/pdf");
      console.log(blob);
      if (!blob) return;
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `${word.toLowerCase()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  } else {
    console.log("Tema no encontrado.");
  }
};

document.getElementById("buscar").addEventListener("click", e => {
  getTheme("agua");
});
