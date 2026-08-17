// ============================================================
//  EXPLORE & BUILD 3D — Survival Technology Game
//  Three.js powered 3D edition
// ============================================================

// --- Constants ---
const TILE_SIZE = 4;       // 3D world units per tile
const WORLD_W = 100;
const WORLD_H = 100;
const PLAYER_SPEED = 8;
const PLAYER_HEIGHT = 1.8;
const INTERACT_RANGE = 6;

// --- Biome types ---
const BIOMES = {
    water:    { color: 0x1a5276, name: 'Water',    walkable: false, height: -0.5 },
    sand:     { color: 0xf4d68a, name: 'Beach',    walkable: true,  height: 0.2 },
    grass:    { color: 0x4a7c3a, name: 'Grass',    walkable: true,  height: 0.5 },
    forest:   { color: 0x2d5a1f, name: 'Forest',   walkable: true,  height: 0.6 },
    mountain: { color: 0x7f8c8d, name: 'Mountain', walkable: true,  height: 1.5 },
    snow:     { color: 0xd5dbdb, name: 'Snow',     walkable: true,  height: 1.8 },
    desert:   { color: 0xe6c878, name: 'Desert',   walkable: true,  height: 0.3 },
};

// --- Resource types ---
const RESOURCE_TYPES = {
    tree:    { icon: '🌲', name: 'Tree',    yields: { wood: 3 },       biome: ['forest','grass','sand','desert'], hardness: 1 },
    bush:    { icon: '🫐', name: 'Berry Bush', yields: { food: 2 }, biome: ['forest','grass'], hardness: 0, forage: true, forageType: 'edible' },
    red_mushroom:  { icon: '🍄', name: 'Red Mushroom', yields: { red_mushroom: 1 }, biome: ['forest','grass'], hardness: 0, forage: true, forageType: 'edible' },
    purple_mushroom: { icon: '🟣', name: 'Purple Mushroom', yields: { purple_mushroom: 1 }, biome: ['forest','grass'], hardness: 0, forage: true, forageType: 'poisonous' },
    red_berries:   { icon: '🔴', name: 'Red Berries', yields: { red_berries: 2 }, biome: ['forest','grass','sand'], hardness: 0, forage: true, forageType: 'edible' },
    nightshade:    { icon: '🫐', name: 'Dark Berries', yields: { nightshade: 1 }, biome: ['forest','grass'], hardness: 0, forage: true, forageType: 'deadly' },
    cactus_fruit:  { icon: '🌵', name: 'Cactus Fruit', yields: { cactus_fruit: 2 }, biome: ['desert','sand'], hardness: 0, forage: true, forageType: 'edible' },
    glowing_plant: { icon: '✨', name: 'Glowing Plant', yields: { glowing_plant: 3 }, biome: ['snow','mountain'], hardness: 0, forage: true, forageType: 'edible' },
    thorn_bush:    { icon: '🌿', name: 'Thorn Bush', yields: { thorn_bush: 1 }, biome: ['desert','sand'], hardness: 0, forage: true, forageType: 'poisonous' },
    stone:   { icon: '🪨', name: 'Stone',   yields: { stone: 3 },      biome: ['mountain'],       hardness: 2 },
    coal:    { icon: '⚫', name: 'Coal',    yields: { coal: 3 },       biome: ['mountain'],       hardness: 2 },
    iron:    { icon: '🔩', name: 'Iron',    yields: { iron_ore: 3 },   biome: ['mountain'],       hardness: 3 },
    copper:  { icon: '🟤', name: 'Copper',  yields: { copper_ore: 3 }, biome: ['mountain'],       hardness: 3 },
    gold:    { icon: '🟡', name: 'Gold',    yields: { gold_ore: 2 },   biome: ['mountain'],       hardness: 4 },
    oil:     { icon: '🛢️', name: 'Oil',     yields: { oil: 2 },        biome: ['desert','snow'],  hardness: 3 },
};

// Resource respawn times (seconds)
const RESOURCE_RESPAWN = {
    tree: 45,
    bush: 30,
    red_mushroom: 25,
    purple_mushroom: 25,
    red_berries: 30,
    nightshade: 35,
    cactus_fruit: 40,
    glowing_plant: 50,
    thorn_bush: 35,
    stone: 60,
    coal: 90,
    iron: 90,
    copper: 90,
    gold: 120,
    oil: 100,
};

// --- Items ---
// Edible items have `edible: true` and effects applied only when eaten (press F)
const ITEMS = {
    wood:        { icon: '🪵', name: 'Wood' },
    stone:       { icon: '🪨', name: 'Stone' },
    food:        { icon: '🫐', name: 'Food', edible: true, energy: 15, health: 0 },
    red_mushroom:    { icon: '🍄', name: 'Red Mushroom', edible: true, energy: 10, health: 0 },
    red_berries:     { icon: '🔴', name: 'Red Berries', edible: true, energy: 12, health: 0 },
    cactus_fruit:    { icon: '🌵', name: 'Cactus Fruit', edible: true, energy: 12, health: 0 },
    glowing_plant:   { icon: '✨', name: 'Glowing Plant', edible: true, energy: 18, health: 0 },
    purple_mushroom: { icon: '🟣', name: 'Purple Mushroom', edible: true, energy: -10, health: -15 },
    thorn_bush:      { icon: '🌿', name: 'Thorn Bush', edible: true, energy: -10, health: -15 },
    nightshade:      { icon: '🫐', name: 'Dark Berries', edible: true, energy: 0, health: -50 },
    coal:        { icon: '⚫', name: 'Coal' },
    iron_ore:    { icon: '🔩', name: 'Iron Ore' },
    iron_ingot:  { icon: '🔗', name: 'Iron Ingot' },
    copper_ore:  { icon: '🟤', name: 'Copper Ore' },
    copper_ingot:{ icon: '🟧', name: 'Copper Ingot' },
    gold_ore:    { icon: '🟡', name: 'Gold Ore' },
    gold_ingot:  { icon: '🟨', name: 'Gold Ingot' },
    oil:         { icon: '🛢️', name: 'Oil' },
    plank:       { icon: '🟫', name: 'Plank' },
    brick:       { icon: '🧱', name: 'Brick' },
    gear:        { icon: '⚙️', name: 'Gear' },
    circuit:     { icon: '🔌', name: 'Circuit' },
    battery:     { icon: '🔋', name: 'Battery' },
    wood_pickaxe:{ icon: '⛏️', name: 'Wooden Pickaxe', tool: 'pickaxe', power: 1 },
    stone_pickaxe:{icon: '⛏️', name: 'Stone Pickaxe',  tool: 'pickaxe', power: 2 },
    iron_pickaxe:{ icon: '⛏️', name: 'Iron Pickaxe',   tool: 'pickaxe', power: 3 },
    wood_axe:    { icon: '🪓', name: 'Wooden Axe',     tool: 'axe',     power: 1 },
    stone_axe:   { icon: '🪓', name: 'Stone Axe',      tool: 'axe',     power: 2 },
    iron_axe:    { icon: '🪓', name: 'Iron Axe',       tool: 'axe',     power: 3 },
};

// --- Crafting recipes ---
const RECIPES = [
    { id: 'plank',        output: { plank: 2 },        cost: { wood: 1 },             tech: null },
    { id: 'brick',        output: { brick: 2 },        cost: { stone: 3 },            tech: null },
    { id: 'wood_pickaxe', output: { wood_pickaxe: 1 }, cost: { wood: 5, stone: 2 },   tech: null },
    { id: 'wood_axe',     output: { wood_axe: 1 },     cost: { wood: 5, stone: 2 },   tech: null },
    { id: 'stone_pickaxe',output: { stone_pickaxe: 1 },cost: { wood: 3, stone: 5 },   tech: 'stone_tools' },
    { id: 'stone_axe',    output: { stone_axe: 1 },    cost: { wood: 3, stone: 5 },   tech: 'stone_tools' },
    { id: 'iron_pickaxe', output: { iron_pickaxe: 1 }, cost: { wood: 2, iron_ingot: 3 }, tech: 'iron_tools' },
    { id: 'iron_axe',     output: { iron_axe: 1 },     cost: { wood: 2, iron_ingot: 3 }, tech: 'iron_tools' },
    { id: 'gear',         output: { gear: 2 },         cost: { iron_ingot: 1 },       tech: 'machinery' },
    { id: 'circuit',      output: { circuit: 1 },      cost: { copper_ingot: 2, gold_ingot: 1 }, tech: 'electronics' },
    { id: 'battery',      output: { battery: 1 },      cost: { copper_ingot: 1, iron_ingot: 1, oil: 1 }, tech: 'electronics' },
];

// --- Buildings ---
const BUILDINGS = {
    campfire: {
        icon: '🔥', name: 'Campfire', cost: { wood: 5, stone: 3 }, tech: null,
        desc: 'Restores energy when nearby', power: 0, powerUse: 0,
        color: 0xe67e22, size: { w: 1.5, h: 1.0, d: 1.5 },
    },
    research_table: {
        icon: '📚', name: 'Research Table', cost: { wood: 8, stone: 5 }, tech: null,
        desc: 'Generates research points slowly', power: 0, powerUse: 0,
        color: 0x8B4513, size: { w: 2, h: 1.5, d: 2 },
        researchRate: 0.5,
    },
    furnace: {
        icon: '🏭', name: 'Furnace', cost: { stone: 10, brick: 4 }, tech: 'smelting',
        desc: 'Smelts ore into ingots', power: 0, powerUse: 0,
        color: 0x555555, size: { w: 2, h: 2.5, d: 2 },
        recipes: [
            { in: { iron_ore: 2, coal: 1 }, out: { iron_ingot: 2 }, time: 3 },
            { in: { copper_ore: 2, coal: 1 }, out: { copper_ingot: 2 }, time: 3 },
            { in: { gold_ore: 2, coal: 1 }, out: { gold_ingot: 1 }, time: 5 },
        ],
    },
    mining_drill: {
        icon: '⛏️', name: 'Mining Drill', cost: { iron_ingot: 5, gear: 3 }, tech: 'mining_automation',
        desc: 'Auto-mines resources from adjacent tiles', power: 0, powerUse: 10,
        color: 0x888888, size: { w: 2, h: 3, d: 2 },
    },
    power_plant: {
        icon: '⚡', name: 'Power Plant', cost: { iron_ingot: 8, copper_ingot: 4, gear: 5 }, tech: 'power_generation',
        desc: 'Generates power from coal', power: 50, powerUse: 0,
        color: 0x8e44ad, size: { w: 3, h: 4, d: 3 },
        fuel: { coal: 1 }, fuelTime: 10,
    },
    solar_panel: {
        icon: '🔆', name: 'Solar Panel', cost: { copper_ingot: 5, circuit: 2, iron_ingot: 3 }, tech: 'renewable_energy',
        desc: 'Generates free power', power: 20, powerUse: 0,
        color: 0x1a5276, size: { w: 3, h: 0.3, d: 2 },
    },
    research_lab: {
        icon: '🔬', name: 'Research Lab', cost: { iron_ingot: 10, copper_ingot: 5, circuit: 3 }, tech: 'scientific_method',
        desc: 'Generates research points', power: 0, powerUse: 15,
        color: 0x2ecc71, size: { w: 3, h: 3, d: 3 },
        researchRate: 1,
    },
    oil_pump: {
        icon: '🛢️', name: 'Oil Pump', cost: { iron_ingot: 6, gear: 4 }, tech: 'oil_processing',
        desc: 'Pumps oil from oil tiles', power: 0, powerUse: 8,
        color: 0x34495e, size: { w: 2, h: 3.5, d: 2 },
    },
    assembler: {
        icon: '🤖', name: 'Assembler', cost: { iron_ingot: 8, gear: 5, circuit: 3 }, tech: 'automation',
        desc: 'Automatically crafts items', power: 0, powerUse: 12,
        color: 0xe74c3c, size: { w: 2.5, h: 2.5, d: 2.5 },
    },
};

