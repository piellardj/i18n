import { makeCompact, makeExpanded } from "./engine";
import * as ModeChooser from "./mode-chooser";
import { Section } from "./section";

function createCompactSection(): Section {
    return new Section("compact", "Makes communication easier.", makeCompact);
}

function createExpandedSection(): Section {
    const infoMessage = document.createElement("div");
    infoMessage.className = "info-messages";
    const section = new Section("expanded", "M3s c11n e4r.", (compactWord: string) => {
        const result = makeExpanded(compactWord);
        infoMessage.textContent = `Chose randomly out of ${result.possibilities} possibilities.`;
        return result.output;
    });
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

