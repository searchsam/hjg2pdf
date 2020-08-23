"use strict";

import "./index.css";
import fs from "fs";
import Helvetica from "!!raw-loader!pdfkit/js/data/Helvetica.afm";

fs.writeFileSync("data/Helvetica.afm", Helvetica);

const blobStream = require("blob-stream");
const Entities = require("html-entities").XmlEntities;
const JSSoup = require("jssoup").default;
const PDFDocument = require("pdfkit").default;

const doc = new PDFDocument({size: "LETTER", margin: 50});
const request = new XMLHttpRequest();
const stream = doc.pipe(blobStream());
const entities = new Entities();
const a = document.createElement("a");
const proxy = "https://cors-anywhere.herokuapp.com/";

document.body.appendChild(a);
a.style = "display: none";

let topicExists = url => {
  request.open("GET", proxy + url, false);
  request.overrideMimeType("text/xml; charset=iso-8859-1");
  request.send(null);

  if (request.status == 200) return true;

  return false;
};

let getTheme = url => {
  return new JSSoup(request.responseText, false);
};

let loadTheme = (word, soup) => {
  doc
    .fontSize(20)
    .text(word.replace(word[0], word[0].toUpperCase()), {align: "center"});
  doc.fontSize(11);
  soup
    .find("div", {id: "main"})
    .findAll("p")
    .forEach(p => {
      doc
        .moveDown()
        .text(p.text.replace(/(\r\n|\n|\r)/gm, " "), {
          align: "justify",
          ellipsis: true
        });
    });
  doc.end();
};

let downloadDoc = word => {
  stream.on("finish", () => {
    let blob = stream.toBlob("application/pdf");

    if (!blob) return;

    let docUrl = window.URL.createObjectURL(blob);
    a.href = docUrl;
    a.download = `${word.toLowerCase()}.pdf`;
    a.click();
    window.URL.revokeObjectURL(docUrl);
  });
};

document.getElementById("buscar").addEventListener("click", e => {
  let word = document.getElementById('palabra').value;
  let url = `https://hjg.com.ar/vocbib/art/${word.toLowerCase()}.html`;

  if (topicExists(url)) {
    let soup = getTheme(url);
    loadTheme(word, soup);
    downloadDoc(word);
    window.location.reload(false);
  } else {
    console.log("Tema no encontrado.");
  }
});
