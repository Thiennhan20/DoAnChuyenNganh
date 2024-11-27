document.getElementById('multi-play-button').addEventListener('click', startMultiplayerGame);
document.getElementById('multi-play-button').addEventListener('click', () => {
    document.getElementById('player-name').value = username;
});

window.addEventListener('click', startMusicOnFirstInteraction);
window.addEventListener('keydown', startMusicOnFirstInteraction);

document.addEventListener("DOMContentLoaded", function() {
    const settingsButton = document.getElementById('bottom-left').querySelector('.btn-icon');
    const settingsMenu = document.getElementById('settings-menu');
    const closeSettingsButton = document.getElementById('close-settings');
    
    settingsButton.addEventListener('click', () => {
        console.log("Settings button clicked");
        settingsMenu.classList.add('active');
        settingsMenu.classList.remove('hidden');
    });
    
    
    closeSettingsButton.addEventListener('click', () => {
        settingsMenu.classList.remove('active');
        setTimeout(() => settingsMenu.classList.add('hidden'), 500); // Hide after animation
    });
});


const multicanvas = document.getElementById('MultigameCanvas');
const multictx = multicanvas.getContext('2d');


function startMultiplayerGame() {
    multicanvas.width = window.innerWidth;
    multicanvas.height = window.innerHeight;
}
