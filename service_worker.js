const ext = self.browser || self.chrome;

function getStorage(defaults) {
    return new Promise((resolve) => {
        const result = ext.storage.sync.get(defaults, (value) => {
            resolve(value);
        });

        if (result && typeof result.then === 'function') {
            result.then(resolve);
        }
    });
}

function setStorage(items) {
    try {
        const result = ext.storage.sync.set(items, () => {});
        if (result && typeof result.then === 'function') {
            return result;
        }
    } catch (error) {
        console.error('Error applying theme:', error);
    }
    return Promise.resolve();
}

function applyTheme(imagePath) {
    setStorage({ selected: imagePath }).then(() => {
        console.log('Theme saved:', imagePath);
    }).catch(error => {
        console.error('Error applying theme:', error);
    });
}

ext.runtime.onInstalled.addListener(() => {
    getStorage({ selected: 'images/labubu-01.jpg' }).then(result => {
        const selected = result.selected || 'images/labubu-01.jpg';
        applyTheme(selected);
    });

    ext.tabs.create({
        url: ext.runtime.getURL('options.html')
    });
});

ext.runtime.onStartup.addListener(() => {
    getStorage({ selected: 'images/labubu-01.jpg' }).then(result => {
        const selected = result.selected || 'images/labubu-01.jpg';
        applyTheme(selected);
    });
});

ext.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'APPLY_THEME' && msg.path) {
        applyTheme(msg.path);
        sendResponse({ success: true });
        return true;
    }
});
