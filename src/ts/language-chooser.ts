import { Language } from "./engine";
import * as Url from "./url-helper";

const languageSelect = document.createElement("select");

const englishOption = document.createElement("option");
englishOption.value = Language.ENGLISH;
englishOption.label = "English";
languageSelect.appendChild(englishOption);

const frenchOption = document.createElement("option");
frenchOption.value = Language.FRENCH;
frenchOption.label = "French";
languageSelect.appendChild(frenchOption);

const URL_KEY = "language";

const initialValueFromUrl = Url.getValue(URL_KEY);
if (initialValueFromUrl) {
    languageSelect.value = initialValueFromUrl;
}

languageSelect.addEventListener("change", () => {
    Url.setValue(URL_KEY, languageSelect.value);
});
export {
    languageSelect,
};

