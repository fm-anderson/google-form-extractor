import { hideElement, showElement } from "../utils/ui.js";

export function updatePopupResults(entries) {
  const resultsElement = document.getElementById("results");
  const copyButton = document.getElementById("copy");

  if (resultsElement) {
    resultsElement.innerHTML = "";
    entries.forEach((entry) => {
      const entryElement = document.createElement("p");
      entryElement.textContent = `${entry.label}: ${entry.name}`;
      resultsElement.appendChild(entryElement);
    });

    if (entries.length > 0 && copyButton) {
      showElement(copyButton);
    }
  } else {
    console.error("No form data found on this page");
  }
}

export function copyResultsToClipboard() {
  const resultsElement = document.getElementById("results");

  if (resultsElement) {
    let textToCopy = "";
    const entries = resultsElement.querySelectorAll("p");
    entries.forEach((entry, index) => {
      textToCopy +=
        entry.textContent + (index < entries.length - 1 ? "\n" : "");
    });
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        const copyStatus = document.getElementById("copyStatus");
        if (copyStatus) {
          copyStatus.textContent = "Copied!";
          showElement(copyStatus);
          setTimeout(() => {
            hideElement(copyStatus);
          }, 1000);
        }
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  } else {
    console.error("No results to copy");
  }
}
