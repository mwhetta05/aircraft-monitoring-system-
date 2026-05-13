// --- Network Configuration ---
const brokerUrl = 'ws://broker.hivemq.com:8000/mqtt'; // HiveMQ public websocket
const topic = 'aircraft_monitor/telemetry/12345'; // Must match the ESP32!

// --- Connect to MQTT ---
console.log('Connecting to ' + brokerUrl);
const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
    console.log('Connected to MQTT Broker!');
    
    // Call function in frontend.js to update the visual dot
    if (typeof updateConnectionStatus === 'function') {
        updateConnectionStatus(true);
    }
    
    // Subscribe to our topic
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log('Successfully subscribed to: ' + topic);
        }
    });
});

client.on('offline', () => {
    // Call function in frontend.js to show disconnect
    if (typeof updateConnectionStatus === 'function') {
        updateConnectionStatus(false);
    }
});

// --- Handle Incoming Network Messages ---
client.on('message', (topic, message) => {
    try {
        // Parse the JSON string from ESP32
        const rawData = JSON.parse(message.toString());
        console.log('Received:', rawData);

        // Backend Math Calculation:
        // MPU6050 returns acceleration. x mapping to pitch, y mapping to roll approx.
        // For visual purposes, we multiply by 10 to get a degree-like value
        const processedData = {
            ...rawData,
            pitchDeg: (rawData.pitch || 0) * 10,
            rollDeg: (rawData.roll || 0) * -10
        };

        // Send the processed data to the Frontend UI function
        if (typeof updateDashboard === 'function') {
            updateDashboard(processedData);
        }

    } catch (e) {
        console.error('Error parsing message:', e);
    }
});
