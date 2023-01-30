function makeCompact(input: string): string {
    return input.replace(/([a-zA-Z]|[à-ü]|[À-Ü]){3,}/g, (word: string) => {
        const firstLetter = word[0];
        const lastLetter = word[word.length - 1];
        const innerLettersCount = word.length - 2;

        if (typeof firstLetter === "undefined" || typeof lastLetter === "undefined" || innerLettersCount <= 0) {
            console.warn(`Invalid word '${word}'.`);
            return word;
        }
        return `${firstLetter}${innerLettersCount}${lastLetter}`;
    });
}

function makeExpanded(_input: string): string {
    return "Not implemented";
}

export {
    makeExpanded,
    makeCompact,
};

