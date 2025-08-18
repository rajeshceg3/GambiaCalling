document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    const attractionCards = document.querySelectorAll('.attraction-card');
    const detailPanels = document.querySelectorAll('.detail-panel');
    const closeButtons = document.querySelectorAll('.close-btn');
    let lastOpenedCard = null;
    let map = null;

    const locations = {
        'detail-kachikally': { coords: [13.4533, -16.6694], desc: 'Kachikally Crocodile Pool' },
        'detail-tanji': { coords: [13.3833, -16.7833], desc: 'Tanji Bird Reserve' },
        'detail-shores': { coords: [13.4667, -16.7167], desc: 'Golden Shores' },
        'detail-bijilo': { coords: [13.4167, -16.7333], desc: 'Bijilo Forest Park' },
        'detail-janjanbureh': { coords: [13.5333, -14.7667], desc: 'Janjanbureh' },
        'detail-wassu': { coords: [13.6833, -15.0333], desc: 'Wassu Stone Circles' },
        'detail-kunta': { coords: [13.3167, -16.4833], desc: 'Kunta Kinteh Island' },
        'detail-albert': { coords: [13.45, -16.5667], desc: 'Albert Market' }
    };

    function initMap(containerId, coords, description) {
        if (map) {
            map.remove();
        }
        map = L.map(containerId).setView(coords, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker(coords).addTo(map)
            .bindPopup(description)
            .openPopup();
    }

    // --- Open Detail View ---
    attractionCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);

            if (targetPanel) {
                lastOpenedCard = card;
                appContainer.classList.add('detail-view-active');
                targetPanel.classList.add('active');

                const location = locations[targetId];
                if (location) {
                    setTimeout(() => {
                        const mapId = 'map-' + targetId.split('-')[1];
                        initMap(mapId, location.coords, location.desc);
                    }, 400); // Delay to allow panel transition
                }
            }
        });
    });

    // --- Close Detail View ---
    function closeAllPanels() {
         appContainer.classList.remove('detail-view-active');
         detailPanels.forEach(panel => {
            panel.classList.remove('active');
        });

        // If a card was opened, reset the reference to it so it can be opened again.
        if (lastOpenedCard) {
            lastOpenedCard = null;
        }
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllPanels);
    });

    // Optional: Close with escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAllPanels();
        }
    });
});
