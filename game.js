// ============================================================
//  EXPLORE & BUILD 3D  Survival Technology Game
//  Three.js powered 3D edition
// ============================================================

// --- Constants ---
const TILE_SIZE = 4;       // 3D world units per tile
const WORLD_W = 100;
const WORLD_H = 100;
const PLAYER_SPEED = 1.5;
const PLAYER_HEIGHT = 1.8;
const INTERACT_RANGE = 6;

// --- Biome types ---
const BIOMES = {
    water:    { color: 0x1a5276, name: 'Water',    walkable: false, height: -0.5 },
    sand:     { color: 0xe8d5a0, name: 'Beach',    walkable: true,  height: 0.2 },
    grass:    { color: 0x5a8c3a, name: 'Grass',    walkable: true,  height: 0.5 },
    forest:   { color: 0x2d4a1a, name: 'Forest',   walkable: true,  height: 0.6 },
    mountain: { color: 0x8a8a8a, name: 'Mountain', walkable: true,  height: 1.5 },
    snow:     { color: 0xe8e8e8, name: 'Snow',     walkable: true,  height: 1.8 },
    desert:   { color: 0xd4a858, name: 'Desert',   walkable: true,  height: 0.3 },
};

// --- Resource types ---
const RESOURCE_TYPES = {
    tree:    { icon: 'tree',    name: 'Tree',    yields: { wood: 3 },       biome: ['forest','grass','sand','desert'], hardness: 1 },
    bush:    { icon: 'bush', name: 'Berry Bush', yields: { food: 2 }, biome: ['forest','grass'], hardness: 0, forage: true, forageType: 'edible' },
    red_mushroom:  { icon: 'red_mushroom', name: 'Red Mushroom', yields: { red_mushroom: 1 }, biome: ['forest','grass'], hardness: 0, forage: true, forageType: 'edible' },
    purple_mushroom: { icon: 'purple_mushroom', name: 'Purple Mushroom', yields: { purple_mushroom: 1 }, biome: ['forest','grass'], hardness: 0, forage: true, forageType: 'poisonous' },
    red_berries:   { icon: 'red_berries', name: 'Red Berries', yields: { red_berries: 2 }, biome: ['forest','grass','sand'], hardness: 0, forage: true, forageType: 'edible' },
    nightshade:    { icon: 'nightshade', name: 'Dark Berries', yields: { nightshade: 1 }, biome: ['forest','grass'], hardness: 0, forage: true, forageType: 'deadly' },
    cactus_fruit:  { icon: 'cactus_fruit', name: 'Cactus Fruit', yields: { cactus_fruit: 2 }, biome: ['desert','sand'], hardness: 0, forage: true, forageType: 'edible' },
    glowing_plant: { icon: 'glowing_plant', name: 'Glowing Plant', yields: { glowing_plant: 3 }, biome: ['snow','mountain'], hardness: 0, forage: true, forageType: 'edible' },
    thorn_bush:    { icon: 'thorn_bush', name: 'Thorn Bush', yields: { thorn_bush: 1 }, biome: ['desert','sand'], hardness: 0, forage: true, forageType: 'poisonous' },
    stone:   { icon: 'stone',   name: 'Stone',   yields: { stone: 3 },      biome: ['mountain','grass','forest'], hardness: 1 },
    coal:    { icon: 'coal',    name: 'Coal',    yields: { coal: 3 },       biome: ['mountain'],       hardness: 2 },
    iron:    { icon: 'iron',    name: 'Iron',    yields: { iron_ore: 3 },   biome: ['mountain'],       hardness: 2 },
    copper:  { icon: 'copper',  name: 'Copper',  yields: { copper_ore: 3 }, biome: ['mountain'],       hardness: 3 },
    gold:    { icon: 'gold',    name: 'Gold',    yields: { gold_ore: 2 },   biome: ['mountain'],       hardness: 4 },
    oil:     { icon: 'oil',     name: 'Oil',     yields: { oil: 2 },        biome: ['desert','snow'],  hardness: 3 },
    soil:         { icon: 'soil', name: 'Soil', yields: { soil: 2 }, biome: ['forest','grass'], hardness: 0 },
    grass:        { icon: 'grass', name: 'Grass', yields: { grass: 2 }, biome: ['forest','grass'], hardness: 0, forage: true, forageType: 'edible' },
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
    soil: 40,
    grass: 30,
};

// --- Items ---
// Edible items have `edible: true` and effects applied only when eaten (press F)
const ITEMS = {
    wood:        { icon: 'wood', name: 'Wood', attackPower: 3 },
    plank:       { icon: 'plank', name: 'Plank', attackPower: 3 },
    stone:       { icon: 'stone', name: 'Stone', attackPower: 4 },
    food:        { icon: 'food', name: 'Food', edible: true, energy: 15, health: 0 },
    red_mushroom:    { icon: 'red_mushroom', name: 'Red Mushroom', edible: true, energy: 20, health: 0 },
    red_berries:     { icon: 'red_berries', name: 'Red Berries', edible: true, energy: 12, health: 0 },
    cactus_fruit:    { icon: 'cactus_fruit', name: 'Cactus Fruit', edible: true, energy: 12, health: 0 },
    glowing_plant:   { icon: 'glowing_plant', name: 'Glowing Plant', edible: true, energy: 18, health: 0 },
    purple_mushroom: { icon: 'purple_mushroom', name: 'Purple Mushroom', edible: true, energy: -10, health: -15 },
    thorn_bush:      { icon: 'thorn_bush', name: 'Thorn Bush', edible: true, energy: -10, health: -15 },
    nightshade:      { icon: 'nightshade', name: 'Dark Berries', edible: true, energy: 0, health: -50 },
    leather:     { icon: 'leather', name: 'Leather', attackPower: 5 },
    coal:        { icon: 'coal', name: 'Coal' },
    iron_ore:    { icon: 'iron_ore', name: 'Iron Ore' },
    iron_ingot:  { icon: 'iron_ingot', name: 'Iron Ingot' },
    copper_ore:  { icon: 'copper_ore', name: 'Copper Ore' },
    copper_ingot:{ icon: 'copper_ingot', name: 'Copper Ingot' },
    gold_ore:    { icon: 'gold_ore', name: 'Gold Ore' },
    gold_ingot:  { icon: 'gold_ingot', name: 'Gold Ingot' },
    oil:         { icon: 'oil', name: 'Oil' },
    soil:         { icon: 'soil', name: 'Soil', attackPower: 3 },
    grass:        { icon: 'grass', name: 'Grass', attackPower: 1 },
    brick:       { icon: 'brick', name: 'Brick', attackPower: 6 },
    gear:        { icon: 'gear', name: 'Gear', attackPower: 4 },
    circuit:     { icon: 'circuit', name: 'Circuit', attackPower: 3 },
    battery:     { icon: 'battery', name: 'Battery', attackPower: 3 },
    wood_pickaxe:{ icon: 'wood_pickaxe', name: 'Wooden Pickaxe', tool: 'pickaxe', power: 1, attackPower: 8 },
    stone_pickaxe:{icon: 'stone_pickaxe', name: 'Stone Pickaxe',  tool: 'pickaxe', power: 2, attackPower: 12 },
    iron_pickaxe:{ icon: 'iron_pickaxe', name: 'Iron Pickaxe',   tool: 'pickaxe', power: 3, attackPower: 18 },
    wood_axe:    { icon: 'wood_axe', name: 'Wooden Axe',     tool: 'axe',     power: 1, attackPower: 10 },
    stone_axe:   { icon: 'stone_axe', name: 'Stone Axe',      tool: 'axe',     power: 2, attackPower: 14 },
    iron_axe:    { icon: 'iron_axe', name: 'Iron Axe',       tool: 'axe',     power: 3, attackPower: 20 },
    raw_meat:    { icon: 'raw_meat', name: 'Raw Meat', edible: true, energy: 8, health: -5, attackPower: 2 },
    cooked_meat: { icon: 'cooked_meat', name: 'Cooked Meat', edible: true, energy: 25, health: 5, attackPower: 2 },
    fang:        { icon: 'fang', name: 'Fang', attackPower: 7 },
    hunting_gun: { icon: 'hunting_gun', name: 'Hunting Gun', tool: 'gun', power: 0, attackPower: 35, ranged: true, range: 30 },
    spider_web:  { icon: 'spider_web', name: 'Spider Web' },
    fishing_rod: { icon: 'fishing_rod', name: 'Fishing Rod', tool: 'fishing' },
    raw_fish:    { icon: 'raw_fish', name: 'Raw Fish', edible: true, energy: 10, health: -3, attackPower: 2 },
    cooked_fish: { icon: 'cooked_fish', name: 'Cooked Fish', edible: true, energy: 22, health: 5, attackPower: 2 },
};

// --- Creature types ---
const CREATURE_TYPES = {
    deer:    { name: 'Deer',     health: 20, speed: 3.5, damage: 0,  hostile: false, fleeDist: 12, attackRange: 0, drops: { raw_meat: 2, leather: 1 }, xp: 3, biomes: ['forest','grass'], spawnWeight: 3, canBeFed: true, followChance: 0.08, isPrey: true, canFightWolf: true, eatsGrass: true, alertDist: 15, freezeDuration: 1.5, herdAnimal: true, crepuscular: true },
    fawn:    { name: 'Fawn',     health: 8,  speed: 2.8, damage: 0,  hostile: false, fleeDist: 10, attackRange: 0, drops: { raw_meat: 1 }, xp: 1, biomes: ['forest','grass'], spawnWeight: 2, canBeFed: true, followChance: 0.15, isPrey: true, eatsGrass: true, alertDist: 12, freezeDuration: 2, followsParent: true, crepuscular: true },
    wolf:    { name: 'Wolf',     health: 80, speed: 4.5, damage: 18, hostile: false, fleeDist: 0, attackRange: 2.0, drops: { raw_meat: 2, leather: 1, fang: 2 }, xp: 10, biomes: ['forest','grass','snow'], spawnWeight: 0.15, packSpawn: true, isPredator: true, huntsPrey: true, stalkDist: 20, cautious: true, territorial: true, aggroRange: 6, starveTimer: 60 },
    bear:    { name: 'Bear',     health: 150, speed: 3.0, damage: 35, hostile: false, fleeDist: 0, attackRange: 2.8, drops: { raw_meat: 5, leather: 3, fang: 3 }, xp: 20, biomes: ['mountain','forest'], spawnWeight: 0.1, aggroWhenAttacked: true, hungerChance: 0.15, canBeFed: true, followChance: 0.03, isPredator: true, huntsPrey: true, eatsBerries: true, foragesBerries: true, fishes: true, solitary: true, aggroRange: 5, warningDist: 10 },
    rabbit:  { name: 'Rabbit',   health: 8,  speed: 3.5, damage: 0,  hostile: false, fleeDist: 8, attackRange: 0, drops: { raw_meat: 1 }, xp: 1, biomes: ['grass','forest','sand'], spawnWeight: 3, canBeFed: true, followChance: 0.05, isPrey: true, alertDist: 10, freezeDuration: 1.5, zigzag: true, burrowChance: true },
    spider:  { name: 'Spider',   health: 10, speed: 2.5, damage: 6,  hostile: false, fleeDist: 0, attackRange: 1.2, drops: { fang: 1, leather: 1, spider_web: 1 }, xp: 3, biomes: ['desert','mountain','forest'], spawnWeight: 2, aggroWhenAttacked: true, onWeb: true, nocturnal: true },
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
    { id: 'cooked_meat',  output: { cooked_meat: 1 },  cost: { raw_meat: 1, wood: 1 },  tech: null },
    { id: 'hunting_gun',  output: { hunting_gun: 1 },  cost: { iron_ingot: 2, wood: 1, stone: 1 }, tech: 'iron_tools' },
    { id: 'fishing_rod',  output: { fishing_rod: 1 },  cost: { spider_web: 1, wood: 2 }, tech: null },
    { id: 'cooked_fish',  output: { cooked_fish: 1 },  cost: { raw_fish: 1, wood: 1 }, tech: null },
];

// --- Buildings ---
const BUILDINGS = {
    campfire: {
        icon: 'campfire', name: 'Campfire', cost: { wood: 5, stone: 3 }, tech: null,
        desc: 'Restores energy when nearby', power: 0, powerUse: 0,
        color: 0xe67e22, size: { w: 1.5, h: 1.0, d: 1.5 },
    },
    research_table: {
        icon: 'research_table', name: 'Research Table', cost: { wood: 8, stone: 5 }, tech: null,
        desc: 'Generates research points slowly', power: 0, powerUse: 0,
        color: 0x8B4513, size: { w: 2, h: 1.5, d: 2 },
        researchRate: 0.5,
    },
    furnace: {
        icon: 'furnace', name: 'Furnace', cost: { brick: 4 }, tech: 'smelting',
        desc: 'Smelts ore into ingots', power: 0, powerUse: 0,
        color: 0x555555, size: { w: 2, h: 2.5, d: 2 },
        recipes: [
            { in: { iron_ore: 2, coal: 1 }, out: { iron_ingot: 2 }, time: 3 },
            { in: { copper_ore: 2, coal: 1 }, out: { copper_ingot: 2 }, time: 3 },
            { in: { gold_ore: 2, coal: 1 }, out: { gold_ingot: 1 }, time: 5 },
        ],
    },
    mining_drill: {
        icon: 'mining_drill', name: 'Mining Drill', cost: { iron_ingot: 5, gear: 3 }, tech: 'mining_automation',
        desc: 'Auto-mines resources from adjacent tiles', power: 0, powerUse: 10,
        color: 0x888888, size: { w: 2, h: 3, d: 2 },
    },
    power_plant: {
        icon: 'power_plant', name: 'Power Plant', cost: { iron_ingot: 8, copper_ingot: 4, gear: 5 }, tech: 'power_generation',
        desc: 'Generates power from coal', power: 50, powerUse: 0,
        color: 0x8e44ad, size: { w: 3, h: 4, d: 3 },
        fuel: { coal: 1 }, fuelTime: 10,
    },
    solar_panel: {
        icon: 'solar_panel', name: 'Solar Panel', cost: { copper_ingot: 5, circuit: 2, iron_ingot: 3 }, tech: 'renewable_energy',
        desc: 'Generates free power', power: 20, powerUse: 0,
        color: 0x1a5276, size: { w: 3, h: 0.3, d: 2 },
    },
    research_lab: {
        icon: 'research_lab', name: 'Research Lab', cost: { iron_ingot: 10, copper_ingot: 5, circuit: 3 }, tech: 'scientific_method',
        desc: 'Generates research points', power: 0, powerUse: 15,
        color: 0x2ecc71, size: { w: 3, h: 3, d: 3 },
        researchRate: 1,
    },
    oil_pump: {
        icon: 'oil_pump', name: 'Oil Pump', cost: { iron_ingot: 6, gear: 4 }, tech: 'oil_processing',
        desc: 'Pumps oil from oil tiles', power: 0, powerUse: 8,
        color: 0x34495e, size: { w: 2, h: 3.5, d: 2 },
    },
    assembler: {
        icon: 'assembler', name: 'Assembler', cost: { iron_ingot: 10, gear: 8, circuit: 4 }, tech: 'automation',
        desc: 'Automatically crafts items', power: 0, powerUse: 12,
        color: 0xe74c3c, size: { w: 2.5, h: 2.5, d: 2.5 },
    },
    wood_hut: {
        icon: 'wood_hut', name: 'Wood Hut', cost: { plank: 10 }, tech: null,
        desc: 'Sleep here at night to restore health & energy', power: 0, powerUse: 0,
        color: 0x8B6B47, size: { w: 3, h: 2.5, d: 3 },
    },
};

// --- Technology tree ---
const TECH_TREE = [
    { id: 'stone_tools',       icon: 'stone_tools', name: 'Stone Tools',       cost: 5,   prereq: [],                  desc: 'Unlock stone pickaxe & axe' },
    { id: 'smelting',          icon: 'smelting', name: 'Smelting',           cost: 10,  prereq: ['stone_tools'],      desc: 'Unlock furnace to smelt ore' },
    { id: 'iron_tools',        icon: 'iron_tools', name: 'Iron Tools',         cost: 15,  prereq: ['smelting'],         desc: 'Unlock iron pickaxe & axe' },
    { id: 'machinery',         icon: 'machinery', name: 'Machinery',          cost: 25,  prereq: ['iron_tools'],       desc: 'Craft gears for machines' },
    { id: 'power_generation',  icon: 'power_generation', name: 'Power Generation',   cost: 30,  prereq: ['machinery'],        desc: 'Build power plants' },
    { id: 'scientific_method', icon: 'scientific_method', name: 'Scientific Method',  cost: 35,  prereq: ['machinery'],        desc: 'Build research labs' },
    { id: 'mining_automation', icon: 'mining_automation', name: 'Mining Automation',  cost: 40,  prereq: ['power_generation'], desc: 'Build mining drills' },
    { id: 'electronics',       icon: 'electronics', name: 'Electronics',        cost: 50,  prereq: ['power_generation','scientific_method'], desc: 'Craft circuits & batteries' },
    { id: 'oil_processing',    icon: 'oil_processing', name: 'Oil Processing',     cost: 45,  prereq: ['machinery'],        desc: 'Build oil pumps' },
    { id: 'renewable_energy',  icon: 'renewable_energy', name: 'Renewable Energy',   cost: 60,  prereq: ['electronics'],      desc: 'Build solar panels' },
    { id: 'automation',        icon: 'automation', name: 'Automation',         cost: 70,  prereq: ['electronics','mining_automation'], desc: 'Build assemblers' },
];

