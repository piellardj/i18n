import { Language, makeCompact, makeExpanded } from "./engine";
import * as LanguageChooser from "./language-chooser";
import * as ModeChooser from "./mode-chooser";
import { Section } from "./section";

function createCompactSection(): Section {
    return new Section("compact", "Makes communication easier.", makeCompact);
}

function createExpandedSection(): Section {
    const languageSelect = LanguageChooser.languageSelect;
    const infoMessage = document.createElement("div");
    infoMessage.className = "info-messages";
    const section = new Section("expanded", "M3s c11n e4r.", (compactWord: string) => {
        const result = makeExpanded(compactWord, languageSelect.value as Language);

        let possibilities = 1;
        for (const fragment of result.output) {
            possibilities *= Math.max(1, fragment.possibilitiesCount);
        }
        infoMessage.textContent = `Randomly chose out of ${possibilities.toLocaleString()} possibilities.`;

        const fragment = document.createDocumentFragment();
        for (const textFragment of result.output) {
            const element = document.createElement("span");
            element.textContent = textFragment.text;
            if (textFragment.title) {
                element.title = textFragment.title;
            }
            fragment.appendChild(element);
        }
        return fragment;
    });
    section.appendMiddleElement(languageSelect);
    section.appendMiddleElement(infoMessage);
    return section;
}

const contentsContainer = document.getElementById("contents");
if (!contentsContainer) {
    throw new Error("No contents.");
}

contentsContainer.appendChild(ModeChooser.container);

const compactSection = createCompactSection();
const expandedSection = createExpandedSection();
contentsContainer.appendChild(compactSection.container);
contentsContainer.appendChild(expandedSection.container);

function updateSectionsVisibility(): void {
    const isCompactMode = ModeChooser.getMode() === ModeChooser.Mode.MAKE_COMPACT;
    compactSection.visible = isCompactMode;
    expandedSection.visible = !isCompactMode;
}
ModeChooser.addOnChangeListener(updateSectionsVisibility);
updateSectionsVisibility();

