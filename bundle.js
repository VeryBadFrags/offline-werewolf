const fs = require("fs");

const inputRules = 'build/rules.html';
const inputFooter = 'build/footer.html';
const inputCss = 'build/style.css';
const inputConstantsJs = 'build/constants.js';
const inputFooterJs = 'build/footer.js';

const outputHtmlFile = "build/index.html";

let mainHtmlFile = fs.readFileSync('src/index.html');
let mainHtml = mainHtmlFile.toString();

// Inject HTML Pages
let rulesHtml = fs.readFileSync(inputRules);
mainHtml = mainHtml.replace("<!-- rules.html -->", rulesHtml.toString());
let footerHtml = fs.readFileSync(inputFooter);
mainHtml = mainHtml.replace("<!-- footer.html -->", footerHtml.toString());

// Inject CSS
let css = fs.readFileSync(inputCss);
mainHtml = mainHtml.replace('<link rel="stylesheet" type="text/css" href="style.css">', "<style>" + css.toString() + "</style>");

// Inject JS
let scriptOpen = "<script>";
let scriptClose = "</script>";

let constantsJs = fs.readFileSync(inputConstantsJs);
mainHtml = mainHtml.replace('<script src="constants.js"></script>', scriptOpen + constantsJs.toString() + scriptClose);

let footerJs = fs.readFileSync(inputFooterJs);
mainHtml = mainHtml.replace('<script src="footer.js"></script>', scriptOpen + footerJs.toString() + scriptClose);

// Output to file
fs.writeFile(outputHtmlFile, mainHtml, function (err) {
    if (err) return console.log(err);
    console.log(`Bundled standalone HTML into ${outputHtmlFile}`);
});
