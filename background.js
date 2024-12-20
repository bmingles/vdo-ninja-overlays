const extensions = "https://developer.chrome.com/docs/extensions";
const webstore = "https://developer.chrome.com/docs/webstore";

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

function addUserIds() {
  const data = document.querySelectorAll("video[data-sid]");

  data.forEach((datum) => {
    datum.parentElement.dataset.userid = datum.dataset.sid;
  });
}

chrome.action.onClicked.addListener(async (tab) => {
  // if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
  // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  // Next state will always be the opposite
  const nextState = prevState === "ON" ? "OFF" : "ON";

  console.log(`[TESTING] onClicked: ${prevState}, ${nextState}`);
  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === "ON") {
    // Insert the CSS file when the user turns the extension on
    await chrome.scripting.insertCSS({
      files: ["tab.css"],
      target: { tabId: tab.id },
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: addUserIds,
    });
  } else if (nextState === "OFF") {
    // Remove the CSS file when the user turns the extension off
    await chrome.scripting.removeCSS({
      files: ["tab.css"],
      target: { tabId: tab.id },
    });
  }
  // }
});
