import {
  copyResultsToClipboard,
  updatePopupWithResults,
  extractEntryNamesAndLabels,
  hideElement,
  showElement,
} from "../utils/helper.js";

document.addEventListener("DOMContentLoaded", function () {
  const extractButton = document.getElementById("extract");
  const copyActionButton = document.getElementById("copy-action");
  const copyResultsButton = document.getElementById("copy-results");
  const validation = document.getElementById("validation-message");
  const copyStatus = document.getElementById("copyStatus");

  extractButton.addEventListener("click", async () => {
    try {
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (
        tab.url.startsWith("https://docs.google.com/forms") &&
        tab.url.includes("viewform")
      ) {
        let currentPageUrl = tab.url.replace("viewform", "formResponse");

        showElement(copyActionButton);

        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            function: extractEntryNamesAndLabels,
          },
          (injectionResults) => {
            if (injectionResults && injectionResults.length > 0) {
              updatePopupWithResults(injectionResults[0].result);
              showElement(copyResultsButton);
            }
          }
        );

        copyActionButton.addEventListener("click", () => {
          navigator.clipboard
            .writeText(`action="${currentPageUrl}"`)
            .then(() => {
              if (copyStatus) {
                copyStatus.textContent = "Copied!";
                showElement(copyStatus);
                setTimeout(() => {
                  hideElement(copyStatus);
                }, 1000);
              }
            })
            .catch((err) => {
              console.error("Failed to copy action URL: ", err);
            });
        });
      } else {
        hideElement(extractButton);
        hideElement(copyResultsButton);
        hideElement(copyActionButton);
        validation.textContent = "This extension only works with Google Forms";
        showElement(validation);
      }
    } catch (error) {
      console.error("Error fetching active tab: ", error);
    }
  });

  copyResultsButton.addEventListener("click", () => {
    copyResultsToClipboard();
  });
});
