document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("extract").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: extractEntryNames,
      },
      (injectionResults) => {
        if (injectionResults && injectionResults.length > 0) {
          updatePopupWithResults(injectionResults[0].result);
        }
      }
    );

    document.getElementById("copy").addEventListener("click", () => {
      copyResultsToClipboard();
    });
  });
});

function extractEntryNames() {
  const inputElements = document.querySelectorAll('input[name^="entry."]');
  let entryNames = [];
  inputElements.forEach((input) => {
    entryNames.push(input.getAttribute("name"));
  });
  return entryNames;
}

function updatePopupWithResults(entryNames) {
  const resultsElement = document.getElementById("results");
  const copyButton = document.getElementById("copy");

  if (resultsElement) {
    resultsElement.innerHTML = "";
    entryNames.forEach((name, index) => {
      const entryElement = document.createElement("p");
      entryElement.textContent = `field-${index + 1}: ${name}`;
      resultsElement.appendChild(entryElement);
    });

    if (entryNames.length > 0 && copyButton) {
      copyButton.style.display = "block";
    }
  } else {
    console.error('No element with ID "results" found in the popup');
  }
}

function copyResultsToClipboard() {
  const resultsElement = document.getElementById("results");
  const copyStatus = document.getElementById("copyStatus");

  if (resultsElement) {
    let textToCopy = "";
    const entries = resultsElement.querySelectorAll("p");
    entries.forEach((entry, index) => {
      textToCopy +=
        `field-${index + 1}: ${entry.textContent.split(": ")[1]}` +
        (index < entries.length - 1 ? "\n" : "");
    });
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
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
