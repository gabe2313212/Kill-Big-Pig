import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// ===============================
// KILL BIG P — MAIN GAME
// ===============================

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);

camera.position.set(0, 8, 14);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.appendChild(renderer.domElement);

// ===============================
// LIGHTING
// ===============================

const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(100, 200, 100);
scene.add(sun);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

// ===============================
// WORLD
// ===============================

// 10,000,000 square metre world
const WORLD_SIZE = Math.sqrt(10000000);

// Ground
const groundGeometry = new THREE.PlaneGeometry(
    WORLD_SIZE,
    WORLD_SIZE
);

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x4b8f3a
});

const ground = new THREE.Mesh(
    groundGeometry,
    groundMaterial
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;

scene.add(ground);

// ===============================
// GAME VARIABLES
// ===============================

let pigsKilled = 0;
let bossActive = false;

const MAX_PIG_KILLS = 500;

const BOSS_MAX_HEALTH = 1000000;
let bossHealth = BOSS_MAX_HEALTH;

const CANNON_DAMAGE = 200;
const FIRE_RATE = 10;

let lastShotTime = 0;

const cannonballs = [];
const pigs = [];

let keys = {};

let mouseX = 0;
let mouseY = 0;

// ===============================
// CAR
// ===============================

const car = new THREE.Group();

const carBodyGeometry = new THREE.BoxGeometry(5, 1.5, 8);

const carBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222
});

const carBody = new THREE.Mesh(
    carBodyGeometry,
    carBodyMaterial
);

carBody.position.y = 1.5;
car.add(carBody);

// Car wheels
function createWheel(x, z) {

    const wheelGeometry = new THREE.CylinderGeometry(
        1,
        1,
        0.7,
        24
    );

    const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111
    });

    const wheel = new THREE.Mesh(
        wheelGeometry,
        wheelMaterial
    );

    wheel.rotation.z = Math.PI / 2;

    wheel.position.set(x, 1, z);

    car.add(wheel);
}

createWheel(-2.6, -2.5);
createWheel(2.6, -2.5);
createWheel(-2.6, 2.5);
createWheel(2.6, 2.5);

car.position.set(0, 0, 0);

scene.add(car);

// ===============================
// FICTIONAL PIG BLASTER
// ===============================

const cannon = new THREE.Group();

const cannonBaseGeometry = new THREE.BoxGeometry(2, 0.7, 2);

const cannonBaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555
});

const cannonBase = new THREE.Mesh(
    cannonBaseGeometry,
    cannonBaseMaterial
);

cannonBase.position.y = 2.8;
cannon.add(cannonBase);

const barrelGeometry = new THREE.CylinderGeometry(
    0.5,
    0.7,
    4,
    20
);

const barrelMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333
});

const barrel = new THREE.Mesh(
    barrelGeometry,
    barrelMaterial
);

barrel.rotation.x = Math.PI / 2;
barrel.position.set(0, 3.2, -2);

cannon.add(barrel);

car.add(cannon);

// ===============================
// PIG CREATION
// ===============================

function createPig(x, z, scale = 8) {

    const pig = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.SphereGeometry(1, 20, 20);

    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xff91b5
    });

    const body = new THREE.Mesh(
        bodyGeometry,
        bodyMaterial
    );

    body.scale.set(1.5, 1, 2);
    pig.add(body);

    // Head
    const head = new THREE.Mesh(
        bodyGeometry,
        bodyMaterial
    );

    head.scale.set(1.3, 1.2, 1.3);
    head.position.z = -2.2;

    pig.add(head);

    // Snout
    const snoutGeometry = new THREE.SphereGeometry(
        0.6,
        16,
        16
    );

    const snout = new THREE.Mesh(
        snoutGeometry,
        bodyMaterial
    );

    snout.scale.set(1.3, 0.8, 0.6);
    snout.position.set(0, -0.1, -3.2);

    pig.add(snout);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(
        0.16,
        12,
        12
    );

    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000
    });

    const leftEye = new THREE.Mesh(
        eyeGeometry,
        eyeMaterial
    );

    const rightEye = new THREE.Mesh(
        eyeGeometry,
        eyeMaterial
    );

    leftEye.position.set(-0.45, 0.45, -2.95);
    rightEye.position.set(0.45, 0.45, -2.95);

    pig.add(leftEye);
    pig.add(rightEye);

    // Ears
    const earGeometry = new THREE.ConeGeometry(
        0.4,
        0.8,
        4
    );

    const leftEar = new THREE.Mesh(
        earGeometry,
        bodyMaterial
    );

    const rightEar = new THREE.Mesh(
        earGeometry,
        bodyMaterial
    );

    leftEar.position.set(-0.8, 1, -2);
    rightEar.position.set(0.8, 1, -2);

    pig.add(leftEar);
    pig.add(rightEar);

    pig.position.set(x, scale * 0.6, z);
    pig.scale.setScalar(scale);

    pig.userData = {
        alive: true,
        ragdoll: false,
        respawnTimer: 0
    };

    scene.add(pig);
    pigs.push(pig);

    return pig;
}

