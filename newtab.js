const ext = window.browser || window.chrome;

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
    const result = ext.storage.sync.set(items, () => {});
    if (result && typeof result.then === 'function') {
        return result;
    }
    return Promise.resolve();
}

document.addEventListener('DOMContentLoaded', function () {
    getStorage({ selected: 'images/labubu-01.jpg' }).then(result => {
        const imagePath = result.selected || 'images/labubu-01.jpg';
        console.log('Applying theme:', imagePath);

        const imageUrl = ext.runtime.getURL(imagePath);
        document.body.style.backgroundImage = `url('${imageUrl}')`;
    });

    ext.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'sync' && changes.selected) {
            const newImagePath = changes.selected.newValue;
            console.log('Theme changed to:', newImagePath);
            const imageUrl = ext.runtime.getURL(newImagePath);
            document.body.style.backgroundImage = `url('${imageUrl}')`;
        }
    });

    const searchBox = document.getElementById('search');
    searchBox.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const query = searchBox.value.trim();
            if (query) {
                if (ext.search && typeof ext.search.query === 'function') {
                    ext.search.query({
                        text: query,
                        disposition: 'CURRENT_TAB'
                    });
                } else {
                    const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(query);
                    window.location.href = searchUrl;
                }
            }
        }
    });

    searchBox.focus();

    const settingsLink = document.querySelector('.settings-link');
    settingsLink.href = ext.runtime.getURL('options.html');

    // Digital Clock functionality
    function updateClock() {
        const now = new Date();

        // Format time as HH:MM:SS
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;

        // Format date as Weekday, Month Day
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const weekday = weekdays[now.getDay()];
        const month = months[now.getMonth()];
        const day = now.getDate();
        const dateString = `${weekday}, ${month} ${day}`;

        // Update DOM elements
        document.getElementById('time').textContent = timeString;
        document.getElementById('date').textContent = dateString;
    }

    // Update clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
});