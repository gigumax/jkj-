// OnlineManager — handles real-time multiplayer sync via Firestore
import {
    db, auth, collection, doc, setDoc, updateDoc, deleteDoc,
    onSnapshot, query, where, getDocs, serverTimestamp,
    addDoc, orderBy, limit, signInAnonymously, onAuthStateChanged
} from './firebase-init.js';

const THREE = window.THREE;

class OnlineManager {
    constructor(game) {
        this.game = game;
        this.uid = null;
        this.playerName = 'Player' + Math.floor(Math.random() * 1000);
        this.isOnline = false;
        this.otherPlayers = new Map(); // uid -> { data, mesh }
        this.unsubscribers = [];
        this.positionUpdateTimer = 0;
        this.positionUpdateInterval = 0.1; // 10 updates/sec
        this.worldSeed = null;
        this.chatUnsub = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    this.uid = user.uid;
                    resolve(user);
                }
            });
            signInAnonymously(auth).catch(reject);
        });
    }

    async joinGame(seed) {
        if (!this.uid) {
            const user = await this.init();
            this.uid = user.uid;
        }

        this.worldSeed = seed;
        this.isOnline = true;

        // Register self in players collection
        const playerRef = doc(db, 'players', this.uid);
        const playerData = {
            name: this.playerName,
            x: this.game.player.x,
            z: this.game.player.z,
            y: this.game.player.y,
            rotation: this.game.player.rotation,
            health: this.game.player.health,
            energy: this.game.player.energy,
            seed: seed,
            online: true,
            lastSeen: serverTimestamp()
        };
        await setDoc(playerRef, playerData);

        // Mark offline on page close/refresh
        window.addEventListener('beforeunload', () => {
            updateDoc(doc(db, 'players', this.uid), { online: false }).catch(() => {});
        });

        // Listen for other players with the same seed
        const playersQuery = query(collection(db, 'players'), where('seed', '==', seed), where('online', '==', true));
        const unsub = onSnapshot(playersQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const data = change.doc.data();
                const uid = change.doc.id;
                if (uid === this.uid) return;

                if (change.type === 'removed' || data.online === false) {
                    this.removeOtherPlayer(uid);
                } else {
                    this.updateOtherPlayer(uid, data);
                }
            });
        });
        this.unsubscribers.push(unsub);

        // Listen for world changes (harvested resources, buildings)
        const worldQuery = query(collection(db, 'worldChanges'), where('seed', '==', seed));
        const worldUnsub = onSnapshot(worldQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const data = change.doc.data();
                if (data.byUid === this.uid) return; // skip own changes

                if (change.type === 'added') {
                    this.handleWorldChange(data);
                } else if (change.type === 'removed') {
                    this.handleWorldRevert(data);
                }
            });
        });
        this.unsubscribers.push(worldUnsub);

        // Listen for chat messages
        const chatQuery = query(collection(db, 'chat'), where('seed', '==', seed), orderBy('timestamp', 'desc'), limit(20));
        this.chatUnsub = onSnapshot(chatQuery, (snapshot) => {
            snapshot.docChanges().reverse().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    if (data.uid === this.uid) return;
                    const msgType = data.type || 'text';
                    if (msgType === 'video' && data.frames && data.frames.length > 0) {
                        this.displayVideoInChat(data.name, data.frames);
                        this.game.notify(`[${data.name}] sent a video!`, 'chat');
                    } else {
                        this.game.notify(`[${data.name}]: ${data.message}`, 'chat');
                    }
                }
            });
        });
        this.unsubscribers.push(this.chatUnsub);
    }

    update(dt) {
        if (!this.isOnline || !this.game.player) return;

        this.positionUpdateTimer += dt;
        if (this.positionUpdateTimer >= this.positionUpdateInterval) {
            this.positionUpdateTimer = 0;
            const p = this.game.player;
            const playerRef = doc(db, 'players', this.uid);
            updateDoc(playerRef, {
                x: p.x,
                z: p.z,
                y: p.y,
                rotation: p.rotation,
                health: p.health,
                energy: p.energy,
                lastSeen: serverTimestamp()
            }).catch(() => {});
        }

        // Update other player meshes
        for (const [uid, info] of this.otherPlayers) {
            if (info.mesh) {
                // Smooth interpolation toward target position
                const targetX = info.data.x * window.TILE_SIZE;
                const targetZ = info.data.z * window.TILE_SIZE;
                const targetY = info.data.y;
                info.mesh.position.x += (targetX - info.mesh.position.x) * Math.min(1, dt * 8);
                info.mesh.position.z += (targetZ - info.mesh.position.z) * Math.min(1, dt * 8);
                info.mesh.position.y += (targetY - info.mesh.position.y) * Math.min(1, dt * 8);
                info.mesh.rotation.y += (info.data.rotation - info.mesh.rotation.y) * Math.min(1, dt * 8);
            }
        }
    }

    updateOtherPlayer(uid, data) {
        if (!this.otherPlayers.has(uid)) {
            // Create mesh for new player
            const mesh = window.ModelFactory.createPlayer();
            mesh.traverse(c => { if (c.isMesh) c.castShadow = true; });
            // Name tag
            const nameSprite = this.createNameTag(data.name || 'Player');
            mesh.add(nameSprite);
            mesh.position.set(data.x * window.TILE_SIZE, data.y, data.z * window.TILE_SIZE);
            this.game.scene.add(mesh);
            this.otherPlayers.set(uid, { data, mesh, nameSprite });
        } else {
            const info = this.otherPlayers.get(uid);
            info.data = data;
            if (info.nameSprite && info.nameSprite.material && info.nameSprite.material.map) {
                // Could update name if changed
            }
        }
    }

    removeOtherPlayer(uid) {
        const info = this.otherPlayers.get(uid);
        if (info && info.mesh) {
            this.game.scene.remove(info.mesh);
            info.mesh.traverse(c => {
                if (c.isMesh) {
                    c.geometry?.dispose();
                    c.material?.dispose();
                }
            });
        }
        this.otherPlayers.delete(uid);
    }

    createNameTag(name) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, 256, 64);
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, 128, 32);
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, depthTest: false });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(2, 0.5, 1);
        sprite.position.set(0, 2.5, 0);
        return sprite;
    }

    async sendWorldChange(type, data) {
        if (!this.isOnline) return;
        try {
            await addDoc(collection(db, 'worldChanges'), {
                type: type,
                seed: this.worldSeed,
                byUid: this.uid,
                byName: this.playerName,
                data: data,
                timestamp: serverTimestamp()
            });
        } catch (e) { /* ignore */ }
    }

    handleWorldChange(change) {
        const d = change.data;
        if (change.type === 'resourceHarvested') {
            const tile = this.game.world.getTile(d.tx, d.ty);
            if (tile) {
                tile.resource = null;
                this.game.removeResourceMesh(d.tx, d.ty);
            }
        } else if (change.type === 'buildingPlaced') {
            const tile = this.game.world.getTile(d.tx, d.ty);
            if (tile) {
                tile.building = d.buildingType;
                tile.buildingData = d.buildingData;
                this.game.addBuildingMesh(d.tx, d.ty, d.buildingType, d.buildingData);
            }
        } else if (change.type === 'resourceForaged') {
            const tile = this.game.world.getTile(d.tx, d.ty);
            if (tile) {
                tile.resource = null;
                this.game.removeResourceMesh(d.tx, d.ty);
            }
        }
    }

    handleWorldRevert(change) {
        const d = change.data;
        if (change.type === 'resourceRespawned') {
            const tile = this.game.world.getTile(d.tx, d.ty);
            if (tile) {
                tile.resource = d.resource;
                this.game.addResourceMesh(d.tx, d.ty, d.resource);
            }
        }
    }

    displayVideoInChat(name, frames) {
        const log = document.getElementById('mp-chat-log');
        if (!log) return;
        const div = document.createElement('div');
        div.className = 'chat-msg chat-video';
        const nameSpan = document.createElement('span');
        nameSpan.className = 'chat-name';
        nameSpan.textContent = `${name}: `;
        div.appendChild(nameSpan);
        const img = document.createElement('img');
        img.className = 'chat-video-img';
        img.src = frames[0];
        img.width = 200;
        div.appendChild(img);
        const label = document.createElement('div');
        label.className = 'chat-video-label';
        label.textContent = `▶ Video (${frames.length} frames)`;
        div.appendChild(label);
        log.appendChild(div);
        log.scrollTop = log.scrollHeight;
        // Animate frames
        let frameIdx = 0;
        const animate = () => {
            frameIdx = (frameIdx + 1) % frames.length;
            img.src = frames[frameIdx];
        };
        const intervalId = setInterval(animate, 250);
        div.dataset.intervalId = intervalId;
        // Stop animating after 30 seconds to save memory
        setTimeout(() => clearInterval(intervalId), 30000);
    }

    async sendChat(message) {
        if (!this.isOnline || !message.trim()) return;
        try {
            await addDoc(collection(db, 'chat'), {
                uid: this.uid,
                name: this.playerName,
                message: message.substring(0, 200),
                seed: this.worldSeed,
                type: 'text',
                timestamp: serverTimestamp()
            });
        } catch (e) { /* ignore */ }
    }

    async sendVideo(frames) {
        if (!this.isOnline || !frames || frames.length === 0) return;
        try {
            await addDoc(collection(db, 'chat'), {
                uid: this.uid,
                name: this.playerName,
                message: '[video]',
                seed: this.worldSeed,
                type: 'video',
                frames: frames,
                timestamp: serverTimestamp()
            });
            this.game.notify('Video sent to chat!', 'success');
        } catch (e) {
            this.game.notify('Failed to send video (too large?)', 'warning');
        }
    }

    async leave() {
        this.isOnline = false;
        for (const unsub of this.unsubscribers) {
            if (unsub) unsub();
        }
        this.unsubscribers = [];
        for (const [uid] of this.otherPlayers) {
            this.removeOtherPlayer(uid);
        }
        if (this.uid) {
            try {
                await updateDoc(doc(db, 'players', this.uid), { online: false });
            } catch (e) { /* ignore */ }
        }
    }

    getOnlineCount() {
        return this.otherPlayers.size + 1;
    }
}

// Export to window for non-module game.js
window.OnlineManager = OnlineManager;
export { OnlineManager };