// ===============================
// CREATE GIANT PIGS
// ===============================

for (let i = 0; i < 30; i++) {

    const angle = Math.random() * Math.PI * 2;
    const distance = 150 + Math.random() * 1000;

    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;

    createPig(x, z, 8);
}

// ===============================
// BOSS
// ===============================

let boss = null;

function createBoss() {

    if (boss) return;

    boss = createPig(0, -250, 15);

    boss.visible = false;

    boss.userData.isBoss = true;
    boss.userData.alive = true;

    bossHealth = BOSS_MAX_HEALTH;

    updateBossUI();
}

// ===============================
// CANNONBALL
// ===============================

function fireCannonball() {

    const now = performance.now();

    // 10 shots per second
    if (now - lastShotTime < 1000 / FIRE_RATE) {
        return;
    }

    lastShotTime = now;

    const geometry = new THREE.SphereGeometry(
        0.35,
        16,
        16
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0x333333
    });

    const ball = new THREE.Mesh(
        geometry,
        material
    );

    const direction = new THREE.Vector3(0, 0, -1);

    direction.applyQuaternion(car.quaternion);

    ball.position.copy(car.position);

    ball.position.y += 3;

    ball.position.add(
        direction.clone().multiplyScalar(7)
    );

    ball.userData = {
        velocity: direction.multiplyScalar(250),
        damage: CANNON_DAMAGE,
        life: 5
    };

    scene.add(ball);
    cannonballs.push(ball);
}

// ===============================
// KILL PIG
// ===============================

function killPig(pig) {

    if (!pig.userData.alive) {
        return;
    }

    pig.userData.alive = false;
    pig.userData.ragdoll = true;
    pig.userData.respawnTimer = 5;

    pigsKilled++;

    updateKillUI();

    // Simple cartoon ragdoll effect
    pig.rotation.x =
        Math.random() * Math.PI;

    pig.rotation.z =
        Math.random() * Math.PI;

    // Hide after 5 seconds
    setTimeout(() => {

        if (!bossActive) {

            pig.visible = false;

            setTimeout(() => {

                if (!bossActive) {

                    const angle =
                        Math.random() * Math.PI * 2;

                    const distance =
                        150 + Math.random() * 1000;

                    pig.position.x =
                        Math.cos(angle) * distance;

                    pig.position.z =
                        Math.sin(angle) * distance;

                    pig.rotation.set(0, 0, 0);

                    pig.userData.alive = true;
                    pig.userData.ragdoll = false;

                    pig.visible = true;
                }

            }, 500);
        }

    }, 5000);

    // Start boss after 500 kills
    if (pigsKilled >= MAX_PIG_KILLS) {
        startBossFight();
    }
}

// ===============================
// BOSS FIGHT
// ===============================

function startBossFight() {

    if (bossActive) {
        return;
    }

    bossActive = true;

    // Hide every normal pig
    pigs.forEach(pig => {

        if (!pig.userData.isBoss) {
            pig.visible = false;
            pig.userData.alive = false;
        }

    });

    createBoss();

    boss.visible = true;

    document.getElementById("message").textContent =
        "⚠️ BIG P HAS ARRIVED ⚠️";
}

// ===============================
// HIT DETECTION
// ===============================