// --- Technology tree ---
const TECH_TREE = [
    { id: 'stone_tools',       icon: '🪨', name: 'Stone Tools',       cost: 5,   prereq: [],                  desc: 'Unlock stone pickaxe & axe' },
    { id: 'smelting',          icon: '🔥', name: 'Smelting',           cost: 10,  prereq: ['stone_tools'],      desc: 'Unlock furnace to smelt ore' },
    { id: 'iron_tools',        icon: '🔩', name: 'Iron Tools',         cost: 15,  prereq: ['smelting'],         desc: 'Unlock iron pickaxe & axe' },
    { id: 'machinery',         icon: '⚙️', name: 'Machinery',          cost: 25,  prereq: ['iron_tools'],       desc: 'Craft gears for machines' },
    { id: 'power_generation',  icon: '⚡', name: 'Power Generation',   cost: 30,  prereq: ['machinery'],        desc: 'Build power plants' },
    { id: 'scientific_method', icon: '🔬', name: 'Scientific Method',  cost: 35,  prereq: ['machinery'],        desc: 'Build research labs' },
    { id: 'mining_automation', icon: '⛏️', name: 'Mining Automation',  cost: 40,  prereq: ['power_generation'], desc: 'Build mining drills' },
    { id: 'electronics',       icon: '🔌', name: 'Electronics',        cost: 50,  prereq: ['power_generation','scientific_method'], desc: 'Craft circuits & batteries' },
    { id: 'oil_processing',    icon: '🛢️', name: 'Oil Processing',     cost: 45,  prereq: ['machinery'],        desc: 'Build oil pumps' },
    { id: 'renewable_energy',  icon: '🔆', name: 'Renewable Energy',   cost: 60,  prereq: ['electronics'],      desc: 'Build solar panels' },
    { id: 'automation',        icon: '🤖', name: 'Automation',         cost: 70,  prereq: ['electronics','mining_automation'], desc: 'Build assemblers' },
];

// ============================================================
//  Quest / Tutorial System
// ============================================================
const QUESTS = [
    { id: 'harvest_wood',   title: 'Gather Wood',    desc: 'Find a 🌲 tree and harvest it',         check: (g) => g.player.hasItem('wood', 1),         reward: 2 },
    { id: 'harvest_stone',  title: 'Gather Stone',   desc: 'Find a 🪨 rock on a mountain and harvest it', check: (g) => g.player.hasItem('stone', 1),  reward: 2 },
    { id: 'craft_pickaxe',  title: 'Craft a Pickaxe', desc: 'Press C and craft a ⛏️ wooden pickaxe',  check: (g) => g.player.hasItem('wood_pickaxe', 1) || g.player.hasItem('stone_pickaxe', 1) || g.player.hasItem('iron_pickaxe', 1), reward: 3 },
    { id: 'build_campfire', title: 'Build a Campfire', desc: 'Press B and place a 🔥 campfire',       check: (g) => g.countBuildings('campfire') > 0,   reward: 3 },
    { id: 'research_stone', title: 'Research Stone Tools', desc: 'Press T and unlock Stone Tools (5 RP)', check: (g) => g.completedTech.has('stone_tools'), reward: 5 },
    { id: 'build_furnace',  title: 'Build a Furnace', desc: 'Craft bricks, then build a 🏭 furnace',  check: (g) => g.countBuildings('furnace') > 0,    reward: 5 },
    { id: 'smelt_iron',     title: 'Smelt Iron',     desc: 'Get iron ore + coal, use furnace to smelt', check: (g) => g.player.hasItem('iron_ingot', 1), reward: 5 },
    { id: 'research_iron',  title: 'Research Iron Tools', desc: 'Unlock Iron Tools in the tech tree',    check: (g) => g.completedTech.has('iron_tools'),  reward: 8 },
    { id: 'build_lab',      title: 'Build a Research Lab', desc: 'Build a 🔬 research lab for auto RP',   check: (g) => g.countBuildings('research_lab') > 0, reward: 10 },
    { id: 'build_power',    title: 'Generate Power',  desc: 'Build a ⚡ power plant to power machines', check: (g) => g.countBuildings('power_plant') > 0, reward: 10 },
    { id: 'build_drill',    title: 'Automate Mining', desc: 'Build a ⛏️ mining drill near resources',   check: (g) => g.countBuildings('mining_drill') > 0, reward: 12 },
    { id: 'research_electronics', title: 'Research Electronics', desc: 'Unlock Electronics in the tech tree', check: (g) => g.completedTech.has('electronics'), reward: 15 },
    { id: 'build_solar',    title: 'Go Solar',       desc: 'Build a 🔆 solar panel for free power',   check: (g) => g.countBuildings('solar_panel') > 0, reward: 15 },
    { id: 'build_assembler', title: 'Full Automation', desc: 'Build a 🤖 assembler to auto-craft',     check: (g) => g.countBuildings('assembler') > 0,  reward: 20 },
    { id: 'all_tech',       title: 'Master All Technology', desc: 'Research every technology in the tree', check: (g) => g.completedTech.size >= TECH_TREE.length, reward: 50 },
];

// ============================================================
//  Perlin Noise
// ============================================================
class Noise {
    constructor(seed) {
        this.perm = new Uint8Array(512);
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) p[i] = i;
        let s = seed;
        for (let i = 255; i > 0; i--) {
            s = (s * 16807) % 2147483647;
            const j = s % (i + 1);
            [p[i], p[j]] = [p[j], p[i]];
        }
        for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
    }
    fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    lerp(a, b, t) { return a + t * (b - a); }
    grad(h, x, y) {
        const g = h & 7;
        const u = g < 4 ? x : y;
        const v = g < 4 ? y : x;
        return ((g & 1) ? -u : u) + ((g & 2) ? -2*v : 2*v);
    }
    noise2D(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x); y -= Math.floor(y);
        const u = this.fade(x), v = this.fade(y);
        const a = this.perm[X] + Y, b = this.perm[X+1] + Y;
        return this.lerp(
            this.lerp(this.grad(this.perm[a], x, y), this.grad(this.perm[b], x-1, y), u),
            this.lerp(this.grad(this.perm[a+1], x, y-1), this.grad(this.perm[b+1], x-1, y-1), u),
            v
        ) * 0.5 + 0.5;
    }
    fbm(x, y, octaves, persistence, scale) {
        let total = 0, freq = scale, amp = 1, max = 0;
        for (let i = 0; i < octaves; i++) {
            total += this.noise2D(x * freq, y * freq) * amp;
            max += amp; amp *= persistence; freq *= 2;
        }
        return total / max;
    }
}

// ============================================================
//  World (data model — same logic, 3D rendering separate)
// ============================================================
class World {
    constructor(seed) {
        this.seed = seed;
        this.noise = new Noise(seed);
        this.noise2 = new Noise(seed + 1000);
        this.tiles = [];
        this.respawnQueue = []; // { tx, ty, type, timer }
        this.generate();
    }
    generate() {
        for (let y = 0; y < WORLD_H; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < WORLD_W; x++) {
                const e = this.noise.fbm(x, y, 5, 0.5, 0.04);
                const m = this.noise2.fbm(x, y, 4, 0.5, 0.06);
                const t = this.noise.fbm(x + 500, y + 500, 3, 0.5, 0.03);
                let biome;
                if (e < 0.35) biome = 'water';
                else if (e < 0.40) biome = 'sand';
                else if (t < 0.3) biome = 'snow';
                else if (t > 0.75 && m < 0.35) biome = 'desert';
                else if (e > 0.72) biome = 'mountain';
                else if (m > 0.55) biome = 'forest';
                else biome = 'grass';
                const tile = { biome, resource: null, resourceAmount: 0, building: null, buildingData: null, elevation: e };
                this.maybeSpawnResource(tile, x, y);
                this.tiles[y][x] = tile;
            }
        }
    }
    // Deterministic pseudo-random 0..1 from tile coords (Perlin is always 0.5 at integer points!)
    rand(x, y, salt = 0) {
        const s = Math.sin(x * 127.1 + y * 311.7 + salt * 74.7 + this.seed * 0.001) * 43758.5453;
        return s - Math.floor(s);
    }
    maybeSpawnResource(tile, x, y) {
        if (!BIOMES[tile.biome].walkable) return;
        const r = this.rand(x, y, 1);
        let density = 0.15;
        if (tile.biome === 'forest') density = 0.50;
        if (tile.biome === 'grass') density = 0.35;
        if (tile.biome === 'sand') density = 0.20;
        if (tile.biome === 'desert') density = 0.20;
        if (tile.biome === 'mountain') density = 0.25;
        if (tile.biome === 'snow') density = 0.15;
        if (r < density) {
            if (tile.biome === 'mountain') {
                const r2 = this.rand(x, y, 2);
                if (r2 < 0.20) tile.resource = 'stone';
                else if (r2 < 0.38) tile.resource = 'coal';
                else if (r2 < 0.55) tile.resource = 'iron';
                else if (r2 < 0.70) tile.resource = 'copper';
                else if (r2 < 0.78) tile.resource = 'gold';
                else if (r2 < 0.85) tile.resource = 'glowing_plant';
                else tile.resource = 'stone';
            } else if (tile.biome === 'forest') {
                const r2 = this.rand(x, y, 3);
                if (r2 < 0.45) tile.resource = 'tree';
                else if (r2 < 0.58) tile.resource = 'bush';
                else if (r2 < 0.68) tile.resource = 'red_berries';
                else if (r2 < 0.76) tile.resource = 'red_mushroom';
                else if (r2 < 0.84) tile.resource = 'purple_mushroom';
                else if (r2 < 0.90) tile.resource = 'nightshade';
                else tile.resource = 'tree';
            } else if (tile.biome === 'grass') {
                const r2 = this.rand(x, y, 3);
                if (r2 < 0.50) tile.resource = 'tree';
                else if (r2 < 0.65) tile.resource = 'bush';
                else if (r2 < 0.75) tile.resource = 'red_berries';
                else if (r2 < 0.82) tile.resource = 'red_mushroom';
                else if (r2 < 0.88) tile.resource = 'purple_mushroom';
                else if (r2 < 0.93) tile.resource = 'nightshade';
                else tile.resource = 'tree';
            } else if (tile.biome === 'sand') {
                const r2 = this.rand(x, y, 3);
                if (r2 < 0.40) tile.resource = 'tree';
                else if (r2 < 0.60) tile.resource = 'red_berries';
                else if (r2 < 0.75) tile.resource = 'cactus_fruit';
                else if (r2 < 0.88) tile.resource = 'thorn_bush';
                else tile.resource = 'tree';
            } else if (tile.biome === 'desert') {
                const r2 = this.rand(x, y, 3);
                if (r2 < 0.30) tile.resource = 'tree';
                else if (r2 < 0.50) tile.resource = 'cactus_fruit';
                else if (r2 < 0.65) tile.resource = 'thorn_bush';
                else if (r2 < 0.72) tile.resource = 'oil';
                else tile.resource = 'tree';
            } else if (tile.biome === 'snow') {
                const r2 = this.rand(x, y, 3);
                if (r2 < 0.20) tile.resource = 'tree';
                else if (r2 < 0.35) tile.resource = 'glowing_plant';
                else if (r2 < 0.50) tile.resource = 'stone';
                else if (r2 < 0.60) tile.resource = 'oil';
                else tile.resource = 'tree';
            }
            if (tile.resource) {
                tile.resourceAmount = RESOURCE_TYPES[tile.resource].yields
                    ? Object.values(RESOURCE_TYPES[tile.resource].yields)[0] : 3;
            }
        }
    }
    getTile(x, y) {
        x = Math.floor(x); y = Math.floor(y);
        if (x < 0 || x >= WORLD_W || y < 0 || y >= WORLD_H) return null;
        return this.tiles[y][x];
    }
    isWalkable(x, y) {
        const t = this.getTile(x, y);
        if (!t) return false;
        // Water is walkable (swimming) but not buildable
        if (t.building) return false;
        return true;
    }
    tileToWorld(tx, ty) {
        return { x: tx * TILE_SIZE, z: ty * TILE_SIZE };
    }
    worldToTile(wx, wz) {
        return { tx: Math.floor(wx / TILE_SIZE), ty: Math.floor(wz / TILE_SIZE) };
    }
    getTileHeight(tx, ty) {
        const t = this.getTile(tx, ty);
        if (!t) return 0;
        // Use elevation noise for smooth terrain + biome base height
        const baseHeight = BIOMES[t.biome].height;
        const elev = t.elevation; // 0..1 from Perlin noise
        // Water is below sea level, mountains get tall
        if (t.biome === 'water') return -2;
        if (t.biome === 'sand') return 0.5 + elev * 2;
        if (t.biome === 'grass') return 1 + elev * 4;
        if (t.biome === 'forest') return 1.5 + elev * 5;
        if (t.biome === 'mountain') return 4 + elev * 18;
        if (t.biome === 'snow') return 8 + elev * 22;
        if (t.biome === 'desert') return 0.8 + elev * 3;
        return baseHeight * 3;
    }

    queueRespawn(tx, ty, resourceType) {
        const time = RESOURCE_RESPAWN[resourceType] || 60;
        this.respawnQueue.push({ tx, ty, type: resourceType, timer: time });
    }

    processRespawns(dt) {
        for (let i = this.respawnQueue.length - 1; i >= 0; i--) {
            const r = this.respawnQueue[i];
            r.timer -= dt;
            if (r.timer <= 0) {
                const tile = this.getTile(r.tx, r.ty);
                if (tile && !tile.resource && !tile.building) {
                    tile.resource = r.type;
                    tile.resourceAmount = RESOURCE_TYPES[r.type].yields
                        ? Object.values(RESOURCE_TYPES[r.type].yields)[0] : 3;
                    // Notify game to add mesh
                    if (this.onRespawn) this.onRespawn(r.tx, r.ty, r.type);
                }
                this.respawnQueue.splice(i, 1);
            }
        }
    }
}

