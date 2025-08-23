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