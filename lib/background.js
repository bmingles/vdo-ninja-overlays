chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

/**
 * Copy any `data-sid` values from the video elements to their parent elements as
 * `data-userid` values. These are then targetted in tab.css to show username
 * overlays.
 */
function addUserIds() {
  const data = document.querySelectorAll("video[data-sid]");

  data.forEach((datum) => {
    datum.parentElement.dataset.userid = datum.dataset.sid;
  });
}

chrome.action.onClicked.addListener(async (tab) => {
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === "ON" ? "OFF" : "ON";

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === "ON") {
    await chrome.scripting.insertCSS({
      files: ["lib/tab.css"],
      target: { tabId: tab.id },
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: addUserIds,
    });
  } else if (nextState === "OFF") {
    await chrome.scripting.removeCSS({
      files: ["lib/tab.css"],
      target: { tabId: tab.id },
    });
  }
});
