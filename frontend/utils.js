export function copy() {
    const selection = window.getSelection();
    if (!selection) {
        return false;
    }
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    return true;
}
