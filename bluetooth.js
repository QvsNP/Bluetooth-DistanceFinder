const pty = require('node-pty');
const { spawn } = require('child_process');
const fs = require('fs');
let devices = new Map();

const ptyProcess = pty.spawn('bluetoothctl', ['scan', 'on'], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
});

ptyProcess.on('data', (data) => {
    const output = (data.toString('utf8'));
    console.log(`Output: ${output}`);

    const newDeviceRegex = /\[.*NEW.*\] Device ([\w:]+) (.+)/;
    const changeDeviceRegex = /\[.*CHG.*\] Device ([\w:]+) (.+)/;
    const delDeviceRegex = /\[.*DEL.*\] Device ([\w:]+) (.+)/;
    let match = output.match(newDeviceRegex);

    if (!match) {
        match = output.match(changeDeviceRegex);
    }
    if (!match) {
        match = output.match(delDeviceRegex);
        if(match) {
            // console.log(`Device ${match[1]} disappeared`);

            return;
        }
    }

    if (match) {
        const id = match[1];
        // console.log(`Device ID: ${id}`);
        const name = match[2];
        console.log(`Device ID: ${id}, Name: ${name}`);


        // Run bluetoothctl info <device_id> to get more information about the device
        const infoProcess = spawn('bluetoothctl', ['info', id]);

        infoProcess.stdout.on('data', (infoData) => {
            const infoOutput = (infoData.toString('utf8'));
            // console.log(`Device Info: ${infoOutput}`);

            // Extract RSSI value from the device info
            const rssiRegex = /RSSI:\s*(-?\d+)/;
            const rssiMatch = infoOutput.match(rssiRegex);

            // Extract TxPower value from the device info
            const txPowerRegex = /TxPower:\s*(-?\d+)/;
            const txPowerMatch = infoOutput.match(txPowerRegex);

            if (rssiMatch) {
                const rssi = parseInt(rssiMatch[1], 10);
                // const txPower = parseInt(txPowerMatch[1], 10);
                const txPower = -59; // Default TxPower value
                const distance = estimateDistance(rssi, txPower);
                if (devices.has(id)) {
                    const distances = devices.get(id);
                    const previousDistance = distances[distances.length - 1].distance;
                    distances.push({ distance, timestamp: new Date() });
                    devices.set(id, distances);

                    if (distance < previousDistance) {
                        console.log(`Device ${id} is moving closer. Distance: ${distance} meters`);
                    } else if (distance > previousDistance) {
                        console.log(`Device ${id} is moving further away. Distance: ${distance} meters`);
                    } else {
                        console.log(`Device ${id} is at the same distance. Distance: ${distance} meters`);
                    }
                } else {
                    console.log(`Device ${id} is ${distance} meters away`);
                    devices.set(id, [{ distance, timestamp: new Date() }]);
                }


            } else {
                console.log('RSSI or TxPower value not found in device info');
            }

            // Collect all device data
            let deviceDataArray = [];
            devices.forEach((value, key) => {
                deviceDataArray.push({ 
                    name: key, 
                    distances: value.map(entry => ({ distance: entry.distance, timestamp: entry.timestamp }))
                });
            });

            // Convert the array to a JSON string
            let deviceDataJson = JSON.stringify(deviceDataArray, null, 2);

            // Write the JSON string to file
            fs.writeFile('data.json', deviceDataJson, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                }
            });
        });

        infoProcess.stderr.on('data', (infoError) => {
            const errorOutput = (infoError.toString('utf8'));
            console.error(`Error: ${errorOutput}`);
        });

        infoProcess.on('close', (infoCode) => {
            // console.log(`Info process exited with code ${infoCode}`);
        });
    }
});

function estimateDistance(rssi, txPower) {
    if (rssi === 0) {
        return -1.0; // if we cannot determine distance
    }

    const ratio = (txPower - rssi) / 20.0;
    const distance = Math.pow(10, ratio);
    return distance;
}