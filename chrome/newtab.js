document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get({ selected: 'images/labubu-01.jpg' }, function (result) {
        const imagePath = result.selected;
        console.log('Applying theme:', imagePath);

        const imageUrl = chrome.runtime.getURL(imagePath);
        document.body.style.backgroundImage = `url('${imageUrl}')`;
    });

    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'sync' && changes.selected) {
            const newImagePath = changes.selected.newValue;
            console.log('Theme changed to:', newImagePath);
            const imageUrl = chrome.runtime.getURL(newImagePath);
            document.body.style.backgroundImage = `url('${imageUrl}')`;
        }
    });

    const searchBox = document.getElementById('search');
    searchBox.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const query = searchBox.value.trim();
            if (query) {
                const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(query);
                window.location.href = searchUrl;
            }
        }
    });

    searchBox.focus();

    const settingsLink = document.querySelector('.settings-link');
    settingsLink.href = chrome.runtime.getURL('options.html');
});