import { makeCompact, makeExpanded } from "./engine";
import * as ModeChooser from "./mode-chooser";
import { Section } from "./section";

const contentsContainer = document.getElementById("contents");
if (!contentsContainer) {
    throw new Error("No contents.");
}

contentsContainer.appendChild(ModeChooser.container);

const compactSection = new Section("compact", "Makes communication easier.", makeCompact);
contentsContainer.appendChild(compactSection.container);

const expandedSection = new Section("expanded", "M3s c11n e4r.", makeExpanded);
contentsContainer.appendChild(expandedSection.container);

function updateVisibility(): void {
    const isCompactMode = ModeChooser.getMode() === ModeChooser.Mode.MAKE_COMPACT;
    compactSection.visible = isCompactMode;
    expandedSection.visible = !isCompactMode;
}
ModeChooser.addOnChangeListener(updateVisibility);
updateVisibility();

