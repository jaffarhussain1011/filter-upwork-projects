// console.log("from background.")
chrome.runtime.onMessage.addListener((request, sender, reply) => {
  if (request.type === "COUNTRY_STORE") {
    chrome.storage.local.set({
      [request.data.country]: request.data.checked,
    });
    chrome.storage.local.get().then((data) => {
      console.log(data, "from country store first");
    });
    reply({});
  }

  if (request.type === "COUNTRY_STORED") {
    chrome.storage.local.get().then((data) => {
      console.log(data, "country stored background");
      reply(data);
    });
  }

  return true;
});
