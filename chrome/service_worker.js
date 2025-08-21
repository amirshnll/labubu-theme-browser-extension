async function applyTheme(imagePath) {
    try {
        await chrome.storage.sync.set({ selected: imagePath });
        console.log('Theme saved:', imagePath);
    } catch (error) {
        console.error('Error applying theme:', error);
    }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get({ selected: "images/labubu-01.jpg" }, ({ selected }) => {
        applyTheme(selected);
    });

    chrome.tabs.create({
        url: chrome.runtime.getURL('options.html')
    });
});

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.sync.get({ selected: "images/labubu-01.jpg" }, ({ selected }) => {
        applyTheme(selected);
    });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "APPLY_THEME" && msg.path) {
        applyTheme(msg.path).then(() => {
            sendResponse({ success: true });
        });
        return true;
    }
});
