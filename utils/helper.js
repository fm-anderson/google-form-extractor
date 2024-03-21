export function showElement(element) {
  element.classList.remove("hide");
  element.classList.add("show");
}

export function hideElement(element) {
  element.classList.remove("show");
  element.classList.add("hide");
}

export function updatePopupWithResults(entries) {
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
      copyButton.style.display = "block";
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
          copyStatus.style.display = "block";
          setTimeout(() => {
            copyStatus.style.display = "none";
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

export function extractEntryNamesAndLabels() {
  const inputElements = document.querySelectorAll('input[name^="entry."]');
  const divElements = document.querySelectorAll("div[data-params]");
  let entries = [];

  inputElements.forEach((input) => {
    const entryName = input.getAttribute("name");
    const entryIdMatch = entryName.match(/entry\.(\d+)/);
    if (entryIdMatch) {
      const entryId = entryIdMatch[1];

      divElements.forEach((div) => {
        const dataParams = div.getAttribute("data-params");
        if (dataParams && dataParams.includes(entryId)) {
          const labelSpan = div.querySelector("span");
          if (labelSpan) {
            const label = labelSpan.textContent;

            entries.push({
              name: entryName,
              label: label,
            });
          }
        }
      });
    }
  });

  return entries;
}