// ============================================================
//  Player
// ============================================================
class Player {
    constructor(x, z) {
        this.x = x; this.z = z;
        this.y = 0;
        this.health = 100; this.maxHealth = 100;
        this.energy = 100; this.maxEnergy = 100;
        this.rotation = 0;
        this.inventory = {};
        this.selectedSlot = 0;
        this.harvesting = null;
        this.jumpVel = 0;
        this.yOffset = 0; // height above terrain from jumping
    }
    get tool() {
        const slots = Object.keys(this.inventory).filter(k => ITEMS[k]?.tool);
        if (slots.length === 0) return null;
        return slots.map(k => ITEMS[k]).sort((a,b) => b.power - a.power)[0];
    }
    get toolPower() { return this.tool ? this.tool.power : 0; }
    addItem(item, count = 1) { this.inventory[item] = (this.inventory[item] || 0) + count; }
    hasItem(item, count = 1) { return (this.inventory[item] || 0) >= count; }
    removeItem(item, count = 1) {
        if (!this.hasItem(item, count)) return false;
        this.inventory[item] -= count;
        if (this.inventory[item] <= 0) delete this.inventory[item];
        return true;
    }
    hasCost(cost) {
        for (const [item, amt] of Object.entries(cost)) if (!this.hasItem(item, amt)) return false;
        return true;
    }
    payCost(cost) {
        if (!this.hasCost(cost)) return false;
        for (const [item, amt] of Object.entries(cost)) this.removeItem(item, amt);
        return true;
    }
}

