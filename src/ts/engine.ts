/// <reference types="./txt"/>

import EnglishWords from "../dictionaries/english.txt";
import FrenchWords from "../dictionaries/french.txt";

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

const dictionaries: Record<string, Dictionary> = {};

enum Language {
    ENGLISH = "english",
    FRENCH = "french",
}

type TextFragment = {
    text: string;
    title?: string;
    possibilitiesCount: number;
};

type ExpansionResult = {
    output: TextFragment[];
};

function expandWord(compactWord: string, dictionary: Dictionary): TextFragment {
    const firstLetter = compactWord[0]!;
    const lastLetter = compactWord[compactWord.length - 1]!;
    const length = parseInt(compactWord.slice(1, compactWord.length - 1)) + 2;

    const candidates = dictionary!.findWords(firstLetter, lastLetter, length);
    console.log(candidates.join(", "));

    const randomIndex = Math.floor(candidates.length * Math.random());
    const chosen = candidates[randomIndex];
    if (!chosen) {
        return {
            text: compactWord,
            possibilitiesCount: 0,
        };
    }
    const chosenMiddle = chosen.slice(1, chosen.length - 1);
    const result: TextFragment = {
        text: `${firstLetter}${chosenMiddle}${lastLetter}`,
        possibilitiesCount: candidates.length,
    };
    if (candidates.length > 1) {
        const maxLength = 3;
        result.title = `or '${candidates.slice(0, maxLength).join("', or '")}`;
        const otherPossibiliesCount = candidates.length - maxLength;
        if (otherPossibiliesCount > 0) {
            result.title += `', or ${otherPossibiliesCount.toLocaleString()} other things`;
        }
    }
    return result;
}

function makeExpanded(input: string, language: Language): ExpansionResult {
    let dictionary = dictionaries[language];
    if (!dictionary) {
        let words: string;
        if (language === Language.ENGLISH) {
            words = EnglishWords;
        } else {
            words = FrenchWords;
        }
        dictionary = new Dictionary(words);
        dictionaries[language] = dictionary;
    }

    const regex = new RegExp(`${letterPattern}[0-9]+${letterPattern}`, "g");

    const output: TextFragment[] = [];
    const matches = input.matchAll(regex);
    let lastCursor = 0;
    for (const match of matches) {
        if (match) {
            const cursor = match.index!;
            const untouchedText = input.substring(lastCursor, cursor);
            if (untouchedText) {
                output.push({
                    text: untouchedText,
                    possibilitiesCount: 0,
                });
            }
            const compactWord = match[0];
            const result = expandWord(compactWord, dictionary);
            lastCursor = cursor + compactWord.length;
            output.push(result);
        }
    }

    if (lastCursor !== input.length) {
        output.push({
            text: input.substring(lastCursor),
            possibilitiesCount: 0,
        })
    }

    return { output };
}

export {
    Language,
    makeExpanded,
    makeCompact,
};

