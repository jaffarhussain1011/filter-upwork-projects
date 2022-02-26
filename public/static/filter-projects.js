chrome.runtime.onMessage.addListener(
     (request, sender, sendResponse) => {
        if (request.action === "getCountryList") {
            let countries = [...document.querySelectorAll("[data-test='client-country']")].map(el => el.textContent.trim())
            countries = [...new Set(countries)];
            chrome.runtime.sendMessage({countries: countries});
        }
    }
);
