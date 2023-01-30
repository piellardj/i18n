/// <reference types="./txt"/>

import EnglishWords from "../dictionaries/english.txt";

const letterPattern = "([a-zA-Z]|[à-ü]|[À-Ü])";

function makeCompact(input: string): string {
    const regex = new RegExp(`${letterPattern}{3,}`, "g");
    return input.replace(regex, (word: string) => {
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

class Dictionary {
    private readonly wordsByFirstLetter: Record<string, string[]>;
    public constructor(input: string) {
        this.wordsByFirstLetter = {};

        const words = input.split(/\r?\n/);
        for (let word of words) {
            word = word.toLowerCase();
            const firstLetter = word[0];
            if (typeof firstLetter === "string") {
                let subDictionary = this.wordsByFirstLetter[firstLetter];
                if (!subDictionary) {
                    subDictionary = [];
                    this.wordsByFirstLetter[firstLetter] = subDictionary;
                }
                subDictionary.push(word);
            }
        }
    }

    public findWords(firstLetter: string, lastLetter: string, lettersCount: number): string[] {
        firstLetter = firstLetter.toLowerCase();
        lastLetter = lastLetter.toLowerCase();
        const candidates = this.wordsByFirstLetter[firstLetter];
        if (!candidates) {
            return [];
        }
        return candidates.filter(word => {
            return (word.length === lettersCount) &&
                (word[word.length - 1] === lastLetter);
        });
    }
}

let englishDictionary: Dictionary | null = null;

type ExpansionResult = {
    output: string;
    possibilities: number;
};

function makeExpanded(input: string): ExpansionResult {
    let dictionary = englishDictionary;
    if (!dictionary) {
        dictionary = englishDictionary = new Dictionary(EnglishWords);
    }

    const regex = new RegExp(`${letterPattern}[0-9]+${letterPattern}`, "g");
    let possibilities = 1;

    const output = input.replace(regex, compactWord => {
        const firstLetter = compactWord[0]!;
        const lastLetter = compactWord[compactWord.length - 1]!;
        const length = parseInt(compactWord.slice(1, compactWord.length - 1)) + 2;

        const candidates = dictionary!.findWords(firstLetter, lastLetter, length);
        possibilities *= Math.max(candidates.length, 1);
        console.log(candidates.join(", "));

        const randomIndex = Math.floor(candidates.length * Math.random());
        const chosen = candidates[randomIndex];
        if (!chosen) {
            return compactWord;
        }
        const chosenMiddle = chosen.slice(1, chosen.length - 1);
        return `${firstLetter}${chosenMiddle}${lastLetter}`;
    });

    return { output, possibilities };
}

export {
    makeExpanded,
    makeCompact,
};