// ============================================================
//  3D Model Factory — creates Three.js meshes for game objects
// ============================================================
class ModelFactory {
    static createTree() {
        const group = new THREE.Group();
        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 2.5, 6);
        const trunkMat = new THREE.MeshLambertMaterial({ color: 0x6b4226 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1.25;
        trunk.castShadow = true;
        group.add(trunk);
        // Leaves (3 cones stacked)
        const leafMat = new THREE.MeshLambertMaterial({ color: 0x2d6b1f });
        for (let i = 0; i < 3; i++) {
            const r = 1.8 - i * 0.4;
            const h = 1.8;
            const coneGeo = new THREE.ConeGeometry(r, h, 7);
            const cone = new THREE.Mesh(coneGeo, leafMat);
            cone.position.y = 2.8 + i * 1.0;
            cone.castShadow = true;
            group.add(cone);
        }
        return group;
    }

    static createBush() {
        const group = new THREE.Group();
        const geo = new THREE.SphereGeometry(0.6, 6, 5);
        const mat = new THREE.MeshLambertMaterial({ color: 0x4a8c2a });
        for (let i = 0; i < 3; i++) {
            const s = new THREE.Mesh(geo, mat);
            s.position.set((Math.random()-0.5)*0.8, 0.5, (Math.random()-0.5)*0.8);
            s.scale.setScalar(0.7 + Math.random()*0.5);
            s.castShadow = true;
            group.add(s);
        }
        // Berries
        const berryMat = new THREE.MeshLambertMaterial({ color: 0x4466ff });
        for (let i = 0; i < 4; i++) {
            const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 4, 4), berryMat);
            b.position.set((Math.random()-0.5)*1.0, 0.6 + Math.random()*0.3, (Math.random()-0.5)*1.0);
            group.add(b);
        }
        return group;
    }

    static createRock(color) {
        const group = new THREE.Group();
        const geo = new THREE.DodecahedronGeometry(0.8, 0);
        const mat = new THREE.MeshLambertMaterial({ color: color, flatShading: true });
        const rock = new THREE.Mesh(geo, mat);
        rock.position.y = 0.5;
        rock.rotation.set(Math.random()*0.5, Math.random()*Math.PI, Math.random()*0.5);
        rock.scale.set(1, 0.7, 1);
        rock.castShadow = true;
        group.add(rock);
        // Small rocks around
        for (let i = 0; i < 2; i++) {
            const small = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3, 0), mat);
            small.position.set((Math.random()-0.5)*1.5, 0.2, (Math.random()-0.5)*1.5);
            small.castShadow = true;
            group.add(small);
        }
        return group;
    }

    static createOreVein(color) {
        const group = new THREE.Group();
        const baseMat = new THREE.MeshLambertMaterial({ color: 0x555555, flatShading: true });
        const oreMat = new THREE.MeshLambertMaterial({ color: color, emissive: color, emissiveIntensity: 0.3, flatShading: true });
        // Base rock
        const base = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 0), baseMat);
        base.position.y = 0.5;
        base.scale.set(1, 0.6, 1);
        base.castShadow = true;
        group.add(base);
        // Ore deposits
        for (let i = 0; i < 5; i++) {
            const ore = new THREE.Mesh(new THREE.SphereGeometry(0.18, 5, 4), oreMat);
            const angle = (i / 5) * Math.PI * 2;
            ore.position.set(Math.cos(angle)*0.6, 0.3 + Math.random()*0.5, Math.sin(angle)*0.6);
            group.add(ore);
        }
        return group;
    }

    static createOilDeposit() {
        const group = new THREE.Group();
        // Dark pool
        const pool = new THREE.Mesh(
            new THREE.CylinderGeometry(1.0, 1.0, 0.15, 10),
            new THREE.MeshLambertMaterial({ color: 0x1a1a1a })
        );
        pool.position.y = 0.08;
        group.add(pool);
        // Derrick frame
        const frameMat = new THREE.MeshLambertMaterial({ color: 0x666666 });
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.5, 4), frameMat);
            post.position.set(Math.cos(angle)*0.6, 0.75, Math.sin(angle)*0.6);
            post.rotation.x = Math.cos(angle) * 0.15;
            post.rotation.z = Math.sin(angle) * 0.15;
            group.add(post);
        }
        return group;
    }

    static createResource(type) {
        switch(type) {
            case 'tree': return this.createTree();
            case 'bush': return this.createBush();
            case 'red_mushroom': return this.createMushroom(0xe74c3c, 0xfff8e7);
            case 'purple_mushroom': return this.createMushroom(0x9b59b6, 0xfff8e7);
            case 'red_berries': return this.createBerryPlant(0xe74c3c);
            case 'nightshade': return this.createBerryPlant(0x2c0a3e);
            case 'cactus_fruit': return this.createCactus();
            case 'glowing_plant': return this.createGlowingPlant();
            case 'thorn_bush': return this.createThornBush();
            case 'stone': return this.createRock(0x95a5a6);
            case 'coal': return this.createOreVein(0x1a1a1a);
            case 'iron': return this.createOreVein(0xc08050);
            case 'copper': return this.createOreVein(0xb87333);
            case 'gold': return this.createOreVein(0xffd700);
            case 'oil': return this.createOilDeposit();
            default: return new THREE.Group();
        }
    }

    static createMushroom(capColor, stemColor) {
        const group = new THREE.Group();
        // Stem
        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.15, 0.5, 6),
            new THREE.MeshLambertMaterial({ color: stemColor })
        );
        stem.position.y = 0.25;
        group.add(stem);
        // Cap
        const cap = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2),
            new THREE.MeshLambertMaterial({ color: capColor })
        );
        cap.position.y = 0.5;
        cap.castShadow = true;
        group.add(cap);
        // Spots
        const spotMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        for (let i = 0; i < 3; i++) {
            const spot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 4, 4), spotMat);
            const angle = (i / 3) * Math.PI * 2;
            spot.position.set(Math.cos(angle) * 0.18, 0.6, Math.sin(angle) * 0.18);
            group.add(spot);
        }
        return group;
    }

    static createBerryPlant(berryColor) {
        const group = new THREE.Group();
        // Leaves
        const leafMat = new THREE.MeshLambertMaterial({ color: 0x3a7a2a });
        for (let i = 0; i < 4; i++) {
            const s = new THREE.Mesh(new THREE.SphereGeometry(0.4, 6, 5), leafMat);
            s.position.set((Math.random()-0.5)*0.6, 0.3 + Math.random()*0.2, (Math.random()-0.5)*0.6);
            s.scale.setScalar(0.8 + Math.random()*0.3);
            s.castShadow = true;
            group.add(s);
        }
        // Berries
        const berryMat = new THREE.MeshLambertMaterial({ color: berryColor });
        for (let i = 0; i < 6; i++) {
            const b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 5, 5), berryMat);
            b.position.set((Math.random()-0.5)*0.8, 0.4 + Math.random()*0.3, (Math.random()-0.5)*0.8);
            group.add(b);
        }
        return group;
    }

    static createCactus() {
        const group = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color: 0x2d8a3e });
        // Main body
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 1.5, 8), mat);
        body.position.y = 0.75;
        body.castShadow = true;
        group.add(body);
        // Arms
        for (let i = 0; i < 2; i++) {
            const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.6, 6), mat);
            arm.position.set(i === 0 ? 0.4 : -0.4, 0.8, 0);
            arm.rotation.z = i === 0 ? -0.5 : 0.5;
            arm.castShadow = true;
            group.add(arm);
        }
        // Fruit on top
        const fruitMat = new THREE.MeshLambertMaterial({ color: 0xe74c3c });
        const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.15, 6, 6), fruitMat);
        fruit.position.y = 1.6;
        group.add(fruit);
        return group;
    }

    static createGlowingPlant() {
        const group = new THREE.Group();
        // Stem
        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.1, 0.6, 5),
            new THREE.MeshLambertMaterial({ color: 0x4a8c4a })
        );
        stem.position.y = 0.3;
        group.add(stem);
        // Glowing flower head
        const glowMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), glowMat);
        head.position.y = 0.7;
        group.add(head);
        // Petals
        const petalMat = new THREE.MeshLambertMaterial({ color: 0x00cc66, emissive: 0x004422 });
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const petal = new THREE.Mesh(new THREE.SphereGeometry(0.12, 5, 5), petalMat);
            petal.position.set(Math.cos(angle) * 0.25, 0.65, Math.sin(angle) * 0.25);
            group.add(petal);
        }
        // Point light
        const light = new THREE.PointLight(0x00ff88, 0.5, 4);
        light.position.y = 0.7;
        group.add(light);
        return group;
    }

    static createThornBush() {
        const group = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color: 0x5a4a2a });
        const thornMat = new THREE.MeshLambertMaterial({ color: 0x3a2a1a });
        for (let i = 0; i < 5; i++) {
            const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.8, 4), mat);
            branch.position.set((Math.random()-0.5)*0.8, 0.3 + Math.random()*0.3, (Math.random()-0.5)*0.8);
            branch.rotation.set(Math.random()*0.5, Math.random()*Math.PI, Math.random()*0.5);
            branch.castShadow = true;
            group.add(branch);
            // Thorns
            for (let j = 0; j < 3; j++) {
                const thorn = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.15, 4), thornMat);
                thorn.position.copy(branch.position);
                thorn.position.x += (Math.random()-0.5)*0.3;
                thorn.position.y += (Math.random()-0.5)*0.3;
                thorn.position.z += (Math.random()-0.5)*0.3;
                thorn.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
                group.add(thorn);
            }
        }
        return group;
    }

    static createBuilding(type) {
        const def = BUILDINGS[type];
        const group = new THREE.Group();
        const s = def.size;
        switch(type) {
            case 'campfire': {
                // Stone ring
                const ringMat = new THREE.MeshLambertMaterial({ color: 0x666666, flatShading: true });
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25, 0), ringMat);
                    stone.position.set(Math.cos(angle)*0.6, 0.15, Math.sin(angle)*0.6);
                    group.add(stone);
                }
                // Logs
                const logMat = new THREE.MeshLambertMaterial({ color: 0x6b4226 });
                for (let i = 0; i < 3; i++) {
                    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 5), logMat);
                    log.position.y = 0.2;
                    log.rotation.z = Math.PI / 2;
                    log.rotation.y = (i / 3) * Math.PI;
                    group.add(log);
                }
                // Flame
                const flame = new THREE.Mesh(
                    new THREE.ConeGeometry(0.3, 0.8, 6),
                    new THREE.MeshBasicMaterial({ color: 0xff6600 })
                );
                flame.position.y = 0.6;
                flame.name = 'flame';
                group.add(flame);
                const flame2 = new THREE.Mesh(
                    new THREE.ConeGeometry(0.15, 0.5, 6),
                    new THREE.MeshBasicMaterial({ color: 0xffdd00 })
                );
                flame2.position.y = 0.7;
                flame2.name = 'flame2';
                group.add(flame2);
                break;
            }
            case 'research_table': {
                // Table top
                const top = new THREE.Mesh(
                    new THREE.BoxGeometry(s.w, 0.15, s.d),
                    new THREE.MeshLambertMaterial({ color: 0x8B4513 })
                );
                top.position.y = 0.9;
                top.castShadow = true;
                group.add(top);
                // Legs
                const legMat = new THREE.MeshLambertMaterial({ color: 0x6b4226 });
                for (let i = -1; i <= 1; i += 2) {
                    for (let j = -1; j <= 1; j += 2) {
                        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.1), legMat);
                        leg.position.set(i * (s.w/2 - 0.1), 0.45, j * (s.d/2 - 0.1));
                        group.add(leg);
                    }
                }
                // Book on table
                const book = new THREE.Mesh(
                    new THREE.BoxGeometry(0.6, 0.12, 0.4),
                    new THREE.MeshLambertMaterial({ color: 0x2ecc71 })
                );
                book.position.y = 1.05;
                group.add(book);
                // Scroll
                const scroll = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.08, 0.08, 0.5, 6),
                    new THREE.MeshLambertMaterial({ color: 0xf1c40f })
                );
                scroll.position.set(0.5, 1.05, 0);
                scroll.rotation.z = Math.PI / 2;
                group.add(scroll);
                // Active light
                const light = new THREE.Mesh(
                    new THREE.SphereGeometry(0.1, 6, 6),
                    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
                );
                light.position.set(-0.5, 1.1, 0.3);
                light.name = 'activeLight';
                group.add(light);
                break;
            }
            case 'solar_panel': {
                // Panel
                const panel = new THREE.Mesh(
                    new THREE.BoxGeometry(s.w, s.h, s.d),
                    new THREE.MeshLambertMaterial({ color: 0x1a3a5a })
                );
                panel.position.y = 1.5;
                panel.rotation.x = -0.3;
                panel.castShadow = true;
                group.add(panel);
                // Support
                const support = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.1, 0.1, 1.5, 6),
                    new THREE.MeshLambertMaterial({ color: 0x888888 })
                );
                support.position.y = 0.75;
                group.add(support);
                // Grid lines on panel
                const lineMat = new THREE.MeshLambertMaterial({ color: 0x0a1a2a });
                for (let i = -1; i <= 1; i++) {
                    const line = new THREE.Mesh(new THREE.BoxGeometry(s.w, 0.02, 0.05), lineMat);
                    line.position.set(0, 1.66, i * 0.6);
                    line.rotation.x = -0.3;
                    group.add(line);
                }
                break;
            }
            default: {
                // Generic building box
                const mat = new THREE.MeshLambertMaterial({ color: def.color, flatShading: true });
                const box = new THREE.Mesh(new THREE.BoxGeometry(s.w, s.h, s.d), mat);
                box.position.y = s.h / 2;
                box.castShadow = true;
                group.add(box);
                // Roof
                const roofMat = new THREE.MeshLambertMaterial({ color: 0x333333, flatShading: true });
                const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(s.w, s.d) * 0.8, 1.0, 4), roofMat);
                roof.position.y = s.h + 0.5;
                roof.rotation.y = Math.PI / 4;
                roof.castShadow = true;
                group.add(roof);
                // Door
                const door = new THREE.Mesh(
                    new THREE.BoxGeometry(0.6, 1.0, 0.05),
                    new THREE.MeshLambertMaterial({ color: 0x4a3020 })
                );
                door.position.set(0, 0.5, s.d / 2 + 0.01);
                group.add(door);
                // Windows (glowing)
                const winMat = new THREE.MeshBasicMaterial({ color: 0x88ccff });
                for (let i = -1; i <= 1; i += 2) {
                    const win = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.05), winMat);
                    win.position.set(i * 0.6, 1.2, s.d / 2 + 0.01);
                    group.add(win);
                }
                // Active light
                if (def.powerUse > 0 || def.power > 0) {
                    const light = new THREE.Mesh(
                        new THREE.SphereGeometry(0.15, 6, 6),
                        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
                    );
                    light.position.set(0, s.h + 0.3, 0);
                    light.name = 'activeLight';
                    group.add(light);
                }
            }
        }
        return group;
    }

    static createPlayer() {
        const group = new THREE.Group();
        // Body
        const body = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.4, 0.8, 4, 8),
            new THREE.MeshLambertMaterial({ color: 0xe67e22 })
        );
        body.position.y = 1.0;
        body.castShadow = true;
        group.add(body);
        // Head
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 8, 8),
            new THREE.MeshLambertMaterial({ color: 0xf5c6a0 })
        );
        head.position.y = 1.8;
        head.castShadow = true;
        group.add(head);
        // Direction indicator (nose)
        const nose = new THREE.Mesh(
            new THREE.ConeGeometry(0.1, 0.2, 4),
            new THREE.MeshLambertMaterial({ color: 0xd35400 })
        );
        nose.position.set(0, 1.8, 0.3);
        nose.rotation.x = Math.PI / 2;
        group.add(nose);
        // Arms
        const armMat = new THREE.MeshLambertMaterial({ color: 0xe67e22 });
        for (let i = -1; i <= 1; i += 2) {
            const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.5, 3, 6), armMat);
            arm.position.set(i * 0.5, 1.0, 0);
            arm.castShadow = true;
            group.add(arm);
        }
        // Legs
        const legMat = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
        for (let i = -1; i <= 1; i += 2) {
            const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.4, 3, 6), legMat);
            leg.position.set(i * 0.2, 0.3, 0);
            leg.castShadow = true;
            group.add(leg);
        }
        return group;
    }
}

