Project Overview
Bluetooth-DistanceFinder is a Node.js application designed to scan for nearby Bluetooth devices and estimate their distances in real-time. It leverages the bluetoothctl command-line tool and the node-pty module to interact with Bluetooth hardware, parsing key data like RSSI (Received Signal Strength Indicator) and TxPower (Transmit Power) to compute approximate distances using a logarithmic model. The project logs device IDs, names, and estimated distances, tracking whether devices are moving closer, further away, or staying stationary. All data, including timestamps, is stored in a data.json file for further analysis.
Key Features
Real-Time Scanning: Continuously scans for devices using bluetoothctl scan on.
Distance Estimation: Calculates distances based on RSSI and TxPower with a logarithmic formula.
Device Tracking: Monitors movement trends (closer, further, or stationary).
Data Persistence: Saves device information, including distances and timestamps, in a JSON file.
Event-Driven: Responds to device events like new, changed, or deleted devices.
Technologies Used
The project relies on:
Node.js as the runtime environment.
node-pty for spawning and interacting with bluetoothctl.
child_process for executing bluetoothctl info commands.
File System module for managing data storage in data.json.
