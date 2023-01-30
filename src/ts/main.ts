import { Section } from "./section";

const contentsContainer = document.getElementById("contents");
if (!contentsContainer) {
    throw new Error("No contents.");
}

const compactSection = new Section();
contentsContainer.appendChild(compactSection.container);

compactSection.onActionCallbacks.push(() => {
    const input = compactSection.getInput();

    if (!input) {
        compactSection.setErrorMessage("");
        compactSection.setResult("");
        return;
    }

    const result = input.replace(/([a-zA-Z]|[à-ü]|[À-Ü]){3,}/g, (word: string) => {
        const firstLetter = word[0];
        const lastLetter = word[word.length - 1];
        const innerLettersCount = word.length - 2;

        if (typeof firstLetter === "undefined" || typeof lastLetter === "undefined" || innerLettersCount <= 0) {
            console.warn(`Invalid word '${word}'.`);
            return word;
        }
        return `${firstLetter}${innerLettersCount}${lastLetter}`;
    });
    compactSection.setResult(result);
});