// ============================================================
//  Game (3D)
// ============================================================
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.keys = {};
        this.mouse = { x: 0, y: 0 };
        this.cameraRotation = { yaw: 0, pitch: -0.5 };
        this.pointerLocked = false;
        this.notifications = [];
        this.buildMode = null;
        this.gameRunning = false;
        this.researchPoints = 0;
        this.completedTech = new Set();
        this.powerProduced = 0;
        this.powerConsumed = 0;
        this.tickAccumulator = 0;
        this.meshUpdateAccumulator = 0;
        this.time = 0;
        this.resourceMeshes = new Map(); // "x,y" -> mesh
        this.buildingMeshes = new Map();
        this.buildingPositions = new Set(); // "x,y" for efficient tick
        this.buildPreview = null;
        this.currentQuestIndex = 0;
        this.spawnPoint = { x: 0, z: 0 };

        this.setupInput();
        this.setupUI();
    }

    // --- Three.js setup ---
    initThree() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);
        this.scene.fog = new THREE.Fog(0x87ceeb, 40, 140);

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 600);

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambient);

        const sun = new THREE.DirectionalLight(0xffffff, 0.8);
        sun.position.set(50, 80, 30);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 1024;
        sun.shadow.mapSize.height = 1024;
        sun.shadow.camera.left = -60;
        sun.shadow.camera.right = 60;
        sun.shadow.camera.top = 60;
        sun.shadow.camera.bottom = -60;
        sun.shadow.camera.far = 200;
        this.scene.add(sun);
        this.scene.add(sun.target);
        this.sun = sun;

        // Hemisphere light for nicer ambient
        const hemi = new THREE.HemisphereLight(0x87ceeb, 0x3a5a1f, 0.3);
        this.scene.add(hemi);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- Terrain mesh ---
    buildTerrain() {
        // (WORLD_W-1) segments of exactly TILE_SIZE each so vertices align with tile grid
        const geo = new THREE.PlaneGeometry((WORLD_W - 1) * TILE_SIZE, (WORLD_H - 1) * TILE_SIZE, WORLD_W - 1, WORLD_H - 1);
        geo.rotateX(-Math.PI / 2);

        const colors = [];
        for (let y = 0; y < WORLD_H; y++) {
            for (let x = 0; x < WORLD_W; x++) {
                const tile = this.world.tiles[y][x];
                const idx = (y * WORLD_W + x) * 3;
                const c = new THREE.Color(BIOMES[tile.biome].color);
                colors[idx] = c.r; colors[idx+1] = c.g; colors[idx+2] = c.b;
                // Set vertex height
                const vIdx = (y * WORLD_W + x);
                const positions = geo.attributes.position;
                positions.setY(vIdx, this.world.getTileHeight(x, y));
            }
        }
        geo.attributes.position.needsUpdate = true;
        geo.computeVertexNormals();
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: false });
        const terrain = new THREE.Mesh(geo, mat);
        // Align terrain with tile grid: plane is centered at origin, shift so tile (0,0) is at world (0,0)
        terrain.position.set((WORLD_W - 1) * TILE_SIZE / 2, 0, (WORLD_H - 1) * TILE_SIZE / 2);
        terrain.receiveShadow = true;
        terrain.name = 'terrain';
        this.scene.add(terrain);
        this.terrainMesh = terrain;

        // Water plane at y=0
        const waterGeo = new THREE.PlaneGeometry(WORLD_W * TILE_SIZE * 8, WORLD_H * TILE_SIZE * 8);
        waterGeo.rotateX(-Math.PI / 2);
        const waterMat = new THREE.MeshLambertMaterial({ color: 0x1a5276, transparent: true, opacity: 0.7 });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.position.y = 0;
        this.scene.add(water);
        this.waterMesh = water;
    }

    // --- Resource meshes (dynamic: only near player) ---
    buildResources() {
        this.resourceLoadRadius = 25; // tiles
        this.updateResourceMeshes();
    }

    updateResourceMeshes() {
        const ptx = Math.floor(this.player.x);
        const pty = Math.floor(this.player.z);
        const r = this.resourceLoadRadius;
        const needed = new Set();
        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                if (dx*dx + dy*dy <= r*r) {
                    const tx = ptx + dx, ty = pty + dy;
                    if (tx < 0 || tx >= WORLD_W || ty < 0 || ty >= WORLD_H) continue;
                    const tile = this.world.tiles[ty][tx];
                    if (tile.resource) {
                        const key = `${tx},${ty}`;
                        needed.add(key);
                        if (!this.resourceMeshes.has(key)) {
                            this.addResourceMesh(tx, ty, tile.resource);
                        }
                    }
                }
            }
        }
        // Remove meshes that are too far away
        for (const [key, mesh] of this.resourceMeshes) {
            if (!needed.has(key)) {
                this.scene.remove(mesh);
                this.resourceMeshes.delete(key);
            }
        }
    }

    addResourceMesh(tx, ty, resourceType) {
        const mesh = ModelFactory.createResource(resourceType);
        const wx = tx * TILE_SIZE + TILE_SIZE / 2;
        const wz = ty * TILE_SIZE + TILE_SIZE / 2;
        const wy = this.world.getTileHeight(tx, ty);
        mesh.position.set(wx, wy, wz);
        mesh.userData = { type: 'resource', tx, ty, resourceType };
        mesh.traverse(c => { if (c.isMesh) { c.castShadow = true; c.userData = mesh.userData; }});
        this.scene.add(mesh);
        this.resourceMeshes.set(`${tx},${ty}`, mesh);
    }

    removeResourceMesh(tx, ty) {
        const key = `${tx},${ty}`;
        const mesh = this.resourceMeshes.get(key);
        if (mesh) {
            this.scene.remove(mesh);
            this.resourceMeshes.delete(key);
        }
    }

    // --- Building meshes (dynamic: only near player) ---
    updateBuildingMeshes() {
        const ptx = Math.floor(this.player.x);
        const pty = Math.floor(this.player.z);
        const r = this.resourceLoadRadius;
        const needed = new Set();
        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                if (dx*dx + dy*dy <= r*r) {
                    const tx = ptx + dx, ty = pty + dy;
                    if (tx < 0 || tx >= WORLD_W || ty < 0 || ty >= WORLD_H) continue;
                    const tile = this.world.tiles[ty][tx];
                    if (tile.building) {
                        const key = `${tx},${ty}`;
                        needed.add(key);
                        if (!this.buildingMeshes.has(key)) {
                            this.addBuildingMesh(tx, ty, tile.building);
                        }
                    }
                }
            }
        }
        for (const [key, mesh] of this.buildingMeshes) {
            if (!needed.has(key)) {
                this.scene.remove(mesh);
                this.buildingMeshes.delete(key);
            }
        }
    }

    // --- Building meshes ---
    addBuildingMesh(tx, ty, buildingType) {
        const mesh = ModelFactory.createBuilding(buildingType);
        const wx = tx * TILE_SIZE + TILE_SIZE / 2;
        const wz = ty * TILE_SIZE + TILE_SIZE / 2;
        const wy = this.world.getTileHeight(tx, ty);
        mesh.position.set(wx, wy, wz);
        mesh.userData = { type: 'building', tx, ty, buildingType };
        mesh.traverse(c => { if (c.isMesh) c.userData = mesh.userData; });
        this.scene.add(mesh);
        this.buildingMeshes.set(`${tx},${ty}`, mesh);
        return mesh;
    }

    removeBuildingMesh(tx, ty) {
        const key = `${tx},${ty}`;
        const mesh = this.buildingMeshes.get(key);
        if (mesh) {
            this.scene.remove(mesh);
            this.buildingMeshes.delete(key);
        }
    }

    // --- Player mesh ---
    buildPlayer() {
        this.playerMesh = ModelFactory.createPlayer();
        this.playerMesh.traverse(c => { if (c.isMesh) c.castShadow = true; });
        this.scene.add(this.playerMesh);
    }

    // --- Start game ---
    start() {
      try {
        this.world = new World(Math.floor(Math.random() * 1000000));
        // Find spawn
        let sx = WORLD_W / 2, sy = WORLD_H / 2;
        for (let r = 0; r < 50; r++) {
            let found = false;
            for (let dy = -r; dy <= r && !found; dy++) {
                for (let dx = -r; dx <= r && !found; dx++) {
                    const t = this.world.getTile(sx + dx, sy + dy);
                    if (t && t.biome === 'grass' && !t.resource && !t.building) {
                        sx = sx + dx; sy = sy + dy; found = true;
                    }
                }
            }
            if (found) break;
        }
        this.player = new Player(sx + 0.5, sy + 0.5);
        this.player.y = this.world.getTileHeight(sx, sy);
        this.player.addItem('wood', 5);
        this.player.addItem('stone', 5);
        this.spawnPoint = { x: sx + 0.5, z: sy + 0.5 };
        this.gameRunning = true;
        this.researchPoints = 0;
        this.completedTech = new Set();
        this.currentQuestIndex = 0;
        this.world.onRespawn = (tx, ty, type) => {
            this.addResourceMesh(tx, ty, type);
        };

        // Init Three.js
        if (!this.scene) {
            this.initThree();
        } else {
            // Clear scene
            while (this.scene.children.length > 0) {
                const obj = this.scene.children[0];
                this.scene.remove(obj);
            }
            this.resourceMeshes.clear();
            this.buildingMeshes.clear();
            this.buildingPositions.clear();
            // Re-add lights
            this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
            const sun = new THREE.DirectionalLight(0xffffff, 0.8);
            sun.position.set(50, 80, 30);
            sun.castShadow = true;
            sun.shadow.mapSize.width = 1024;
            sun.shadow.mapSize.height = 1024;
            sun.shadow.camera.left = -60;
            sun.shadow.camera.right = 60;
            sun.shadow.camera.top = 60;
            sun.shadow.camera.bottom = -60;
            sun.shadow.camera.far = 200;
            this.scene.add(sun);
            this.scene.add(sun.target);
            this.sun = sun;
            this.scene.add(new THREE.HemisphereLight(0x87ceeb, 0x3a5a1f, 0.3));
        }

        this.buildTerrain();
        this.buildResources();
        this.buildPlayer();

        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('crosshair').classList.add('visible');

        this.updateUI();
        this.updateQuestUI();
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
        this.notify('🌍 Welcome to the 3D world! Explore, gather, build, and research.', 'info');
        this.requestPointerLock();
        // Show prompt if pointer lock didn't engage
        if (!this.pointerLocked) {
            const prompt = document.getElementById('pointer-lock-prompt');
            prompt.classList.remove('hidden');
            prompt.classList.add('visible');
        }
      } catch (err) {
        console.error('Game start error:', err);
        alert('Error starting game: ' + err.message + '\n\n' + err.stack);
        this.gameRunning = false;
      }
    }

    // --- Pointer lock ---
    requestPointerLock() {
        // Try to lock immediately (works if called within user gesture like click)
        if (this.gameRunning && !this.pointerLocked && !this.anyPanelOpen()) {
            const el = this.canvas;
            const req = el.requestPointerLock || el.mozRequestPointerLock;
            if (req) {
                try { req.call(el); } catch(e) {}
            }
        }
        // Also set up click handler for re-locking after ESC or panel close
        this.canvas.onclick = () => {
            if (this.gameRunning && !this.pointerLocked && !this.anyPanelOpen()) {
                const req = this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock;
                if (req) {
                    try { req.call(this.canvas); } catch(e) {}
                }
            }
        };
    }

    anyPanelOpen() {
        return !document.getElementById('panel-crafting').classList.contains('hidden') ||
               !document.getElementById('panel-build').classList.contains('hidden') ||
               !document.getElementById('panel-tech').classList.contains('hidden');
    }

    // --- Input ---
    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === 'Escape') {
                if (this.buildMode) {
                    this.buildMode = null;
                    this.updateBuildModeUI();
                }
                this.closePanels();
            }
            if (e.key.toLowerCase() === 'c' && this.gameRunning) this.togglePanel('panel-crafting');
            if (e.key.toLowerCase() === 'b' && this.gameRunning) this.togglePanel('panel-build');
            if (e.key.toLowerCase() === 't' && this.gameRunning) this.togglePanel('panel-tech');
            if (e.key.toLowerCase() === 'e' && this.gameRunning) this.interact();
            if (e.key.toLowerCase() === 'f' && this.gameRunning) this.eatSelectedItem();
            if (e.code === 'Space' && this.gameRunning && this.player.yOffset === 0 && this.player.jumpVel === 0) {
                this.player.jumpVel = 12;
            }
            const num = parseInt(e.key);
            if (num >= 1 && num <= 9 && this.gameRunning) {
                this.player.selectedSlot = num - 1;
                this.updateInventoryUI();
            }
        });
        window.addEventListener('keyup', (e) => { this.keys[e.key.toLowerCase()] = false; });

        // Clear all keys when window loses focus
        window.addEventListener('blur', () => { this.keys = {}; });

        // Pointer lock change
        document.addEventListener('pointerlockchange', () => {
            this.pointerLocked = (document.pointerLockElement === this.canvas);
            if (!this.pointerLocked) this.keys = {}; // Clear keys when lock lost
            const prompt = document.getElementById('pointer-lock-prompt');
            if (this.gameRunning && !this.pointerLocked && !this.anyPanelOpen()) {
                prompt.classList.remove('hidden');
                prompt.classList.add('visible');
            } else {
                prompt.classList.add('hidden');
                prompt.classList.remove('visible');
            }
        });

        // Mouse look
        document.addEventListener('mousemove', (e) => {
            if (this.pointerLocked && this.gameRunning) {
                this.cameraRotation.yaw -= e.movementX * 0.002;
                this.cameraRotation.pitch -= e.movementY * 0.002;
                this.cameraRotation.pitch = Math.max(-1.4, Math.min(1.4, this.cameraRotation.pitch));
            }
        });

        // Click to interact or place
        this.canvas.addEventListener('mousedown', (e) => {
            if (!this.gameRunning || !this.pointerLocked) return;
            if (e.button === 0) { // left click
                if (this.buildMode) {
                    this.placeBuilding();
                } else {
                    this.interact();
                }
            }
            if (e.button === 2) { // right click
                if (this.buildMode) {
                    this.buildMode = null;
                    this.updateBuildModeUI();
                }
            }
        });
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    setupUI() {
        document.getElementById('start-btn').addEventListener('click', () => this.start());
        document.getElementById('restart-btn').addEventListener('click', () => this.respawn());
        document.getElementById('btn-craft').addEventListener('click', () => this.togglePanel('panel-crafting'));
        document.getElementById('btn-build').addEventListener('click', () => this.togglePanel('panel-build'));
        document.getElementById('btn-tech').addEventListener('click', () => this.togglePanel('panel-tech'));
        document.querySelectorAll('.panel-close').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById(btn.dataset.panel).classList.add('hidden');
                document.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
                this.requestPointerLock();
            });
        });
    }

    togglePanel(id) {
        const panel = document.getElementById(id);
        const isHidden = panel.classList.contains('hidden');
        this.closePanels();
        if (isHidden) {
            panel.classList.remove('hidden');
            this.updatePanelContent(id);
            // Exit pointer lock when opening panel
            if (this.pointerLocked) document.exitPointerLock();
        }
        if (!isHidden) {
            if (id === 'panel-crafting') document.getElementById('btn-craft').classList.add('active');
            if (id === 'panel-build') document.getElementById('btn-build').classList.add('active');
            if (id === 'panel-tech') document.getElementById('btn-tech').classList.add('active');
        }
    }

    closePanels() {
        document.querySelectorAll('.side-panel').forEach(p => p.classList.add('hidden'));
        document.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
        // Re-request pointer lock after closing panels
        if (this.gameRunning) {
            this.requestPointerLock();
            if (!this.pointerLocked) {
                const prompt = document.getElementById('pointer-lock-prompt');
                prompt.classList.remove('hidden');
                prompt.classList.add('visible');
            }
        }
    }

    updatePanelContent(id) {
        if (id === 'panel-crafting') this.renderCrafting();
        if (id === 'panel-build') this.renderBuild();
        if (id === 'panel-tech') this.renderTech();
    }

    // --- Raycasting for interaction ---
    getTargetTile() {
        // Raycast from camera center
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);

        // Check resource and building meshes
        const targets = [...this.resourceMeshes.values(), ...this.buildingMeshes.values()];
        const intersects = raycaster.intersectObjects(targets, true);

        if (intersects.length > 0) {
            const hit = intersects[0];
            let obj = hit.object;
            while (obj.userData && !obj.userData.tx) obj = obj.parent;
            if (obj.userData && obj.userData.tx !== undefined) {
                return { tx: obj.userData.tx, ty: obj.userData.ty, type: obj.userData.type, distance: hit.distance };
            }
        }

        // Also check terrain for build placement
        const terrainHit = raycaster.intersectObject(this.terrainMesh, false);
        if (terrainHit.length > 0) {
            const point = terrainHit[0].point;
            const { tx, ty } = this.world.worldToTile(point.x, point.z);
            return { tx, ty, type: 'terrain', distance: terrainHit[0].distance };
        }
        return null;
    }

    // --- Interaction ---
    interact() {
        if (this.player.harvesting) return;
        const target = this.getTargetTile();
        if (!target) return;
        if (target.distance > INTERACT_RANGE) {
            this.notify('Too far away!', 'warning');
            return;
        }
        const tile = this.world.getTile(target.tx, target.ty);
        if (!tile) return;

        if (target.type === 'building' && tile.building) {
            this.interactWithBuilding(target.tx, target.ty, tile);
            return;
        }
        if (tile.resource) {
            const resDef = RESOURCE_TYPES[tile.resource];
            if (resDef.forage) {
                this.forage(target.tx, target.ty, tile, resDef);
            } else {
                this.startHarvest(target.tx, target.ty, tile);
            }
        }
    }

    forage(tx, ty, tile, resDef) {
        const resKey = this.getLastResourceType(resDef);
        // Picking up a plant is always safe - effects only apply when eaten
        for (const [item, amt] of Object.entries(resDef.yields)) {
            this.player.addItem(item, amt);
            this.notify(`+${amt} ${ITEMS[item]?.name || item}`, 'success');
        }
        tile.resource = null;
        tile.resourceAmount = 0;
        this.removeResourceMesh(tx, ty);
        this.world.queueRespawn(tx, ty, resKey);
        this.player.energy = Math.max(0, this.player.energy - 1);
        this.researchPoints += 0.3;
        this.updateInventoryUI();
        this.updateUI();
        this.checkQuests();
    }

    getLastResourceType(resDef) {
        for (const [key, def] of Object.entries(RESOURCE_TYPES)) {
            if (def === resDef) return key;
        }
        return 'bush';
    }

    // --- Eating ---
    eatSelectedItem() {
        const items = Object.entries(this.player.inventory).filter(([_, c]) => c > 0);
        const entry = items[this.player.selectedSlot];
        if (!entry) { this.notify('No item selected!', 'warning'); return; }
        const [itemKey] = entry;
        const def = ITEMS[itemKey];
        if (!def || !def.edible) { this.notify(`Can't eat ${def?.name || itemKey}!`, 'warning'); return; }
        this.player.removeItem(itemKey, 1);
        if (def.energy > 0 || def.health > 0) {
            this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + Math.max(0, def.energy));
            this.player.health = Math.min(this.player.maxHealth, this.player.health + Math.max(0, def.health));
        }
        if (def.health < 0) {
            this.player.health = Math.max(0, this.player.health + def.health);
        }
        if (def.energy < 0) {
            this.player.energy = Math.max(0, this.player.energy + def.energy);
        }
        if (def.health < 0 && def.health <= -40) {
            this.notify(`💀 The ${def.name} was deadly! ${def.health} HP!`, 'warning');
        } else if (def.health < 0) {
            this.notify(`☠️ The ${def.name} was poisonous! ${def.health} HP, ${def.energy} energy`, 'warning');
        } else {
            this.notify(`🍽️ Ate ${def.name}: +${def.energy} energy`, 'success');
        }
        this.updateInventoryUI();
        this.updateUI();
    }


    startHarvest(tx, ty, tile) {
        const resDef = RESOURCE_TYPES[tile.resource];
        const toolPower = this.player.toolPower;
        const toolType = this.player.tool?.tool;
        if (resDef.hardness > 0 && toolPower < resDef.hardness) {
            this.notify(`Need a stronger tool to harvest ${resDef.name}!`, 'warning');
            return;
        }
        let baseTime = resDef.hardness * 1.5 + 0.5;
        if (toolType === 'pickaxe' && ['stone','coal','iron','copper','gold','oil'].includes(tile.resource)) baseTime *= 0.5;
        if (toolType === 'axe' && tile.resource === 'tree') baseTime *= 0.5;
        this.player.harvesting = { tx, ty, progress: 0, total: baseTime, resource: tile.resource };
    }

    completeHarvest() {
        const h = this.player.harvesting;
        const tile = this.world.getTile(h.tx, h.ty);
        if (!tile || !tile.resource) { this.player.harvesting = null; return; }
        const resDef = RESOURCE_TYPES[h.resource];
        for (const [item, amt] of Object.entries(resDef.yields)) {
            this.player.addItem(item, amt);
            this.notify(`+${amt} ${ITEMS[item]?.name || item}`, 'success');
        }
        tile.resource = null;
        tile.resourceAmount = 0;
        this.removeResourceMesh(h.tx, h.ty);
        this.world.queueRespawn(h.tx, h.ty, h.resource);
        this.player.energy = Math.max(0, this.player.energy - 3);
        this.player.harvesting = null;
        this.researchPoints += 0.5;
        this.updateInventoryUI();
        this.checkQuests();
    }

    interactWithBuilding(tx, ty, tile) {
        const bd = tile.buildingData;
        const def = BUILDINGS[tile.building];
        if (tile.building === 'campfire') {
            if (this.player.energy < this.player.maxEnergy) {
                this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + 20);
                this.notify('⚡ Restored energy by the campfire', 'success');
                this.updateUI();
            } else { this.notify('Energy already full', 'info'); }
        } else if (tile.building === 'furnace') {
            for (const recipe of def.recipes) {
                if (this.player.hasCost(recipe.in)) {
                    this.player.payCost(recipe.in);
                    for (const [item, amt] of Object.entries(recipe.out)) {
                        this.player.addItem(item, amt);
                        this.notify(`Smelted: +${amt} ${ITEMS[item]?.name}`, 'success');
                    }
                    this.updateInventoryUI();
                    return;
                }
            }
            this.notify('Not enough materials to smelt', 'warning');
        } else {
            this.notify(`${def.name}: ${def.desc}`, 'info');
        }
    }

    // --- Building placement ---
    placeBuilding() {
        const target = this.getTargetTile();
        if (!target || target.type !== 'terrain') {
            this.notify('Invalid placement!', 'warning');
            return;
        }
        const { tx, ty } = target;
        const tile = this.world.getTile(tx, ty);
        if (!tile || !BIOMES[tile.biome].walkable) { this.notify("Can't build on water!", 'warning'); return; }
        if (tile.resource) { this.notify("Clear the resource first!", 'warning'); return; }
        if (tile.building) { this.notify('Tile occupied!', 'warning'); return; }
        // Distance check
        const dx = tx + 0.5 - this.player.x;
        const dy = ty + 0.5 - this.player.z;
        if (Math.sqrt(dx*dx + dy*dy) > 6) { this.notify('Too far away!', 'warning'); return; }
        const def = BUILDINGS[this.buildMode];
        if (!this.player.hasCost(def.cost)) { this.notify('Not enough resources!', 'warning'); return; }
        this.player.payCost(def.cost);
        tile.building = this.buildMode;
        tile.buildingData = { type: this.buildMode, progress: 0, fuelTimer: 0, active: false };
        this.buildingPositions.add(`${tx},${ty}`);
        this.addBuildingMesh(tx, ty, this.buildMode);
        this.notify(`Built ${def.name}!`, 'success');
        this.updateInventoryUI();
        this.updateUI();
        this.checkQuests();
    }

    // --- Building tick ---
    buildingTick(dt) {
        this.powerProduced = 0;
        this.powerConsumed = 0;
        // First pass: calculate power
        for (const key of this.buildingPositions) {
            const [x, y] = key.split(',').map(Number);
            const tile = this.world.tiles[y][x];
            if (!tile.building) continue;
            const def = BUILDINGS[tile.building];
            const bd = tile.buildingData;
            if (def.power > 0) {
                if (tile.building === 'power_plant') {
                    if (bd.fuelTimer > 0) { bd.fuelTimer -= dt; this.powerProduced += def.power; bd.active = true; }
                    else if (this.player.hasItem('coal', 1)) { this.player.removeItem('coal', 1); bd.fuelTimer = def.fuelTime; this.powerProduced += def.power; bd.active = true; }
                    else bd.active = false;
                } else if (tile.building === 'solar_panel') { this.powerProduced += def.power; bd.active = true; }
            }
            if (def.powerUse > 0) this.powerConsumed += def.powerUse;
        }
        const hasPower = this.powerProduced >= this.powerConsumed;
        // Second pass: production
        for (const key of this.buildingPositions) {
            const [x, y] = key.split(',').map(Number);
            const tile = this.world.tiles[y][x];
            if (!tile.building) continue;
            const def = BUILDINGS[tile.building];
            const bd = tile.buildingData;
            if (def.powerUse > 0 && !hasPower) { bd.active = false; continue; }
            if (tile.building === 'mining_drill') {
                bd.progress += dt;
                if (bd.progress >= 2) {
                    bd.progress = 0;
                    const neighbors = [[0,-1],[1,0],[0,1],[-1,0],[0,0]];
                    for (const [dx,dy] of neighbors) {
                        const nt = this.world.getTile(x+dx, y+dy);
                        if (nt && nt.resource) {
                            const resDef = RESOURCE_TYPES[nt.resource];
                            for (const [item, amt] of Object.entries(resDef.yields)) this.player.addItem(item, amt);
                            nt.resource = null; nt.resourceAmount = 0;
                            this.removeResourceMesh(x+dx, y+dy);
                            this.world.queueRespawn(x+dx, y+dy, nt.resource || 'stone');
                            bd.active = true; break;
                        }
                    }
                }
            } else if (tile.building === 'oil_pump') {
                bd.progress += dt;
                if (bd.progress >= 3) {
                    bd.progress = 0;
                    const neighbors = [[0,0],[0,-1],[1,0],[0,1],[-1,0]];
                    for (const [dx,dy] of neighbors) {
                        const nt = this.world.getTile(x+dx, y+dy);
                        if (nt && nt.resource === 'oil') {
                            this.player.addItem('oil', 2);
                            nt.resource = null; nt.resourceAmount = 0;
                            this.removeResourceMesh(x+dx, y+dy);
                            this.world.queueRespawn(x+dx, y+dy, 'oil');
                            bd.active = true; break;
                        }
                    }
                }
            } else if (tile.building === 'research_lab') {
                bd.progress += dt;
                if (bd.progress >= 2) { bd.progress = 0; this.researchPoints += def.researchRate; bd.active = true; }
            } else if (tile.building === 'research_table') {
                bd.progress += dt;
                if (bd.progress >= 4) { bd.progress = 0; this.researchPoints += def.researchRate; bd.active = true; }
            } else if (tile.building === 'furnace') {
                bd.progress += dt;
                if (bd.progress >= 3) {
                    bd.progress = 0;
                    for (const recipe of def.recipes) {
                        if (this.player.hasCost(recipe.in)) {
                            this.player.payCost(recipe.in);
                            for (const [item, amt] of Object.entries(recipe.out)) this.player.addItem(item, amt);
                            bd.active = true; break;
                        }
                    }
                }
            } else if (tile.building === 'assembler') {
                bd.progress += dt;
                if (bd.progress >= 2) {
                    bd.progress = 0;
                    for (const recipe of RECIPES) {
                        if (recipe.tech && !this.completedTech.has(recipe.tech)) continue;
                        if (this.player.hasCost(recipe.cost)) {
                            this.player.payCost(recipe.cost);
                            for (const [item, amt] of Object.entries(recipe.output)) this.player.addItem(item, amt);
                            bd.active = true; break;
                        }
                    }
                }
            }
        }
    }

    // --- Tech ---
    researchTech(techId) {
        const tech = TECH_TREE.find(t => t.id === techId);
        if (!tech || this.completedTech.has(techId)) return;
        for (const p of tech.prereq) if (!this.completedTech.has(p)) { this.notify('Complete prerequisites first!', 'warning'); return; }
        if (this.researchPoints < tech.cost) { this.notify(`Need ${tech.cost} RP (have ${Math.floor(this.researchPoints)})`, 'warning'); return; }
        this.researchPoints -= tech.cost;
        this.completedTech.add(techId);
        this.notify(`🔬 Researched: ${tech.name}!`, 'success');
        this.updateUI();
        this.renderTech();
        this.checkQuests();
    }

    isTechUnlocked(techId) { return !techId || this.completedTech.has(techId); }
    isTechAvailable(techId) {
        const tech = TECH_TREE.find(t => t.id === techId);
        if (!tech || this.completedTech.has(techId)) return false;
        return tech.prereq.every(p => this.completedTech.has(p));
    }

    // --- Crafting ---
    craft(recipeId) {
        const recipe = RECIPES.find(r => r.id === recipeId);
        if (!recipe) return;
        if (recipe.tech && !this.completedTech.has(recipe.tech)) { this.notify('Technology not researched!', 'warning'); return; }
        if (!this.player.hasCost(recipe.cost)) { this.notify('Not enough resources!', 'warning'); return; }
        this.player.payCost(recipe.cost);
        for (const [item, amt] of Object.entries(recipe.output)) {
            this.player.addItem(item, amt);
            this.notify(`Crafted: ${ITEMS[item]?.name || item} x${amt}`, 'success');
        }
        this.researchPoints += 1;
        this.updateInventoryUI();
        this.renderCrafting();
        this.checkQuests();
    }

    // --- Quest System ---
    checkQuests() {
        if (this.currentQuestIndex >= QUESTS.length) return;
        const quest = QUESTS[this.currentQuestIndex];
        if (quest.check(this)) {
            this.researchPoints += quest.reward;
            this.notify(`🎯 Quest complete: ${quest.title}! +${quest.reward} RP`, 'success');
            this.currentQuestIndex++;
            this.updateQuestUI();
            if (this.currentQuestIndex < QUESTS.length) {
                const next = QUESTS[this.currentQuestIndex];
                this.notify(`🎯 New quest: ${next.title}`, 'info');
            } else {
                this.notify('🏆 All quests complete! Keep building your empire!', 'success');
            }
        }
    }

    updateQuestUI() {
        const tracker = document.getElementById('quest-tracker');
        const text = document.getElementById('quest-text');
        if (this.currentQuestIndex >= QUESTS.length) {
            tracker.classList.remove('visible');
            return;
        }
        const quest = QUESTS[this.currentQuestIndex];
        text.innerHTML = `<div class="quest-title">${quest.title}</div><div class="quest-desc">${quest.desc}</div><div class="quest-progress">Quest ${this.currentQuestIndex + 1} / ${QUESTS.length} — Reward: ${quest.reward} RP</div>`;
        tracker.classList.add('visible');
    }

    countBuildings(type) {
        let count = 0;
        for (const key of this.buildingPositions) {
            const [x, y] = key.split(',').map(Number);
            if (this.world.tiles[y][x].building === type) count++;
        }
        return count;
    }

    respawn() {
        this.player.health = 50;
        this.player.energy = 50;
        this.player.x = this.spawnPoint.x;
        this.player.z = this.spawnPoint.z;
        this.player.harvesting = null;
        this.gameRunning = true;
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('crosshair').classList.add('visible');
        this.notify('😵 You respawned nearby with partial health!', 'warning');
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
        this.requestPointerLock();
        if (!this.pointerLocked) {
            const prompt = document.getElementById('pointer-lock-prompt');
            prompt.classList.remove('hidden');
            prompt.classList.add('visible');
        }
    }

    // --- Notifications ---
    notify(msg, type = 'info') {
        const el = document.createElement('div');
        el.className = `notification ${type}`;
        el.textContent = msg;
        document.getElementById('notifications').appendChild(el);
        setTimeout(() => el.remove(), 3500);
    }

    // --- Main loop ---
    loop(time) {
        if (!this.gameRunning) return;
        const dt = Math.min((time - this.lastTime) / 1000, 0.1);
        this.lastTime = time;
        this.time += dt;
        this.update(dt);
        this.render();
        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        const p = this.player;

        // Movement (WASD relative to camera yaw)
        const yaw = this.cameraRotation.yaw;
        // Forward vector (where camera looks on XZ plane)
        const fwdX = -Math.sin(yaw);
        const fwdZ = -Math.cos(yaw);
        // Right vector (perpendicular to forward)
        const rightX = Math.cos(yaw);
        const rightZ = -Math.sin(yaw);

        let dx = 0, dz = 0;
        if (this.keys['w'] || this.keys['arrowup']) { dx += fwdX; dz += fwdZ; }
        if (this.keys['s'] || this.keys['arrowdown']) { dx -= fwdX; dz -= fwdZ; }
        if (this.keys['a'] || this.keys['arrowleft']) { dx -= rightX; dz -= rightZ; }
        if (this.keys['d'] || this.keys['arrowright']) { dx += rightX; dz += rightZ; }

        // Sprinting
        const isSprinting = (this.keys['shift'] || this.keys['shiftleft']) && (dx !== 0 || dz !== 0) && p.energy > 0;
        // Swimming
        const ptx = Math.floor(p.x), pty = Math.floor(p.z);
        const currentTile = this.world.getTile(ptx, pty);
        const isSwimming = currentTile && currentTile.biome === 'water';

        if (dx !== 0 || dz !== 0) {
            const len = Math.sqrt(dx*dx + dz*dz);
            dx /= len; dz /= len;
            let speed = PLAYER_SPEED * dt;
            if (isSprinting && !isSwimming) speed *= 1.8;
            if (isSwimming) speed *= 0.5; // slower in water
            const newX = p.x + dx * speed;
            const newZ = p.z + dz * speed;
            // Collision + max step height (can't climb steep walls)
            const curH = this.world.getTileHeight(Math.floor(p.x), Math.floor(p.z));
            const MAX_STEP = 2.5;
            const canStep = (nx, nz) => {
                if (!this.world.isWalkable(nx, nz)) return false;
                const h = this.world.getTileHeight(Math.floor(nx), Math.floor(nz));
                return h - (curH + p.yOffset) <= MAX_STEP;
            };
            if (canStep(newX, p.z)) p.x = newX;
            if (canStep(p.x, newZ)) p.z = newZ;
            // Update facing
            p.rotation = Math.atan2(dx, dz);
            if (p.harvesting) p.harvesting = null;
        }

        // Movement energy costs
        if (isSwimming && (dx !== 0 || dz !== 0)) {
            p.energy = Math.max(0, p.energy - dt * 3); // swimming costs 3/s
        } else if (isSprinting) {
            p.energy = Math.max(0, p.energy - dt * 2); // running costs 2/s
        } else if (dx !== 0 || dz !== 0) {
            p.energy = Math.max(0, p.energy - dt * 0.5); // walking costs 0.5/s
        }
        // Swimming drains energy even when idle
        if (isSwimming) {
            p.energy = Math.max(0, p.energy - dt * 0.5);
            if (p.energy <= 0) p.health = Math.max(0, p.health - dt * 3); // drowning damage
        }

        p.x = Math.max(0.5, Math.min(WORLD_W - 0.5, p.x));
        p.z = Math.max(0.5, Math.min(WORLD_H - 0.5, p.z));

        // Update player Y to terrain height + jump offset
        const groundY = this.world.getTileHeight(Math.floor(p.x), Math.floor(p.z));
        // Jump physics
        if (p.jumpVel !== 0 || p.yOffset > 0) {
            p.yOffset += p.jumpVel * dt;
            p.jumpVel -= 30 * dt; // gravity
            if (p.yOffset <= 0) {
                p.yOffset = 0;
                p.jumpVel = 0;
            }
        }
        // Smooth Y toward ground height (no snapping when walking slopes)
        const targetY = groundY + p.yOffset;
        if (p.yOffset > 0) {
            p.y = targetY; // during jump, follow physics exactly
        } else {
            p.y += (targetY - p.y) * Math.min(1, dt * 12);
        }

        // Update player mesh (hidden in FPV but kept for shadows)
        this.playerMesh.position.set(p.x * TILE_SIZE, p.y, p.z * TILE_SIZE);
        this.playerMesh.rotation.y = p.rotation;
        this.playerMesh.visible = false;

        // Camera: first-person view
        const camYaw = this.cameraRotation.yaw;
        const camPitch = this.cameraRotation.pitch;
        const eyeHeight = PLAYER_HEIGHT;
        this.camera.position.set(p.x * TILE_SIZE, p.y + eyeHeight, p.z * TILE_SIZE);
        // Look direction from yaw + pitch
        const lookX = p.x * TILE_SIZE - Math.sin(camYaw) * Math.cos(camPitch);
        const lookY = p.y + eyeHeight + Math.sin(camPitch);
        const lookZ = p.z * TILE_SIZE - Math.cos(camYaw) * Math.cos(camPitch);
        this.camera.lookAt(lookX, lookY, lookZ);

        // Move sun with player for consistent shadows
        if (this.sun) {
            this.sun.position.set(p.x * TILE_SIZE + 50, 80, p.z * TILE_SIZE + 30);
            this.sun.target.position.set(p.x * TILE_SIZE, p.y, p.z * TILE_SIZE);
            this.sun.target.updateMatrixWorld();
        }

        // Harvesting
        if (p.harvesting) {
            p.harvesting.progress += dt;
            if (p.harvesting.progress >= p.harvesting.total) this.completeHarvest();
            this.updateHarvestUI();
        } else {
            document.getElementById('harvest-progress').classList.add('hidden');
        }

        // Interaction prompt
        this.updateInteractionPrompt();

        // Dynamic mesh loading/unloading near player
        this.meshUpdateAccumulator += dt;
        if (this.meshUpdateAccumulator >= 0.3) {
            this.meshUpdateAccumulator = 0;
            this.updateResourceMeshes();
            this.updateBuildingMeshes();
        }

        // Building tick
        this.tickAccumulator += dt;
        if (this.tickAccumulator >= 0.5) {
            this.tickAccumulator = 0;
            this.buildingTick(0.5);
            this.world.processRespawns(0.5);
            this.checkQuests();
            this.updateUI();
        }

        // Campfire regen
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const t = this.world.getTile(ptx + dx, pty + dy);
                if (t && t.building === 'campfire') {
                    p.energy = Math.min(p.maxEnergy, p.energy + dt * 5);
                    p.health = Math.min(p.maxHealth, p.health + dt * 2);
                }
            }
        }

        // Energy drain
        p.energy = Math.max(0, p.energy - dt * 0.3);
        if (p.energy <= 0) p.health = Math.max(0, p.health - dt * 2);
        if (p.health <= 0) {
            this.gameRunning = false;
            document.getElementById('game-over').classList.remove('hidden');
            document.getElementById('crosshair').classList.remove('visible');
            document.getElementById('quest-tracker').classList.remove('visible');
            if (this.pointerLocked) document.exitPointerLock();
        }

        // Animate campfire flames
        this.buildingMeshes.forEach((mesh, key) => {
            const [tx, ty] = key.split(',').map(Number);
            const tile = this.world.getTile(tx, ty);
            if (tile && tile.building === 'campfire') {
                const flame = mesh.getObjectByName('flame');
                const flame2 = mesh.getObjectByName('flame2');
                if (flame) flame.scale.y = 1 + Math.sin(this.time * 8) * 0.2;
                if (flame2) flame2.scale.y = 1 + Math.sin(this.time * 10 + 1) * 0.3;
            }
            // Active light pulse
            if (tile && tile.buildingData) {
                const light = mesh.getObjectByName('activeLight');
                if (light) {
                    const bd = tile.buildingData;
                    if (bd.active) {
                        light.material.color.setHex(0x00ff00);
                        light.scale.setScalar(1 + Math.sin(this.time * 4) * 0.2);
                    } else {
                        light.material.color.setHex(0xff0000);
                        light.scale.setScalar(1);
                    }
                }
            }
        });

        // Build preview
        if (this.buildMode) {
            this.updateBuildPreview();
        } else if (this.buildPreview) {
            this.scene.remove(this.buildPreview);
            this.buildPreview = null;
        }
    }

    updateBuildPreview() {
        const target = this.getTargetTile();
        if (!target) {
            if (this.buildPreview) this.buildPreview.visible = false;
            return;
        }
        const { tx, ty } = target;
        const tile = this.world.getTile(tx, ty);
        const canBuild = tile && BIOMES[tile.biome].walkable && !tile.resource && !tile.building;

        if (!this.buildPreview) {
            this.buildPreview = new THREE.Mesh(
                new THREE.BoxGeometry(TILE_SIZE * 0.9, 0.1, TILE_SIZE * 0.9),
                new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.4 })
            );
            this.scene.add(this.buildPreview);
        }
        const wy = this.world.getTileHeight(tx, ty);
        this.buildPreview.position.set(tx * TILE_SIZE + TILE_SIZE/2, wy + 0.05, ty * TILE_SIZE + TILE_SIZE/2);
        this.buildPreview.visible = true;
        this.buildPreview.material.color.setHex(canBuild ? 0x00ff00 : 0xff0000);
    }

    updateInteractionPrompt() {
        const target = this.getTargetTile();
        const el = document.getElementById('interaction-prompt');
        if (!target || target.distance > INTERACT_RANGE) {
            el.classList.add('hidden');
            return;
        }
        const tile = this.world.getTile(target.tx, target.ty);
        if (!tile) { el.classList.add('hidden'); return; }
        if (tile.resource && !this.player.harvesting && !this.buildMode) {
            const resDef = RESOURCE_TYPES[tile.resource];
            el.innerHTML = `<kbd>E / Click</kbd> Harvest ${resDef.icon} ${resDef.name}`;
            el.classList.remove('hidden');
        } else if (tile.building && !this.buildMode) {
            const def = BUILDINGS[tile.building];
            el.innerHTML = `<kbd>E / Click</kbd> ${def.icon} ${def.name}`;
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    }

    updateHarvestUI() {
        const h = this.player.harvesting;
        if (!h) return;
        const el = document.getElementById('harvest-progress');
        const fill = document.getElementById('harvest-progress-fill').firstElementChild;
        const label = document.getElementById('harvest-label');
        const resDef = RESOURCE_TYPES[h.resource];
        const pct = (h.progress / h.total) * 100;
        fill.style.width = pct + '%';
        label.textContent = `Harvesting ${resDef.name}...`;
        el.classList.remove('hidden');
    }

    // --- Render ---
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    // --- UI Updates ---
    updateUI() {
        document.getElementById('health-bar').style.width = (this.player.health / this.player.maxHealth * 100) + '%';
        document.getElementById('energy-bar').style.width = (this.player.energy / this.player.maxEnergy * 100) + '%';
        document.getElementById('research-points').textContent = Math.floor(this.researchPoints);
        document.getElementById('power-display').textContent = `${Math.floor(this.powerProduced)} / ${Math.floor(this.powerConsumed)}`;
        this.updateInventoryUI();
        if (!document.getElementById('panel-crafting').classList.contains('hidden')) this.renderCrafting();
        if (!document.getElementById('panel-build').classList.contains('hidden')) this.renderBuild();
        if (!document.getElementById('panel-tech').classList.contains('hidden')) this.renderTech();
    }

    updateInventoryUI() {
        const bar = document.getElementById('inventory-bar');
        bar.innerHTML = '';
        const items = Object.entries(this.player.inventory).filter(([_, c]) => c > 0);
        items.forEach(([item, count], i) => {
            const def = ITEMS[item];
            const slot = document.createElement('div');
            slot.className = 'inv-slot' + (i === this.player.selectedSlot ? ' selected' : '');
            slot.innerHTML = `<span class="inv-slot-key">${i + 1}</span><span class="inv-slot-icon">${def?.icon || '❓'}</span><span class="inv-slot-count">${count}</span>`;
            slot.title = def?.name || item;
            bar.appendChild(slot);
        });
    }

    renderCrafting() {
        const list = document.getElementById('crafting-list');
        list.innerHTML = '';
        for (const recipe of RECIPES) {
            if (recipe.tech && !this.completedTech.has(recipe.tech)) continue;
            const card = document.createElement('div');
            const canAfford = this.player.hasCost(recipe.cost);
            card.className = 'recipe-card' + (canAfford ? '' : ' cant-afford');
            const outItems = Object.entries(recipe.output).map(([item, amt]) => `${ITEMS[item]?.icon || ''} ${ITEMS[item]?.name || item} x${amt}`).join(', ');
            const costItems = Object.entries(recipe.cost).map(([item, amt]) => {
                const has = this.player.hasItem(item, amt);
                return `<span class="cost-item${has ? '' : ' lacking'}">${ITEMS[item]?.icon || ''} ${amt}</span>`;
            }).join('');
            card.innerHTML = `<div class="recipe-header"><span class="recipe-icon">${ITEMS[Object.keys(recipe.output)[0]]?.icon || '🔨'}</span><span class="recipe-name">${outItems}</span></div><div class="recipe-cost">Cost: ${costItems}</div>`;
            card.addEventListener('click', () => this.craft(recipe.id));
            list.appendChild(card);
        }
        if (list.children.length === 0) list.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">No recipes available. Research technology to unlock more!</p>';
    }

    renderBuild() {
        const list = document.getElementById('build-list');
        list.innerHTML = '';
        for (const [id, def] of Object.entries(BUILDINGS)) {
            if (def.tech && !this.completedTech.has(def.tech)) continue;
            const card = document.createElement('div');
            const canAfford = this.player.hasCost(def.cost);
            card.className = 'build-card' + (canAfford ? '' : ' cant-afford');
            const costItems = Object.entries(def.cost).map(([item, amt]) => {
                const has = this.player.hasItem(item, amt);
                return `<span class="cost-item${has ? '' : ' lacking'}">${ITEMS[item]?.icon || ''} ${amt}</span>`;
            }).join('');
            const powerInfo = def.power > 0 ? ` ⚡+${def.power}` : (def.powerUse > 0 ? ` ⚡-${def.powerUse}` : '');
            card.innerHTML = `<div class="build-header"><span class="build-icon">${def.icon}</span><span class="build-name">${def.name}${powerInfo}</span></div><div style="font-size:11px;color:#999;margin-bottom:4px;">${def.desc}</div><div class="build-cost">Cost: ${costItems}</div>`;
            card.addEventListener('click', () => {
                this.buildMode = id;
                this.updateBuildModeUI();
                document.getElementById('panel-build').classList.add('hidden');
                document.getElementById('btn-build').classList.remove('active');
                this.requestPointerLock();
            });
            list.appendChild(card);
        }
        if (list.children.length === 0) list.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">No buildings available. Research technology to unlock more!</p>';
    }

    renderTech() {
        const list = document.getElementById('tech-list');
        list.innerHTML = '';
        for (const tech of TECH_TREE) {
            const completed = this.completedTech.has(tech.id);
            const available = this.isTechAvailable(tech.id);
            const card = document.createElement('div');
            card.className = 'tech-card' + (completed ? ' completed' : '') + (available ? ' available' : (!completed ? ' locked' : ''));
            let status;
            if (completed) status = '<span class="tech-status" style="color:#2ecc71;">✓ Done</span>';
            else if (available) status = `<span class="tech-status" style="color:#f1c40f;">${tech.cost} RP</span>`;
            else status = '<span class="tech-status" style="color:#888;">🔒 Locked</span>';
            const prereqText = tech.prereq.length > 0 ? `<div class="tech-prereq">Requires: ${tech.prereq.map(p => TECH_TREE.find(t=>t.id===p)?.name).join(', ')}</div>` : '';
            card.innerHTML = `<div class="tech-header"><span class="tech-icon">${tech.icon}</span><span class="tech-name">${tech.name}</span>${status}</div><div class="tech-desc">${tech.desc}</div>${prereqText}`;
            if (available) { card.style.cursor = 'pointer'; card.addEventListener('click', () => this.researchTech(tech.id)); }
            list.appendChild(card);
        }
    }

    updateBuildModeUI() {
        const el = document.getElementById('build-mode-indicator');
        if (this.buildMode) {
            el.classList.remove('hidden');
            document.getElementById('build-mode-name').textContent = `Placing: ${BUILDINGS[this.buildMode].icon} ${BUILDINGS[this.buildMode].name} — Click to place`;
        } else {
            el.classList.add('hidden');
        }
    }
}

// --- Start ---
const game = new Game();
