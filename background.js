chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveFilteredCountries") {
      chrome.storage.local.set({ filteredCountries: request.filteredCountries });
    }
  
    if (request.action === "getFilteredCountries") {
      chrome.storage.local.get("filteredCountries", (result) => {
        sendResponse({ filteredCountries: result.filteredCountries || [] });
      });
    }
  
    return true;
  });
  