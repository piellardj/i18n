import * as fs from "fs";
import * as path from "path";
import { DemopageEmpty } from "webpage-templates";

const data = {
    title: "i18n",
    description: "Silly tool to translate to and from numeronyms such as 'i18n'.",
    introduction: [
        "This is a silly tool to translate to and from numeronyms such as \"i18n\" (which stands for \"internationalization\").  The reverse translation illustrates how confusing such abbreviations can be.",
        "Only keep the first and last letters, and add the count of inner letters. Makes communication easier. M3s c11n e4r."
    ],
    githubProjectName: "i18n",
    readme: {
        filepath: path.join(__dirname, "..", "README.md"),
        branchName: "main"
    },
    additionalLinks: [],
    scriptFiles: [
        "script/main.js"
    ],
    styleFiles: [
        "css/demo.css"
    ],
    body: `<div id="contents"></div>`
};

const DEST_DIR = path.resolve(__dirname, "..", "docs");

const buildResult = DemopageEmpty.build(data, DEST_DIR);

// disable linting on this file because it is generated
buildResult.pageScriptDeclaration = "/* tslint:disable */\n" + buildResult.pageScriptDeclaration;

// const SCRIPT_DECLARATION_FILEPATH = path.resolve(__dirname, ".", "ts", "page-interface-generated.ts");
// fs.writeFileSync(SCRIPT_DECLARATION_FILEPATH, buildResult.pageScriptDeclaration);

const sourceCss = path.resolve(__dirname, "static", "css", "demo.css");
const destinationCss = path.resolve(__dirname, "..", "docs", "css", "demo.css");
fs.copyFileSync(sourceCss, destinationCss);
