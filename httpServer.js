const http = require('http');
const fs = require('fs');
const path = require('path');

let vehicles = [
    { id: 1, vehicleName: "Hyundai Creta", vehicleNumber: "HR26AB1234", type: "SUV", price: 1500000 },
    { id: 2, vehicleName: "Honda City", vehicleNumber: "DL3CC9876", type: "Sedan", price: 1200000 },
    { id: 3, vehicleName: "Tata Nexon", vehicleNumber: "UP16XY5678", type: "SUV", price: 1300000 }
];

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    if (req.method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Vehicle Management HTTP Server</h1>');
    } 
    else if (req.method === 'GET' && pathname === '/vehicles') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(vehicles));
    } 
    else if (req.method === 'GET' && pathname === '/about') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ app: "Vehicle Management Application", version: "1.0.0" }));
    } 
    else if (req.method === 'GET' && pathname === '/info') {
        const filePath = path.join(__dirname, 'public', 'info.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error: File not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } 
    else if (req.method === 'POST' && pathname === '/add-vehicle') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const newVehicle = JSON.parse(body);
                const { id, vehicleName, vehicleNumber, type, price } = newVehicle;

                if (!id || !vehicleName || !vehicleNumber || !type || typeof price !== 'number' || price <= 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON or missing required fields' }));
                    return;
                }

                vehicles.push(newVehicle);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Vehicle added successfully', vehicle: newVehicle }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON format' }));
            }
        });
    } 
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});