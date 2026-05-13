// --- UI Elements ---
const statusIndicator = document.getElementById('connection-status');
const alertBanner = document.getElementById('alert-banner');
const horizonBall = document.querySelector('.horizon-ball');

const elAlt = document.getElementById('val-altitude');
const elPres = document.getElementById('val-pressure');
const elTemp = document.getElementById('val-temp');
const elHum = document.getElementById('val-humidity');
const elPitch = document.getElementById('val-pitch');
const elRoll = document.getElementById('val-roll');

// --- UI Update Functions (Triggered by backend.js) ---

function updateConnectionStatus(isConnected) {
    if (isConnected) {
        statusIndicator.classList.add('connected');
    } else {
        statusIndicator.classList.remove('connected');
    }
}

function updateDashboard(data) {
    // 1. Inject Data into HTML
    elAlt.innerText = (data.altitude || 0).toFixed(1);
    elPres.innerText = (data.pressure || 0).toFixed(1);
    elTemp.innerText = (data.temperature || 0).toFixed(1);
    elHum.innerText = (data.humidity || 0).toFixed(1);

    elPitch.innerText = data.pitchDeg.toFixed(1);
    elRoll.innerText = data.rollDeg.toFixed(1);

    // 2. Manipulate CSS for Visual Animations
    horizonBall.style.transform = `rotate(${data.rollDeg}deg) translateY(${data.pitchDeg * 2}px)`;

    // 3. Visual UI Logic for Warnings
    if (data.error && data.error.length > 0) {
        alertBanner.innerText = "HARDWARE ERROR: " + data.error;
        alertBanner.classList.remove('hidden');
        alertBanner.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
        alertBanner.style.color = '#ffffff';
    } else if (data.alert) {
        alertBanner.innerText = "⚠️ CRITICAL TILT DETECTED ⚠️";
        alertBanner.classList.remove('hidden');
    } else {
        alertBanner.classList.add('hidden');
    }
}
