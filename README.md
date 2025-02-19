# Bluetooth-DistanceFinder

Bluetooth-DistanceFinder is a Node.js application that leverages the Bluetooth command-line tool `bluetoothctl` to scan for nearby Bluetooth devices and estimate their distances in real-time. The tool uses the `node-pty` module to interact with `bluetoothctl`, listens for device events, parses characteristic data such as RSSI (Received Signal Strength Indicator) and TxPower (Transmit Power), and computes an approximate distance using a logarithmic model. It logs the device ID, name, and estimated distance, and tracks whether devices are moving closer, further away, or staying at the same distance. All device data, including distances and timestamps, are stored in a JSON file (`data.json`) for further analysis.

## Key Features

- **Real-Time Scanning**: Continuously scans for Bluetooth devices using `bluetoothctl scan on`.
- **Distance Estimation**: Calculates approximate distances based on RSSI and TxPower using a logarithmic formula.
- **Device Tracking**: Monitors movement trends (closer, further, or stationary) for detected devices.
- **Data Persistence**: Stores device information, including distances and timestamps, in a JSON file.
- **Event-Driven**: Responds to new, changed, or deleted device events from `bluetoothctl`.

## Technologies Used

- **Node.js**: Core runtime environment.
- **`node-pty`**: Spawns and interacts with the `bluetoothctl` process.
- **`child_process`**: Executes `bluetoothctl info` commands to retrieve device details.
- **File System**: Manages data storage in `data.json`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