function checkCannonballHits(ball) {

    // Normal pigs
    for (const pig of pigs) {

        if (
            pig.userData.alive &&
            pig.visible &&
            !pig.userData.isBoss
        ) {

            const distance =
                ball.position.distanceTo(pig.position);

            if (distance < 12) {

                killPig(pig);

                return true;
            }
        }
    }

    // Boss
    if (
        bossActive &&
        boss &&
        boss.visible &&
        boss.userData.alive
    ) {

        const distance =
            ball.position.distanceTo(boss.position);

        if (distance < 20) {

            bossHealth -= CANNON_DAMAGE;

            if (bossHealth < 0) {
                bossHealth = 0;
            }

            updateBossUI();

            if (bossHealth <= 0) {

                boss.userData.alive = false;

                boss.visible = false;

                document.getElementById("message").textContent =
                    "🏆 BIG P DEFEATED!";
            }

            return true;
        }
    }

    return false;
}

// ===============================
// CAR MOVEMENT
// ===============================

function updateCar(delta) {

    const speed = 80;

    const forward = new THREE.Vector3(
        0,
        0,
        -1
    );

    forward.applyQuaternion(car.quaternion);

    if (keys["w"]) {
        car.position.add(
            forward.clone().multiplyScalar(speed * delta)
        );
    }

    if (keys["s"]) {
        car.position.add(
            forward.clone().multiplyScalar(-speed * delta)
        );
    }

    if (keys["a"]) {
        car.rotation.y += 2 * delta;
    }

    if (keys["d"]) {
        car.rotation.y -= 2 * delta;
    }

    // Keep car inside world
    const limit = WORLD_SIZE / 2 - 50;

    car.position.x =
        THREE.MathUtils.clamp(
            car.position.x,
            -limit,
            limit
        );

    car.position.z =
        THREE.MathUtils.clamp(
            car.position.z,
            -limit,
            limit
        );
}

// ===============================
// CAMERA
// ===============================

function updateCamera() {

    const cameraOffset = new THREE.Vector3(
        0,
        12,
        25
    );

    cameraOffset.applyQuaternion(
        car.quaternion
    );

    const targetPosition =
        car.position.clone().add(cameraOffset);

    camera.position.lerp(
        targetPosition,
        0.1
    );

    camera.lookAt(
        car.position.x,
        car.position.y + 2,
        car.position.z
    );
}

// ===============================
// UI
// ===============================

function updateKillUI() {

    document.getElementById("killCount").textContent =
        pigsKilled.toLocaleString();
}

function updateBossUI() {

    const healthPercent =
        bossHealth / BOSS_MAX_HEALTH * 100;

    document.getElementById("bossHealth").style.width =
        `${healthPercent}%`;

    document.getElementById("bossHealthText").textContent =
        bossHealth.toLocaleString();
}

// ===============================
// INPUT
// ===============================

window.addEventListener("keydown", event => {

    keys[event.key.toLowerCase()] = true;

});

window.addEventListener("keyup", event => {

    keys[event.key.toLowerCase()] = false;

});

window.addEventListener("mousedown", event => {

    if (event.button === 0) {
        fireCannonball();
    }

});

// ===============================
// RESIZE
// ===============================

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// ===============================
// GAME LOOP
// ===============================

let previousTime = performance.now();

function gameLoop() {

    requestAnimationFrame(gameLoop);

    const currentTime = performance.now();

    const delta =
        Math.min(
            (currentTime - previousTime) / 1000,
            0.05
        );

    previousTime = currentTime;

    updateCar(delta);
    updateCamera();

    // Move cannonballs
    for (let i = cannonballs.length - 1; i >= 0; i--) {

        const ball = cannonballs[i];

        ball.position.add(
            ball.userData.velocity
                .clone()
                .multiplyScalar(delta)
        );

        ball.userData.life -= delta;

        const hit =
            checkCannonballHits(ball);

        if (
            hit ||
            ball.userData.life <= 0
        ) {

            scene.remove(ball);

            cannonballs.splice(i, 1);
        }
    }

    renderer.render(
        scene,
        camera
    );
}

// ===============================
// START
// ===============================

updateKillUI();
updateBossUI();
gameLoop();