// ============================================================
//  Quest / Tutorial System
// ============================================================
const QUESTS = [
    { id: 'harvest_wood',   title: 'Gather Wood',    desc: 'Find a tree and harvest it',         check: (g) => g.player.hasItem('wood', 1),         reward: 2 },
    { id: 'harvest_stone',  title: 'Gather Stone',   desc: 'Find a rock on a mountain and harvest it', check: (g) => g.player.hasItem('stone', 1),  reward: 2 },
    { id: 'craft_pickaxe',  title: 'Craft a Pickaxe', desc: 'Press C and craft a wooden pickaxe',  check: (g) => g.player.hasItem('wood_pickaxe', 1) || g.player.hasItem('stone_pickaxe', 1) || g.player.hasItem('iron_pickaxe', 1), reward: 3 },
    { id: 'build_campfire', title: 'Build a Campfire', desc: 'Press B and place a campfire',       check: (g) => g.countBuildings('campfire') > 0,   reward: 3 },
    { id: 'research_stone', title: 'Research Stone Tools', desc: 'Press T and unlock Stone Tools (5 RP)', check: (g) => g.completedTech.has('stone_tools'), reward: 5 },
    { id: 'build_furnace',  title: 'Build a Furnace', desc: 'Craft bricks, then build a furnace',  check: (g) => g.countBuildings('furnace') > 0,    reward: 5 },
    { id: 'smelt_iron',     title: 'Smelt Iron',     desc: 'Get iron ore + coal, use furnace to smelt', check: (g) => g.player.hasItem('iron_ingot', 1), reward: 5 },
    { id: 'research_iron',  title: 'Research Iron Tools', desc: 'Unlock Iron Tools in the tech tree',    check: (g) => g.completedTech.has('iron_tools'),  reward: 8 },
    { id: 'build_lab',      title: 'Build a Research Lab', desc: 'Build a research lab for auto RP',   check: (g) => g.countBuildings('research_lab') > 0, reward: 10 },
    { id: 'build_power',    title: 'Generate Power',  desc: 'Build a power plant to power machines', check: (g) => g.countBuildings('power_plant') > 0, reward: 10 },
    { id: 'build_drill',    title: 'Automate Mining', desc: 'Build a mining drill near resources',   check: (g) => g.countBuildings('mining_drill') > 0, reward: 12 },
    { id: 'research_electronics', title: 'Research Electronics', desc: 'Unlock Electronics in the tech tree', check: (g) => g.completedTech.has('electronics'), reward: 15 },
    { id: 'build_solar',    title: 'Go Solar',       desc: 'Build a solar panel for free power',   check: (g) => g.countBuildings('solar_panel') > 0, reward: 15 },
    { id: 'build_assembler', title: 'Full Automation', desc: 'Build an assembler to auto-craft',     check: (g) => g.countBuildings('assembler') > 0,  reward: 20 },
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
//  World (data model  same logic, 3D rendering separate)
// ============================================================
class World {
    constructor(seed) {
        this.seed = seed;
        this.noise = new Noise(seed);
        this.noise2 = new Noise(seed + 1000);
        this.tiles = [];
        this.respawnQueue = []; // { tx, ty, type, timer }
        this.bearCaves = []; // { tx, ty, x, z } — bear cave locations on mountain sides
        this.generate();
        this.generateBearCaves();
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
                const tile = { biome, resource: null, resourceAmount: 0, building: null, buildingData: null, elevation: e, digDepth: 0 };
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
        // Mountain peaks (highest elevation) are rockier
        if (tile.biome === 'mountain' && tile.elevation > 0.85) density = 0.65;
        if (r < density) {
            if (tile.biome === 'mountain') {
                const r2 = this.rand(x, y, 2);
                if (tile.elevation > 0.85) {
                    // Peaks are mostly bare rock
                    if (r2 < 0.65) tile.resource = 'stone';
                    else if (r2 < 0.78) tile.resource = 'coal';
                    else if (r2 < 0.88) tile.resource = 'iron';
                    else tile.resource = 'stone';
                } else if (r2 < 0.20) tile.resource = 'stone';
                else if (r2 < 0.38) tile.resource = 'coal';
                else if (r2 < 0.55) tile.resource = 'iron';
                else if (r2 < 0.70) tile.resource = 'copper';
                else if (r2 < 0.78) tile.resource = 'gold';
                else if (r2 < 0.85) tile.resource = 'glowing_plant';
                else tile.resource = 'stone';
            } else if (tile.biome === 'forest') {
                const r2 = this.rand(x, y, 3);
                if (r2 < 0.55) tile.resource = 'tree';
                else if (r2 < 0.60) tile.resource = 'bush';
                else if (r2 < 0.65) tile.resource = 'red_berries';
                else if (r2 < 0.70) tile.resource = 'red_mushroom';
                else if (r2 < 0.74) tile.resource = 'purple_mushroom';
                else if (r2 < 0.77) tile.resource = 'nightshade';
                else if (r2 < 0.82) tile.resource = 'stone';
                else if (r2 < 0.88) tile.resource = 'soil';
                else if (r2 < 0.94) tile.resource = 'grass';
                else tile.resource = 'tree';
            } else if (tile.biome === 'grass') {
                const r2 = this.rand(x, y, 3);
                if (r2 < 0.55) tile.resource = 'tree';
                else if (r2 < 0.60) tile.resource = 'bush';
                else if (r2 < 0.66) tile.resource = 'red_berries';
                else if (r2 < 0.71) tile.resource = 'red_mushroom';
                else if (r2 < 0.75) tile.resource = 'purple_mushroom';
                else if (r2 < 0.78) tile.resource = 'nightshade';
                else if (r2 < 0.85) tile.resource = 'stone';
                else if (r2 < 0.92) tile.resource = 'soil';
                else if (r2 < 0.97) tile.resource = 'grass';
                else tile.resource = 'tree';
            } else if (tile.biome === 'sand') {
                const r2 = this.rand(x, y, 3);
                if (r2 < 0.55) tile.resource = 'tree';
                else if (r2 < 0.68) tile.resource = 'red_berries';
                else if (r2 < 0.78) tile.resource = 'cactus_fruit';
                else if (r2 < 0.85) tile.resource = 'thorn_bush';
                else tile.resource = 'tree';
            } else if (tile.biome === 'desert') {
                const r2 = this.rand(x, y, 3);
                if (r2 < 0.45) tile.resource = 'tree';
                else if (r2 < 0.58) tile.resource = 'cactus_fruit';
                else if (r2 < 0.68) tile.resource = 'thorn_bush';
                else if (r2 < 0.75) tile.resource = 'oil';
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
    generateBearCaves() {
        // Place bear caves on mountain tiles adjacent to lower-elevation tiles (mountain sides)
        for (let y = 2; y < WORLD_H - 2; y++) {
            for (let x = 2; x < WORLD_W - 2; x++) {
                const tile = this.tiles[y][x];
                if (tile.biome !== 'mountain') continue;
                // Check if this is a mountain side (adjacent to non-mountain, non-water walkable tile)
                const neighbors = [[0,-1],[1,0],[0,1],[-1,0]];
                let hasLowNeighbor = false;
                for (const [dx, dy] of neighbors) {
                    const nt = this.tiles[y + dy][x + dx];
                    if (nt && (nt.biome === 'forest' || nt.biome === 'grass' || nt.biome === 'sand')) {
                        hasLowNeighbor = true;
                        break;
                    }
                }
                if (!hasLowNeighbor) continue;
                // Use deterministic random to place ~1 cave per 20x20 area
                const r = this.rand(x, y, 42);
                if (r < 0.015) {
                    this.bearCaves.push({ tx: x, ty: y, x: x + 0.5, z: y + 0.5 });
                    tile.cave = true;
                }
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
        let h;
        if (t.biome === 'water') h = -2;
        else if (t.biome === 'sand') h = 0.5 + elev * 2;
        else if (t.biome === 'grass') h = 1 + elev * 4;
        else if (t.biome === 'forest') h = 1.5 + elev * 5;
        else if (t.biome === 'mountain') h = 4 + elev * 18;
        else if (t.biome === 'snow') h = 8 + elev * 22;
        else if (t.biome === 'desert') h = 0.8 + elev * 3;
        else h = baseHeight * 3;
        // Apply dig depth
        h -= (t.digDepth || 0);
        return h;
    }
    // Average height at the center of a tile (between 4 corners)
    getTileCenterHeight(tx, ty) {
        return (this.getTileHeight(tx, ty) +
                this.getTileHeight(tx + 1, ty) +
                this.getTileHeight(tx, ty + 1) +
                this.getTileHeight(tx + 1, ty + 1)) / 4;
    }
    // Bilinear interpolation of terrain height at exact world tile coordinates
    // Uses triangle-based (barycentric) interpolation to match the GPU terrain mesh
    getHeightAt(wx, wz) {
        const tx = Math.floor(wx);
        const ty = Math.floor(wz);
        const fx = wx - tx;
        const fz = wz - ty;
        const h00 = this.getTileHeight(tx, ty);
        const h10 = this.getTileHeight(tx + 1, ty);
        const h01 = this.getTileHeight(tx, ty + 1);
        const h11 = this.getTileHeight(tx + 1, ty + 1);
        // Triangle 1: (tx,ty), (tx+1,ty), (tx,ty+1) — covers fx+fz <= 1
        if (fx + fz <= 1) {
            return h00 * (1 - fx - fz) + h10 * fx + h01 * fz;
        }
        // Triangle 2: (tx+1,ty), (tx+1,ty+1), (tx,ty+1) — covers fx+fz > 1
        return h10 * (1 - fz) + h11 * (fx + fz - 1) + h01 * (1 - fx);
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
        this.hunger = 100; this.maxHunger = 100;
        this.thirst = 100; this.maxThirst = 100;
        this.temperature = 20; // comfortable temp ~20 deg C
        this.rotation = 0;
        this.inventory = {};
        this.selectedSlot = 0;
        this.harvesting = null;
        this.jumpVel = 0;
        this.yOffset = 0;
        this.isClimbing = false;
        this.fallStartY = 0;
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
//  3D Model Factory  creates Three.js meshes for game objects
// ============================================================
class ModelFactory {
    static createTree(seed) {
        // Deterministic pseudo-random from seed
        const rng = (salt) => {
            const s = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453;
            return s - Math.floor(s);
        };

        // Pick a species based on biome context (caller can override via seed bias)
        const speciesRoll = rng(1);
        const sizeRoll = rng(2); // 0..1 for size variation
        const sizeScale = 0.65 + sizeRoll * 0.8; // 0.65x to 1.45x

        // Species: oak, pine, birch, palm, dead
        let species;
        if (speciesRoll < 0.30) species = 'oak';
        else if (speciesRoll < 0.55) species = 'pine';
        else if (speciesRoll < 0.75) species = 'birch';
        else if (speciesRoll < 0.88) species = 'palm';
        else species = 'dead';

        const group = new THREE.Group();

        if (species === 'oak') {
            // Classic broadleaf: thick trunk, 3 stacked cones, medium green
            const trunkH = 2.5 * sizeScale;
            const trunkGeo = new THREE.CylinderGeometry(0.3 * sizeScale, 0.4 * sizeScale, trunkH, 6);
            const trunkMat = new THREE.MeshLambertMaterial({ color: 0x6b4226 });
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = trunkH / 2;
            trunk.castShadow = true;
            group.add(trunk);
            const leafMat = new THREE.MeshLambertMaterial({ color: 0x2d6b1f });
            for (let i = 0; i < 3; i++) {
                const r = (1.8 - i * 0.4) * sizeScale;
                const h = 1.8 * sizeScale;
                const coneGeo = new THREE.ConeGeometry(r, h, 7);
                const cone = new THREE.Mesh(coneGeo, leafMat);
                cone.position.y = trunkH + 0.3 + i * 1.0 * sizeScale;
                cone.castShadow = true;
                group.add(cone);
            }
        } else if (species === 'pine') {
            // Tall narrow conifer: thin trunk, many tight cones, dark green
            const trunkH = 3.5 * sizeScale;
            const trunkGeo = new THREE.CylinderGeometry(0.22 * sizeScale, 0.3 * sizeScale, trunkH, 6);
            const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5a3a20 });
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = trunkH / 2;
            trunk.castShadow = true;
            group.add(trunk);
            const leafMat = new THREE.MeshLambertMaterial({ color: 0x1a4d10 });
            const numCones = 5;
            for (let i = 0; i < numCones; i++) {
                const r = (1.2 - i * 0.18) * sizeScale;
                const h = 1.4 * sizeScale;
                const coneGeo = new THREE.ConeGeometry(r, h, 6);
                const cone = new THREE.Mesh(coneGeo, leafMat);
                cone.position.y = trunkH + i * 0.7 * sizeScale;
                cone.castShadow = true;
                group.add(cone);
            }
        } else if (species === 'birch') {
            // Slender tree: thin white-ish trunk, small sparse canopy, light green-yellow
            const trunkH = 3.0 * sizeScale;
            const trunkGeo = new THREE.CylinderGeometry(0.18 * sizeScale, 0.25 * sizeScale, trunkH, 5);
            const trunkMat = new THREE.MeshLambertMaterial({ color: 0xd0d0c0 });
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = trunkH / 2;
            trunk.castShadow = true;
            group.add(trunk);
            const leafMat = new THREE.MeshLambertMaterial({ color: 0x8aa840 });
            // Fewer, smaller leaf clusters
            for (let i = 0; i < 2; i++) {
                const r = (1.0 - i * 0.2) * sizeScale;
                const h = 1.2 * sizeScale;
                const coneGeo = new THREE.ConeGeometry(r, h, 6);
                const cone = new THREE.Mesh(coneGeo, leafMat);
                cone.position.y = trunkH + 0.2 + i * 0.8 * sizeScale;
                cone.castShadow = true;
                group.add(cone);
            }
        } else if (species === 'palm') {
            // Palm: tall thin trunk, fan-like leaves at top
            const trunkH = 3.5 * sizeScale;
            const trunkGeo = new THREE.CylinderGeometry(0.2 * sizeScale, 0.28 * sizeScale, trunkH, 5);
            const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = trunkH / 2;
            trunk.rotation.z = (rng(3) - 0.5) * 0.15;
            trunk.castShadow = true;
            group.add(trunk);
            const leafMat = new THREE.MeshLambertMaterial({ color: 0x4a8c2a, side: THREE.DoubleSide });
            const numFronds = 6;
            for (let i = 0; i < numFronds; i++) {
                const frondGeo = new THREE.ConeGeometry(0.15 * sizeScale, 1.8 * sizeScale, 4);
                const frond = new THREE.Mesh(frondGeo, leafMat);
                const angle = (i / numFronds) * Math.PI * 2;
                frond.position.set(
                    Math.cos(angle) * 0.5 * sizeScale,
                    trunkH + 0.2,
                    Math.sin(angle) * 0.5 * sizeScale
                );
                frond.rotation.z = Math.cos(angle) * 0.6;
                frond.rotation.x = Math.sin(angle) * 0.6;
                frond.castShadow = true;
                group.add(frond);
            }
        } else {
            // Dead/bare tree: trunk + bare branches, no leaves
            const trunkH = 2.8 * sizeScale;
            const trunkGeo = new THREE.CylinderGeometry(0.2 * sizeScale, 0.35 * sizeScale, trunkH, 5);
            const trunkMat = new THREE.MeshLambertMaterial({ color: 0x4a3a2a });
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = trunkH / 2;
            trunk.castShadow = true;
            group.add(trunk);
            const branchMat = new THREE.MeshLambertMaterial({ color: 0x4a3a2a });
            const numBranches = 4 + Math.floor(rng(4) * 3);
            for (let i = 0; i < numBranches; i++) {
                const len = (0.8 + rng(10 + i) * 0.6) * sizeScale;
                const branchGeo = new THREE.CylinderGeometry(0.06 * sizeScale, 0.1 * sizeScale, len, 4);
                const branch = new THREE.Mesh(branchGeo, branchMat);
                const angle = (i / numBranches) * Math.PI * 2 + rng(20 + i) * 0.5;
                const tilt = 0.5 + rng(30 + i) * 0.4;
                branch.position.set(
                    Math.cos(angle) * 0.3 * sizeScale,
                    trunkH * 0.7 + rng(40 + i) * trunkH * 0.25,
                    Math.sin(angle) * 0.3 * sizeScale
                );
                branch.rotation.z = Math.cos(angle) * tilt;
                branch.rotation.x = Math.sin(angle) * tilt;
                branch.castShadow = true;
                group.add(branch);
            }
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

    static createSoil() {
        const group = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color: 0x6b4226, flatShading: true });
        const mound = new THREE.Mesh(new THREE.SphereGeometry(0.6, 6, 5), mat);
        mound.position.y = 0.2; mound.scale.set(1.2, 0.5, 1.2); mound.castShadow = true;
        group.add(mound);
        const lump = new THREE.Mesh(new THREE.SphereGeometry(0.3, 5, 4), mat);
        lump.position.set(0.3, 0.15, 0.2); lump.scale.set(1, 0.6, 1); lump.castShadow = true;
        group.add(lump);
        return group;
    }

    static createGrass() {
        const group = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color: 0x4a8c2a, side: THREE.DoubleSide });
        for (let i = 0; i < 8; i++) {
            const blade = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.4 + Math.random() * 0.2, 3), mat);
            blade.position.set((Math.random() - 0.5) * 0.7, 0.2, (Math.random() - 0.5) * 0.7);
            blade.rotation.z = (Math.random() - 0.5) * 0.3;
            blade.rotation.x = (Math.random() - 0.5) * 0.3;
            blade.castShadow = true;
            group.add(blade);
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

    static createResource(type, tx, ty) {
        switch(type) {
            case 'tree': return this.createTree(tx * 73856093 ^ ty * 19349663);
            case 'bush': return this.createBush();
            case 'red_mushroom': return this.createMushroom(0xe74c3c, 0xfff8e7);
            case 'purple_mushroom': return this.createMushroom(0x9b59b6, 0xfff8e7);
            case 'red_berries': return this.createBerryPlant(0xe74c3c);
            case 'nightshade': return this.createBerryPlant(0x2c0a3e);
            case 'cactus_fruit': return this.createCactus();
            case 'glowing_plant': return this.createGlowingPlant();
            case 'thorn_bush': return this.createThornBush();
            case 'stone': return this.createRock(0x95a5a6);
            case 'soil': return this.createSoil();
            case 'grass': return this.createGrass();
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

    // --- Bear cave model ---
    static createBearCave() {
        const g = new THREE.Group();
        const rockMat = new THREE.MeshLambertMaterial({ color: 0x5a5a5a, flatShading: true });
        const darkMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        // Cave entrance — dark arch
        const arch = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 2.0, 8, 1, true), darkMat);
        arch.position.set(0, 1.0, 0);
        arch.rotation.x = Math.PI / 2;
        arch.scale.set(1, 1, 0.6);
        g.add(arch);
        // Dark interior (half-sphere recessed)
        const interior = new THREE.Mesh(new THREE.SphereGeometry(1.3, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), darkMat);
        interior.position.set(0, 0.5, -0.3);
        interior.scale.set(1, 0.8, 0.7);
        g.add(interior);
        // Rocks around entrance
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.4 + Math.random() * 0.3, 0), rockMat);
            rock.position.set(Math.cos(angle) * 1.5, 0.3 + Math.random() * 0.5, Math.sin(angle) * 1.2);
            rock.rotation.set(Math.random(), Math.random(), Math.random());
            rock.castShadow = true;
            g.add(rock);
        }
        // Top boulder
        const topRock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8, 0), rockMat);
        topRock.position.set(0, 2.2, 0);
        topRock.castShadow = true;
        g.add(topRock);
        return g;
    }

    // --- Creature models ---
    static createCreature(type) {
        switch(type) {
            case 'deer':   return this.createDeer();
            case 'fawn':   return this.createFawn();
            case 'wolf':   return this.createWolf();
            case 'bear':   { const m = this.createBear(); m.scale.set(1.8, 1.8, 1.8); return m; }
            case 'rabbit': return this.createRabbit();
            case 'spider': { const m = this.createSpider(); m.scale.set(0.4, 0.4, 0.4); return m; }
            default: return new THREE.Group();
        }
    }

    static createDeer() {
        const g = new THREE.Group();
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x9b7653 });
        const legMat = new THREE.MeshLambertMaterial({ color: 0x6b5535 });
        const bellyMat = new THREE.MeshLambertMaterial({ color: 0xc4a484 });
        const darkMat = new THREE.MeshLambertMaterial({ color: 0x4a3520 });
        const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 1.1, 4, 8), bodyMat);
        torso.rotation.x = Math.PI / 2; torso.position.set(0, 1.05, 0);
        torso.castShadow = true; torso.userData.isBody = true; g.add(torso);
        const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 6), bodyMat);
        shoulder.position.set(0, 1.05, 0.5); g.add(shoulder);
        const haunch = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 6), bodyMat);
        haunch.position.set(0, 1.05, -0.5); g.add(haunch);
        const neck = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.7, 4, 6), bodyMat);
        neck.position.set(0, 1.5, 0.7); neck.rotation.x = -0.6; g.add(neck);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 6), bodyMat);
        head.position.set(0, 1.85, 0.95); head.userData.isHead = true; g.add(head);
        const snout = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.22, 4, 6), bodyMat);
        snout.position.set(0, 1.82, 1.15); snout.rotation.x = Math.PI / 2; g.add(snout);
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.03, 5, 4), darkMat);
        nose.position.set(0, 1.82, 1.28); g.add(nose);
        for (let s = -1; s <= 1; s += 2) {
            const ear = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 4), bodyMat);
            ear.position.set(s * 0.08, 1.95, 0.9); ear.rotation.z = s * 0.4; g.add(ear);
        }
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const pupilMat = new THREE.MeshLambertMaterial({ color: 0x000000 });
        for (let s = -1; s <= 1; s += 2) {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 5), eyeMat);
            eye.position.set(s * 0.07, 1.88, 1.05); g.add(eye);
            const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.018, 5, 4), pupilMat);
            pupil.position.set(s * 0.07, 1.88, 1.08); g.add(pupil);
        }
        const antMat = new THREE.MeshLambertMaterial({ color: 0x4a3520 });
        for (let s = -1; s <= 1; s += 2) {
            const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.45, 5), antMat);
            beam.position.set(s * 0.12, 2.05, 0.88); beam.rotation.z = s * 0.3; beam.rotation.x = -0.2; g.add(beam);
            const tine1 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.32, 4), antMat);
            tine1.position.set(s * 0.28, 2.15, 0.88); tine1.rotation.z = s * 0.9; g.add(tine1);
            const tine2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.018, 0.2, 4), antMat);
            tine2.position.set(s * 0.4, 2.1, 0.9); tine2.rotation.z = s * 0.5; tine2.rotation.x = 0.2; g.add(tine2);
        }
        for (let s = -1; s <= 1; s += 2) for (let f = -1; f <= 1; f += 2) {
            const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.5, 4, 5), legMat);
            upper.position.set(s * 0.18, 0.85, f * 0.45); upper.castShadow = true; g.add(upper);
            const lower = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.4, 4, 5), legMat);
            lower.position.set(s * 0.18, 0.3, f * 0.45); lower.castShadow = true; g.add(lower);
            const hoof = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.07, 5), darkMat);
            hoof.position.set(s * 0.18, 0.035, f * 0.45); hoof.rotation.x = Math.PI; g.add(hoof);
        }
        const tail = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.25, 5), bellyMat);
        tail.position.set(0, 1.15, -0.78); tail.rotation.x = 0.2; tail.userData.isTail = true; g.add(tail);
        return g;
    }

    static createFawn() {
        const g = new THREE.Group();
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0xc9a96e });
        const legMat = new THREE.MeshLambertMaterial({ color: 0x9b7e54 });
        const bellyMat = new THREE.MeshLambertMaterial({ color: 0xe0cda0 });
        const spotMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.65, 4, 8), bodyMat);
        torso.rotation.x = Math.PI / 2; torso.position.set(0, 0.6, 0);
        torso.castShadow = true; torso.userData.isBody = true; g.add(torso);
        const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.16, 7, 5), bodyMat);
        shoulder.position.set(0, 0.6, 0.28); g.add(shoulder);
        const haunch = new THREE.Mesh(new THREE.SphereGeometry(0.16, 7, 5), bodyMat);
        haunch.position.set(0, 0.6, -0.28); g.add(haunch);
        const neck = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.4, 4, 6), bodyMat);
        neck.position.set(0, 0.85, 0.4); neck.rotation.x = -0.5; g.add(neck);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 7, 5), bodyMat);
        head.position.set(0, 1.02, 0.56); head.userData.isHead = true; g.add(head);
        const snout = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.14, 4, 6), bodyMat);
        snout.position.set(0, 1.0, 0.69); snout.rotation.x = Math.PI / 2; g.add(snout);
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.018, 5, 4), new THREE.MeshLambertMaterial({ color: 0x6b5535 }));
        nose.position.set(0, 1.0, 0.77); g.add(nose);
        for (let s = -1; s <= 1; s += 2) {
            const ear = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.1, 4), bodyMat);
            ear.position.set(s * 0.05, 1.08, 0.52); ear.rotation.z = s * 0.5; g.add(ear);
        }
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const pupilMat = new THREE.MeshLambertMaterial({ color: 0x000000 });
        for (let s = -1; s <= 1; s += 2) {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 5), eyeMat);
            eye.position.set(s * 0.05, 1.04, 0.64); g.add(eye);
            const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.015, 5, 4), pupilMat);
            pupil.position.set(s * 0.05, 1.04, 0.66); g.add(pupil);
        }
        for (let i = 0; i < 5; i++) {
            const spot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 5, 4), spotMat);
            const a = (i / 5) * Math.PI * 2;
            spot.position.set(Math.cos(a) * 0.15, 0.68, Math.sin(a) * 0.2);
            spot.scale.set(1, 0.25, 1); g.add(spot);
        }
        for (let s = -1; s <= 1; s += 2) for (let f = -1; f <= 1; f += 2) {
            const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.3, 4, 5), legMat);
            upper.position.set(s * 0.11, 0.45, f * 0.28); g.add(upper);
            const lower = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.24, 4, 5), legMat);
            lower.position.set(s * 0.11, 0.16, f * 0.28); g.add(lower);
            const hoof = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.04, 4), new THREE.MeshLambertMaterial({ color: 0x6b5535 }));
            hoof.position.set(s * 0.11, 0.02, f * 0.28); hoof.rotation.x = Math.PI; g.add(hoof);
        }
        const tail = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 5), bellyMat);
        tail.position.set(0, 0.66, -0.48); tail.rotation.x = 0.2; tail.userData.isTail = true; g.add(tail);
        return g;
    }

    static createBoar() {
        const g = new THREE.Group();
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x4a3c30 });
        const legMat = new THREE.MeshLambertMaterial({ color: 0x2e251a });
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 1.2, 7), bodyMat);
        body.position.y = 0.6; body.rotation.x = Math.PI / 2; body.castShadow = true; body.userData.isBody = true; g.add(body);
        const hump = new THREE.Mesh(new THREE.SphereGeometry(0.35, 6, 5), bodyMat);
        hump.position.set(0, 0.75, 0.3); hump.scale.set(0.9, 0.6, 0.8); g.add(hump);
        const head = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.5, 6), bodyMat);
        head.position.set(0, 0.55, 0.7); head.rotation.x = Math.PI / 2 - 0.2; head.castShadow = true; head.userData.isHead = true; g.add(head);
        const tuskMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        for (let s = -1; s <= 1; s += 2) {
            const tusk = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.15, 4), tuskMat);
            tusk.position.set(s * 0.1, 0.38, 0.95); tusk.rotation.x = Math.PI; g.add(tusk);
        }
        for (let s = -1; s <= 1; s += 2) {
            const ear = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.12, 3), bodyMat);
            ear.position.set(s * 0.15, 0.75, 0.6); ear.rotation.z = s * 0.4; g.add(ear);
        }
        // Eyes
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const pupilMat = new THREE.MeshLambertMaterial({ color: 0x000000 });
        for (let s = -1; s <= 1; s += 2) {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 5), eyeMat);
            eye.position.set(s * 0.1, 0.6, 0.92); g.add(eye);
            const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.025, 5, 4), pupilMat);
            pupil.position.set(s * 0.1, 0.6, 0.95); g.add(pupil);
        }
        // Snout
        const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.2, 5), bodyMat);
        snout.position.set(0, 0.48, 0.98); snout.rotation.x = Math.PI / 2; g.add(snout);
        // Mouth
        const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.02), pupilMat);
        mouth.position.set(0, 0.42, 1.05); g.add(mouth);
        for (let s = -1; s <= 1; s += 2) for (let f = -1; f <= 1; f += 2) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.5, 4), legMat);
            leg.position.set(s * 0.2, 0.25, f * 0.35); leg.castShadow = true;
            leg.userData.isLeg = true; g.add(leg);
        }
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.2, 3), bodyMat);
        tail.position.set(0, 0.65, -0.65); tail.rotation.x = 0.8; tail.userData.isTail = true; g.add(tail);
        return g;
    }

    static createWolf() {
        const g = new THREE.Group();
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x6a6a6a });
        const legMat = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
        const bellyMat = new THREE.MeshLambertMaterial({ color: 0x8a8a8a });
        const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 1.0, 4, 8), bodyMat);
        torso.rotation.x = Math.PI / 2; torso.position.set(0, 0.7, 0);
        torso.castShadow = true; torso.userData.isBody = true; g.add(torso);
        const chest = new THREE.Mesh(new THREE.SphereGeometry(0.27, 8, 6), bodyMat);
        chest.position.set(0, 0.72, 0.42); g.add(chest);
        const waist = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), bodyMat);
        waist.position.set(0, 0.68, -0.45); g.add(waist);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), bodyMat);
        head.position.set(0, 0.88, 0.75); head.userData.isHead = true; g.add(head);
        const snout = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.45, 4, 6), bodyMat);
        snout.position.set(0, 0.85, 1.12); snout.rotation.x = Math.PI / 2; g.add(snout);
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.045, 5, 4), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        nose.position.set(0, 0.85, 1.35); g.add(nose);
        for (let s = -1; s <= 1; s += 2) {
            const ear = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 4), bodyMat);
            ear.position.set(s * 0.1, 1.1, 0.72); ear.rotation.z = s * 0.2; g.add(ear);
        }
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        const pupilMat = new THREE.MeshLambertMaterial({ color: 0x000000 });
        for (let s = -1; s <= 1; s += 2) {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 5), eyeMat);
            eye.position.set(s * 0.08, 0.92, 0.95); g.add(eye);
            const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.02, 5, 4), pupilMat);
            pupil.position.set(s * 0.08, 0.92, 0.97); g.add(pupil);
        }
        for (let s = -1; s <= 1; s += 2) for (let f = -1; f <= 1; f += 2) {
            const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.35, 4, 5), legMat);
            upper.position.set(s * 0.18, 0.45, f * 0.35); upper.castShadow = true; g.add(upper);
            const lower = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.32, 4, 5), legMat);
            lower.position.set(s * 0.18, 0.16, f * 0.35); g.add(lower);
            const paw = new THREE.Mesh(new THREE.SphereGeometry(0.06, 5, 4), legMat);
            paw.scale.set(1, 0.6, 1.4); paw.position.set(s * 0.18, 0.03, f * 0.35 + 0.02); g.add(paw);
        }
        const tail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.65, 6), bodyMat);
        tail.position.set(0, 0.72, -0.65); tail.rotation.x = 0.5; tail.castShadow = true; tail.userData.isTail = true; g.add(tail);
        return g;
    }

    static createBear() {
        const g = new THREE.Group();
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x4a3a28 });
        const legMat = new THREE.MeshLambertMaterial({ color: 0x3a2a18 });
        const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.38, 0.9, 4, 8), bodyMat);
        body.rotation.x = Math.PI / 2; body.position.set(0, 0.85, 0);
        body.scale.set(1, 0.85, 1.35);
        body.castShadow = true; body.userData.isBody = true; g.add(body);
        const chest = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 6), bodyMat);
        chest.position.set(0, 0.88, 0.5); g.add(chest);
        const belly = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 6), new THREE.MeshLambertMaterial({ color: 0x5a4a38 }));
        belly.position.set(0, 0.72, 0); belly.scale.set(0.9, 0.7, 1.1); g.add(belly);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 6), bodyMat);
        head.position.set(0, 1.12, 0.9); head.userData.isHead = true; g.add(head);
        const snout = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.3, 4, 6), new THREE.MeshLambertMaterial({ color: 0x2a1a08 }));
        snout.position.set(0, 1.08, 1.28); snout.rotation.x = Math.PI / 2; g.add(snout);
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 5, 4), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        nose.position.set(0, 1.1, 1.43); g.add(nose);
        for (let s = -1; s <= 1; s += 2) {
            const ear = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), bodyMat);
            ear.position.set(s * 0.22, 1.45, 0.82); g.add(ear);
        }
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const pupilMat = new THREE.MeshLambertMaterial({ color: 0x000000 });
        for (let s = -1; s <= 1; s += 2) {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 5), eyeMat);
            eye.position.set(s * 0.13, 1.18, 1.15); g.add(eye);
            const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.025, 5, 4), pupilMat);
            pupil.position.set(s * 0.13, 1.18, 1.18); g.add(pupil);
        }
        for (let s = -1; s <= 1; s += 2) for (let f = -1; f <= 1; f += 2) {
            const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.45, 4, 5), legMat);
            upper.position.set(s * 0.28, 0.5, f * 0.42); upper.castShadow = true; g.add(upper);
            const lower = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.4, 4, 5), legMat);
            lower.position.set(s * 0.28, 0.18, f * 0.42); g.add(lower);
            const paw = new THREE.Mesh(new THREE.SphereGeometry(0.11, 6, 5), legMat);
            paw.scale.set(1.2, 0.5, 1.5); paw.position.set(s * 0.28, 0.05, f * 0.42 + 0.03); g.add(paw);
        }
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.09, 5, 4), bodyMat);
        tail.position.set(0, 1.0, -0.75); tail.userData.isTail = true; g.add(tail);
        return g;
    }

    static createRabbit() {
        const g = new THREE.Group();
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0xb0b0b0 });
        const legMat = new THREE.MeshLambertMaterial({ color: 0x909090 });
        const bellyMat = new THREE.MeshLambertMaterial({ color: 0xd0d0d0 });
        const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.55, 4, 8), bodyMat);
        body.rotation.x = Math.PI / 2; body.position.set(0, 0.35, 0);
        body.castShadow = true; body.userData.isBody = true; g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 7, 5), bodyMat);
        head.position.set(0, 0.5, 0.26); head.userData.isHead = true; g.add(head);
        const snout = new THREE.Mesh(new THREE.SphereGeometry(0.05, 5, 4), new THREE.MeshLambertMaterial({ color: 0xffaaaa }));
        snout.position.set(0, 0.5, 0.35); g.add(snout);
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.018, 5, 4), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        nose.position.set(0, 0.52, 0.39); g.add(nose);
        for (let s = -1; s <= 1; s += 2) {
            const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.6, 4, 5), bodyMat);
            ear.position.set(s * 0.05, 0.85, 0.24); g.add(ear);
        }
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const pupilMat = new THREE.MeshLambertMaterial({ color: 0x000000 });
        for (let s = -1; s <= 1; s += 2) {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 5), eyeMat);
            eye.position.set(s * 0.05, 0.54, 0.37); g.add(eye);
            const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.015, 5, 4), pupilMat);
            pupil.position.set(s * 0.05, 0.54, 0.39); g.add(pupil);
        }
        for (let s = -1; s <= 1; s += 2) for (let f = -1; f <= 1; f += 2) {
            if (f === 1) {
                const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.22, 4, 5), legMat);
                thigh.position.set(s * 0.12, 0.18, f * 0.18); g.add(thigh);
                const foot = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.15, 4, 5), legMat);
                foot.position.set(s * 0.12, 0.05, f * 0.2); foot.rotation.x = Math.PI / 2; g.add(foot);
            } else {
                const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.18, 4, 5), legMat);
                leg.position.set(s * 0.08, 0.09, f * 0.1); leg.userData.isLeg = true; g.add(leg);
            }
        }
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.1, 5, 4), bellyMat);
        tail.position.set(0, 0.38, -0.22); tail.userData.isTail = true; g.add(tail);
        return g;
    }

    static createSpider() {
        const g = new THREE.Group();
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x1a1a2a });
        const legMat = new THREE.MeshLambertMaterial({ color: 0x0a0a1a });
        const abdomen = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 6), bodyMat);
        abdomen.position.set(0, 0.48, -0.15); abdomen.scale.set(1, 0.7, 1.2); abdomen.castShadow = true; abdomen.userData.isBody = true; g.add(abdomen);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 7, 5), bodyMat);
        head.position.set(0, 0.42, 0.35); head.userData.isHead = true; g.add(head);
        const eyeMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 0.6 - Math.PI * 0.3;
            for (let s = -1; s <= 1; s += 2) {
                const eye = new THREE.Mesh(new THREE.SphereGeometry(0.038, 5, 4), eyeMat);
                eye.position.set(s * 0.08, 0.5 + Math.sin(a) * 0.05, 0.5 + Math.cos(a) * 0.08); g.add(eye);
            }
        }
        const fangMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        for (let s = -1; s <= 1; s += 2) {
            const fang = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.12, 3), fangMat);
            fang.position.set(s * 0.07, 0.34, 0.55); fang.rotation.x = Math.PI; g.add(fang);
        }
        for (let i = 0; i < 8; i++) {
            const side = i < 4 ? -1 : 1;
            const idx = i % 4;
            const z = -0.05 + idx * 0.12;
            const femur = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.5, 4, 5), legMat);
            femur.position.set(side * 0.18, 0.4, z);
            femur.rotation.z = side * 0.8;
            femur.castShadow = true; femur.userData.isLeg = true; g.add(femur);
            const tibia = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.45, 4, 5), legMat);
            tibia.position.set(side * 0.42, 0.15, z);
            tibia.rotation.z = side * -0.6;
            tibia.rotation.x = 0.4; g.add(tibia);
            const tarsus = new THREE.Mesh(new THREE.CapsuleGeometry(0.015, 0.25, 4, 5), legMat);
            tarsus.position.set(side * 0.62, 0.04, z - 0.05);
            tarsus.rotation.z = side * -1.1;
            g.add(tarsus);
        }
        return g;
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
        this.dayTime = 0.1; // Start in morning (day, not dawn)
        this.dayDuration = 300; // 5 minutes of day
        this.nightDuration = 180; // 3 minutes of night
        this.totalCycle = this.dayDuration + this.nightDuration; // 480s
        this.isNight = false;
        this.season = 'summer'; // summer, autumn, winter, spring
        this.seasonTimer = 0;
        this.seasonDuration = 600; // 10 minutes per season
        this.seasonBrightness = { summer: 1.0, autumn: 0.8, winter: 0.6, spring: 0.85 };
        this.sleeping = false;
        this.sleepFade = 0; // 0..1 fade-to-black during sleep
        this.inHut = false;
        this.hutTile = null;
        this.weather = 'clear'; // 'clear', 'rain', 'snow', 'fog'
        this.weatherTimer = 30 + Math.random() * 60; // weather changes over time
        this.weatherParticles = null;
        this.audioCtx = null; // Web Audio context, created on first user interaction
        this.resourceMeshes = new Map(); // "x,y" -> mesh
        this.buildingMeshes = new Map();
        this.buildingPositions = new Set(); // "x,y" for efficient tick
        this.buildPreview = null;
        this.currentQuestIndex = 0;
        this.spawnPoint = { x: 0, z: 0 };
        this.creatures = []; // active creature objects
        this.creatureMeshes = new Map(); // id -> mesh
        this.creatureSpawnAccumulator = 0;
        this.creatureMeshAccumulator = 0;
        this.attackCooldown = 0;
        this.maxCreatures = 15;
        this.inventoryPage = 0;

        // Pause & mobile
        this.paused = false;
        this.mobileMode = false;
        this.joystick = { active: false, dx: 0, dz: 0, startX: 0, startY: 0, touchId: null };
        this.lookTouch = { active: false, lastX: 0, lastY: 0, touchId: null };
        this.discoveredFoods = new Set(); // item keys the player has eaten at least once

        this.setupInput();
        this.setupUI();
    }

    // --- Three.js setup ---
    initThree() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);
        this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.008);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 600);

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;

        // Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambient);
        this.ambientLight = ambient;

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
        this.hemiLight = hemi;

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
        const waterMat = new THREE.MeshPhongMaterial({
            color: 0x1a5276, transparent: true, opacity: 0.75,
            shininess: 80, specular: 0x3a7a9a,
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.position.y = 0;
        this.scene.add(water);
        this.waterMesh = water;
    }

    // --- Resource meshes (dynamic: only near player) ---
    buildResources() {
        this.resourceLoadRadius = 25; // tiles
        this.caveMeshes = new Map();
        this.updateResourceMeshes();
    }

    buildBearCaves() {
        const ptx = Math.floor(this.player.x);
        const pty = Math.floor(this.player.z);
        const r = this.resourceLoadRadius;
        const needed = new Set();
        for (const cave of this.world.bearCaves) {
            const dx = cave.tx - ptx, dy = cave.ty - pty;
            if (dx*dx + dy*dy <= r*r) {
                const key = `${cave.tx},${cave.ty}`;
                needed.add(key);
                if (!this.caveMeshes.has(key)) {
                    const mesh = ModelFactory.createBearCave();
                    const h = this.world.getTileHeight(cave.tx, cave.ty);
                    mesh.position.set(cave.tx * TILE_SIZE + TILE_SIZE / 2, h, cave.ty * TILE_SIZE + TILE_SIZE / 2);
                    mesh.traverse(c => { if (c.isMesh) c.castShadow = true; });
                    this.scene.add(mesh);
                    this.caveMeshes.set(key, mesh);
                }
            }
        }
        // Remove distant caves
        for (const [key, mesh] of this.caveMeshes) {
            if (!needed.has(key)) {
                this.scene.remove(mesh);
                this.caveMeshes.delete(key);
            }
        }
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
        const mesh = ModelFactory.createResource(resourceType, tx, ty);
        const wx = tx * TILE_SIZE + TILE_SIZE / 2;
        const wz = ty * TILE_SIZE + TILE_SIZE / 2;
        const wy = this.world.getTileCenterHeight(tx, ty);
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
        const wy = this.world.getTileCenterHeight(tx, ty);
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
        document.getElementById('start-screen').classList.add('hidden');
        const seed = Math.floor(Math.random() * 1000000);
        this.initWorldWithSeed(seed);
      } catch (err) {
        console.error('Game start error:', err);
        alert('Error starting game: ' + err.message + '\n\n' + err.stack);
        this.gameRunning = false;
      }
    }

    initWorldWithSeed(seed) {
        this.exitHut();
        this.inHut = false;
        this.hutTile = null;
        this.hutInteriorGroup = null;
        this.world = new World(seed);
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
        this.player.y = this.world.getHeightAt(sx + 0.5, sy + 0.5);
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
            while (this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
            this.resourceMeshes.clear();
            this.buildingMeshes.clear();
            if (this.caveMeshes) this.caveMeshes.clear();
            this.buildingPositions.clear();
            const ambient = new THREE.AmbientLight(0xffffff, 0.5);
            this.scene.add(ambient);
            this.ambientLight = ambient;
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
            const hemi = new THREE.HemisphereLight(0x87ceeb, 0x3a5a1f, 0.3);
            this.scene.add(hemi);
            this.hemiLight = hemi;
        }

        // Reset weather state
        this.weather = 'clear';
        this.weatherTimer = 30 + Math.random() * 60;
        if (this.weatherParticles) {
            this.scene.remove(this.weatherParticles);
            this.weatherParticles.geometry.dispose();
            this.weatherParticles.material.dispose();
            this.weatherParticles = null;
        }

        this.buildTerrain();
        this.buildResources();
        this.buildBearCaves();
        this.buildPlayer();

        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('crosshair').classList.add('visible');

        this.updateUI();
        this.updateQuestUI();
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
        this.notify('Welcome to the 3D world!', 'info');
        if (!this.mobileMode) this.requestPointerLock();
        if (!this.pointerLocked && !this.mobileMode) {
            const prompt = document.getElementById('pointer-lock-prompt');
            prompt.classList.remove('hidden');
            prompt.classList.add('visible');
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
               !document.getElementById('panel-tech').classList.contains('hidden') ||
               !document.getElementById('panel-inventory').classList.contains('hidden');
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
            if (e.key.toLowerCase() === 'q' && this.gameRunning) this.togglePanel('panel-crafting');
            if (e.key.toLowerCase() === 'b' && this.gameRunning) this.togglePanel('panel-build');
            if (e.key.toLowerCase() === 't' && this.gameRunning) this.togglePanel('panel-tech');
            if (e.key.toLowerCase() === 'i' && this.gameRunning) {
                if (this.inHut) this.exitHut();
                else this.interact();
            }
            if (e.key === 'Escape' && this.inHut) {
                this.exitHut();
            }
            if (e.key.toLowerCase() === 'e' && this.gameRunning) this.togglePanel('panel-inventory');
            if (e.key.toLowerCase() === 'f' && this.gameRunning) this.eatSelectedItem();
            if (e.key.toLowerCase() === 'g' && this.gameRunning) this.feedCreature();
            if (e.key.toLowerCase() === 'c' && this.gameRunning) this.dig();
            if (e.key.toLowerCase() === 'r' && this.gameRunning) this.drinkWater();
            if (e.key.toLowerCase() === 'p' && this.gameRunning) this.togglePause();
            if (e.code === 'Space' && this.gameRunning && this.player.yOffset === 0 && this.player.jumpVel === 0) {
                this.player.jumpVel = 12;
            }
            const num = parseInt(e.key);
            if (num >= 1 && num <= 9 && this.gameRunning) {
                const invOpen = !document.getElementById('panel-inventory').classList.contains('hidden');
                if (invOpen) {
                    // Navigate inventory pages, not hotbar
                    this.inventoryPage = num - 1;
                    this.renderInventoryGrid();
                } else {
                    this.player.selectedSlot = num - 1;
                    this.updateInventoryUI();
                }
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
                } else if (this.attackCreature()) {
                    // hit a creature, don't do normal interact
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
        // Initialize HUD sprites
        document.getElementById('hud-health-icon').innerHTML = sprite('health');
        document.getElementById('hud-energy-icon').innerHTML = sprite('energy');
        document.getElementById('hud-research-icon').innerHTML = sprite('research');
        document.getElementById('hud-power-icon').innerHTML = sprite('power');
        document.getElementById('hud-hunger-icon').innerHTML = sprite('hunger');
        document.getElementById('hud-thirst-icon').innerHTML = sprite('thirst');
        document.getElementById('hud-temp-icon').innerHTML = sprite('temp');
        document.getElementById('quest-icon').innerHTML = sprite('quest');

        document.getElementById('start-btn').addEventListener('click', () => { this.ensureAudioCtx(); this.start(); });
        document.getElementById('restart-btn').addEventListener('click', () => { this.ensureAudioCtx(); this.respawn(); });
        document.getElementById('resume-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('mobile-toggle').addEventListener('click', () => this.toggleMobileMode());
        this.setupMobileControls();
        document.getElementById('btn-craft').addEventListener('click', () => this.togglePanel('panel-crafting'));
        document.getElementById('btn-build').addEventListener('click', () => this.togglePanel('panel-build'));
        document.getElementById('btn-tech').addEventListener('click', () => this.togglePanel('panel-tech'));
        document.querySelectorAll('.panel-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById(btn.dataset.panel).classList.add('hidden');
                document.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
                this.requestPointerLock();
            });
        });
    }

    togglePanel(id) {
        const panel = document.getElementById(id);
        const isHidden = panel.classList.contains('hidden');
        // Close all panels but don't re-lock pointer if we're opening another
        document.querySelectorAll('.side-panel').forEach(p => p.classList.add('hidden'));
        document.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
        if (isHidden) {
            panel.classList.remove('hidden');
            this.updatePanelContent(id);
            if (id === 'panel-crafting') document.getElementById('btn-craft').classList.add('active');
            if (id === 'panel-build') document.getElementById('btn-build').classList.add('active');
            if (id === 'panel-tech') document.getElementById('btn-tech').classList.add('active');
            // Exit pointer lock when opening panel
            if (this.pointerLocked) document.exitPointerLock();
        } else {
            // Panel was open and is now closing  re-request pointer lock
            if (this.gameRunning) {
                this.requestPointerLock();
                if (!this.pointerLocked) {
                    const prompt = document.getElementById('pointer-lock-prompt');
                    prompt.classList.remove('hidden');
                    prompt.classList.add('visible');
                }
            }
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
        if (id === 'panel-inventory') this.renderInventoryGrid();
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

    // --- Digging ---
    dig() {
        if (this.player.harvesting) return;
        if (this.player.energy < 3) { this.notify('Too tired to dig!', 'warning'); return; }
        const target = this.getTargetTile();
        if (!target) return;
        if (target.distance > INTERACT_RANGE) { this.notify('Too far away!', 'warning'); return; }
        const tile = this.world.getTile(target.tx, target.ty);
        if (!tile) return;
        if (tile.biome === 'water') { this.notify("Can't dig underwater!", 'warning'); return; }
        if (tile.building) { this.notify("Can't dig under a building!", 'warning'); return; }
        if ((tile.digDepth || 0) >= 5) { this.notify('Hole is too deep!', 'warning'); return; }

        tile.digDepth = (tile.digDepth || 0) + 1;
        this.player.addItem('soil', 2);
        this.player.energy = Math.max(0, this.player.energy - 3);
        this.researchPoints += 0.2;
        this.notify('Dug soil! +2 Soil', 'success');

        // Update terrain mesh at this vertex and neighbors
        this.updateTerrainAt(target.tx, target.ty);
        this.updateInventoryUI();
        this.updateUI();
    }

    updateTerrainAt(tx, ty) {
        const terrain = this.terrainMesh;
        if (!terrain) return;
        const geo = terrain.geometry;
        const positions = geo.attributes.position;
        // Update the vertex and its 4 neighbors for smooth holes
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const vx = tx + dx, vy = ty + dy;
                if (vx < 0 || vx >= WORLD_W || vy < 0 || vy >= WORLD_H) continue;
                const vIdx = vy * WORLD_W + vx;
                positions.setY(vIdx, this.world.getTileHeight(vx, vy));
            }
        }
        positions.needsUpdate = true;
        geo.computeVertexNormals();
    }

    // --- Drinking ---
    drinkWater() {
        const p = this.player;
        if (p.thirst >= p.maxThirst - 5) { this.notify('Not thirsty!', 'info'); return; }
        const ptx = Math.floor(p.x), pty = Math.floor(p.z);
        // Check for adjacent water tiles (3-tile radius for easier access from shore)
        for (let dy = -3; dy <= 3; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
                const t = this.world.getTile(ptx + dx, pty + dy);
                if (t && t.biome === 'water') {
                    p.thirst = Math.min(p.maxThirst, p.thirst + 40);
                    p.energy = Math.min(p.maxEnergy, p.energy + 5);
                    this.notify('[W] Drank water! +40 Thirst', 'success');
                    this.updateUI();
                    return;
                }
            }
        }
        this.notify('No water nearby! Find a lake or river.', 'warning');
    }

    // --- Interaction ---
    interact() {
        if (this.player.harvesting) return;
        // Inside hut: raycast against 3D bed / campfire
        if (this.inHut) {
            this.interactWithHutInterior();
            return;
        }
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
        // Fishing: looking at water with fishing rod selected
        if (tile.biome === 'water') {
            const items = Object.entries(this.player.inventory).filter(([_, c]) => c > 0);
            const entry = items[this.player.selectedSlot];
            if (entry && entry[0] === 'fishing_rod') {
                this.startFishing(target.tx, target.ty);
                return;
            }
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
            const displayName = this.getFoodDisplayName(item);
            this.notify(`+${amt} ${displayName}`, 'success');
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
    getFoodDisplayName(itemKey) {
        const def = ITEMS[itemKey];
        if (!def) return itemKey;
        if (def.edible && !this.discoveredFoods.has(itemKey)) return 'Mysterious Food';
        return def.name;
    }

    eatSelectedItem() {
        const items = Object.entries(this.player.inventory).filter(([_, c]) => c > 0);
        const entry = items[this.player.selectedSlot];
        if (!entry) { this.notify('No item selected!', 'warning'); return; }
        const [itemKey] = entry;
        const def = ITEMS[itemKey];
        if (!def || !def.edible) { this.notify(`Can't eat ${def?.name || itemKey}!`, 'warning'); return; }
        this.player.removeItem(itemKey, 1);
        const wasUndiscovered = !this.discoveredFoods.has(itemKey);
        this.discoveredFoods.add(itemKey);
        if (def.energy > 0 || def.health > 0) {
            this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + Math.max(0, def.energy));
            this.player.health = Math.min(this.player.maxHealth, this.player.health + Math.max(0, def.health));
            // Eating restores hunger
            const hungerRestore = def.energy > 0 ? Math.min(30, def.energy * 1.2) : 10;
            this.player.hunger = Math.min(this.player.maxHunger, this.player.hunger + hungerRestore);
        }
        if (def.health < 0) {
            this.player.health = Math.max(0, this.player.health + def.health);
        }
        if (def.energy < 0) {
            this.player.energy = Math.max(0, this.player.energy + def.energy);
        }
        if (def.health < 0 && def.health <= -40) {
            this.notify(`The ${def.name} was deadly! ${def.health} HP!`, 'warning');
        } else if (def.health < 0) {
            this.notify(`The ${def.name} was poisonous! ${def.health} HP, ${def.energy} energy`, 'warning');
        } else {
            this.notify(`Ate ${def.name}: +${def.energy} energy`, 'success');
        }
        if (wasUndiscovered) {
            this.notify(`You discovered: ${def.name}!`, 'info');
        }
        this.updateInventoryUI();
        this.updateUI();
    }


    // --- Hut Interior (3D first-person) ---
    buildHutInterior() {
        const group = new THREE.Group();
        group.name = 'hutInterior';

        // Floor
        const floorMat = new THREE.MeshLambertMaterial({ color: 0x6b4423 });
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        group.add(floor);

        // Bed (back-left corner)
        const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.25, 2.0), new THREE.MeshLambertMaterial({ color: 0x5a3a20 }));
        bedFrame.position.set(-0.6, 0.125, -0.7);
        bedFrame.userData.isHutBed = true;
        group.add(bedFrame);
        const mattress = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 1.8), new THREE.MeshLambertMaterial({ color: 0xd0d0d0 }));
        mattress.position.set(-0.6, 0.31, -0.7);
        mattress.userData.isHutBed = true;
        group.add(mattress);
        const blanket = new THREE.Mesh(new THREE.BoxGeometry(0.97, 0.14, 1.0), new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
        blanket.position.set(-0.6, 0.34, -0.4);
        blanket.userData.isHutBed = true;
        group.add(blanket);
        const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.3), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        pillow.position.set(-0.6, 0.35, -1.25);
        pillow.userData.isHutBed = true;
        group.add(pillow);

        // Campfire spot (right side, hidden until placed)
        const fireRing = ModelFactory.createBuilding('campfire');
        fireRing.scale.set(0.7, 0.7, 0.7);
        fireRing.position.set(0.7, 0, 0.7);
        fireRing.name = 'hutCampfire';
        fireRing.userData.isHutCampfire = true;
        fireRing.visible = false;
        group.add(fireRing);

        // Place-campfire prompt box
        const boxMat = new THREE.MeshLambertMaterial({ color: 0x4a2f1a, transparent: true, opacity: 0.5 });
        const emptySpot = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.8), boxMat);
        emptySpot.position.set(0.7, 0.025, 0.7);
        emptySpot.name = 'hutCampfireEmpty';
        emptySpot.userData.isHutCampfireEmpty = true;
        group.add(emptySpot);

        // Warm point light (visible when campfire placed)
        const light = new THREE.PointLight(0xffaa44, 0, 8);
        light.position.set(0.7, 1, 0.7);
        light.name = 'hutCampfireLight';
        group.add(light);

        this.scene.add(group);
        this.hutInteriorGroup = group;
    }

    interactWithHutInterior() {
        // Raycast against hut interior objects
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);
        const hits = raycaster.intersectObject(this.hutInteriorGroup, true);
        if (hits.length === 0) return;
        let node = hits[0].object;
        while (node) {
            if (node.userData.isHutBed) { this.startSleep(); return; }
            if (node.userData.isHutCampfireEmpty) { this.placeCampfireInHut(); return; }
            if (node.userData.isHutCampfire) { this.notify('The campfire crackles warmly.', 'info'); return; }
            node = node.parent;
        }
    }

    enterHut(tx, ty) {
        this.inHut = true;
        this.hutTile = { tx, ty };

        // Build 3D interior if not already
        if (!this.hutInteriorGroup) this.buildHutInterior();

        // Position the interior group over the hut in the world
        const wx = tx * TILE_SIZE + TILE_SIZE / 2;
        const wz = ty * TILE_SIZE + TILE_SIZE / 2;
        const wy = this.world.getTileCenterHeight(tx, ty);
        this.hutInteriorGroup.position.set(wx, wy, wz);
        this.hutInteriorGroup.visible = true;

        // Update campfire visibility based on save state
        const tile = this.world.getTile(tx, ty);
        const fire = this.hutInteriorGroup.getObjectByName('hutCampfire');
        const empty = this.hutInteriorGroup.getObjectByName('hutCampfireEmpty');
        const light = this.hutInteriorGroup.getObjectByName('hutCampfireLight');
        if (fire && empty && light) {
            fire.visible = !!tile.hutCampfire;
            empty.visible = !tile.hutCampfire;
            light.intensity = tile.hutCampfire ? 1.2 : 0;
        }

        // Move camera to inside the hut, facing the bed
        this.hutCameraPos = new THREE.Vector3(wx, wy + 1.4, wz + 1.2);
        this.camera.position.copy(this.hutCameraPos);

        // Show crosshair and hint
        document.getElementById('crosshair').classList.add('visible');
        if (this.isNight) {
            this.notify('Look at the bed and press I / Click to sleep. Press I / ESC to leave.', 'info');
        } else {
            this.notify('You are inside the hut. Look at the empty spot to place a campfire. Press I / ESC to leave.', 'info');
        }
    }

    exitHut() {
        if (!this.inHut) return;
        this.inHut = false;
        this.hutTile = null;
        if (this.hutInteriorGroup) this.hutInteriorGroup.visible = false;
        if (this.gameRunning) {
            this.requestPointerLock();
        }
    }

    placeCampfireInHut() {
        if (!this.hutTile) return;
        const tile = this.world.getTile(this.hutTile.tx, this.hutTile.ty);
        if (tile.hutCampfire) {
            this.notify('There is already a campfire in the hut', 'info');
            return;
        }
        if (this.player.hasItem('wood', 5) && this.player.hasItem('stone', 3)) {
            this.player.removeItem('wood', 5);
            this.player.removeItem('stone', 3);
            tile.hutCampfire = true;
            const fire = this.hutInteriorGroup?.getObjectByName('hutCampfire');
            const empty = this.hutInteriorGroup?.getObjectByName('hutCampfireEmpty');
            const light = this.hutInteriorGroup?.getObjectByName('hutCampfireLight');
            if (fire && empty) { fire.visible = true; empty.visible = false; }
            if (light) light.intensity = 1.2;
            this.notify('Campfire placed inside the hut!', 'success');
            this.updateInventoryUI();
            this.updateUI();
        } else {
            this.notify('Need 5 wood and 3 stone to build a campfire', 'warning');
        }
    }

    startSleep() {
        if (!this.isNight) {
            this.notify('You can only sleep at night!', 'warning');
            return;
        }
        if (this.sleeping) return;
        this.sleeping = true;
        this.sleepFade = 0;
        this.sleepTimer = 4; // 4 seconds of fade before skip
        const overlay = document.getElementById('sleep-overlay');
        overlay.classList.remove('hidden');
        overlay.classList.add('fading-in');
        this.notify('You drift off to sleep...', 'info');
    }

    finishSleep() {
        // Skip to dawn: advance time to start of next day
        const elapsedInCycle = (this.time % this.totalCycle);
        if (this.isNight) {
            // Skip remaining night time
            const nightElapsed = elapsedInCycle - this.dayDuration;
            const nightRemaining = this.nightDuration - nightElapsed;
            this.time += nightRemaining;
        }
        this.sleeping = false;
        this.sleepFade = 0;
        // Restore player
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 30);
        this.player.energy = this.player.maxEnergy;
        this.player.hunger = Math.min(this.player.maxHunger, this.player.hunger + 20);
        this.player.thirst = Math.min(this.player.maxThirst, this.player.thirst + 20);
        // Fade out
        const overlay = document.getElementById('sleep-overlay');
        overlay.classList.remove('fading-in');
        overlay.classList.add('fading-out');
        setTimeout(() => {
            overlay.classList.add('hidden');
            overlay.classList.remove('fading-out');
        }, 1500);
        this.notify('You wake up feeling refreshed! +30 HP, full energy', 'success');
        this.updateUI();
        // Exit hut
        this.exitHut();
    }

    startFishing(tx, ty) {
        const baseTime = 3 + Math.random() * 4;
        this.player.harvesting = { tx, ty, progress: 0, total: baseTime, resource: null, fishing: true };
        this.notify('Casting line...', 'info');
    }

    completeFishing() {
        const h = this.player.harvesting;
        if (Math.random() < 0.75) {
            const amt = 1 + Math.floor(Math.random() * 2);
            this.player.addItem('raw_fish', amt);
            this.notify(`+${amt} Raw Fish`, 'success');
        } else {
            this.notify('The fish got away!', 'info');
        }
        this.player.energy = Math.max(0, this.player.energy - 2);
        this.player.harvesting = null;
        this.researchPoints += 0.3;
        this.updateInventoryUI();
        this.updateUI();
        this.checkQuests();
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
            const displayName = this.getFoodDisplayName(item);
            this.notify(`+${amt} ${displayName}`, 'success');
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
            // Try cooking first - if player has raw meat or raw fish
            let cooked = false;
            if (this.player.hasItem('raw_meat', 1) && this.player.hasItem('wood', 1)) {
                this.player.removeItem('raw_meat', 1);
                this.player.removeItem('wood', 1);
                this.player.addItem('cooked_meat', 1);
                this.notify('[M] Cooked meat on the campfire!', 'success');
                cooked = true;
            } else if (this.player.hasItem('raw_fish', 1) && this.player.hasItem('wood', 1)) {
                this.player.removeItem('raw_fish', 1);
                this.player.removeItem('wood', 1);
                this.player.addItem('cooked_fish', 1);
                this.notify('Cooked fish on the campfire!', 'success');
                cooked = true;
            }
            if (cooked) {
                this.updateInventoryUI();
                this.updateUI();
                return;
            }
            if (this.player.energy < this.player.maxEnergy) {
                this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + 20);
                this.notify('Restored energy by the campfire', 'success');
                this.updateUI();
            } else { this.notify('Energy already full', 'info'); }
        } else if (tile.building === 'wood_hut') {
            this.enterHut(tx, ty);
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
        this.renderBuild();
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
                            const resType = nt.resource;
                            nt.resource = null; nt.resourceAmount = 0;
                            this.removeResourceMesh(x+dx, y+dy);
                            this.world.queueRespawn(x+dx, y+dy, resType || 'stone');
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

    // --- Creatures ---
    feedCreature() {
        const p = this.player;
        const slots = Object.keys(p.inventory).filter(k => ITEMS[k]?.edible);
        if (slots.length === 0) {
            this.notify('No food to feed!', 'warning');
            return false;
        }
        for (let i = this.creatures.length - 1; i >= 0; i--) {
            const c = this.creatures[i];
            const def = CREATURE_TYPES[c.type];
            if (!def.canBeFed) continue;
            const dx = c.x - p.x;
            const dz = c.z - p.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < 3) {
                // Feed the first edible item in inventory
                const itemKey = slots[0];
                p.removeItem(itemKey, 1);
                const itemName = ITEMS[itemKey]?.name || itemKey;
                this.notify(`Fed ${def.name} ${itemName}`, 'success');
                this.updateInventoryUI();
                // Rare chance to start following
                if (!c.following && Math.random() < (def.followChance || 0.05)) {
                    c.following = true;
                    c.fleeDist = 0;
                    this.notify(`The ${def.name} seems to like you! It will follow you.`, 'success');
                }
                return true;
            }
        }
        return false;
    }

    attackCreature() {
        const p = this.player;
        const items = Object.entries(p.inventory).filter(([_, c]) => c > 0);
        const entry = items[p.selectedSlot];
        let damage = 2;
        let weaponName = 'bare hands';
        let attackRange = 3;
        let itemDef = null;
        if (entry) {
            const [itemKey] = entry;
            itemDef = ITEMS[itemKey];
            damage = itemDef?.attackPower || 2;
            weaponName = itemDef?.name || itemKey;
            if (itemDef?.ranged) attackRange = itemDef.range || 30;
        }

        // --- Raycast for headshot detection ---
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);
        const creatureMeshList = [...this.creatureMeshes.values()];
        const intersects = raycaster.intersectObjects(creatureMeshList, true);

        let aimedCreature = null;
        let aimedHitY = 0;
        if (intersects.length > 0) {
            const hit = intersects[0];
            for (const c of this.creatures) {
                const mesh = this.creatureMeshes.get(c.id);
                if (!mesh) continue;
                let node = hit.object;
                while (node) { if (node === mesh) { aimedCreature = c; aimedHitY = hit.point.y; break; } node = node.parent; }
                if (aimedCreature) break;
            }
        }

        let targetCreature = null;
        let isHeadshot = false;

        if (aimedCreature) {
            const dx = aimedCreature.x - p.x;
            const dz = aimedCreature.z - p.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < attackRange) {
                targetCreature = aimedCreature;
                const creatureWorldY = aimedCreature.y;
                const creatureHeight = this.getCreatureHeight(aimedCreature.type);
                const headThreshold = creatureWorldY + creatureHeight * 0.65;
                isHeadshot = aimedHitY >= headThreshold;
            }
        }

        if (!targetCreature) {
            for (let i = this.creatures.length - 1; i >= 0; i--) {
                const c = this.creatures[i];
                const dx = c.x - p.x;
                const dz = c.z - p.z;
                const dist = Math.sqrt(dx * dx + dz * dz);
                if (dist < attackRange) { targetCreature = c; break; }
            }
        }

        if (!targetCreature) return false;

        const def = CREATURE_TYPES[targetCreature.type];
        if (def.aggroWhenAttacked) targetCreature.aggroed = true;
        if (targetCreature.onWeb) targetCreature.onWeb = false;

        const isRanged = itemDef?.ranged;
        const isWolf = targetCreature.type === 'wolf';

        // Wolves take fixed 10 hits from non-ranged weapons
        if (isWolf && !isRanged) {
            damage = targetCreature.maxHealth / 10;
        }

        // Headshot logic
        if (isHeadshot) {
            if (isWolf && !isRanged) {
                // Headshot with non-ranged weapon knocks out the wolf
                targetCreature.knockedOut = true;
                targetCreature.knockoutTimer = 8;
                targetCreature.state = 'idle';
                targetCreature.targetX = targetCreature.x;
                targetCreature.targetZ = targetCreature.z;
                this.notify(`HEADSHOT! Wolf knocked out! (${Math.ceil(targetCreature.health / (targetCreature.maxHealth / 10))} hits left)`, 'success');
                this.updateInventoryUI();
                this.updateUI();
                return true;
            } else {
                // Ranged weapon headshot = instant kill (for all creatures including wolves)
                damage = targetCreature.health;
                this.notify(`HEADSHOT! ${def.name} killed instantly!`, 'success');
            }
        }

        targetCreature.health -= damage;

        if (targetCreature.health <= 0) {
            for (const [item, amt] of Object.entries(targetCreature.drops)) {
                p.addItem(item, amt);
                this.notify(`+${amt} ${ITEMS[item]?.name || item}`, 'success');
            }
            this.researchPoints += targetCreature.xp;
            if (!isHeadshot) this.notify(`Killed ${def.name}! +${targetCreature.xp} RP`, 'success');
            const idx = this.creatures.indexOf(targetCreature);
            if (idx >= 0) this.creatures.splice(idx, 1);
            const mesh = this.creatureMeshes.get(targetCreature.id);
            if (mesh) { this.scene.remove(mesh); this.creatureMeshes.delete(targetCreature.id); }
        } else {
            if (isWolf && !isRanged) {
                const hitsLeft = Math.ceil(targetCreature.health / (targetCreature.maxHealth / 10));
                this.notify(`Hit Wolf for ${damage} with ${weaponName}! ${hitsLeft} hits left`, 'info');
            } else {
                this.notify(`Hit ${def.name} for ${damage} with ${weaponName}!`, 'info');
            }
        }
        this.updateInventoryUI();
        this.updateUI();
        return true;
    }

    getCreatureHeight(type) {
        const heights = { deer: 2.0, fawn: 1.2, wolf: 1.1, bear: 1.8, rabbit: 0.7, spider: 0.8 };
        return heights[type] || 1.5;
    }

    spawnCreature() {
        const p = this.player;
        const angle = Math.random() * Math.PI * 2;
        const dist = 15 + Math.random() * 20;
        const cx = Math.floor(p.x + Math.cos(angle) * dist);
        const cz = Math.floor(p.z + Math.sin(angle) * dist);
        if (cx < 1 || cx >= WORLD_W - 1 || cz < 1 || cz >= WORLD_H - 1) return;
        const tile = this.world.getTile(cx, cz);
        if (!tile || !BIOMES[tile.biome].walkable) return;
        // Pick a creature type that fits the biome, weighted by spawnWeight
        let candidates = Object.entries(CREATURE_TYPES).filter(([_, def]) => def.biomes.includes(tile.biome));
        // Time-based spawning: nocturnal creatures spawn at night, diurnal during day
        if (this.isNight) {
            // At night: only nocturnal creatures (spider) + wolves
            candidates = candidates.filter(([t, d]) => d.nocturnal || t === 'wolf');
        } else {
            // During day: block nocturnal creatures (spider)
            candidates = candidates.filter(([t, d]) => !d.nocturnal);
        }
        if (candidates.length === 0) return;
        // Boost wolf spawn weight by 20% at night for more wolf packs
        if (this.isNight) {
            candidates = candidates.map(([t, d]) => [t, t === 'wolf' ? { ...d, spawnWeight: d.spawnWeight * 1.2 } : d]);
        }
        const totalWeight = candidates.reduce((sum, [_, d]) => sum + (d.spawnWeight || 1), 0);
        let roll = Math.random() * totalWeight;
        let type, def;
        for (const [t, d] of candidates) {
            roll -= (d.spawnWeight || 1);
            if (roll <= 0) { type = t; def = d; break; }
        }
        if (!type) { type = candidates[0][0]; def = candidates[0][1]; }
        const h = this.world.getTileHeight(cx, cz);
        // Pack spawning for wolves
        const packSize = def.packSpawn ? 3 + Math.floor(Math.random() * 3) : 1;
        for (let pi = 0; pi < packSize && this.creatures.length < this.maxCreatures; pi++) {
            const px = cx + (Math.random() - 0.5) * 4;
            const pz = cz + (Math.random() - 0.5) * 4;
            const ptile = this.world.getTile(Math.floor(px), Math.floor(pz));
            if (!ptile || !BIOMES[ptile.biome].walkable) continue;
            const ph = this.world.getHeightAt(px + 0.5, pz + 0.5);
            this.creatures.push({
                id: Math.random().toString(36).slice(2),
                type, x: px + 0.5, z: pz + 0.5, y: ph,
                rotation: Math.random() * Math.PI * 2,
                health: def.health, maxHealth: def.health,
                speed: def.speed, damage: def.damage,
                hostile: def.hostile, fleeDist: def.fleeDist,
                attackRange: def.attackRange, drops: def.drops, xp: def.xp,
                state: 'idle', stateTimer: 0,
                targetX: px + 0.5, targetZ: pz + 0.5,
                attackCooldown: 0,
                walkPhase: 0,
                aggroed: false,
                hungerTimer: 20 + Math.random() * 40,
                following: false,
                pounced: false,
                pounceTimer: 0,
                onWeb: def.onWeb || false,
                gender: (type === 'deer') ? (Math.random() < 0.5 ? 'male' : 'female') : null,
                berryTimer: def.eatsBerries ? 10 + Math.random() * 20 : 0,
                grazeTimer: def.eatsGrass ? 10 + Math.random() * 15 : 0,
                grazing: false,
                huntCooldown: 0,
                defendCooldown: 0,
                knockedOut: false,
                knockoutTimer: 0,
                sleeping: false,
                sleepTimer: 0,
                howlTimer: 15 + Math.random() * 30,
                alertness: 0,
                // New realistic behavior properties
                alertState: false,       // frozen and looking at threat
                alertTimer: 0,           // how long to stay frozen
                parentId: null,          // for fawns - follows parent deer
                starveTimer: def.starveTimer || 0,  // wolves get hungry over time
                territoryX: px + 0.5,    // home territory center
                territoryZ: pz + 0.5,
                territoryRadius: 25,     // animals stay near territory
                lookTimer: Math.random() * 5, // periodic looking around
                fishTimer: def.fishes ? 20 + Math.random() * 30 : 0,
            });
        }
        // Link fawns to nearest deer as parent
        for (const fawn of this.creatures) {
            if (fawn.type !== 'fawn' || fawn.parentId) continue;
            let nearestDeer = null, nearestDist = 999;
            for (const deer of this.creatures) {
                if (deer.type !== 'deer') continue;
                const d = Math.sqrt((deer.x - fawn.x) ** 2 + (deer.z - fawn.z) ** 2);
                if (d < nearestDist) { nearestDist = d; nearestDeer = deer; }
            }
            if (nearestDeer && nearestDist < 10) fawn.parentId = nearestDeer.id;
        }
    }

    updateCreatures(dt) {
        const p = this.player;
        this.attackCooldown = Math.max(0, this.attackCooldown - dt);
        for (let i = this.creatures.length - 1; i >= 0; i--) {
            const c = this.creatures[i];
            const def = CREATURE_TYPES[c.type];
            const dx = p.x - c.x;
            const dz = p.z - c.z;
            const distToPlayer = Math.sqrt(dx * dx + dz * dz);
            c.stateTimer -= dt;
            c.attackCooldown = Math.max(0, c.attackCooldown - dt);
            c.huntCooldown = Math.max(0, c.huntCooldown - dt);
            c.defendCooldown = Math.max(0, c.defendCooldown - dt);

            // Knockout timer for wolves
            if (c.knockedOut) {
                c.knockoutTimer -= dt;
                if (c.knockoutTimer <= 0) {
                    c.knockedOut = false;
                    c.aggroed = true;
                    this.notify('The wolf woke up!', 'warning');
                } else {
                    c.state = 'idle';
                    c.targetX = c.x;
                    c.targetZ = c.z;
                    c.moving = false;
                    const mesh = this.creatureMeshes.get(c.id);
                    if (mesh) {
                        mesh.position.set(c.x * TILE_SIZE, c.y, c.z * TILE_SIZE);
                        mesh.rotation.y = c.rotation;
                        if (mesh.userData.bodyRef) mesh.userData.bodyRef.rotation.z = Math.PI / 2;
                    }
                    continue;
                }
            }

            // --- Sleeping: diurnal creatures sleep at night, nocturnal sleep during day ---
            if (!c.aggroed && !c.following) {
                const shouldSleep = def.nocturnal ? !this.isNight : (this.isNight && c.type !== 'spider' && c.type !== 'wolf');
                if (shouldSleep && !c.sleeping && c.stateTimer <= 0 && Math.random() < 0.3) {
                    c.sleeping = true;
                    c.sleepTimer = 15 + Math.random() * 25;
                    c.state = 'sleep';
                    c.targetX = c.x;
                    c.targetZ = c.z;
                }
                if (c.sleeping) {
                    c.sleepTimer -= dt;
                    c.state = 'sleep';
                    c.targetX = c.x;
                    c.targetZ = c.z;
                    // Wake up if player gets close or takes damage
                    if (distToPlayer < 5 || c.health < c.maxHealth) {
                        c.sleeping = false;
                        c.stateTimer = 2;
                    }
                    if (c.sleepTimer <= 0 || !shouldSleep) {
                        c.sleeping = false;
                        c.stateTimer = 2;
                    }
                }
            }

            // --- Wolf pack howling at night ---
            if (c.type === 'wolf' && !c.pounced) {
                c.howlTimer -= dt;
                if (c.howlTimer <= 0) {
                    c.howlTimer = 20 + Math.random() * 40;
                    if (this.isNight && distToPlayer < 40) {
                        this.notify('You hear a wolf howling in the distance...', 'warning');
                        this.playWolfHowl(distToPlayer);
                        // Nearby wolves become alert
                        for (const other of this.creatures) {
                            if (other.type === 'wolf' && other !== c) {
                                const odx = other.x - c.x;
                                const odz = other.z - c.z;
                                if (Math.sqrt(odx*odx + odz*odz) < 20) {
                                    other.aggroed = true;
                                    other.alertness = 10;
                                }
                            }
                        }
                    }
                }
            }

            // Skip AI if sleeping
            if (c.sleeping) {
                const mesh = this.creatureMeshes.get(c.id);
                if (mesh) {
                    mesh.position.set(c.x * TILE_SIZE, c.y, c.z * TILE_SIZE);
                    if (mesh.userData.bodyRef) mesh.userData.bodyRef.rotation.z = Math.PI / 2;
                }
                continue;
            }

            // --- Territory: animals stay near home, wander within range ---
            c.lookTimer -= dt;
            if (c.lookTimer <= 0 && c.state === 'idle' && !c.aggroed && !c.following) {
                c.lookTimer = 5 + Math.random() * 10;
                // Periodically look around (rotate in place)
                c.rotation += (Math.random() - 0.5) * 1.5;
            }

            // --- Weather shelter: animals move toward cover in bad weather ---
            if ((this.weather === 'rain' || this.weather === 'snow') && !c.aggroed && !c.following && c.type !== 'spider') {
                // Move toward nearest forest/mountain tile for shelter
                if (c.stateTimer <= 0 && c.state !== 'graze' && c.state !== 'seek_grass') {
                    const ctx = Math.floor(c.x), ctz = Math.floor(c.z);
                    const ct = this.world.getTile(ctx, ctz);
                    if (ct && ct.biome !== 'forest' && ct.biome !== 'mountain') {
                        c.state = 'seek_shelter';
                        // Move in a random direction to find cover
                        const ang = Math.random() * Math.PI * 2;
                        c.targetX = c.x + Math.cos(ang) * 10;
                        c.targetZ = c.z + Math.sin(ang) * 10;
                        c.stateTimer = 3;
                    }
                }
            }

            // --- Bear fishing in water ---
            if (def.fishes && !c.aggroed && !c.following) {
                c.fishTimer -= dt;
                if (c.fishTimer <= 0) {
                    const ctx = Math.floor(c.x), ctz = Math.floor(c.z);
                    // Look for water nearby
                    let foundWater = false;
                    for (let sy = -5; sy <= 5 && !foundWater; sy++) {
                        for (let sx = -5; sx <= 5 && !foundWater; sx++) {
                            const t = this.world.getTile(ctx + sx, ctz + sy);
                            if (t && t.biome === 'water') {
                                const wx = ctx + sx + 0.5, wz = ctz + sy + 0.5;
                                const wd = Math.sqrt((wx - c.x) ** 2 + (wz - c.z) ** 2);
                                if (wd < 2) {
                                    // At water - try to catch fish
                                    if (Math.random() < 0.5) {
                                        this.notify('The bear catches a fish from the water!', 'info');
                                    }
                                    c.fishTimer = 30 + Math.random() * 40;
                                    foundWater = true;
                                } else {
                                    c.state = 'seek_water';
                                    c.targetX = wx;
                                    c.targetZ = wz;
                                    c.stateTimer = 8;
                                    foundWater = true;
                                }
                            }
                        }
                    }
                    if (!foundWater) c.fishTimer = 10 + Math.random() * 20;
                }
            }

            // --- Deer grazing ---
            if (def.eatsGrass && !c.aggroed && !c.following) {
                c.grazeTimer -= dt;
                if (c.grazing) {
                    c.state = 'graze';
                    c.targetX = c.x;
                    c.targetZ = c.z;
                    c.moving = false;
                    if (c.grazeTimer <= 0) {
                        c.grazing = false;
                        c.grazeTimer = 15 + Math.random() * 20;
                        const ctx = Math.floor(c.x), ctz = Math.floor(c.z);
                        const ct = this.world.getTile(ctx, ctz);
                        if (ct && ct.resource === 'grass') {
                            ct.resource = null;
                            ct.resourceAmount = 0;
                            this.removeResourceMesh(ctx, ctz);
                            this.world.queueRespawn(ctx, ctz, 'grass');
                        }
                    }
                } else if (c.grazeTimer <= 0) {
                    const ctx = Math.floor(c.x), ctz = Math.floor(c.z);
                    let foundGrass = false;
                    for (let sy = -3; sy <= 3 && !foundGrass; sy++) {
                        for (let sx = -3; sx <= 3 && !foundGrass; sx++) {
                            const t = this.world.getTile(ctx + sx, ctz + sy);
                            if (t && t.resource === 'grass') {
                                const wx = ctx + sx + 0.5;
                                const wz = ctz + sy + 0.5;
                                const gd = Math.sqrt((wx - c.x) ** 2 + (wz - c.z) ** 2);
                                if (gd < 1.5) {
                                    c.grazing = true;
                                    c.grazeTimer = 5 + Math.random() * 5;
                                    foundGrass = true;
                                } else {
                                    c.state = 'seek_grass';
                                    c.targetX = wx;
                                    c.targetZ = wz;
                                    c.stateTimer = 5;
                                    foundGrass = true;
                                }
                            }
                        }
                    }
                    if (!foundGrass) c.grazeTimer = 5 + Math.random() * 10;
                }
            }

            // Hunger timer for bears - only aggro if very hungry
            if (def.hungerChance && !c.aggroed) {
                c.hungerTimer -= dt;
                if (c.hungerTimer <= 0 && Math.random() < def.hungerChance) {
                    c.aggroed = true;
                    c.hungerTimer = 60 + Math.random() * 60;
                } else if (c.hungerTimer <= 0) {
                    c.hungerTimer = 60 + Math.random() * 60;
                }
            }

            // Wolf starvation - wolves get more aggressive when starving
            if (def.starveTimer && !c.aggroed) {
                c.starveTimer -= dt;
                if (c.starveTimer <= 0) {
                    c.aggroed = true; // starving wolf attacks player
                    c.starveTimer = 90;
                    if (distToPlayer < 30) this.notify('A starving wolf is hunting you!', 'warning');
                }
            }

            // --- Bear eating berries ---
            if (def.eatsBerries && !c.aggroed && !c.following) {
                c.berryTimer -= dt;
                if (c.berryTimer <= 0) {
                    const ctx = Math.floor(c.x), ctz = Math.floor(c.z);
                    let foundBerry = false;
                    for (let sy = -4; sy <= 4 && !foundBerry; sy++) {
                        for (let sx = -4; sx <= 4 && !foundBerry; sx++) {
                            const t = this.world.getTile(ctx + sx, ctz + sy);
                            if (t && t.resource && (t.resource === 'bush' || t.resource === 'red_berries')) {
                                const wx = ctx + sx + 0.5;
                                const wz = ctz + sy + 0.5;
                                const bd = Math.sqrt((wx - c.x) ** 2 + (wz - c.z) ** 2);
                                if (bd < 2) {
                                    const berryType = t.resource;
                                    t.resource = null;
                                    t.resourceAmount = 0;
                                    this.removeResourceMesh(ctx + sx, ctz + sy);
                                    this.world.queueRespawn(ctx + sx, ctz + sy, berryType);
                                    c.berryTimer = 25 + Math.random() * 20;
                                    foundBerry = true;
                                } else {
                                    c.state = 'seek_berries';
                                    c.targetX = wx;
                                    c.targetZ = wz;
                                    c.stateTimer = 5;
                                    foundBerry = true;
                                }
                            }
                        }
                    }
                    if (!foundBerry) c.berryTimer = 5 + Math.random() * 10;
                }
            }

            const isAggro = c.hostile || c.aggroed;

            // --- Predator-prey AI ---
            let preyTarget = null;
            let predatorThreat = null;
            let wolfToFight = null;

            if (def.huntsPrey && c.huntCooldown <= 0 && !c.aggroed && !c.following) {
                for (const other of this.creatures) {
                    if (other === c) continue;
                    const odef = CREATURE_TYPES[other.type];
                    if (!odef.isPrey) continue;
                    const odx = other.x - c.x;
                    const odz = other.z - c.z;
                    const odist = Math.sqrt(odx * odx + odz * odz);
                    if (odist < (def.stalkDist || 15)) {
                        if (!preyTarget || odist < Math.sqrt((preyTarget.x - c.x) ** 2 + (preyTarget.z - c.z) ** 2)) {
                            preyTarget = other;
                        }
                    }
                }
                // Pack hunting: alert nearby wolves to join the chase
                if (preyTarget && c.type === 'wolf') {
                    for (const other of this.creatures) {
                        if (other === c || other.type !== 'wolf') continue;
                        if (other.aggroed || other.pounced) continue;
                        const odx = other.x - c.x, odz = other.z - c.z;
                        if (Math.sqrt(odx*odx + odz*odz) < 15) {
                            other.huntCooldown = 0;
                        }
                    }
                }
            }

            if (def.isPrey) {
                for (const other of this.creatures) {
                    const odef = CREATURE_TYPES[other.type];
                    if (!odef.isPredator) continue;
                    const odx = c.x - other.x;
                    const odz = c.z - other.z;
                    const odist = Math.sqrt(odx * odx + odz * odz);
                    if (odist < 12) {
                        if (!predatorThreat || odist < Math.sqrt((c.x - predatorThreat.x) ** 2 + (c.z - predatorThreat.z) ** 2)) {
                            predatorThreat = other;
                        }
                    }
                }
            }

            // Male deer defend against wolves
            if (c.type === 'deer' && c.gender === 'male' && def.canFightWolf && c.defendCooldown <= 0) {
                for (const other of this.creatures) {
                    if (other.type !== 'wolf') continue;
                    const odx = other.x - c.x;
                    const odz = other.z - c.z;
                    const odist = Math.sqrt(odx * odx + odz * odz);
                    if (odist < 8) { wolfToFight = other; break; }
                }
            }

            // --- Alert/freeze state for prey animals ---
            if (def.alertDist && def.isPrey && !isAggro && !c.following && !c.sleeping) {
                // Count player as a threat too
                let nearestThreat = predatorThreat;
                let nearestThreatDist = predatorThreat ? Math.sqrt((c.x - predatorThreat.x)**2 + (c.z - predatorThreat.z)**2) : 999;
                if (distToPlayer < nearestThreatDist) {
                    nearestThreatDist = distToPlayer;
                    nearestThreat = null; // null means player threat
                }
                // Enter alert state if threat is within alert distance but outside flee distance
                if (nearestThreatDist < (def.alertDist || 10) && nearestThreatDist > (def.fleeDist || 6) && !c.alertState) {
                    c.alertState = true;
                    c.alertTimer = def.freezeDuration || 1.5;
                    c.state = 'alert';
                    c.targetX = c.x;
                    c.targetZ = c.z;
                    c.moving = false;
                    // Face the threat
                    if (nearestThreat) {
                        c.rotation = Math.atan2(nearestThreat.x - c.x, nearestThreat.z - c.z);
                    } else {
                        c.rotation = Math.atan2(p.x - c.x, p.z - c.z);
                    }
                }
                // Handle alert state
                if (c.alertState) {
                    c.alertTimer -= dt;
                    c.state = 'alert';
                    c.targetX = c.x;
                    c.targetZ = c.z;
                    c.moving = false;
                    if (c.alertTimer <= 0) {
                        c.alertState = false;
                        // Now decide: flee if threat still close
                        if (nearestThreatDist < (def.fleeDist || 6)) {
                            // Will be handled by flee logic below
                        } else {
                            // Threat gone - resume normal behavior
                            c.stateTimer = 0;
                        }
                    }
                    // Skip other AI while in alert
                    if (c.alertState) {
                        // Still process pounce/mesh at end
                    }
                }
            }

            // Spider on web stays put and doesn't attack
            if (c.onWeb) {
                c.state = 'idle';
                c.targetX = c.x;
                c.targetZ = c.z;
                if (distToPlayer < 1.5) {
                    c.onWeb = false;
                    c.aggroed = true;
                    this.notify('You broke the spider web!', 'warning');
                }
            } else if (c.alertState) {
                // Frozen in alert - do nothing else
            } else if (c.following) {
                const followDist = 4;
                if (distToPlayer > followDist) {
                    c.state = 'follow';
                    c.targetX = p.x - (dx / distToPlayer) * followDist;
                    c.targetZ = p.z - (dz / distToPlayer) * followDist;
                } else {
                    c.state = 'idle';
                    c.targetX = c.x;
                    c.targetZ = c.z;
                }
            } else if (isAggro && distToPlayer < (def.aggroRange || 12)) {
                // Aggro creature chases player
                c.state = 'chase';
                c.targetX = p.x;
                c.targetZ = p.z;
            } else if (isAggro && c.type === 'wolf' && distToPlayer < 25) {
                // Wolf stalks player from distance when aggro
                c.state = 'stalk';
                const stalkDist = 12;
                if (distToPlayer > stalkDist) {
                    c.targetX = p.x;
                    c.targetZ = p.z;
                } else {
                    c.state = 'idle';
                    c.targetX = c.x;
                    c.targetZ = c.z;
                }
            } else if (wolfToFight) {
                // Male deer charges at wolf to defend
                c.state = 'defend';
                const wdx = wolfToFight.x - c.x;
                const wdz = wolfToFight.z - c.z;
                const wdist = Math.sqrt(wdx * wdx + wdz * wdz);
                if (wdist < 2 && c.attackCooldown <= 0) {
                    wolfToFight.health -= 8;
                    c.attackCooldown = 1.5;
                    c.defendCooldown = 8;
                    if (wolfToFight.health <= 0) {
                        const widx = this.creatures.indexOf(wolfToFight);
                        if (widx >= 0) {
                            for (const [item, amt] of Object.entries(wolfToFight.drops)) {
                                p.addItem(item, amt);
                            }
                            this.researchPoints += wolfToFight.xp;
                            this.creatures.splice(widx, 1);
                            const wmesh = this.creatureMeshes.get(wolfToFight.id);
                            if (wmesh) { this.scene.remove(wmesh); this.creatureMeshes.delete(wolfToFight.id); }
                        }
                    }
                } else {
                    c.targetX = wolfToFight.x;
                    c.targetZ = wolfToFight.z;
                }
            } else if (preyTarget && !c.aggroed) {
                // Predator hunting prey - wolves stalk first, bears charge
                if (c.type === 'wolf') {
                    const pdx = preyTarget.x - c.x;
                    const pdz = preyTarget.z - c.z;
                    const pdist = Math.sqrt(pdx * pdx + pdz * pdz);
                    if (pdist > 8) {
                        // Stalk: move slowly toward prey
                        c.state = 'stalk';
                        c.targetX = preyTarget.x;
                        c.targetZ = preyTarget.z;
                    } else {
                        // Close enough - chase
                        c.state = 'hunt';
                        c.targetX = preyTarget.x;
                        c.targetZ = preyTarget.z;
                        if (pdist < c.attackRange && c.attackCooldown <= 0) {
                            preyTarget.health -= c.damage * 0.6;
                            c.attackCooldown = 1.5;
                            c.huntCooldown = 3;
                            if (preyTarget.health <= 0) {
                                const pidx = this.creatures.indexOf(preyTarget);
                                if (pidx >= 0) {
                                    for (const [item, amt] of Object.entries(preyTarget.drops)) {
                                        p.addItem(item, Math.max(1, Math.floor(amt * 0.5)));
                                    }
                                    this.creatures.splice(pidx, 1);
                                    const pmesh = this.creatureMeshes.get(preyTarget.id);
                                    if (pmesh) { this.scene.remove(pmesh); this.creatureMeshes.delete(preyTarget.id); }
                                }
                            }
                        }
                    }
                } else {
                    // Bear charges prey directly
                    c.state = 'hunt';
                    c.targetX = preyTarget.x;
                    c.targetZ = preyTarget.z;
                    const pdx = preyTarget.x - c.x;
                    const pdz = preyTarget.z - c.z;
                    const pdist = Math.sqrt(pdx * pdx + pdz * pdz);
                    if (pdist < c.attackRange && c.attackCooldown <= 0) {
                        preyTarget.health -= c.damage * 0.6;
                        c.attackCooldown = 1.5;
                        c.huntCooldown = 3;
                        if (preyTarget.health <= 0) {
                            const pidx = this.creatures.indexOf(preyTarget);
                            if (pidx >= 0) {
                                for (const [item, amt] of Object.entries(preyTarget.drops)) {
                                    p.addItem(item, Math.max(1, Math.floor(amt * 0.5)));
                                }
                                this.creatures.splice(pidx, 1);
                                const pmesh = this.creatureMeshes.get(preyTarget.id);
                                if (pmesh) { this.scene.remove(pmesh); this.creatureMeshes.delete(preyTarget.id); }
                            }
                        }
                    }
                }
            } else if (predatorThreat && def.isPrey && !c.following) {
                // Prey flees from predator - zigzag for realistic escape
                c.state = 'flee_predator';
                const pdx = c.x - predatorThreat.x;
                const pdz = c.z - predatorThreat.z;
                const pAng = Math.atan2(pdz, pdx);
                const zigzag = def.zigzag ? Math.sin(this.time * 5 + c.id.charCodeAt(0)) * 0.8 : Math.sin(this.time * 3 + c.id.charCodeAt(0)) * 0.5;
                const fleeAng = pAng + zigzag;
                c.targetX = c.x + Math.cos(fleeAng) * 8;
                c.targetZ = c.z + Math.sin(fleeAng) * 8;
                c.stateTimer = 2;
                // Alert nearby same-species herd members
                for (const other of this.creatures) {
                    if (other === c || other.type !== c.type) continue;
                    const odx = other.x - c.x, odz = other.z - c.z;
                    if (Math.sqrt(odx*odx + odz*odz) < 12) {
                        other.state = 'flee_predator';
                        other.targetX = other.x + Math.cos(fleeAng) * 6;
                        other.targetZ = other.z + Math.sin(fleeAng) * 6;
                        other.stateTimer = 2;
                        other.alertState = false;
                    }
                }
            } else if (def.isPrey && c.fleeDist > 0 && distToPlayer < c.fleeDist && !c.following) {
                // Prey flees from player (skittish behavior)
                c.state = 'flee';
                const fleeAng = Math.atan2(c.z - p.z, c.x - p.x);
                const zigzag = def.zigzag ? Math.sin(this.time * 5 + c.id.charCodeAt(0)) * 0.8 : 0;
                c.targetX = c.x + Math.cos(fleeAng + zigzag) * 10;
                c.targetZ = c.z + Math.sin(fleeAng + zigzag) * 10;
                c.stateTimer = 2;
                // Alert herd members
                if (def.herdAnimal) {
                    for (const other of this.creatures) {
                        if (other === c || other.type !== c.type) continue;
                        const odx = other.x - c.x, odz = other.z - c.z;
                        if (Math.sqrt(odx*odx + odz*odz) < 12) {
                            other.alertState = false;
                            other.state = 'flee';
                            other.targetX = other.x + Math.cos(fleeAng) * 8;
                            other.targetZ = other.z + Math.sin(fleeAng) * 8;
                            other.stateTimer = 2;
                        }
                    }
                }
            } else if (def.followsParent && c.parentId && !c.aggroed && !c.following) {
                // Fawn follows parent deer
                const parent = this.creatures.find(o => o.id === c.parentId);
                if (parent) {
                    const pdx = parent.x - c.x;
                    const pdz = parent.z - c.z;
                    const pdist = Math.sqrt(pdx * pdx + pdz * pdz);
                    if (pdist > 4) {
                        c.state = 'follow_parent';
                        c.targetX = parent.x - (pdx / pdist) * 3;
                        c.targetZ = parent.z - (pdz / pdist) * 3;
                    } else if (c.stateTimer <= 0 && c.state !== 'graze' && c.state !== 'seek_grass') {
                        c.state = 'wander';
                        c.targetX = c.x + (Math.random() - 0.5) * 3;
                        c.targetZ = c.z + (Math.random() - 0.5) * 3;
                        c.stateTimer = 3 + Math.random() * 4;
                    }
                } else {
                    // Parent died - fawn wanders alone
                    if (c.stateTimer <= 0 && c.state !== 'graze' && c.state !== 'seek_grass') {
                        c.state = 'wander';
                        c.targetX = c.x + (Math.random() - 0.5) * 4;
                        c.targetZ = c.z + (Math.random() - 0.5) * 4;
                        c.stateTimer = 3 + Math.random() * 4;
                    }
                }
            } else if (def.eatsGrass && !c.aggroed && !c.following && distToPlayer < 15) {
                // Deer/fawn: check if player has grass selected in hotbar
                const items = Object.entries(p.inventory).filter(([_, cnt]) => cnt > 0);
                const entry = items[p.selectedSlot];
                if (entry && entry[0] === 'grass') {
                    c.state = 'approach';
                    const followDist = 2.5;
                    if (distToPlayer > followDist) {
                        c.targetX = p.x - (dx / distToPlayer) * followDist;
                        c.targetZ = p.z - (dz / distToPlayer) * followDist;
                    } else {
                        c.state = 'idle';
                        c.targetX = c.x;
                        c.targetZ = c.z;
                    }
                } else if (c.stateTimer <= 0 && c.state !== 'seek_grass' && c.state !== 'graze') {
                    // Wander within territory
                    c.state = 'wander';
                    const wx = c.x + (Math.random() - 0.5) * 6;
                    const wz = c.z + (Math.random() - 0.5) * 6;
                    // Stay within territory
                    const tdx = wx - c.territoryX, tdz = wz - c.territoryZ;
                    const tdist = Math.sqrt(tdx*tdx + tdz*tdz);
                    if (tdist > c.territoryRadius) {
                        c.targetX = c.territoryX + (tdx / tdist) * c.territoryRadius * 0.8;
                        c.targetZ = c.territoryZ + (tdz / tdist) * c.territoryRadius * 0.8;
                    } else {
                        c.targetX = wx;
                        c.targetZ = wz;
                    }
                    c.stateTimer = 3 + Math.random() * 4;
                }
            } else if (c.stateTimer <= 0 && c.state !== 'seek_berries' && c.state !== 'seek_grass' && c.state !== 'graze' && c.state !== 'seek_water' && c.state !== 'seek_shelter') {
                // Default wander within territory
                c.state = 'wander';
                const wx = c.x + (Math.random() - 0.5) * 6;
                const wz = c.z + (Math.random() - 0.5) * 6;
                const tdx = wx - c.territoryX, tdz = wz - c.territoryZ;
                const tdist = Math.sqrt(tdx*tdx + tdz*tdz);
                if (tdist > c.territoryRadius) {
                    c.targetX = c.territoryX + (tdx / tdist) * c.territoryRadius * 0.8;
                    c.targetZ = c.territoryZ + (tdz / tdist) * c.territoryRadius * 0.8;
                } else {
                    c.targetX = wx;
                    c.targetZ = wz;
                }
                c.stateTimer = 3 + Math.random() * 4;
            }

            // Pounce timer countdown
            if (c.pounced) {
                c.pounceTimer -= dt;
                p.energy = Math.max(0, p.energy - dt * 5);
                const struggling = this.keys['w'] || this.keys['a'] || this.keys['s'] || this.keys['d'] || this.keys[' '];
                if (struggling) {
                    p.energy = Math.max(0, p.energy - dt * 8);
                    c.pounceTimer -= dt * 2;
                }
                if (c.pounceTimer <= 0) {
                    c.pounced = false;
                    c.attackCooldown = 3;
                    this.notify('You broke free from the wolf!', 'info');
                }
            }

            // Move toward target (skip if pounced)
            if (c.pounced) {
                c.x = p.x;
                c.z = p.z;
                c.y = p.y;
            } else {
            const tdx = c.targetX - c.x;
            const tdz = c.targetZ - c.z;
            const tdist = Math.sqrt(tdx * tdx + tdz * tdz);
            if (tdist > 0.1) {
                let speedMult = 1;
                if (c.state === 'flee' || c.state === 'flee_predator') speedMult = 1.6;
                else if (c.state === 'chase' || c.state === 'hunt' || c.state === 'defend') speedMult = 1.3;
                else if (c.state === 'stalk') speedMult = 0.5; // slow stalking
                else if (c.state === 'alert') speedMult = 0; // frozen
                else if (c.state === 'follow_parent') speedMult = 0.8; // gentle follow
                const speed = c.speed * dt * speedMult;
                const nx = c.x + (tdx / tdist) * speed;
                const nz = c.z + (tdz / tdist) * speed;
                const tile = this.world.getTile(Math.floor(nx), Math.floor(nz));
                if (tile && BIOMES[tile.biome].walkable) {
                    c.x = nx;
                    c.z = nz;
                    c.y = this.world.getHeightAt(nx, nz);
                    c.rotation = Math.atan2(tdx, tdz);
                    // Walk phase frequency depends on speed state
                    const phaseSpeed = (c.state === 'flee' || c.state === 'flee_predator' || c.state === 'chase' || c.state === 'hunt' || c.state === 'defend') ? 14 : 7;
                    c.walkPhase += dt * phaseSpeed;
                    c.moving = true;
                } else {
                    c.moving = false;
                }
            } else {
                c.moving = false;
            }
            }

            // Attack player
            if (isAggro && distToPlayer < c.attackRange && c.attackCooldown <= 0 && !c.pounced) {
                if (c.type === 'wolf') {
                    c.pounced = true;
                    c.pounceTimer = 3;
                    p.health = Math.max(0, p.health - c.damage);
                    this.notify(`Wolf pounced on you! Struggle (WASD/Space) to break free!`, 'warning');
                } else {
                    c.attackCooldown = 1.5;
                    p.health = Math.max(0, p.health - c.damage);
                    this.notify(`${def.name} hit you for ${c.damage} damage!`, 'warning');
                }
                this.updateUI();
            }

            // Update mesh if loaded
            const mesh = this.creatureMeshes.get(c.id);
            if (mesh) {
                mesh.position.set(c.x * TILE_SIZE, c.y, c.z * TILE_SIZE);
                mesh.rotation.y = c.rotation;
                // Leg walk animation  amplitude and speed depend on state
                const legs = mesh.userData.legs;
                const isRunning = c.state === 'flee' || c.state === 'flee_predator' || c.state === 'chase' || c.state === 'hunt' || c.state === 'defend';
                const legAmp = isRunning ? 0.55 : 0.25;
                if (legs) {
                    for (let li = 0; li < legs.length; li++) {
                        legs[li].rotation.x = Math.sin(c.walkPhase + li * Math.PI / 2) * legAmp;
                    }
                }
                // Body bob  vertical oscillation while moving
                if (mesh.userData.bodyRef) {
                    const bobAmp = isRunning ? 0.08 : 0.04;
                    mesh.userData.bodyRef.position.y = Math.abs(Math.sin(c.walkPhase)) * bobAmp;
                    mesh.userData.bodyRef.rotation.z = 0;
                }
                // Head bob - slight up/down different from body, or lowered when grazing, or raised when alert
                if (mesh.userData.headRef) {
                    if (c.state === 'graze') {
                        mesh.userData.headRef.rotation.x = 1.4;
                    } else if (c.state === 'alert') {
                        // Head raised, looking around nervously
                        mesh.userData.headRef.rotation.x = -0.3 + Math.sin(this.time * 2) * 0.1;
                    } else if (c.state === 'sleep') {
                        mesh.userData.headRef.rotation.x = 0.8;
                    } else {
                        mesh.userData.headRef.rotation.x = Math.sin(c.walkPhase * 0.5) * 0.08;
                    }
                }
                // Tail wag
                if (mesh.userData.tailRef) {
                    mesh.userData.tailRef.rotation.z = Math.sin(c.walkPhase * 0.7) * 0.3;
                }
            }
        }
    }

    updateCreatureMeshes() {
        const p = this.player;
        const RENDER_DIST = 35;
        const loadedIds = new Set();
        for (const c of this.creatures) {
            const dx = c.x - p.x;
            const dz = c.z - p.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist > RENDER_DIST) continue;
            loadedIds.add(c.id);
            if (!this.creatureMeshes.has(c.id)) {
                const mesh = ModelFactory.createCreature(c.type);
                mesh.traverse(child => { if (child.isMesh) child.castShadow = true; });
                mesh.position.set(c.x * TILE_SIZE, c.y, c.z * TILE_SIZE);
                mesh.rotation.y = c.rotation;
                // Store legs for animation
                const legs = [];
                let bodyRef = null, headRef = null, tailRef = null;
                mesh.traverse(child => {
                    if (child.userData.isLeg) legs.push(child);
                    if (child.userData.isBody) bodyRef = child;
                    if (child.userData.isHead) headRef = child;
                    if (child.userData.isTail) tailRef = child;
                });
                mesh.userData.legs = legs;
                mesh.userData.bodyRef = bodyRef;
                mesh.userData.headRef = headRef;
                mesh.userData.tailRef = tailRef;
                // Add web for spiders on web
                if (c.onWeb) {
                    const web = new THREE.Mesh(
                        new THREE.SphereGeometry(0.8, 8, 6),
                        new THREE.MeshLambertMaterial({ color: 0xdddddd, transparent: true, opacity: 0.3 })
                    );
                    web.position.y = 0.1;
                    mesh.add(web);
                    mesh.userData.web = web;
                }
                this.scene.add(mesh);
                this.creatureMeshes.set(c.id, mesh);
            } else {
                // Update web visibility
                const mesh = this.creatureMeshes.get(c.id);
                if (mesh.userData.web) {
                    mesh.userData.web.visible = c.onWeb;
                }
            }
        }
        // Unload distant creatures
        for (const [id, mesh] of this.creatureMeshes) {
            if (!loadedIds.has(id)) {
                this.scene.remove(mesh);
                this.creatureMeshes.delete(id);
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
        this.notify(`Researched: ${tech.name}!`, 'success');
        this.updateUI();
        this.renderTech();
        this.renderBuild();
        this.renderCrafting();
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
            this.notify(`Quest complete: ${quest.title}! +${quest.reward} RP`, 'success');
            this.currentQuestIndex++;
            this.updateQuestUI();
            if (this.currentQuestIndex < QUESTS.length) {
                const next = QUESTS[this.currentQuestIndex];
                this.notify(`New quest: ${next.title}`, 'info');
            } else {
                this.notify('All quests complete! Keep building your empire!', 'success');
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
        text.innerHTML = `<div class="quest-title">${quest.title}</div><div class="quest-desc">${quest.desc}</div><div class="quest-progress">Quest ${this.currentQuestIndex + 1} / ${QUESTS.length} - Reward: ${quest.reward} RP</div>`;
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
        this.start();
    }

    // --- Notifications ---
    notify(msg, type = 'info') {
        const el = document.createElement('div');
        el.className = `notification ${type}`;
        el.textContent = msg;
        document.getElementById('notifications').appendChild(el);
        setTimeout(() => el.remove(), 3500);
    }

    // --- Audio: wolf howl synthesized via Web Audio API ---
    ensureAudioCtx() {
        if (!this.audioCtx) {
            try {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) { return null; }
        }
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        return this.audioCtx;
    }

    playWolfHowl(distToPlayer) {
        const ctx = this.ensureAudioCtx();
        if (!ctx) return;
        // Volume falls off with distance (40 tiles max hearing range)
        const volume = Math.max(0.05, 1 - distToPlayer / 45);
        const now = ctx.currentTime;

        // Howl: rising pitch then sustained then falling — like a real wolf howl
        // Base frequency around 300-400 Hz with harmonics
        const baseFreq = 280 + Math.random() * 60;
        const duration = 2.5 + Math.random() * 1.5; // 2.5-4 seconds

        // Main oscillator (the howl)
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        // Pitch envelope: rise -> sustain -> fall
        osc.frequency.setValueAtTime(baseFreq * 0.6, now);
        osc.frequency.linearRampToValueAtTime(baseFreq, now + 0.4);
        osc.frequency.setValueAtTime(baseFreq, now + 0.4);
        osc.frequency.linearRampToValueAtTime(baseFreq * 1.05, now + duration * 0.4);
        osc.frequency.linearRampToValueAtTime(baseFreq * 0.9, now + duration * 0.7);
        osc.frequency.linearRampToValueAtTime(baseFreq * 0.5, now + duration);

        // Second oscillator for harmonic richness (a fifth above)
        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(baseFreq * 0.9, now);
        osc2.frequency.linearRampToValueAtTime(baseFreq * 1.5, now + 0.4);
        osc2.frequency.linearRampToValueAtTime(baseFreq * 1.5 * 1.05, now + duration * 0.4);
        osc2.frequency.linearRampToValueAtTime(baseFreq * 1.5 * 0.5, now + duration);

        // Amplitude envelope: fade in, sustain, fade out
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume * 0.4, now + 0.3);
        gain.gain.setValueAtTime(volume * 0.4, now + duration * 0.5);
        gain.gain.linearRampToValueAtTime(0, now + duration);

        // Harmonic gain (lower volume)
        const gain2 = ctx.createGain();
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(volume * 0.12, now + 0.3);
        gain2.gain.setValueAtTime(volume * 0.12, now + duration * 0.5);
        gain2.gain.linearRampToValueAtTime(0, now + duration);

        // Lowpass filter for muffled distant sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        // Closer wolves = brighter sound, distant = more muffled
        filter.frequency.setValueAtTime(800 + volume * 1500, now);
        filter.Q.value = 1;

        // Connect: osc -> gain -> filter -> destination
        osc.connect(gain);
        gain.connect(filter);
        osc2.connect(gain2);
        gain2.connect(filter);
        filter.connect(ctx.destination);

        // Add slight vibrato for realism
        const vibrato = ctx.createOscillator();
        vibrato.frequency.value = 5; // 5 Hz vibrato
        const vibratoGain = ctx.createGain();
        vibratoGain.gain.value = 8; // 8 Hz pitch wobble
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        vibratoGain.connect(osc2.frequency);

        osc.start(now);
        osc2.start(now);
        vibrato.start(now);
        osc.stop(now + duration);
        osc2.stop(now + duration);
        vibrato.stop(now + duration);
    }

    // --- Pause ---
    togglePause() {
        this.paused = !this.paused;
        const pauseScreen = document.getElementById('pause-screen');
        if (this.paused) {
            pauseScreen.classList.remove('hidden');
            if (this.pointerLocked) document.exitPointerLock();
            this.keys = {};
        } else {
            pauseScreen.classList.add('hidden');
            this.lastTime = performance.now();
            if (!this.mobileMode) this.requestPointerLock();
        }
    }

    // --- Mobile mode ---
    static detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || (navigator.maxTouchPoints > 0 && window.innerWidth <= 900);
    }

    toggleMobileMode() {
        this.mobileMode = !this.mobileMode;
        const btn = document.getElementById('mobile-toggle');
        const controls = document.getElementById('mobile-controls');
        const mobInfo = document.getElementById('mobile-controls-info');
        if (this.mobileMode) {
            btn.textContent = 'Mobile Mode: On';
            btn.classList.add('active');
            controls.classList.remove('hidden');
            controls.classList.add('active');
            if (mobInfo) mobInfo.style.display = '';
        } else {
            btn.textContent = 'Mobile Mode: Off';
            btn.classList.remove('active');
            controls.classList.remove('active');
            controls.classList.add('hidden');
            if (mobInfo) mobInfo.style.display = 'none';
        }
    }

    setupMobileControls() {
        const joystickZone = document.getElementById('joystick-zone');
        const knob = document.getElementById('joystick-knob');
        const lookZone = document.getElementById('mobile-look-zone');

        // Joystick for movement
        joystickZone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const t = e.changedTouches[0];
            this.joystick.active = true;
            this.joystick.touchId = t.identifier;
            this.joystick.startX = t.clientX;
            this.joystick.startY = t.clientY;
        }, { passive: false });

        joystickZone.addEventListener('touchmove', (e) => {
            e.preventDefault();
            for (const t of e.changedTouches) {
                if (t.identifier !== this.joystick.touchId) continue;
                const dx = t.clientX - this.joystick.startX;
                const dy = t.clientY - this.joystick.startY;
                const maxDist = 50;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const clampedDist = Math.min(dist, maxDist);
                const angle = Math.atan2(dy, dx);
                const kx = Math.cos(angle) * clampedDist;
                const ky = Math.sin(angle) * clampedDist;
                knob.style.left = (35 + kx) + 'px';
                knob.style.top = (35 + ky) + 'px';
                this.joystick.dx = kx / maxDist;
                this.joystick.dz = ky / maxDist;
            }
        }, { passive: false });

        joystickZone.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.joystick.active = false;
            this.joystick.dx = 0;
            this.joystick.dz = 0;
            this.joystick.touchId = null;
            knob.style.left = '35px';
            knob.style.top = '35px';
        }, { passive: false });

        // Look zone for camera rotation + tap to interact/attack
        let lookStartX = 0, lookStartY = 0, lookMoved = false;
        lookZone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const t = e.changedTouches[0];
            this.lookTouch.active = true;
            this.lookTouch.touchId = t.identifier;
            this.lookTouch.lastX = t.clientX;
            this.lookTouch.lastY = t.clientY;
            lookStartX = t.clientX;
            lookStartY = t.clientY;
            lookMoved = false;
        }, { passive: false });

        lookZone.addEventListener('touchmove', (e) => {
            e.preventDefault();
            for (const t of e.changedTouches) {
                if (t.identifier !== this.lookTouch.touchId) continue;
                const dx = t.clientX - this.lookTouch.lastX;
                const dy = t.clientY - this.lookTouch.lastY;
                this.cameraRotation.yaw -= dx * 0.005;
                this.cameraRotation.pitch -= dy * 0.005;
                this.cameraRotation.pitch = Math.max(-1.4, Math.min(1.4, this.cameraRotation.pitch));
                this.lookTouch.lastX = t.clientX;
                this.lookTouch.lastY = t.clientY;
                if (Math.abs(t.clientX - lookStartX) > 10 || Math.abs(t.clientY - lookStartY) > 10) lookMoved = true;
            }
        }, { passive: false });

        lookZone.addEventListener('touchend', (e) => {
            e.preventDefault();
            // Tap (no significant move) = interact/attack
            if (!lookMoved && this.gameRunning) {
                if (this.buildMode) {
                    this.placeBuilding();
                } else if (this.attackCreature()) {
                    // hit a creature
                } else {
                    this.interact();
                }
            }
            this.lookTouch.active = false;
            this.lookTouch.touchId = null;
        }, { passive: false });

        // Action buttons  hold buttons set key state, tap buttons trigger actions
        const setupHoldBtn = (id, key) => {
            const btn = document.getElementById(id);
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                btn.classList.add('active');
                this.keys[key] = true;
            }, { passive: false });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                btn.classList.remove('active');
                this.keys[key] = false;
            }, { passive: false });
        };

        const setupTapBtn = (id, fn) => {
            const btn = document.getElementById(id);
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                btn.classList.add('active');
            }, { passive: false });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                btn.classList.remove('active');
                if (this.gameRunning) fn.call(this);
            }, { passive: false });
        };

        setupTapBtn('mob-jump', () => {
            if (this.player.yOffset === 0 && this.player.jumpVel === 0)
                this.player.jumpVel = 12;
        });
        setupHoldBtn('mob-climb', 'v');
        setupHoldBtn('mob-sprint', 'shift');
        setupTapBtn('mob-attack', () => {
            if (this.buildMode) this.placeBuilding();
            else this.attackCreature();
        });
        setupTapBtn('mob-interact', () => {
            if (this.buildMode) this.placeBuilding();
            else this.interact();
        });
        setupTapBtn('mob-eat', () => this.eatSelectedItem());
        setupTapBtn('mob-feed', () => this.feedCreature());
        setupTapBtn('mob-inv', () => this.togglePanel('panel-inventory'));
        setupTapBtn('mob-pause', () => this.togglePause());
        setupTapBtn('mob-cancel', () => {
            if (this.buildMode) { this.buildMode = null; this.notify('Build cancelled', 'info'); }
            else this.closePanels();
        });

        // Inventory slot tap selection
        const invBar = document.getElementById('inventory-bar');
        invBar.addEventListener('click', (e) => {
            const slot = e.target.closest('.inv-slot');
            if (!slot) return;
            const slots = [...invBar.querySelectorAll('.inv-slot')];
            const idx = slots.indexOf(slot);
            if (idx >= 0) {
                this.player.selectedSlot = idx;
                this.updateInventoryUI();
            }
        });

        // Auto-detect mobile on load
        if (Game.detectMobile()) {
            this.mobileMode = true;
            const btn = document.getElementById('mobile-toggle');
            const controls = document.getElementById('mobile-controls');
            btn.textContent = 'Mobile Mode: On';
            btn.classList.add('active');
            controls.classList.remove('hidden');
            controls.classList.add('active');
            const mobInfo = document.getElementById('mobile-controls-info');
            if (mobInfo) mobInfo.style.display = '';
        }
    }

    // --- Main loop ---
    loop(time) {
        if (!this.gameRunning) return;
        const dt = Math.min((time - this.lastTime) / 1000, 0.1);
        this.lastTime = time;
        if (!this.paused) {
            try {
                this.update(dt);
            } catch (err) {
                console.error('Game loop error:', err);
            }
        }
        this.render();
        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        const p = this.player;
        this.time += dt;

        // Check if player is pounced by a wolf
        const isPounced = this.creatures.some(c => c.pounced);

        // Movement (WASD relative to camera yaw)
        const yaw = this.cameraRotation.yaw;
        // Forward vector (where camera looks on XZ plane)
        const fwdX = -Math.sin(yaw);
        const fwdZ = -Math.cos(yaw);
        // Right vector (perpendicular to forward)
        const rightX = Math.cos(yaw);
        const rightZ = -Math.sin(yaw);

        let dx = 0, dz = 0;
        if (isPounced) {
            // Player is pinned - can't move normally, struggling handled in updateCreatures
        } else {
        if (!this.inHut) {
        if (this.keys['w'] || this.keys['arrowup']) { dx += fwdX; dz += fwdZ; }
        if (this.keys['s'] || this.keys['arrowdown']) { dx -= fwdX; dz -= fwdZ; }
        if (this.keys['a'] || this.keys['arrowleft']) { dx -= rightX; dz -= rightZ; }
        if (this.keys['d'] || this.keys['arrowright']) { dx += rightX; dz += rightZ; }

        // Mobile joystick input
        if (this.mobileMode && this.joystick.active) {
            dx += fwdX * (-this.joystick.dz) + rightX * this.joystick.dx;
            dz += fwdZ * (-this.joystick.dz) + rightZ * this.joystick.dx;
        }
        }
        } // end else (not pounced)

        // Sprinting
        const isSprinting = !isPounced && (this.keys['shift'] || this.keys['shiftleft']) && (dx !== 0 || dz !== 0) && p.energy > 0;
        // Swimming
        const ptx = Math.floor(p.x), pty = Math.floor(p.z);
        const currentTile = this.world.getTile(ptx, pty);
        const isSwimming = currentTile && currentTile.biome === 'water';

        const CLIMBABLE_BIOMES = ['mountain', 'snow'];
        const isHoldingClimb = this.keys['v'];
        const curBiomeClimbable = currentTile && CLIMBABLE_BIOMES.includes(currentTile.biome);
        let isClimbing = false;
        if (isHoldingClimb && curBiomeClimbable) {
            isClimbing = true;
        }

        if (dx !== 0 || dz !== 0) {
            const len = Math.sqrt(dx*dx + dz*dz);
            dx /= len; dz /= len;
            let speed = PLAYER_SPEED * dt;
            if (isSprinting && !isSwimming) speed *= 1.8;
            if (isSwimming) speed *= 0.5; // slower in water
            if (isClimbing) speed *= 0.5; // climbing is slower than walking
            const newX = p.x + dx * speed;
            const newZ = p.z + dz * speed;
            // Collision + max step height (can't climb steep walls unless climbing)
            const curH = this.world.getHeightAt(p.x, p.z);
            const MAX_STEP = 2.5;
            const MAX_CLIMB = 100;
            const canStep = (nx, nz) => {
                if (!this.world.isWalkable(nx, nz)) return false;
                const targetTile = this.world.getTile(nx, nz);
                const h = this.world.getHeightAt(nx, nz);
                const diff = h - (curH + p.yOffset);
                if (diff <= MAX_STEP) return true;
                if (isClimbing && targetTile && CLIMBABLE_BIOMES.includes(targetTile.biome) && diff <= MAX_CLIMB) return true;
                return false;
            };
            if (canStep(newX, p.z)) p.x = newX;
            if (canStep(p.x, newZ)) p.z = newZ;
            // Update facing
            p.rotation = Math.atan2(dx, dz);
            if (p.harvesting) p.harvesting = null;
            p.isClimbing = isClimbing;
        } else {
            p.isClimbing = isClimbing;
        }

        // Movement energy costs
        if (isSwimming && (dx !== 0 || dz !== 0)) {
            p.energy = Math.max(0, p.energy - dt * 3); // swimming costs 3/s
        } else if (isSprinting) {
            p.energy = Math.max(0, p.energy - dt * 2); // running costs 2/s
        } else if (dx !== 0 || dz !== 0) {
            p.energy = Math.max(0, p.energy - dt * 0.5); // walking costs 0.5/s
        } else if (!isSwimming && !p.isClimbing) {
            p.energy = Math.max(0, p.energy - dt * 0.3); // idle drains 0.3/s
        }
        // Swimming drains energy even when idle
        if (isSwimming) {
            p.energy = Math.max(0, p.energy - dt * 0.5);
            if (p.energy <= 0) p.health = Math.max(0, p.health - dt * 3); // drowning damage
        }
        // Climbing costs energy
        if (p.isClimbing) {
            p.energy = Math.max(0, p.energy - dt * 2.5);
        }

        p.x = Math.max(0.5, Math.min(WORLD_W - 0.5, p.x));
        p.z = Math.max(0.5, Math.min(WORLD_H - 0.5, p.z));

        // Update player Y to terrain height + jump offset
        const groundY = this.world.getHeightAt(p.x, p.z);
        // Jump physics
        if (p.jumpVel !== 0 || p.yOffset > 0 || p.yOffset < 0) {
            p.yOffset += p.jumpVel * dt;
            p.jumpVel -= 30 * dt; // gravity
            // Track highest point for fall damage
            const currentY = groundY + p.yOffset;
            if (currentY > p.fallStartY) p.fallStartY = currentY;
            if (p.yOffset <= 0 && p.jumpVel < 0) {
                // Landing
                p.yOffset = 0;
                p.jumpVel = 0;
                // Fall damage
                const fallDist = p.fallStartY - groundY;
                if (fallDist > 8) {
                    const dmg = Math.floor((fallDist - 8) * 3);
                    p.health = Math.max(0, p.health - dmg);
                    this.notify(`Fall damage! -${dmg} HP`, 'warning');
                    if (p.health <= 0) { this.respawn(); return; }
                }
                p.fallStartY = groundY;
                // Just landed - check for stepping on small creatures
                for (let i = this.creatures.length - 1; i >= 0; i--) {
                    const c = this.creatures[i];
                    const def = CREATURE_TYPES[c.type];
                    if (def.health > 15) continue; // only small creatures can be stepped on
                    const cdx = c.x - p.x;
                    const cdz = c.z - p.z;
                    const cdist = Math.sqrt(cdx * cdx + cdz * cdz);
                    if (cdist < 1.0) {
                        // Stepped on it!
                        for (const [item, amt] of Object.entries(c.drops)) {
                            p.addItem(item, amt);
                            this.notify(`+${amt} ${ITEMS[item]?.name || item}`, 'success');
                        }
                        this.researchPoints += c.xp;
                        this.notify(`Stepped on ${def.name}! +${c.xp} RP`, 'success');
                        this.creatures.splice(i, 1);
                        const mesh = this.creatureMeshes.get(c.id);
                        if (mesh) { this.scene.remove(mesh); this.creatureMeshes.delete(c.id); }
                        this.updateInventoryUI();
                        this.updateUI();
                    }
                }
            }
        }
        // Snap player Y to terrain height + jump offset (climbing smooths instead)
        const targetY = groundY + p.yOffset;
        if (p.isClimbing) {
            // Climb at a controlled vertical rate instead of snapping to full height
            const CLIMB_RISE_SPEED = 3.5; // units/sec
            const delta = targetY - p.y;
            const step = Math.sign(delta) * Math.min(Math.abs(delta), CLIMB_RISE_SPEED * dt);
            p.y += step;
        } else {
            p.y = targetY; // always attached to the ground (or jump arc)
        }

        // Update player mesh (hidden in FPV but kept for shadows)
        this.playerMesh.position.set(p.x * TILE_SIZE, p.y, p.z * TILE_SIZE);
        this.playerMesh.rotation.y = p.rotation;
        this.playerMesh.visible = false;

        // Camera: first-person view
        const camYaw = this.cameraRotation.yaw;
        const camPitch = this.cameraRotation.pitch;
        const eyeHeight = PLAYER_HEIGHT;

        // Check if pounced by a wolf  camera drops to ground, looks up at wolf
        const pouncingWolf = this.creatures.find(c => c.pounced && c.type === 'wolf');
        if (this.inHut) {
            this.camera.position.copy(this.hutCameraPos);
            const lookX = this.hutCameraPos.x - Math.sin(camYaw) * Math.cos(camPitch);
            const lookY = this.hutCameraPos.y + Math.sin(camPitch);
            const lookZ = this.hutCameraPos.z - Math.cos(camYaw) * Math.cos(camPitch);
            this.camera.lookAt(lookX, lookY, lookZ);
        } else if (pouncingWolf) {
            // Camera drops to near-ground level (head jerked back)
            const groundCamY = p.y + 0.3;
            const wolfWorldX = pouncingWolf.x * TILE_SIZE;
            const wolfWorldZ = pouncingWolf.z * TILE_SIZE;
            const wolfWorldY = pouncingWolf.y + 1.0; // wolf face height
            // Smoothly lower camera
            this.camera.position.set(
                p.x * TILE_SIZE,
                this.camera.position.y + (groundCamY - this.camera.position.y) * Math.min(1, dt * 8),
                p.z * TILE_SIZE
            );
            // Force look at the wolf's face
            this.camera.lookAt(wolfWorldX, wolfWorldY, wolfWorldZ);
        } else {
            this.camera.position.set(p.x * TILE_SIZE, p.y + eyeHeight, p.z * TILE_SIZE);
            // Look direction from yaw + pitch
            const lookX = p.x * TILE_SIZE - Math.sin(camYaw) * Math.cos(camPitch);
            const lookY = p.y + eyeHeight + Math.sin(camPitch);
            const lookZ = p.z * TILE_SIZE - Math.cos(camYaw) * Math.cos(camPitch);
            this.camera.lookAt(lookX, lookY, lookZ);
        }

        // Sun target follows player (position is set in updateDayNightLighting)
        if (this.sun) {
            this.sun.target.position.set(p.x * TILE_SIZE, p.y, p.z * TILE_SIZE);
            this.sun.target.updateMatrixWorld();
        }

        // Harvesting / Fishing
        if (p.harvesting) {
            p.harvesting.progress += dt;
            if (p.harvesting.progress >= p.harvesting.total) {
                if (p.harvesting.fishing) this.completeFishing();
                else this.completeHarvest();
            }
            this.updateHarvestUI();
        } else {
            document.getElementById('harvest-progress').classList.add('hidden');
        }

        // Interaction prompt (throttled)
        this._promptTimer = (this._promptTimer || 0) + dt;
        if (this._promptTimer >= 0.1) {
            this._promptTimer = 0;
            this.updateInteractionPrompt();
        }

        // Dynamic mesh loading/unloading near player
        this.meshUpdateAccumulator += dt;
        if (this.meshUpdateAccumulator >= 0.3) {
            this.meshUpdateAccumulator = 0;
            this.updateResourceMeshes();
            this.updateBuildingMeshes();
            this.buildBearCaves();
        }

        // Building tick
        this.tickAccumulator += dt;
        if (this.tickAccumulator >= 0.5) {
            this.tickAccumulator = 0;
            this.buildingTick(0.5);
            this.world.processRespawns(0.5);
            this.checkQuests();
            this.updateUI();

            // Ambient wilderness notifications
            if (!this.ambientTimer) this.ambientTimer = 0;
            this.ambientTimer += 0.5;
            if (this.ambientTimer > 25 + Math.random() * 30) {
                this.ambientTimer = 0;
                const pBiome3 = pTile ? pTile.biome : 'grass';
                const ambients = {
                    grass: ['You hear birds chirping', 'A butterfly flutters by', 'A gentle breeze rustles the grass', 'Crickets chirp in the distance'],
                    forest: ['An owl hoots in the trees', 'Leaves rustle in the wind', 'A squirrel chatters nearby', 'The forest is alive with sounds'],
                    mountain: ['An eagle soars overhead', 'Wind howls through the peaks', 'Rocks clatter somewhere above'],
                    snow: ['The wind bites at your skin', 'Deer tracks lead through the snow', 'A bitter wind sweeps across the tundra'],
                    desert: ['Sand shifts in the wind', 'A scorpion scurries under a rock', 'The sun beats down relentlessly'],
                    sand: ['Waves lap at the shore', 'You spot seashells on the beach', 'A crab scuttles sideways'],
                    water: ['Water laps gently at your feet'],
                };
                const msgs = ambients[pBiome3] || ambients.grass;
                if (this.weather === 'rain') msgs.push('Rain patters on the ground');
                if (this.weather === 'snow') msgs.push('Snowflakes drift silently down');
                if (this.isNight) msgs.push('The night is quiet and still', 'Stars twinkle overhead');
                this.notify(msgs[Math.floor(Math.random() * msgs.length)], 'info');
            }
        }

        // Creature spawning
        this.creatureSpawnAccumulator += dt;
        if (this.creatureSpawnAccumulator >= 2.0 && this.creatures.length < this.maxCreatures) {
            this.creatureSpawnAccumulator = 0;
            this.spawnCreature();
        }

        // Creature updates
        this.updateCreatures(dt);

        // Creature mesh loading/unloading
        this.creatureMeshAccumulator += dt;
        if (this.creatureMeshAccumulator >= 0.3) {
            this.creatureMeshAccumulator = 0;
            this.updateCreatureMeshes();
        }

        // --- Survival mechanics ---
        // Hunger decays slowly
        p.hunger = Math.max(0, p.hunger - dt * 0.4);
        // Thirst decays faster, especially in hot biomes
        const pTile = this.world.getTile(Math.floor(p.x), Math.floor(p.z));
        const pBiome = pTile ? pTile.biome : 'grass';
        let thirstRate = 0.5;
        if (pBiome === 'desert') thirstRate = 1.5;
        else if (pBiome === 'snow' || pBiome === 'sand') thirstRate = 0.8;
        p.thirst = Math.max(0, p.thirst - dt * thirstRate);
        // Temperature moves toward biome target
        const biomeTemp = { desert: 40, sand: 30, snow: -10, mountain: 5, water: 10, grass: 20, forest: 18 };
        const targetTemp = (biomeTemp[pBiome] || 20) + (this.isNight ? -8 : 0);
        p.temperature += (targetTemp - p.temperature) * dt * 0.1;
        // Health effects from survival stats
        if (p.hunger <= 0) p.health = Math.max(0, p.health - dt * 1.5);
        if (p.thirst <= 0) p.health = Math.max(0, p.health - dt * 2);
        if (p.temperature < 0) p.health = Math.max(0, p.health - dt * Math.abs(p.temperature) * 0.1);
        if (p.temperature > 35) p.health = Math.max(0, p.health - dt * (p.temperature - 35) * 0.15);
        if (p.energy <= 0) p.health = Math.max(0, p.health - dt * 2);
        // Campfire regen + warmth
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const t = this.world.getTile(ptx + dx, pty + dy);
                if (t && t.building === 'campfire') {
                    p.energy = Math.min(p.maxEnergy, p.energy + dt * 5);
                    p.health = Math.min(p.maxHealth, p.health + dt * 2);
                    p.temperature += dt * 3;
                }
            }
        }

        // Day/night cycle: dayTime is 0..1 where 0..0.5 is day (300s) and 0.5..1 is night (180s)
        // Convert elapsed time to dayTime: day portion maps to 0..0.5, night portion maps to 0.5..1
        const dayFraction = this.dayDuration / this.totalCycle; // 0.625
        const elapsedInCycle = (this.time % this.totalCycle);
        if (elapsedInCycle < this.dayDuration) {
            this.dayTime = (elapsedInCycle / this.dayDuration) * dayFraction; // 0..0.5
        } else {
            this.dayTime = dayFraction + ((elapsedInCycle - this.dayDuration) / this.nightDuration) * (1 - dayFraction); // 0.5..1
        }
        const wasNight = this.isNight;
        this.isNight = this.dayTime >= 0.5;
        if (this.isNight && !wasNight) {
            this.notify('Night falls! Find a Wood Hut to sleep.', 'warning');
        } else if (!this.isNight && wasNight) {
            this.notify('Dawn breaks. Stay safe!', 'info');
        }

        // --- Season progression ---
        this.seasonTimer += dt;
        if (this.seasonTimer >= this.seasonDuration) {
            this.seasonTimer = 0;
            const seasons = ['summer', 'autumn', 'winter', 'spring'];
            const idx = seasons.indexOf(this.season);
            this.season = seasons[(idx + 1) % seasons.length];
            const seasonNames = { summer: 'Summer', autumn: 'Autumn', winter: 'Winter', spring: 'Spring' };
            this.notify(`Season changed to ${seasonNames[this.season]}!`, 'info');
        }

        this.updateDayNightLighting();

        // --- Weather system ---
        this.weatherTimer -= dt;
        if (this.weatherTimer <= 0) {
            const oldWeather = this.weather;
            const pBiome2 = pTile ? pTile.biome : 'grass';
            const r = Math.random();
            if (pBiome2 === 'desert' || pBiome2 === 'sand') {
                this.weather = r < 0.6 ? 'clear' : r < 0.85 ? 'fog' : 'rain';
            } else if (pBiome2 === 'snow' || pBiome2 === 'mountain') {
                this.weather = r < 0.4 ? 'clear' : r < 0.8 ? 'snow' : 'fog';
            } else {
                this.weather = r < 0.5 ? 'clear' : r < 0.8 ? 'rain' : r < 0.92 ? 'fog' : 'clear';
            }
            this.weatherTimer = 40 + Math.random() * 80;
            if (this.weather !== oldWeather) {
                const names = { clear: 'Skies clear up', rain: 'It starts raining', snow: 'Snow begins to fall', fog: 'Fog rolls in' };
                this.notify(names[this.weather] || 'Weather changes', 'info');
                this.updateWeatherParticles();
            }
        }
        // Weather effects on player
        if (this.weather === 'rain') {
            p.thirst = Math.min(p.maxThirst, p.thirst + dt * 2); // rain hydrates
            p.temperature -= dt * 0.5; // rain cools you
            p.energy = Math.max(0, p.energy - dt * 0.2); // rain is tiring
        } else if (this.weather === 'snow') {
            p.temperature -= dt * 1.5; // snow is very cold
            p.energy = Math.max(0, p.energy - dt * 0.3);
        } else if (this.weather === 'fog') {
            // Fog reduces visibility (handled in lighting)
        }
        // Update weather particles
        if (this.weatherParticles) {
            const positions = this.weatherParticles.geometry.attributes.position;
            const camX = this.camera.position.x, camZ = this.camera.position.z;
            for (let i = 0; i < positions.count; i++) {
                let y = positions.getY(i);
                let x = positions.getX(i);
                let z = positions.getZ(i);
                if (this.weather === 'rain') {
                    y -= dt * 30;
                    if (y < this.camera.position.y - 15) {
                        y = this.camera.position.y + 15;
                        x = camX + (Math.random() - 0.5) * 40;
                        z = camZ + (Math.random() - 0.5) * 40;
                    }
                } else if (this.weather === 'snow') {
                    y -= dt * 3;
                    x += Math.sin(this.time * 2 + i) * dt * 0.5;
                    if (y < this.camera.position.y - 10) {
                        y = this.camera.position.y + 10;
                        x = camX + (Math.random() - 0.5) * 30;
                        z = camZ + (Math.random() - 0.5) * 30;
                    }
                }
                positions.setXYZ(i, x, y, z);
            }
            positions.needsUpdate = true;
        }

        // Sleeping in wood hut - fade to black then skip night
        if (this.sleeping) {
            this.sleepTimer -= dt;
            if (this.sleepTimer <= 0) {
                this.finishSleep();
            }
            this.updateUI();
        }

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
        const wy = this.world.getTileCenterHeight(tx, ty);
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
            const yieldKey = resDef.yields ? Object.keys(resDef.yields)[0] : null;
            const isMystery = yieldKey && ITEMS[yieldKey]?.edible && !this.discoveredFoods.has(yieldKey);
            const displayName = isMystery ? 'Mysterious Food' : resDef.name;
            el.innerHTML = `<kbd>I / Click</kbd> Harvest ${sprite(resDef.icon)} ${displayName}`;
            el.classList.remove('hidden');
        } else if (tile.building && !this.buildMode) {
            const def = BUILDINGS[tile.building];
            el.innerHTML = `<kbd>I / Click</kbd> ${sprite(def.icon)} ${def.name}`;
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    }

    updateHarvestUI() {
        const h = this.player.harvesting;
        if (!h) return;
        const el = document.getElementById('harvest-progress');
        const fill = document.getElementById('harvest-progress-fill');
        const label = document.getElementById('harvest-label');
        fill.style.width = `${(h.progress / h.total) * 100}%`;
        if (h.fishing) {
            label.textContent = `Fishing...`;
            el.classList.remove('hidden');
            return;
        }
        const resDef = RESOURCE_TYPES[h.resource];
        const pct = (h.progress / h.total) * 100;
        fill.style.width = pct + '%';
        const yieldKey = resDef.yields ? Object.keys(resDef.yields)[0] : null;
        const isMystery = yieldKey && ITEMS[yieldKey]?.edible && !this.discoveredFoods.has(yieldKey);
        const displayName = isMystery ? 'Mysterious Food' : resDef.name;
        label.textContent = `Harvesting ${displayName}...`;
        el.classList.remove('hidden');
    }

    // --- Render ---
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    // --- UI Updates ---
    _tmpCol1 = new THREE.Color();
    _tmpCol2 = new THREE.Color();
    _tmpCol3 = new THREE.Color();
    updateDayNightLighting() {
        const t = this.dayTime;
        // Map dayTime 0..1 to sun angle: 0=dawn(rising), 0.25=noon, 0.5=dusk(setting), 0.5..1=night
        const sunAngle = t * Math.PI * 2 - Math.PI / 2;
        const sunHeight = Math.sin(sunAngle);
        // Boost brightness: dawn/dusk should have decent light, not pitch black
        // Morning boost: when sun is rising (sunHeight > 0 but small), increase brightness faster
        let brightness = Math.max(0, Math.min(1, (sunHeight + 0.5) / 1.2));
        // Morning boost - make mornings brighter by raising brightness when sun is low but rising
        if (sunHeight > 0 && sunHeight < 0.3) {
            brightness = Math.min(1, brightness + (0.3 - sunHeight) * 0.5);
        }

        // Season brightness modifier: summer=1.0, autumn=0.8, winter=0.6, spring=0.85
        const seasonMult = this.seasonBrightness ? (this.seasonBrightness[this.season] || 1.0) : 1.0;
        brightness *= seasonMult;

        // Dawn/dusk orange tint factor
        const dawnDusk = Math.max(0, 1 - Math.abs(sunHeight) * 3);

        if (this.sun) {
            this.sun.intensity = (0.08 + brightness * 0.75) * seasonMult;
            // Warm orange at dawn/dusk, white at noon, cool blue at night
            const c1 = this._tmpCol1.setHex(0x3a4a7a);
            const c2 = this._tmpCol2.setHex(0xfff5e0);
            const c3 = this._tmpCol3.setHex(0xff8c42);
            c1.lerp(c2, brightness);
            c1.lerp(c3, dawnDusk * 0.5);
            this.sun.color.copy(c1);
            // Move sun position across sky
            const p = this.player;
            if (p) {
                this.sun.position.set(
                    p.x * TILE_SIZE + Math.cos(sunAngle) * 100,
                    Math.max(5, sunHeight * 100),
                    p.z * TILE_SIZE + Math.sin(sunAngle) * 60
                );
            }
        }
        if (this.ambientLight) {
            this.ambientLight.intensity = (0.12 + brightness * 0.38) * seasonMult;
        }
        if (this.hemiLight) {
            this.hemiLight.intensity = (0.08 + brightness * 0.22) * seasonMult;
            const c1 = this._tmpCol1.setHex(0x87ceeb);
            const c2 = this._tmpCol2.setHex(0xff6a3a);
            c1.lerp(c2, dawnDusk * 0.4);
            this.hemiLight.color.copy(c1);
        }
        if (this.scene.background) {
            const c1 = this._tmpCol1.setHex(0x080820);
            const c2 = this._tmpCol2.setHex(0x87ceeb);
            const c3 = this._tmpCol3.setHex(0xe85a2a);
            c1.lerp(c2, brightness);
            c1.lerp(c3, dawnDusk * 0.45);
            this.scene.background.copy(c1);
        }
        if (this.scene.fog) {
            const c1 = this._tmpCol1.setHex(0x080820);
            const c2 = this._tmpCol2.setHex(0x87ceeb);
            const c3 = this._tmpCol3.setHex(0xc04a20);
            c1.lerp(c2, brightness);
            c1.lerp(c3, dawnDusk * 0.4);
            this.scene.fog.color.copy(c1);
            if (this.scene.fog.density !== undefined) {
                let density = 0.006 + (1 - brightness) * 0.006;
                if (this.weather === 'fog') density *= 3;
                else if (this.weather === 'rain') density *= 1.5;
                else if (this.weather === 'snow') density *= 1.3;
                this.scene.fog.density = density;
            }
        }
    }

    updateWeatherParticles() {
        // Remove old particles
        if (this.weatherParticles) {
            this.scene.remove(this.weatherParticles);
            this.weatherParticles.geometry.dispose();
            this.weatherParticles.material.dispose();
            this.weatherParticles = null;
        }
        if (this.weather !== 'rain' && this.weather !== 'snow') return;

        const count = this.weather === 'rain' ? 800 : 500;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const camX = this.camera.position.x, camZ = this.camera.position.z;
        const camY = this.camera.position.y;
        for (let i = 0; i < count; i++) {
            positions[i * 3] = camX + (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = camY + (Math.random() - 0.5) * 25;
            positions[i * 3 + 2] = camZ + (Math.random() - 0.5) * 40;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            color: this.weather === 'rain' ? 0x8899bb : 0xffffff,
            size: this.weather === 'rain' ? 0.15 : 0.25,
            transparent: true,
            opacity: this.weather === 'rain' ? 0.6 : 0.8,
            depthWrite: false
        });
        this.weatherParticles = new THREE.Points(geo, mat);
        this.scene.add(this.weatherParticles);
    }

    updateUI() {
        document.getElementById('health-bar').style.width = (this.player.health / this.player.maxHealth * 100) + '%';
        document.getElementById('energy-bar').style.width = (this.player.energy / this.player.maxEnergy * 100) + '%';
        document.getElementById('research-points').textContent = Math.floor(this.researchPoints);
        document.getElementById('power-display').textContent = `${Math.floor(this.powerProduced)} / ${Math.floor(this.powerConsumed)}`;
        const timeEl = document.getElementById('time-display');
        if (timeEl) {
            const phase = this.dayTime < 0.15 ? 'Dawn' :
                          this.dayTime < 0.35 ? 'Day' :
                          this.dayTime < 0.5 ? 'Dusk' :
                          this.dayTime < 0.85 ? 'Night' : 'Late Night';
            const seasonIcons = { summer: '☀️', autumn: '🍂', winter: '❄️', spring: '🌸' };
            const seasonNames = { summer: 'Summer', autumn: 'Autumn', winter: 'Winter', spring: 'Spring' };
            timeEl.textContent = `${phase} ${seasonIcons[this.season] || ''} ${seasonNames[this.season] || ''}`;
        }
        const hungerBar = document.getElementById('hunger-bar');
        if (hungerBar) hungerBar.style.width = (this.player.hunger / this.player.maxHunger * 100) + '%';
        const thirstBar = document.getElementById('thirst-bar');
        if (thirstBar) thirstBar.style.width = (this.player.thirst / this.player.maxThirst * 100) + '%';
        const tempEl = document.getElementById('temp-display');
        if (tempEl) {
            const t = Math.round(this.player.temperature);
            tempEl.textContent = `${t}C`;
            tempEl.style.color = t < 0 ? '#3498db' : t > 35 ? '#e74c3c' : '#2ecc71';
        }
        const weatherEl = document.getElementById('weather-display');
        if (weatherEl) {
            const icons = { clear: 'Clear', rain: 'Rain', snow: 'Snow', fog: 'Fog' };
            weatherEl.textContent = icons[this.weather] || 'Clear';
        }
        this.updateInventoryUI();
        // Note: panels (crafting/build/tech/inventory) are NOT re-rendered here
        // because doing so destroys click event listeners. They are re-rendered
        // only when opened or when an action (craft/build/research) completes.
    }

    updateInventoryUI() {
        const bar = document.getElementById('inventory-bar');
        bar.innerHTML = '';
        const items = Object.entries(this.player.inventory).filter(([_, c]) => c > 0).slice(0, 9);
        items.forEach(([item, count], i) => {
            const def = ITEMS[item];
            const isUndiscoveredFood = def?.edible && !this.discoveredFoods.has(item);
            const icon = sprite(def?.icon) || '?';
            const name = isUndiscoveredFood ? 'Mysterious Food' : (def?.name || item);
            const slot = document.createElement('div');
            slot.className = 'inv-slot' + (i === this.player.selectedSlot ? ' selected' : '');
            slot.innerHTML = `<span class="inv-slot-key">${i + 1}</span><span class="inv-slot-icon">${icon}</span><span class="inv-slot-count">${count}</span>`;
            slot.title = name;
            bar.appendChild(slot);
        });
    }

    renderInventoryGrid() {
        const grid = document.getElementById('inventory-grid');
        grid.innerHTML = '';
        const items = Object.entries(this.player.inventory).filter(([_, c]) => c > 0);
        const perPage = 9;
        const totalPages = Math.max(1, Math.ceil(items.length / perPage));
        if (this.inventoryPage >= totalPages) this.inventoryPage = totalPages - 1;
        const start = this.inventoryPage * perPage;
        const pageItems = items.slice(start, start + perPage);

        const pageLabel = document.createElement('div');
        pageLabel.style.cssText = 'text-align:center;color:#aaa;font-size:12px;margin-bottom:8px;';
        pageLabel.textContent = `Page ${this.inventoryPage + 1} / ${totalPages} - Press 1-9 to switch pages`;
        grid.appendChild(pageLabel);

        if (pageItems.length === 0) {
            grid.innerHTML += '<p style="color:#888;text-align:center;padding:20px;">Inventory is empty</p>';
            return;
        }

        const gridDiv = document.createElement('div');
        gridDiv.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:4px;';
        for (const [item, count] of pageItems) {
            const def = ITEMS[item];
            const isUndiscoveredFood = def?.edible && !this.discoveredFoods.has(item);
            const icon = sprite(def?.icon) || '?';
            const name = isUndiscoveredFood ? 'Mysterious Food' : (def?.name || item);
            const cell = document.createElement('div');
            cell.style.cssText = 'background:rgba(255,255,255,0.08);border-radius:8px;padding:8px;text-align:center;cursor:pointer;';
            cell.innerHTML = `<div style="font-size:24px;">${icon}</div><div style="font-size:11px;color:#ccc;margin-top:4px;">${name}</div><div style="font-size:10px;color:#888;">x${count}</div>`;
            cell.title = name;
            cell.addEventListener('click', (e) => {
                e.stopPropagation();
                // Select this item in the hotbar
                const allItems = Object.entries(this.player.inventory).filter(([_, c]) => c > 0);
                const idx = allItems.findIndex(([k]) => k === item);
                if (idx >= 0 && idx < 9) {
                    this.player.selectedSlot = idx;
                    this.updateInventoryUI();
                }
            });
            gridDiv.appendChild(cell);
        }
        grid.appendChild(gridDiv);
    }

    renderCrafting() {
        const list = document.getElementById('crafting-list');
        list.innerHTML = '';
        for (const recipe of RECIPES) {
            if (recipe.tech && !this.completedTech.has(recipe.tech)) continue;
            const card = document.createElement('div');
            const canAfford = this.player.hasCost(recipe.cost);
            card.className = 'recipe-card' + (canAfford ? '' : ' cant-afford');
            const outItems = Object.entries(recipe.output).map(([item, amt]) => `${sprite(ITEMS[item]?.icon)} ${ITEMS[item]?.name || item} x${amt}`).join(', ');
            const costItems = Object.entries(recipe.cost).map(([item, amt]) => {
                const has = this.player.hasItem(item, amt);
                return `<span class="cost-item${has ? '' : ' lacking'}">${sprite(ITEMS[item]?.icon)} ${amt}</span>`;
            }).join('');
            card.innerHTML = `<div class="recipe-header"><span class="recipe-icon">${sprite(ITEMS[Object.keys(recipe.output)[0]]?.icon)}</span><span class="recipe-name">${outItems}</span></div><div class="recipe-cost">Cost: ${costItems}</div>`;
            card.addEventListener('click', (e) => { e.stopPropagation(); this.craft(recipe.id); });
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
                return `<span class="cost-item${has ? '' : ' lacking'}">${sprite(ITEMS[item]?.icon)} ${amt}</span>`;
            }).join('');
            const powerInfo = def.power > 0 ? ` +${def.power}` : (def.powerUse > 0 ? ` -${def.powerUse}` : '');
            card.innerHTML = `<div class="build-header"><span class="build-icon">${sprite(def.icon)}</span><span class="build-name">${def.name}${powerInfo}</span></div><div style="font-size:11px;color:#999;margin-bottom:4px;">${def.desc}</div><div class="build-cost">Cost: ${costItems}</div>`;
            card.addEventListener('click', (e) => {
                e.stopPropagation();
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
            if (completed) status = '<span class="tech-status" style="color:#2ecc71;">Done</span>';
            else if (available) status = `<span class="tech-status" style="color:#f1c40f;">${tech.cost} RP</span>`;
            else status = `<span class="tech-status" style="color:#888;">${sprite('locked')} Locked</span>`;
            const prereqText = tech.prereq.length > 0 ? `<div class="tech-prereq">Requires: ${tech.prereq.map(p => TECH_TREE.find(t=>t.id===p)?.name).join(', ')}</div>` : '';
            card.innerHTML = `<div class="tech-header"><span class="tech-icon">${sprite(tech.icon)}</span><span class="tech-name">${tech.name}</span>${status}</div><div class="tech-desc">${tech.desc}</div>${prereqText}`;
            if (available) { card.style.cursor = 'pointer'; card.addEventListener('click', (e) => { e.stopPropagation(); this.researchTech(tech.id); }); }
            list.appendChild(card);
        }
    }

    updateBuildModeUI() {
        const el = document.getElementById('build-mode-indicator');
        if (this.buildMode) {
            el.classList.remove('hidden');
            document.getElementById('build-mode-name').innerHTML = `Placing: ${sprite(BUILDINGS[this.buildMode].icon)} ${BUILDINGS[this.buildMode].name} - Click to place`;
        } else {
            el.classList.add('hidden');
        }
    }
}

// --- Start ---
const game = new Game();
