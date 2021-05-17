"use strict";

import "./index.css";
import fs from "fs";
import Helvetica from "!!raw-loader!pdfkit/js/data/Helvetica.afm";

fs.writeFileSync("data/Helvetica.afm", Helvetica);

const blobStream = require("blob-stream");
const JSSoup = require("jssoup").default;
const PDFDocument = require("pdfkit").default;

const doc = new PDFDocument({size: "LETTER", margin: 50});
const request = new XMLHttpRequest();
const stream = doc.pipe(blobStream());
const a = document.createElement("a");
const proxy = "https://api.allorigins.win/get?url=";

document.body.appendChild(a);
a.style = "display: none";

let setInputFilter = (textbox, inputFilter) => {
  [
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mouseup",
    "select",
    "contextmenu",
    "drop"
  ].forEach(event => {
    textbox.addEventListener(event, () => {
      if (inputFilter(textbox.value)) {
        textbox.oldValue = textbox.value;
        textbox.oldSelectionStart = textbox.selectionStart;
        textbox.oldSelectionEnd = textbox.selectionEnd;
      } else if (textbox.hasOwnProperty("oldValue")) {
        textbox.value = textbox.oldValue;
        textbox.setSelectionRange(
          textbox.oldSelectionStart,
          textbox.oldSelectionEnd
        );
      } else {
        textbox.value = "";
      }
    });
  });
};

setInputFilter(document.getElementById("palabra"), value =>
  /^[a-zñ]*$/i.test(value)
);

let topicExists = url => {
  request.open("GET", proxy + url, false);
//   request.overrideMimeType("text/xml; charset=iso-8859-1");
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
      doc.moveDown().text(p.text.replace(/\r\n|\n|\r/gm, " "), {
        align: "justify",
        ellipsis: true
      });
    });
  // doc.end();
};

let loadReadings = (word, soup) => {
  let order = {1: [], 2: [], 3: [], 4: []};
  let quotesType = {
    primera: [
      "Gen",
      "Ex",
      "Lev",
      "Num",
      "Dt",
      "Jos",
      "Jue",
      "Rut",
      "1Sa",
      "2Sa",
      "1Re",
      "2Re",
      "1Cr",
      "1Par",
      "2Cr",
      "2Par",
      "Esd",
      "Neh",
      "1Mac",
      "1Mac",
      "Tob",
      "Jdt",
      "Est",
      "Job",
      "Sal",
      "Prov",
      "Ecl",
      "Qo",
      "Cant",
      "Sab",
      "Eclo",
      "Sir"
    ],
    segunda: [
      "Is",
      "Jer",
      "Lam",
      "Bar",
      "Ez",
      "Dan",
      "Os",
      "Jl",
      "Am",
      "Abd",
      "Jon",
      "Miq",
      "Nah",
      "Hab",
      "Sof",
      "Ag",
      "Zac",
      "Mal"
    ],
    tercera: [
      "Act",
      "Hec",
      "Rom",
      "1Cor",
      "2Cor",
      "Gal",
      "Ef",
      "Flp",
      "Col",
      "1Tes",
      "2Tes",
      "1Tim",
      "2Tim",
      "Tit",
      "Flm",
      "Heb",
      "Sant",
      "1Pe",
      "2Pe",
      "1Jn",
      "2Jn",
      "3Jn",
      "Jds",
      "Ap"
    ],
    cuarta: ["Mt", "Mc", "Lc", "Jn"]
  };
  let type = 0;
  let i = 0
  soup.findAll("cite").forEach(cite => {
//     console.log(cite.text)
//     console.log(cite.text.split(/�/))
    try {
      if (quotesType["primera"].includes(cite.text.split(/�/)[0])) type = 1;
      if (quotesType["segunda"].includes(cite.text.split(/�/)[0])) type = 2;
      if (quotesType["tercera"].includes(cite.text.split(/�/)[0])) type = 3;
      if (quotesType["cuarta"].includes(cite.text.split(/�/)[0])) type = 4;
    } catch (error) { }
    console.log(type)
    order[type].push(cite.text);
  });

  let total = 0;
  if (order[1].length > total) total = order[1].length;
  if (order[2].length > total) total = order[2].length;
  if (order[3].length > total) total = order[3].length;
  if (order[4].length > total) total = order[4].length;

  doc.addPage();
  doc
    .fontSize(20)
    .text(word.replace(word[0], word[0].toUpperCase()) + " Lecturas", {
      align: "center"
    });
  doc.fontSize(11);
  doc
    .text("Primera Lectura", 50, 100)
    .text("Segunda Lectura", 175, 100)
    .text("Tercera Lectura", 300, 100)
    .text("Evangelio", 425, 100);
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, 115)
    .lineTo(550, 115)
    .stroke();

  let vspace = 120;
  let iterator = 0;
  for (const x of Array(total).keys()) {
    doc
      .text(order[1][x], 50, vspace + 20 * iterator)
      .text(order[2][x], 175, vspace + 20 * iterator)
      .text(order[3][x], 300, vspace + 20 * iterator)
      .text(order[4][x], 425, vspace + 20 * iterator);

    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, vspace + 15 + 20 * iterator)
      .lineTo(550, vspace + 15 + 20 * iterator)
      .stroke();

    iterator++;
    if (x == 30 || x == 64) {
      doc.addPage();
      vspace = 50;
      iterator = 0;
    }
  }

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

let main = word => {
  let mensaje = document.getElementById("mensaje");

  if (word.split(" ").length > 1 || word == "") {
    mensaje.classList.add("error");
    mensaje.textContent = "Palabra no valida.";
    return;
  }
  
  let url = `https://hjg.com.ar/vocbib/art/${word.toLowerCase()}.html`;
  
  if (topicExists(url)) {
    mensaje.classList.add("success");
    mensaje.textContent = "Palabra encontrada.";
    alert("Palabra encontrada.");
    let soup = getTheme(url);
    loadTheme(word, soup);
    // downloadDoc(word);
    loadReadings(word, soup);
    downloadDoc(word);
    window.location.reload(false);
  } else {
    mensaje.classList.add("error");
    mensaje.textContent = "Palabra no encontrada.";
    alert("Palabra no encontrada.");
    return;
  }
};

let word = document.getElementById("palabra");

document.getElementById("buscar").addEventListener("click", event => {
  event.preventDefault();
  main(word.value);
});

document.getElementById("formulario").addEventListener("submit", event => {
  event.preventDefault();
  main(word.value);
});
