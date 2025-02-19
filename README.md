# Bluetooth-DistanceFinder
Bluetooth-DistanceFinder is a Node.js application that leverages the Bluetooth command-line tool bluetoothctl to scan for nearby Bluetooth devices and estimate their distances in real-time. The tool listens for device events, parses characteristic data (such as RSSI and TxPower), and computes an approximate distance using a logarithmic model.
