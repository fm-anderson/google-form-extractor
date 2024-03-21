function extractEntryNamesAndLabels() {
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

  chrome.runtime.sendMessage({ entries: entries });
}

extractEntryNamesAndLabels();
