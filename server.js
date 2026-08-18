// ============================================================
//  Multiplayer Server — Explore & Build 3D
//  Run: node server.js
//  Then open http://localhost:3000 on this laptop
//  Other players connect to http://YOUR_LAPTOP_IP:3000
// ============================================================

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (game.js, index.html, style.css)
app.use(express.static(path.join(__dirname)));

// --- Server world state ---
const WORLD_SEED = Math.floor(Math.random() * 1000000);
const players = {}; // socket.id -> { id, name, x, z, y, rotation, health, energy, inventory, selectedSlot }
const worldChanges = {
    harvestedResources: {}, // "tx,ty" -> { resource, respawnTimer }
    placedBuildings: {},    // "tx,ty" -> { type, buildingData }
    removedResources: new Set(), // "tx,ty" tiles where resource was foraged
};

console.log(`World seed: ${WORLD_SEED}`);

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Send world seed and current world state to new player
    socket.emit('worldInit', {
        seed: WORLD_SEED,
        players: Object.values(players).map(p => ({
            id: p.id, name: p.name, x: p.x, z: p.z, y: p.y,
            rotation: p.rotation, health: p.health, energy: p.energy
        })),
        worldChanges: {
            harvestedResources: worldChanges.harvestedResources,
            placedBuildings: worldChanges.placedBuildings,
            removedResources: [...worldChanges.removedResources],
        }
    });

    // New player joins
    socket.on('playerJoin', (data) => {
        players[socket.id] = {
            id: socket.id,
            name: data.name || 'Player',
            x: data.x, z: data.z, y: data.y,
            rotation: data.rotation || 0,
            health: 100, energy: 100,
            inventory: {}, selectedSlot: 0
        };
        // Tell everyone about the new player
        io.emit('playerJoined', {
            id: socket.id,
            name: players[socket.id].name,
            x: data.x, z: data.z, y: data.y,
            rotation: data.rotation || 0
        });
        console.log(`Player ${players[socket.id].name} joined at (${data.x}, ${data.z})`);
    });

    // Player position update (broadcast to others)
    socket.on('playerMove', (data) => {
        if (!players[socket.id]) return;
        const p = players[socket.id];
        p.x = data.x; p.z = data.z; p.y = data.y;
        p.rotation = data.rotation;
        p.health = data.health;
        p.energy = data.energy;
        // Broadcast to all other players
        socket.broadcast.emit('playerMoved', {
            id: socket.id,
            x: data.x, z: data.z, y: data.y,
            rotation: data.rotation,
            health: data.health, energy: data.energy
        });
    });

    // Player harvested a resource — broadcast to others
    socket.on('resourceHarvested', (data) => {
        const key = `${data.tx},${data.ty}`;
        worldChanges.harvestedResources[key] = {
            resource: data.resource,
            respawnTimer: data.respawnTime || 60
        };
        socket.broadcast.emit('resourceHarvested', data);
    });

    // Player foraged a resource — broadcast to others
    socket.on('resourceForaged', (data) => {
        const key = `${data.tx},${data.ty}`;
        worldChanges.removedResources.add(key);
        worldChanges.harvestedResources[key] = {
            resource: data.resource,
            respawnTimer: data.respawnTime || 60
        };
        socket.broadcast.emit('resourceForaged', data);
    });

    // Resource respawned — broadcast to all
    socket.on('resourceRespawned', (data) => {
        const key = `${data.tx},${data.ty}`;
        delete worldChanges.harvestedResources[key];
        worldChanges.removedResources.delete(key);
        io.emit('resourceRespawned', data);
    });

    // Player placed a building — broadcast to others
    socket.on('buildingPlaced', (data) => {
        const key = `${data.tx},${data.ty}`;
        worldChanges.placedBuildings[key] = {
            type: data.buildingType,
            buildingData: data.buildingData
        };
        socket.broadcast.emit('buildingPlaced', data);
    });

    // Player attacked a creature — broadcast to others
    socket.on('creatureAttacked', (data) => {
        socket.broadcast.emit('creatureAttacked', data);
    });

    // Player damaged by creature — broadcast to others (for visual feedback)
    socket.on('playerDamaged', (data) => {
        socket.broadcast.emit('playerDamaged', { id: socket.id, ...data });
    });

    // Chat message
    socket.on('chatMessage', (data) => {
        io.emit('chatMessage', { id: socket.id, name: players[socket.id]?.name || 'Player', message: data.message });
    });

    // Disconnect
    socket.on('disconnect', () => {
        if (players[socket.id]) {
            console.log(`Player disconnected: ${players[socket.id].name}`);
            delete players[socket.id];
            io.emit('playerLeft', { id: socket.id });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🎮 Explore & Build 3D server running!`);
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   Network: http://YOUR_LAPTOP_IP:${PORT}`);
    console.log(`   Press Ctrl+C to stop\n`);
});
