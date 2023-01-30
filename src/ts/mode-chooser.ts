import * as Url from "./url-helper";

enum Mode {
    MAKE_COMPACT = "0",
    MAKE_EXPANDED = "1",
}

const URL_KEY = "mode";

const onChangeListeners: VoidFunction[] = [];

function addOnChangeListener(callback: VoidFunction): void {
    onChangeListeners.push(callback);
}

function onChange(): void {
    const mode = getMode();
    Url.setValue(URL_KEY, mode);

    for (const callback of onChangeListeners) {
        callback();
    }
}

type Block = {
    container: HTMLElement;
    radioElement: HTMLInputElement;
};

function createBlock(value: string, label: string): Block {
    const container = document.createElement("span");

    const labelElement = document.createElement("label");
    labelElement.textContent = label;
    labelElement.htmlFor = value;

    const radioElement = document.createElement("input");
    radioElement.id = value;
    radioElement.type = "radio";
    radioElement.name = "mode";
    radioElement.value = label;
    radioElement.addEventListener("change", onChange);

    container.appendChild(radioElement);
    container.appendChild(labelElement);

    return { container, radioElement };
}

const compact = createBlock(Mode.MAKE_COMPACT, "internationalization → i18n");
const expanded = createBlock(Mode.MAKE_EXPANDED, "i18n → internationalization");

const container = document.createElement("div");
container.id = "mode-chooser";
container.appendChild(compact.container);
container.appendChild(expanded.container);

function getMode(): Mode {
    if (expanded.radioElement.checked) {
        return Mode.MAKE_EXPANDED;
    }
    return Mode.MAKE_COMPACT;
}

function setMode(mode: Mode): void {
    compact.radioElement.checked = (mode === Mode.MAKE_COMPACT);
    expanded.radioElement.checked = (mode === Mode.MAKE_EXPANDED);
}

const modeFromUrl = Url.getValue(URL_KEY);
const initialMode = (modeFromUrl === Mode.MAKE_EXPANDED) ? Mode.MAKE_EXPANDED : Mode.MAKE_COMPACT;
setMode(initialMode);

export {
    addOnChangeListener,
    container,
    getMode,
    Mode,
    setMode,
};

