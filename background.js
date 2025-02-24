let blockedUrls = [];
const GITHUB_LIST_URL = "https://raw.githubusercontent.com/HeinzSchmidt/kidsblock/eac4da4c428fefb16b30256b5faca37b0caa6d94/streaming.json";
const WARNING_PAGE = browser.runtime.getURL("warning.html");

async function fetchBlockedUrls() {
  try {
    const response = await fetch(GITHUB_LIST_URL);
    if (response.ok) {
      blockedUrls = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch blocked URLs:", error);
  }
}

browser.alarms.create("updateBlockedUrls", { periodInMinutes: 60 });

browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateBlockedUrls") {
    fetchBlockedUrls();
  }
});

browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (blockedUrls.includes(details.url)) {
      return { redirectUrl: WARNING_PAGE };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

fetchBlockedUrls();
