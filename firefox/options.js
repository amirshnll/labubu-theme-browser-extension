const grid = document.getElementById('grid');

let availableImages = [];

browser.storage.sync.get({ selected: 'images/labubu-01.jpg' }).then(result => {
    const currentSelected = result.selected;

    fetch('images/images.json')
        .then(response => response.json())
        .then(data => {
            availableImages = data.images || [];
            render(currentSelected);
        })
        .catch(error => {
            console.error('Error loading images.json:', error);
            availableImages = [];
            render(currentSelected);
        });
}).catch(error => {
    console.error('Error getting storage:', error);
});

function path(filename) { return `images/${filename}`; }

function select(path, card) {
    browser.runtime.sendMessage({ type: 'APPLY_THEME', path });
    browser.storage.sync.set({ selected: path });

    document.querySelectorAll('.card.selected').forEach(el => {
        el.classList.remove('selected');
        const activeLabel = el.querySelector('.active-label');
        if (activeLabel) {
            activeLabel.remove();
        }
    });

    card.classList.add('selected');

    const label = document.createElement('div');
    label.className = 'active-label';
    label.textContent = 'Active';
    label.style.cssText = `
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        background: #007bff;
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        z-index: 10;
    `;
    card.style.position = 'relative';
    card.appendChild(label);
}

function render(selected) {
    grid.innerHTML = '';

    availableImages.forEach((filename, index) => {
        const imagePath = path(filename);
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'card';

        // Check if this image is selected
        if (selected === imagePath) {
            card.classList.add('selected');
        }

        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Labubu #${index + 1}`;
        img.loading = 'lazy';

        card.appendChild(img);

        if (selected === imagePath) {
            const label = document.createElement('div');
            label.className = 'active-label';
            label.textContent = 'Active';
            label.style.cssText = `
                position: absolute;
                bottom: 8px;
                left: 50%;
                transform: translateX(-50%);
                background: #007bff;
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
                z-index: 10;
            `;
            card.style.position = 'relative';
            card.appendChild(label);
        }

        card.addEventListener('click', () => select(imagePath, card));
        grid.appendChild(card);
    });
}
