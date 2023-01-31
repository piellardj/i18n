import * as Url from "./url-helper";

type Callback = (input: string) => DocumentFragment | string;

class Section {
    public readonly container: HTMLElement;

    private readonly callback: Callback;

    private readonly idInUrl: string;

    private readonly input: HTMLElement;

    private readonly actionSection: HTMLElement;
    private readonly button: HTMLButtonElement;
    private readonly errorMessages: HTMLElement;

    private readonly result: HTMLElement;

    public constructor(id: string, defaultInputText: string, callback: Callback) {
        this.idInUrl = `input_${id}`;

        this.callback = callback;

        this.container = document.createElement("section");

        this.input = document.createElement("div");
        this.input.className = "section input";
        this.input.contentEditable = "true";
        this.container.appendChild(this.input);

        this.actionSection = document.createElement("div");
        {
            this.actionSection.className = "action-section";

            this.button = document.createElement("button");
            this.button.className = "action-button";
            this.button.textContent = "Transform";
            this.button.addEventListener("click", () => this.process());
            this.actionSection.appendChild(this.button);

            this.errorMessages = document.createElement("div");
            this.errorMessages.className = "error-messages";
            this.actionSection.appendChild(this.errorMessages);
        }

        this.container.appendChild(this.actionSection);

        this.result = document.createElement("div");
        this.result.className = "section result";
        this.container.appendChild(this.result);

        const inputTextFromUrl = Url.getValue(this.idInUrl);
        let inputText = defaultInputText;
        if (inputTextFromUrl) {
            inputText = inputTextFromUrl;
        }
        this.input.textContent = inputText;

        this.input.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                this.process();
                event.preventDefault();
            }
        });
    }

    public process(): void {
        const input = this.input.textContent;
        let result = null as string | DocumentFragment | null;
        if (!input) {
            this.setErrorMessage("");
            return;
        } else {
            Url.setValue(this.idInUrl, input);

            try {
                result = this.callback(input);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    this.setErrorMessage(error.message);
                } else {
                    this.setErrorMessage(`Unknown error: ${error}`);
                }
            }
        }

        this.result.innerHTML = "";
        if (typeof result === "string") {
            this.result.innerText = result;
        } else if (result instanceof DocumentFragment) {
            this.result.appendChild(result);
        }
    }

    private setErrorMessage(message: string): void {
        this.errorMessages.textContent = message;
    }

    public get visible(): boolean {
        return this.container.style.display !== "none";
    }

    public set visible(visible: boolean) {
        if (visible) {
            this.process();
        }
        this.container.style.display = visible ? "" : "none";
    }

    public appendMiddleElement(element: HTMLElement): void {
        this.actionSection.appendChild(element);
    }

    public get outputText(): string {
        return this.result.textContent || "";
    }

    public set inputText(input: string) {
        this.input.textContent = input;
        if (this.visible) {
            this.process();
        }
    }
}

export {
    Section,
};

