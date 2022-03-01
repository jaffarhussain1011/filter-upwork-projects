chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.action === "getCountryList") {
            let countries = [...document.querySelectorAll("[data-test='client-country'],.client-location")].map(el => el.textContent.trim())
            countries = [...new Set(countries)];
            chrome.runtime.sendMessage({ countries: countries });
        }
        if (request.action === "filterProjects") {
            // console.log(request)
            [...document.querySelectorAll("[data-test='client-country'],.client-location")].map(el => {
                if (el.textContent.trim() == request.country) {
                    if (request.checked) {
                        // [data-job-tile='::job']
                        el.closest(".up-card-section,.job-tile").style.display = "block";
                    } else {
                        el.closest(".up-card-section,.job-tile").style.display = "none";
                    }
                }
            })
        }
    }
);
