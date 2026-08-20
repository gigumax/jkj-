// Custom SVG sprite icons for all game items, resources, buildings, and tech.
// Usage: sprite('wood') returns an <img> tag with a data URI SVG.

const SPRITES = {
    // --- HUD ---
    health: '<path d="M12 21s-7-4.5-9-9C1 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6 4 4 8-2 4.5-9 9-9 9z" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/>',
    energy: '<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="#f1c40f" stroke="#f39c12" stroke-width="1.5"/>',
    hunger: '<path d="M4 8c0-2 2-4 8-4s8 2 8 4-2 4-8 4-8-2-8-4z M4 12c0 4 4 8 8 8s8-4 8-8" fill="#e67e22" stroke="#d35400" stroke-width="1.5"/>',
    thirst: '<path d="M12 2c-4 6-6 9-6 12a6 6 0 0012 0c0-3-2-6-6-12z" fill="#3498db" stroke="#2980b9" stroke-width="1.5"/>',
    temp: '<rect x="10" y="2" width="4" height="14" rx="2" fill="#95a5a6"/><circle cx="12" cy="18" r="4" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/><rect x="11" y="4" width="2" height="10" fill="#e74c3c"/>',
    research: '<circle cx="12" cy="12" r="3" fill="#2ecc71"/><circle cx="12" cy="12" r="8" fill="none" stroke="#2ecc71" stroke-width="1.5"/><line x1="12" y1="2" x2="12" y2="5" stroke="#2ecc71" stroke-width="2"/><line x1="12" y1="19" x2="12" y2="22" stroke="#2ecc71" stroke-width="2"/><line x1="2" y1="12" x2="5" y2="12" stroke="#2ecc71" stroke-width="2"/><line x1="19" y1="12" x2="22" y2="12" stroke="#2ecc71" stroke-width="2"/>',
    power: '<path d="M12 2v8M12 14v8M2 12h8M14 12h8" stroke="#f1c40f" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#f1c40f" stroke="#f39c12" stroke-width="1.5"/>',

    // --- Resources ---
    tree: '<rect x="10" y="14" width="4" height="8" fill="#6b4423"/><circle cx="12" cy="10" r="6" fill="#27ae60" stroke="#1e8449" stroke-width="1.5"/>',
    bush: '<circle cx="8" cy="14" r="4" fill="#2ecc71"/><circle cx="16" cy="14" r="4" fill="#2ecc71"/><circle cx="12" cy="10" r="5" fill="#27ae60"/><circle cx="10" cy="12" r="1.5" fill="#e74c3c"/><circle cx="14" cy="11" r="1.5" fill="#e74c3c"/><circle cx="12" cy="15" r="1.5" fill="#e74c3c"/>',
    red_mushroom: '<ellipse cx="12" cy="8" rx="7" ry="4" fill="#e74c3c"/><rect x="10" y="8" width="4" height="10" fill="#ecf0f1"/><circle cx="9" cy="7" r="1" fill="#fff"/><circle cx="14" cy="8" r="1" fill="#fff"/>',
    purple_mushroom: '<ellipse cx="12" cy="8" rx="7" ry="4" fill="#9b59b6"/><rect x="10" y="8" width="4" height="10" fill="#ecf0f1"/><circle cx="9" cy="7" r="1" fill="#fff"/><circle cx="14" cy="8" r="1" fill="#fff"/>',
    red_berries: '<circle cx="8" cy="10" r="2.5" fill="#e74c3c"/><circle cx="14" cy="9" r="2.5" fill="#e74c3c"/><circle cx="11" cy="14" r="2.5" fill="#c0392b"/><path d="M6 6c2-2 6-2 8 0" stroke="#27ae60" stroke-width="2" fill="none"/>',
    nightshade: '<circle cx="8" cy="10" r="2.5" fill="#2c3e50"/><circle cx="14" cy="9" r="2.5" fill="#2c3e50"/><circle cx="11" cy="14" r="2.5" fill="#1a1a2e"/><path d="M6 6c2-2 6-2 8 0" stroke="#27ae60" stroke-width="2" fill="none"/>',
    cactus_fruit: '<ellipse cx="12" cy="12" rx="5" ry="7" fill="#e67e22"/><rect x="10" y="3" width="1.5" height="4" fill="#27ae60"/><rect x="12.5" y="2" width="1.5" height="5" fill="#27ae60"/>',
    glowing_plant: '<path d="M12 22V10 M12 10c-3-2-5-5-5-8 3 1 5 3 5 8 M12 10c3-2 5-5 5-8-3 1-5 3-5 8" fill="#8e44ad"/><circle cx="12" cy="6" r="2" fill="#f1c40f" opacity="0.8"/>',
    thorn_bush: '<path d="M6 18l3-6 3 6 3-6 3 6" stroke="#27ae60" stroke-width="2" fill="none"/><path d="M9 12l-1-3M15 12l1-3M12 15v-4" stroke="#e74c3c" stroke-width="1.5"/>',
    stone: '<path d="M4 16l4-8 8-2 4 6-2 8-8 2z" fill="#95a5a6" stroke="#7f8c8d" stroke-width="1.5"/>',
    coal: '<path d="M4 16l4-8 8-2 4 6-2 8-8 2z" fill="#2c3e50" stroke="#1a1a2e" stroke-width="1.5"/><circle cx="10" cy="12" r="1" fill="#7f8c8d"/><circle cx="14" cy="14" r="1" fill="#7f8c8d"/>',
    iron: '<path d="M4 16l4-8 8-2 4 6-2 8-8 2z" fill="#bdc3c7" stroke="#7f8c8d" stroke-width="1.5"/><circle cx="10" cy="11" r="1.5" fill="#d35400"/><circle cx="14" cy="13" r="1.5" fill="#d35400"/>',
    copper: '<path d="M4 16l4-8 8-2 4 6-2 8-8 2z" fill="#d4a574" stroke="#a0522d" stroke-width="1.5"/><circle cx="10" cy="11" r="1.5" fill="#e67e22"/><circle cx="14" cy="13" r="1.5" fill="#e67e22"/>',
    gold: '<path d="M4 16l4-8 8-2 4 6-2 8-8 2z" fill="#f1c40f" stroke="#d4ac0d" stroke-width="1.5"/><circle cx="10" cy="11" r="1.5" fill="#fff"/><circle cx="14" cy="13" r="1.5" fill="#fff"/>',
    oil: '<path d="M12 2c-4 4-6 8-6 12a6 6 0 0012 0c0-4-2-8-6-12z" fill="#1a1a2e" stroke="#2c3e50" stroke-width="1.5"/><ellipse cx="10" cy="10" rx="1.5" ry="2" fill="#34495e" opacity="0.5"/>',
    soil: '<path d="M2 12h20M2 16h20" stroke="#6b4423" stroke-width="3"/><circle cx="6" cy="10" r="1" fill="#8b6914"/><circle cx="14" cy="8" r="1" fill="#8b6914"/><circle cx="18" cy="14" r="1" fill="#8b6914"/>',
    grass: '<path d="M6 22V12M6 12c0-4 2-6 2-6M10 22V10M10 10c0-4 2-6 2-6M14 22V12M14 12c0-4 2-6 2-6M18 22V10M18 10c0-4 2-6 2-6" stroke="#27ae60" stroke-width="2" fill="none"/>',

    // --- Items ---
    wood: '<rect x="4" y="8" width="16" height="8" rx="2" fill="#6b4423" stroke="#4a2f1a" stroke-width="1.5"/><line x1="8" y1="8" x2="8" y2="16" stroke="#4a2f1a" stroke-width="1"/><line x1="12" y1="8" x2="12" y2="16" stroke="#4a2f1a" stroke-width="1"/><line x1="16" y1="8" x2="16" y2="16" stroke="#4a2f1a" stroke-width="1"/>',
    plank: '<rect x="3" y="6" width="18" height="4" fill="#8b6914" stroke="#6b4423" stroke-width="1"/><rect x="3" y="11" width="18" height="4" fill="#8b6914" stroke="#6b4423" stroke-width="1"/><rect x="3" y="16" width="18" height="4" fill="#8b6914" stroke="#6b4423" stroke-width="1"/>',
    food: '<circle cx="12" cy="12" r="5" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/><circle cx="10" cy="10" r="1.5" fill="#c0392b"/><circle cx="14" cy="13" r="1.5" fill="#c0392b"/>',
    leather: '<path d="M6 6c4-2 8-2 12 0l-2 12c-4 2-8 2-10 0z" fill="#8B4513" stroke="#654321" stroke-width="1.5"/><path d="M8 8c3-1 6-1 8 0" stroke="#654321" stroke-width="1" fill="none"/>',
    iron_ore: '<path d="M4 16l4-8 8-2 4 6-2 8-8 2z" fill="#bdc3c7" stroke="#7f8c8d" stroke-width="1.5"/><circle cx="10" cy="11" r="2" fill="#d35400"/><circle cx="14" cy="13" r="2" fill="#d35400"/>',
    iron_ingot: '<rect x="4" y="9" width="16" height="6" rx="1" fill="#bdc3c7" stroke="#7f8c8d" stroke-width="1.5"/><rect x="6" y="10" width="12" height="1" fill="#ecf0f1" opacity="0.5"/>',
    copper_ore: '<path d="M4 16l4-8 8-2 4 6-2 8-8 2z" fill="#d4a574" stroke="#a0522d" stroke-width="1.5"/><circle cx="10" cy="11" r="2" fill="#e67e22"/><circle cx="14" cy="13" r="2" fill="#e67e22"/>',
    copper_ingot: '<rect x="4" y="9" width="16" height="6" rx="1" fill="#d4814a" stroke="#a0522d" stroke-width="1.5"/><rect x="6" y="10" width="12" height="1" fill="#f5b985" opacity="0.5"/>',
    gold_ore: '<path d="M4 16l4-8 8-2 4 6-2 8-8 2z" fill="#f1c40f" stroke="#d4ac0d" stroke-width="1.5"/><circle cx="10" cy="11" r="2" fill="#fff"/><circle cx="14" cy="13" r="2" fill="#fff"/>',
    gold_ingot: '<rect x="4" y="9" width="16" height="6" rx="1" fill="#f1c40f" stroke="#d4ac0d" stroke-width="1.5"/><rect x="6" y="10" width="12" height="1" fill="#fffae0" opacity="0.5"/>',
    brick: '<rect x="3" y="6" width="8" height="5" fill="#c0392b" stroke="#922b21" stroke-width="1"/><rect x="13" y="6" width="8" height="5" fill="#c0392b" stroke="#922b21" stroke-width="1"/><rect x="8" y="13" width="8" height="5" fill="#c0392b" stroke="#922b21" stroke-width="1"/>',
    gear: '<circle cx="12" cy="12" r="4" fill="#7f8c8d" stroke="#5d6d7e" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="#5d6d7e"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="#7f8c8d" stroke-width="2"/>',
    circuit: '<rect x="4" y="4" width="16" height="16" rx="2" fill="#2ecc71" stroke="#27ae60" stroke-width="1.5"/><path d="M8 8h8M8 12h4M8 16h8M8 8v8M16 8v8" stroke="#1a5276" stroke-width="1.5" fill="none"/><circle cx="8" cy="8" r="1.5" fill="#f1c40f"/><circle cx="16" cy="16" r="1.5" fill="#f1c40f"/>',
    battery: '<rect x="6" y="4" width="12" height="16" rx="2" fill="#34495e" stroke="#2c3e50" stroke-width="1.5"/><rect x="9" y="2" width="6" height="3" fill="#2c3e50"/><rect x="8" y="8" width="8" height="4" fill="#e74c3c"/><rect x="8" y="14" width="8" height="4" fill="#3498db"/>',
    wood_pickaxe: '<line x1="4" y1="20" x2="16" y2="6" stroke="#6b4423" stroke-width="3"/><path d="M14 4l6 2-2 6-4-2z" fill="#8b6914" stroke="#6b4423" stroke-width="1.5"/>',
    stone_pickaxe: '<line x1="4" y1="20" x2="16" y2="6" stroke="#6b4423" stroke-width="3"/><path d="M14 4l6 2-2 6-4-2z" fill="#95a5a6" stroke="#7f8c8d" stroke-width="1.5"/>',
    iron_pickaxe: '<line x1="4" y1="20" x2="16" y2="6" stroke="#6b4423" stroke-width="3"/><path d="M14 4l6 2-2 6-4-2z" fill="#bdc3c7" stroke="#7f8c8d" stroke-width="1.5"/>',
    wood_axe: '<line x1="6" y1="20" x2="16" y2="8" stroke="#6b4423" stroke-width="3"/><path d="M14 4l6 4-4 6-4-4z" fill="#8b6914" stroke="#6b4423" stroke-width="1.5"/>',
    stone_axe: '<line x1="6" y1="20" x2="16" y2="8" stroke="#6b4423" stroke-width="3"/><path d="M14 4l6 4-4 6-4-4z" fill="#95a5a6" stroke="#7f8c8d" stroke-width="1.5"/>',
    iron_axe: '<line x1="6" y1="20" x2="16" y2="8" stroke="#6b4423" stroke-width="3"/><path d="M14 4l6 4-4 6-4-4z" fill="#bdc3c7" stroke="#7f8c8d" stroke-width="1.5"/>',
    raw_meat: '<path d="M6 10c0-4 3-6 6-6s6 2 6 6-2 8-6 8-6-4-6-8z" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/><path d="M8 10c0-2 2-3 4-3" stroke="#ff6b6b" stroke-width="1" fill="none"/>',
    cooked_meat: '<path d="M6 10c0-4 3-6 6-6s6 2 6 6-2 8-6 8-6-4-6-8z" fill="#8B4513" stroke="#654321" stroke-width="1.5"/><path d="M9 6c1-1 2-1 3 0M12 8c1-1 2-1 3 0" stroke="#5d4037" stroke-width="1" fill="none"/>',
    fang: '<path d="M6 4l4 8 2 8 2-8 4-8z" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="1.5"/><path d="M8 6l3 6M16 6l-3 6" stroke="#bdc3c7" stroke-width="1"/>',
    hunting_gun: '<rect x="4" y="10" width="14" height="3" fill="#2c3e50" stroke="#1a1a2e" stroke-width="1"/><rect x="14" y="13" width="3" height="5" fill="#6b4423" stroke="#4a2f1a" stroke-width="1"/><rect x="2" y="9" width="4" height="5" rx="1" fill="#7f8c8d" stroke="#5d6d7e" stroke-width="1"/>',
    spider_web: '<circle cx="12" cy="12" r="8" fill="none" stroke="#ecf0f1" stroke-width="1"/><circle cx="12" cy="12" r="5" fill="none" stroke="#ecf0f1" stroke-width="1"/><circle cx="12" cy="12" r="2" fill="none" stroke="#ecf0f1" stroke-width="1"/><path d="M12 4v16M4 12h16M6 6l12 12M18 6L6 18" stroke="#ecf0f1" stroke-width="1"/>',
    fishing_rod: '<path d="M4 20L20 4" stroke="#6b4423" stroke-width="2.5"/><path d="M18 6c2 0 3 2 2 4" stroke="#3498db" stroke-width="1" fill="none"/><circle cx="20" cy="10" r="1" fill="#3498db"/>',
    raw_fish: '<path d="M4 12c4-4 10-4 14 0-4 4-10 4-14 0z" fill="#3498db" stroke="#2980b9" stroke-width="1.5"/><path d="M18 12l4-4v8z" fill="#2980b9"/><circle cx="8" cy="11" r="1" fill="#1a1a2e"/>',
    cooked_fish: '<path d="M4 12c4-4 10-4 14 0-4 4-10 4-14 0z" fill="#d4814a" stroke="#a0522d" stroke-width="1.5"/><path d="M18 12l4-4v8z" fill="#a0522d"/><circle cx="8" cy="11" r="1" fill="#1a1a2e"/>',

    // --- Buildings ---
    campfire: '<path d="M12 22c-4-2-6-6-6-10 0 0 2 4 6 4s6-4 6-4c0 4-2 8-6 10z" fill="#e67e22" stroke="#d35400" stroke-width="1.5"/><path d="M12 18c-2-1-3-3-3-5 0 0 1 2 3 2s3-2 3-2c0 2-1 4-3 5z" fill="#f1c40f"/>',
    research_table: '<rect x="2" y="14" width="20" height="6" fill="#6b4423" stroke="#4a2f1a" stroke-width="1.5"/><rect x="4" y="8" width="6" height="6" fill="#8b6914" stroke="#6b4423" stroke-width="1"/><circle cx="16" cy="10" r="3" fill="#2ecc71" stroke="#27ae60" stroke-width="1.5"/>',
    furnace: '<rect x="4" y="4" width="16" height="16" rx="2" fill="#7f8c8d" stroke="#5d6d7e" stroke-width="1.5"/><rect x="8" y="8" width="8" height="8" rx="1" fill="#e67e22"/><rect x="10" y="10" width="4" height="4" fill="#f1c40f"/>',
    mining_drill: '<rect x="6" y="10" width="12" height="10" fill="#7f8c8d" stroke="#5d6d7e" stroke-width="1.5"/><circle cx="12" cy="6" r="3" fill="#bdc3c7" stroke="#7f8c8d" stroke-width="1.5"/><path d="M12 6v4M9 6h6" stroke="#5d6d7e" stroke-width="1.5"/>',
    power_plant: '<rect x="4" y="8" width="16" height="12" fill="#8e44ad" stroke="#6c3483" stroke-width="1.5"/><path d="M12 10v4M12 16v2" stroke="#f1c40f" stroke-width="2"/><rect x="8" y="4" width="8" height="4" fill="#7f8c8d" stroke="#5d6d7e" stroke-width="1"/>',
    solar_panel: '<rect x="2" y="10" width="20" height="8" fill="#1a5276" stroke="#154360" stroke-width="1.5"/><path d="M2 14h20M8 10v8M16 10v8" stroke="#154360" stroke-width="1"/><circle cx="18" cy="4" r="3" fill="#f1c40f" stroke="#f39c12" stroke-width="1.5"/>',
    research_lab: '<rect x="4" y="6" width="16" height="14" fill="#2ecc71" stroke="#27ae60" stroke-width="1.5"/><path d="M8 10h8M8 14h8M8 18h4" stroke="#fff" stroke-width="1.5"/><circle cx="16" cy="18" r="2" fill="#f1c40f"/>',
    oil_pump: '<rect x="8" y="14" width="8" height="6" fill="#34495e" stroke="#2c3e50" stroke-width="1.5"/><path d="M12 14V6M12 6l6 4M12 6l-6 4" stroke="#34495e" stroke-width="2" fill="none"/><circle cx="12" cy="6" r="2" fill="#e67e22"/>',
    assembler: '<rect x="4" y="8" width="16" height="12" rx="1" fill="#bdc3c7" stroke="#7f8c8d" stroke-width="1.5"/><circle cx="12" cy="14" r="3" fill="#7f8c8d" stroke="#5d6d7e" stroke-width="1.5"/><path d="M12 14l2-2" stroke="#e74c3c" stroke-width="2"/>',
    wood_hut: '<path d="M4 12l8-6 8 6v8h-16z" fill="#8b6914" stroke="#6b4423" stroke-width="1.5"/><rect x="10" y="14" width="4" height="6" fill="#4a2f1a"/>',

    // --- Tech ---
    stone_tools: '<path d="M6 18l8-8 4 4-8 8z" fill="#95a5a6" stroke="#7f8c8d" stroke-width="1.5"/><path d="M14 10l4-4 2 2-4 4z" fill="#bdc3c7" stroke="#7f8c8d" stroke-width="1.5"/>',
    smelting: '<rect x="4" y="10" width="16" height="10" rx="1" fill="#e67e22" stroke="#d35400" stroke-width="1.5"/><path d="M8 10c0-4 3-6 4-6s4 2 4 6" fill="#f1c40f" stroke="#e67e22" stroke-width="1.5"/>',
    iron_tools: '<path d="M6 18l8-8 4 4-8 8z" fill="#bdc3c7" stroke="#7f8c8d" stroke-width="1.5"/><path d="M14 10l4-4 2 2-4 4z" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="1.5"/>',
    machinery: '<circle cx="12" cy="12" r="5" fill="#7f8c8d" stroke="#5d6d7e" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="#5d6d7e"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3" stroke="#7f8c8d" stroke-width="2"/>',
    power_generation: '<path d="M13 2L6 12h4l-1 8 7-10h-4l1-8z" fill="#f1c40f" stroke="#f39c12" stroke-width="1.5"/>',
    scientific_method: '<circle cx="12" cy="10" r="5" fill="none" stroke="#2ecc71" stroke-width="2"/><path d="M12 15v6M9 21h6" stroke="#2ecc71" stroke-width="2"/><circle cx="12" cy="10" r="2" fill="#2ecc71"/>',
    mining_automation: '<rect x="6" y="12" width="12" height="8" fill="#7f8c8d" stroke="#5d6d7e" stroke-width="1.5"/><path d="M12 4v8M9 8h6" stroke="#5d6d7e" stroke-width="2"/><circle cx="12" cy="4" r="2" fill="#bdc3c7"/>',
    electronics: '<rect x="4" y="6" width="16" height="12" rx="1" fill="#2ecc71" stroke="#27ae60" stroke-width="1.5"/><path d="M8 10h8M8 14h8M8 10v4M16 10v4" stroke="#1a5276" stroke-width="1.5" fill="none"/>',
    oil_processing: '<path d="M12 2c-3 4-5 7-5 10a5 5 0 0010 0c0-3-2-6-5-10z" fill="#1a1a2e" stroke="#2c3e50" stroke-width="1.5"/><rect x="9" y="16" width="6" height="4" fill="#34495e"/>',
    renewable_energy: '<circle cx="12" cy="12" r="4" fill="#f1c40f" stroke="#f39c12" stroke-width="1.5"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" stroke="#f1c40f" stroke-width="1.5"/>',
    automation: '<circle cx="12" cy="12" r="4" fill="#7f8c8d" stroke="#5d6d7e" stroke-width="1.5"/><path d="M12 12l3-3M12 12l-3 3" stroke="#e74c3c" stroke-width="2"/><path d="M6 6l2 2M18 6l-2 2M6 18l2-2M18 18l-2-2" stroke="#7f8c8d" stroke-width="2"/>',

    // --- Misc ---
    quest: '<circle cx="12" cy="12" r="8" fill="#f1c40f" stroke="#f39c12" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="#e67e22" stroke="#d35400" stroke-width="1"/><circle cx="12" cy="12" r="1.5" fill="#c0392b"/>',
    locked: '<rect x="6" y="10" width="12" height="10" rx="2" fill="#7f8c8d" stroke="#5d6d7e" stroke-width="1.5"/><path d="M9 10V7a3 3 0 016 0v3" fill="none" stroke="#5d6d7e" stroke-width="2"/><circle cx="12" cy="15" r="1.5" fill="#2c3e50"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="2" fill="#34495e" stroke="#2c3e50" stroke-width="1.5"/><rect x="8" y="5" width="8" height="4" rx="1" fill="#34495e" stroke="#2c3e50" stroke-width="1.5"/><circle cx="12" cy="13" r="4" fill="#1a1a2e" stroke="#7f8c8d" stroke-width="1.5"/><circle cx="12" cy="13" r="2" fill="#3498db" opacity="0.6"/>',
    bike: '<circle cx="6" cy="17" r="4" fill="none" stroke="#2c3e50" stroke-width="2"/><circle cx="18" cy="17" r="4" fill="none" stroke="#2c3e50" stroke-width="2"/><path d="M6 17l4-7h6l-2 7M10 10l4 7M14 10h3" stroke="#2c3e50" stroke-width="1.5" fill="none"/><circle cx="10" cy="10" r="1" fill="#e74c3c"/>',
    car: '<rect x="2" y="12" width="20" height="6" rx="1" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/><rect x="5" y="8" width="14" height="5" rx="1" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/><circle cx="7" cy="18" r="2" fill="#2c3e50"/><circle cx="17" cy="18" r="2" fill="#2c3e50"/><rect x="6" y="9" width="5" height="3" fill="#85c1e9" opacity="0.7"/><rect x="13" y="9" width="5" height="3" fill="#85c1e9" opacity="0.7"/>',
};

function _svgDataUri(svgInner) {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">' + svgInner + '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

// Cache for data URIs
const _spriteCache = {};

function sprite(key) {
    if (!key) return '';
    if (_spriteCache[key]) return _spriteCache[key];
    const inner = SPRITES[key];
    if (!inner) return '';
    const uri = _svgDataUri(inner);
    const img = '<img src="' + uri + '" class="item-sprite" width="20" height="20" alt="' + key + '">';
    _spriteCache[key] = img;
    return img;
}
