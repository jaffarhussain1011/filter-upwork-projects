chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.action === "getCountryList") {
            let countries = [...document.querySelectorAll("[data-test='client-country']")].map(el => el.textContent.trim())
            countries = [...new Set(countries)];
            chrome.runtime.sendMessage({ countries: countries });
        }
        if (request.action === "filterProjects") {
            // console.log(request)
            [...document.querySelectorAll("[data-test='client-country']")].map(el => {
                if (el.textContent.trim() == request.country) {
                    if (request.checked) {
                        el.closest(".up-card-section").style.display = "block";
                    } else {
                        el.closest(".up-card-section").style.display = "none";
                    }
                }
            })
        }
    }
);
