import { hideElement, showElement } from "../utils/ui.js";
import { copyResultsToClipboard, updatePopupResults } from "./popupHelpers.js";

chrome.runtime.onMessage.addListener(function (message) {
  if (message.entries) {
    updatePopupResults(message.entries);
  }
});

document.addEventListener("DOMContentLoaded", setupEventListeners);

function setupEventListeners() {
  const extractButton = document.getElementById("extract");
  const copyActionButton = document.getElementById("copy-action");
  const copyResultsButton = document.getElementById("copy-results");

  extractButton.addEventListener("click", handleExtractClick);
  copyActionButton.addEventListener("click", handleCopyActionClick);
  copyResultsButton.addEventListener("click", copyResultsToClipboard);
}

async function handleExtractClick() {
  try {
    const tab = await getActiveTab();

    if (isValidGoogleFormsUrl(tab.url)) {
      prepareUIForExtraction();
      injectAndExecuteScript(tab);
    } else {
      displayInvalidUrlMessage();
    }
  } catch (error) {
    console.error("Error fetching active tab: ", error);
  }
}

async function handleCopyActionClick() {
  try {
    const currentPageUrl = await getCurrentPageUrl();
    navigator.clipboard
      .writeText(`action="${currentPageUrl}"`)
      .then(displayCopySuccessMessage)
      .catch((err) => console.error("Failed to copy action URL: ", err));
  } catch (error) {
    console.error("Error in handleCopyActionClick: ", error);
  }
}

async function getActiveTab() {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tab;
}

function isValidGoogleFormsUrl(url) {
  return (
    url.startsWith("https://docs.google.com/forms") && url.includes("viewform")
  );
}

function prepareUIForExtraction() {
  const copyActionButton = document.getElementById("copy-action");
  const copyResultsButton = document.getElementById("copy-results");
  const copyFormButton = document.getElementById("copy-form");
  showElement(copyActionButton);
  showElement(copyResultsButton);
  showElement(copyFormButton);
}

function injectAndExecuteScript(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["/scripts/formExtractor.js"],
  });
}

function displayInvalidUrlMessage() {
  const extractButton = document.getElementById("extract");
  const copyResultsButton = document.getElementById("copy-results");
  const copyActionButton = document.getElementById("copy-action");
  const validation = document.getElementById("validation-message");

  hideElement(extractButton);
  hideElement(copyResultsButton);
  hideElement(copyActionButton);
  validation.textContent = "This extension only works with Google Forms";
  showElement(validation);
}

async function getCurrentPageUrl() {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tab.url.replace("viewform", "formResponse");
}

function displayCopySuccessMessage() {
  const copyStatus = document.getElementById("copyStatus");
  if (copyStatus) {
    copyStatus.textContent = "Copied!";
    showElement(copyStatus);
    setTimeout(() => {
      hideElement(copyStatus);
    }, 1000);
  }
}
