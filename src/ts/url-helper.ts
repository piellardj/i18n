function getValue(key: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
}

function setValue(key: string, value: string): void {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(key, value);

    const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${urlParams}`;
    window.history.replaceState("", "", url);
}

export {
    getValue,
    setValue,
};

