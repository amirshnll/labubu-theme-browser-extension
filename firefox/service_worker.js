function applyTheme(imagePath) {
    try {
        browser.storage.sync.set({ selected: imagePath });
        console.log('Theme saved:', imagePath);
    } catch (error) {
        console.error('Error applying theme:', error);
    }
}

browser.runtime.onInstalled.addListener(() => {
    browser.storage.sync.get({ selected: "images/labubu-01.jpg" }, function (result) {
        const selected = result.selected || "images/labubu-01.jpg";
        applyTheme(selected);
    });

    browser.tabs.create({
        url: browser.runtime.getURL('options.html')
    });
});

browser.runtime.onStartup.addListener(() => {
    browser.storage.sync.get({ selected: "images/labubu-01.jpg" }, function (result) {
        const selected = result.selected || "images/labubu-01.jpg";
        applyTheme(selected);
    });
});

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "APPLY_THEME" && msg.path) {
        applyTheme(msg.path);
        sendResponse({ success: true });
        return true;
    }
});
