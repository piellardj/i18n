class Section {
    public readonly container: HTMLElement;

    public readonly onActionCallbacks: VoidFunction[] = [];

    private readonly input: HTMLElement;
    private readonly button: HTMLButtonElement;
    private readonly errorMessages: HTMLElement;
    private readonly result: HTMLElement;

    public constructor() {
        this.container = document.createElement("section");

        this.input = document.createElement("div");
        this.input.className = "section input";
        this.input.contentEditable = "true";
        this.container.appendChild(this.input);

        const actionSection = document.createElement("div");
        {
            actionSection.className = "action-section";

            this.button = document.createElement("button");
            this.button.className = "action-button";
            this.button.textContent = "Transform";
            this.button.addEventListener("click", () => {
                for (const callback of this.onActionCallbacks) {
                    callback();
                }
            });
            actionSection.appendChild(this.button);

            this.errorMessages = document.createElement("div");
            this.errorMessages.className = "error-messages";
            actionSection.appendChild(this.errorMessages);
        }

        this.container.appendChild(actionSection);

        this.result = document.createElement("div");
        this.result.className = "section result";
        this.container.appendChild(this.result);
    }

    public setErrorMessage(message: string): void {
        this.errorMessages.textContent = message;
    }

    public getInput(): string | null {
        return this.input.textContent;
    }

    public setResult(output: string): void {
        this.result.textContent = output;
    }
}

export {
    Section,
};

