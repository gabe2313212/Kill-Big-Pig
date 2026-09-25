// ==========================================
// KILL BIG P — GAME MECHANICS
// ==========================================

const GAME_RULES = {
    worldArea: 10000000,
    normalPigKillsRequired: 500,

    cannonballsPerSecond: 10,
    normalPigDamage: Infinity,

    boss: {
        name: "Big P",
        maxHealth: 1000000,
        damagePerCannonball: 200
    },

    normalPig: {
        respawnTime: 5,
        size: "GIANT"
    }
};

// ==========================================
// CALCULATIONS
// ==========================================

// A square with an area of 10,000,000 m²
// has a side length of about 3162.28 metres.
GAME_RULES.worldSideLength = Math.sqrt(
    GAME_RULES.worldArea
);

// Number of successful hits needed to defeat Big P.
GAME_RULES.bossHitsRequired =
    GAME_RULES.boss.maxHealth /
    GAME_RULES.boss.damagePerCannonball;


// ==========================================
// GAME STATE
// ==========================================

const gameState = {
    pigsKilled: 0,
    bossStarted: false,
    bossDefeated: false,

    bossHealth: GAME_RULES.boss.maxHealth,

    cannonballsFired: 0,

    gameStarted: false
};


// ==========================================
// PIG SYSTEM
// ==========================================

function registerPigKill() {

    if (gameState.bossStarted) {
        return false;
    }

    gameState.pigsKilled++;

    if (
        gameState.pigsKilled >=
        GAME_RULES.normalPigKillsRequired
    ) {
        beginBossFight();
    }

    return true;
}


// ==========================================
// BOSS SYSTEM
// ==========================================

function beginBossFight() {

    if (gameState.bossStarted) {
        return;
    }

    gameState.bossStarted = true;
    gameState.bossHealth =
        GAME_RULES.boss.maxHealth;

    console.log("BIG P HAS ARRIVED!");

    showBossUI();
}


function damageBoss() {

    if (
        !gameState.bossStarted ||
        gameState.bossDefeated
    ) {
        return;
    }

    gameState.bossHealth -=
        GAME_RULES.boss.damagePerCannonball;

    if (gameState.bossHealth < 0) {
        gameState.bossHealth = 0;
    }

    updateBossHealthDisplay();

    if (gameState.bossHealth === 0) {
        defeatBoss();
    }
}


function defeatBoss() {

    if (gameState.bossDefeated) {
        return;
    }

    gameState.bossDefeated = true;

    console.log("BIG P DEFEATED!");

    showMessage("🏆 BIG P DEFEATED!");
}


// ==========================================
// CANNON SYSTEM
// ==========================================

let lastMechanicsShot = 0;


function canFire() {

    const now = performance.now();

    const delay =
        1000 /
        GAME_RULES.cannonballsPerSecond;

    if (
        now - lastMechanicsShot >= delay
    ) {
        lastMechanicsShot = now;

        gameState.cannonballsFired++;

        return true;
    }

    return false;
}


// ==========================================
// UI
// ==========================================

function showBossUI() {

    const bossUI =
        document.getElementById("bossUI");

    if (bossUI) {
        bossUI.style.display = "block";
    }

    showMessage("⚠️ BIG P HAS ARRIVED ⚠️");

    setTimeout(() => {

        const message =
            document.getElementById("message");

        if (message) {
            message.textContent = "";
        }

    }, 3000);
}


function updateBossHealthDisplay() {

    const healthBar =
        document.getElementById("bossHealth");

    const healthText =
        document.getElementById("bossHealthText");

    if (healthBar) {

        const percentage =
            (
                gameState.bossHealth /
                GAME_RULES.boss.maxHealth
            ) * 100;

        healthBar.style.width =
            `${percentage}%`;
    }

    if (healthText) {

        healthText.textContent =
            gameState.bossHealth.toLocaleString();
    }
}


function showMessage(message) {

    const messageElement =
        document.getElementById("message");

    if (messageElement) {
        messageElement.textContent = message;
    }
}


// ==========================================
// RESET GAME
// ==========================================

function resetGameState() {

    gameState.pigsKilled = 0;
    gameState.bossStarted = false;
    gameState.bossDefeated = false;

    gameState.bossHealth =
        GAME_RULES.boss.maxHealth;

    gameState.cannonballsFired = 0;

    updateBossHealthDisplay();
}


// ==========================================
// DEBUG INFORMATION
// ==========================================

console.log(
    "KILL BIG P mechanics loaded."
);

console.log(
    `World: ${GAME_RULES.worldArea.toLocaleString()} m²`
);

console.log(
    `World side: ${GAME_RULES.worldSideLength.toFixed(2)} m`
);

console.log(
    `Boss hits required: ${GAME_RULES.bossHitsRequired.toLocaleString()}`
);
