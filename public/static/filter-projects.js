chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCountryList") {
    const countries = [
      ...document.querySelectorAll(
        "[data-test='client-country'], .client-location"
      ),
    ].map((el) => el.textContent.trim());
    const uniqueCountries = [...new Set(countries)];
    chrome.runtime.sendMessage({ countries: uniqueCountries });
  }
  if (request.action === "filterProjects") {
    [
      ...document.querySelectorAll(
        "[data-test='client-country'], .client-location"
      ),
    ].map((el) => {
      if (el.textContent.trim() == request.country) {
        el.closest(".up-card-section, .job-tile").style.display =
          request.checked ? "block" : "none";
      }
    });
  }
});

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      chrome.runtime &&
        chrome.runtime.sendMessage(
          {
            type: "COUNTRY_STORED",
          },
          (countries) => {
            console.log(countries, "getCountry from filter-projects");
            for (const country in countries) {
              console.log(country, countries[country]);

              [
                ...document.querySelectorAll(
                  "[data-test='client-country'], .client-location"
                ),
              ].map((el) => {
                if (el.textContent.trim() == country) {
                  el.closest(".up-card-section, .job-tile").style.display =
                    countries[country] ? "block" : "none";
                }
              });
            }
          }
        );
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });