import * as Url from "./url-helper";

type Callback = (input: string) => string;

class Section {
    public readonly container: HTMLElement;

    private readonly callback: Callback;

    private readonly input: HTMLElement;

    private readonly actionSection: HTMLElement;
    private readonly button: HTMLButtonElement;
    private readonly errorMessages: HTMLElement;

    private readonly result: HTMLElement;

    public constructor(id: string, defaultInputText: string, callback: Callback) {
        const idInUrl = `input_${id}`;

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
            this.button.addEventListener("click", () => {
                const input = this.input.textContent;
                let result = "";
                if (!input) {
                    this.setErrorMessage("");
                    return;
                } else {
                    Url.setValue(idInUrl, input);

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
                this.result.textContent = result;
            });
            this.actionSection.appendChild(this.button);

            this.errorMessages = document.createElement("div");
            this.errorMessages.className = "error-messages";
            this.actionSection.appendChild(this.errorMessages);
        }

        this.container.appendChild(this.actionSection);

        this.result = document.createElement("div");
        this.result.className = "section result";
        this.container.appendChild(this.result);

        const inputTextFromUrl = Url.getValue(idInUrl);
        let inputText = defaultInputText;
        if (inputTextFromUrl) {
            inputText = inputTextFromUrl;
        }
        this.input.textContent = inputText;
    }

    public setErrorMessage(message: string): void {
        this.errorMessages.textContent = message;
    }

    public set visible(visible: boolean) {
        this.container.style.display = visible ? "" : "none";
    }

    public appendMiddleElement(element: HTMLElement): void {
        this.actionSection.appendChild(element);
    }
}

export {
    Section,
};

