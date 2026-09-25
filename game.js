import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// ==========================================
// KILL BIG P
// ==========================================

const WORLD_AREA = 10000000;
const WORLD_SIZE = Math.sqrt(WORLD_AREA);
const HALF_WORLD = WORLD_SIZE / 2;

const MAX_PIGS = 35;
const PIG_SIZE = 8;

const FIRE_RATE = 10;
const CANNONBALL_SPEED = 250;
const CANNONBALL_LIFETIME = 5000;

const KILLS_REQUIRED = 500;

const BOSS_MAX_HEALTH = 1000000;
const BOSS_DAMAGE = 200;

// ==========================================
// SCENE
// ==========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87bde8);

scene.fog = new THREE.Fog(
    0x87bde8,
    900,
    2200
);

// ==========================================
// CAMERA
// ==========================================

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
);

camera.position.set(
    0,
    20,
    32
);

// ==========================================
// RENDERER
// ==========================================

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.5)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

document.body.appendChild(
    renderer.domElement
);

// ==========================================
// LIGHTING
// ==========================================

const hemisphereLight =
    new THREE.HemisphereLight(
        0xffffff,
        0x557744,
        2.2
    );

scene.add(hemisphereLight);

const sun =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

sun.position.set(
    400,
    700,
    250
);

sun.castShadow = true;

sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;

sun.shadow.camera.left = -700;
sun.shadow.camera.right = 700;
sun.shadow.camera.top = 700;
sun.shadow.camera.bottom = -700;

scene.add(sun);

// ==========================================
// MATERIAL HELPER
// ==========================================

function makeMaterial(color) {

    return new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.9
    });
}

// ==========================================
// GROUND
// ==========================================

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            WORLD_SIZE,
            WORLD_SIZE
        ),
        makeMaterial(0x4e8b3a)
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);

// ==========================================
// OPTIMIZED GRASS
// ==========================================

const grassGroup =
    new THREE.Group();

scene.add(grassGroup);

const grassMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3d7d2f,
        side: THREE.DoubleSide,
        roughness: 1
    });

const grassGeometry =
    new THREE.PlaneGeometry(
        2.5,
        4
    );

const GRASS_COUNT = 700;
const GRASS_AREA = 700;

for (
    let i = 0;
    i < GRASS_COUNT;
    i++
) {

    const patch =
        new THREE.Group();

    const blade1 =
        new THREE.Mesh(
            grassGeometry,
            grassMaterial
        );

    const blade2 =
        new THREE.Mesh(
            grassGeometry,
            grassMaterial
        );

    blade1.rotation.y =
        Math.PI / 4;

    blade2.rotation.y =
        -Math.PI / 4;

    blade1.position.y = 2;
    blade2.position.y = 2;

    patch.add(blade1);
    patch.add(blade2);

    patch.position.set(
        (Math.random() - 0.5) *
            GRASS_AREA,

        0,

        (Math.random() - 0.5) *
            GRASS_AREA
    );

    const scale =
        0.7 +
        Math.random() * 0.8;

    patch.scale.set(
        scale,
        scale,
        scale
    );

    patch.rotation.y =
        Math.random() *
        Math.PI;

    grassGroup.add(patch);
}

// ==========================================
// CAR
// ==========================================

const car =
    new THREE.Group();

scene.add(car);

car.position.set(
    0,
    2,
    0
);

// ==========================================
// CAR MATERIALS
// ==========================================

const carBodyMaterial =
    makeMaterial(0x263238);

const carLowerMaterial =
    makeMaterial(0x111518);

const windowMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x172b35,
        roughness: 0.25,
        metalness: 0.15
    });

const tyreMaterial =
    makeMaterial(0x151515);

const rimMaterial =
    makeMaterial(0x777777);

const bumperMaterial =
    makeMaterial(0x202020);

const lightMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xfff1b0,
        emissive: 0xffc928,
        emissiveIntensity: 2
    });

// ==========================================
// CAR BODY
// ==========================================

const body =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            9,
            3.4,
            15
        ),
        carBodyMaterial
    );

body.position.y = 3;

body.castShadow = true;

car.add(body);

// ==========================================
// LOWER BODY
// ==========================================

const lowerBody =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            10,
            2.4,
            16
        ),
        carLowerMaterial
    );

lowerBody.position.y = 1.8;

lowerBody.castShadow = true;

car.add(lowerBody);

// ==========================================
// HOOD
// ==========================================

const hood =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            8.7,
            2,
            5
        ),
        carBodyMaterial
    );

hood.position.set(
    0,
    4.1,
    -4.3
);

hood.castShadow = true;

car.add(hood);

// ==========================================
// CABIN
// ==========================================

const cabin =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            8,
            4.5,
            6.5
        ),
        carBodyMaterial
    );

cabin.position.set(
    0,
    6.2,
    1.5
);

cabin.castShadow = true;

car.add(cabin);

// ==========================================
// WINDOWS
// ==========================================

const frontWindshield =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            7.4,
            2.6,
            0.25
        ),
        windowMaterial
    );

frontWindshield.position.set(
    0,
    6.4,
    -1.82
);

frontWindshield.rotation.x =
    -0.18;

car.add(frontWindshield);

const rearWindow =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            7.4,
            2.5,
            0.25
        ),
        windowMaterial
    );

rearWindow.position.set(
    0,
    6.4,
    4.8
);

rearWindow.rotation.x =
    0.18;

car.add(rearWindow);

for (
    const side of [-1, 1]
) {

    const sideWindow =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.25,
                2.6,
                5
            ),
            windowMaterial
        );

    sideWindow.position.set(
        side * 4.05,
        6.4,
        1.5
    );

    car.add(sideWindow);
}

// ==========================================
// BUMPERS
// ==========================================

const frontBumper =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            10.5,
            1.5,
            1.5
        ),
        bumperMaterial
    );

frontBumper.position.set(
    0,
    2.2,
    -8
);

frontBumper.castShadow = true;

car.add(frontBumper);

const rearBumper =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            10.5,
            1.5,
            1.5
        ),
        bumperMaterial
    );

rearBumper.position.set(
    0,
    2.2,
    8
);

car.add(rearBumper);

// ==========================================
// HEADLIGHTS
// ==========================================

for (
    const side of [-1, 1]
) {

    const light =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.3,
                1,
                0.35
            ),
            lightMaterial
        );

    light.position.set(
        side * 2.8,
        4,
        -7.65
    );

    car.add(light);
}

// ==========================================
// OFF-ROAD WHEELS
// ==========================================

const wheels = [];

function createWheel(x, z) {

    const wheel =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                2.5,
                2.5,
                1.7,
                12
            ),
            tyreMaterial
        );

    wheel.rotation.z =
        Math.PI / 2;

    wheel.position.set(
        x,
        2.4,
        z
    );

    wheel.castShadow = true;

    car.add(wheel);

    const rim =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                1.15,
                1.15,
                1.8,
                10
            ),
            rimMaterial
        );

    rim.rotation.z =
        Math.PI / 2;

    rim.position.set(
        x,
        2.4,
        z
    );

    car.add(rim);

    wheels.push(wheel);
}

createWheel(-5.2, -5);
createWheel(5.2, -5);
createWheel(-5.2, 5);
createWheel(5.2, 5);

// ==========================================
// ROOF RACK
// ==========================================

const roofRackMaterial =
    makeMaterial(0x151515);

for (
    const x of [-3.4, 3.4]
) {

    const bar =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.35,
                0.35,
                8
            ),
            roofRackMaterial
        );

    bar.position.set(
        x,
        8.65,
        1
    );

    car.add(bar);
}

const roofBar =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            7.2,
            0.35,
            0.35
        ),
        roofRackMaterial
    );

roofBar.position.set(
    0,
    8.65,
    -2
);

car.add(roofBar);

// ==========================================
// FICTIONAL PIG BLASTER
// ==========================================

const cannon =
    new THREE.Group();

cannon.position.set(
    0,
    5.5,
    -7
);

car.add(cannon);

const cannonBase =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            1.6,
            1.6,
            0.8,
            12
        ),
        bumperMaterial
    );

cannonBase.rotation.x =
    Math.PI / 2;

cannon.add(cannonBase);

const cannonTube =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.75,
            1,
            4,
            10
        ),
        makeMaterial(0x555555)
    );

cannonTube.rotation.x =
    Math.PI / 2;

cannonTube.position.z = -2;

cannon.add(cannonTube);

// ==========================================
// CAR CONTROLS
// ==========================================

const keys = {};

let carSpeed = 0;

const MAX_SPEED = 65;
const REVERSE_SPEED = 25;
const ACCELERATION = 45;
const STEERING_SPEED = 1.9;

window.addEventListener(
    "keydown",
    event => {
        keys[
            event.key.toLowerCase()
        ] = true;
    }
);

window.addEventListener(
    "keyup",
    event => {
        keys[
            event.key.toLowerCase()
        ] = false;
    }
);

// ==========================================
// PIG CREATION
// ==========================================

const pigs = [];

function createPig(
    position,
    size = PIG_SIZE
) {

    const pig =
        new THREE.Group();

    pig.userData.isPig = true;
    pig.userData.alive = true;
    pig.userData.isBoss = false;

    const pink =
        makeMaterial(0xf49aaa);

    const darkPink =
        makeMaterial(0xd96f83);

    const black =
        makeMaterial(0x111111);

    // BODY
    const body =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                size * 0.65,
                12,
                8
            ),
            pink
        );

    body.scale.set(
        1.3,
        0.9,
        1.6
    );

    body.position.y =
        size * 0.85;

    body.castShadow = true;

    pig.add(body);

    // HEAD
    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                size * 0.45,
                12,
                8
            ),
            pink
        );

    head.position.set(
        0,
        size * 1.15,
        -size * 0.85
    );

    head.castShadow = true;

    pig.add(head);

    // SNOUT
    const snout =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                size * 0.25,
                10,
                6
            ),
            darkPink
        );

    snout.scale.z = 0.6;

    snout.position.set(
        0,
        size * 1.1,
        -size * 1.2
    );

    pig.add(snout);

    // EYES
    for (
        const x of [-0.17, 0.17]
    ) {

        const eye =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    size * 0.07,
                    8,
                    6
                ),
                black
            );

        eye.position.set(
            x * size,
            size * 1.38,
            -size * 1.05
        );

        pig.add(eye);
    }

    // EARS
    for (
        const x of [-1, 1]
    ) {

        const ear =
            new THREE.Mesh(
                new THREE.ConeGeometry(
                    size * 0.18,
                    size * 0.45,
                    6
                ),
                pink
            );

        ear.position.set(
            x * size * 0.3,
            size * 1.55,
            -size * 0.85
        );

        ear.rotation.z =
            x * -0.5;

        pig.add(ear);
    }

    // LEGS
    const legs = [];

    const legPositions = [
        [-size * 0.42, size * 0.35, -size * 0.45],
        [size * 0.42, size * 0.35, -size * 0.45],
        [-size * 0.42, size * 0.35, size * 0.5],
        [size * 0.42, size * 0.35, size * 0.5]
    ];

    for (
        const positionData of legPositions
    ) {

        const leg =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    size * 0.13,
                    size * 0.16,
                    size * 0.75,
                    8
                ),
                pink
            );

        leg.position.set(
            positionData[0],
            positionData[1],
            positionData[2]
        );

        leg.castShadow = true;

        pig.add(leg);

        legs.push(leg);
    }

    // TAIL
    const tail =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                size * 0.18,
                size * 0.07,
                6,
                8
            ),
            pink
        );

    tail.position.set(
        0,
        size * 1.05,
        size * 1.05
    );

    tail.rotation.x =
        Math.PI / 2;

    pig.add(tail);

    pig.userData.legs = legs;

    pig.userData.walkTime =
        Math.random() *
        Math.PI *
        2;

    pig.position.copy(position);

    scene.add(pig);

    pigs.push(pig);

    return pig;
}

// ==========================================
// RANDOM PIG SPAWN
// ==========================================

function randomPigPosition() {

    const angle =
        Math.random() *
        Math.PI *
        2;

    const distance =
        180 +
        Math.random() *
        1200;

    return new THREE.Vector3(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
    );
}

// ==========================================
// CREATE PIGS
// ==========================================

for (
    let i = 0;
    i < MAX_PIGS;
    i++
) {

    createPig(
        randomPigPosition()
    );
}

// ==========================================
// PIG AI
// ==========================================

function updatePigs(delta) {

    if (bossStarted) {
        return;
    }

    for (
        const pig of pigs
    ) {

        if (
            !pig.userData.alive ||
            !pig.visible
        ) {
            continue;
        }

        const direction =
            new THREE.Vector3()
                .subVectors(
                    car.position,
                    pig.position
                );

        const distance =
            direction.length();

        if (
            distance < 900
        ) {

            direction.normalize();

            pig.position.x +=
                direction.x *
                12 *
                delta;

            pig.position.z +=
                direction.z *
                12 *
                delta;

            const targetRotation =
                Math.atan2(
                    direction.x,
                    direction.z
                );

            let rotationDifference =
                targetRotation -
                pig.rotation.y;

            while (
                rotationDifference >
                Math.PI
            ) {
                rotationDifference -=
                    Math.PI * 2;
            }

            while (
                rotationDifference <
                -Math.PI
            ) {
                rotationDifference +=
                    Math.PI * 2;
            }

            pig.rotation.y +=
                rotationDifference *
                Math.min(
                    delta * 6,
                    1
                );

            // RUNNING ANIMATION
            pig.userData.walkTime +=
                delta * 12;

            const legs =
                pig.userData.legs;

            for (
                let i = 0;
                i < legs.length;
                i++
            ) {

                const offset =
                    i % 2 === 0
                        ? 0
                        : Math.PI;

                legs[i].rotation.x =
                    Math.sin(
                        pig.userData.walkTime +
                        offset
                    ) * 0.45;
            }
        }
    }
}

// ==========================================
// CANNONBALLS
// ==========================================

const cannonballs = [];

const cannonballGeometry =
    new THREE.SphereGeometry(
        1.2,
        8,
        8
    );

const cannonballMaterial =
    makeMaterial(0x202020);

function fireCannonball() {

    const ball =
        new THREE.Mesh(
            cannonballGeometry,
            cannonballMaterial
        );

    const direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );

    direction.applyQuaternion(
        car.quaternion
    );

    ball.position.copy(
        cannon.getWorldPosition(
            new THREE.Vector3()
        )
    );

    ball.position.add(
        direction.clone()
            .multiplyScalar(5)
    );

    ball.userData.velocity =
        direction.multiplyScalar(
            CANNONBALL_SPEED
        );

    ball.userData.created =
        performance.now();

    scene.add(ball);

    cannonballs.push(ball);
}

// ==========================================
// HOLD MOUSE TO RAPID FIRE
// ==========================================

let mouseHeld = false;
let lastShot = 0;

window.addEventListener(
    "mousedown",
    event => {

        if (
            event.button === 0
        ) {

            mouseHeld = true;

            // Fire immediately
            const now =
                performance.now();

            lastShot =
                now;

            fireCannonball();
        }
    }
);

window.addEventListener(
    "mouseup",
    event => {

        if (
            event.button === 0
        ) {

            mouseHeld = false;
        }
    }
);

window.addEventListener(
    "mouseleave",
    () => {

        mouseHeld = false;
    }
);

function updateShooting() {

    if (!mouseHeld) {
        return;
    }

    const now =
        performance.now();

    const delay =
        1000 / FIRE_RATE;

    if (
        now - lastShot >=
        delay
    ) {

        lastShot = now;

        fireCannonball();
    }
}

// ==========================================
// KILL PIG
// ==========================================

let pigsKilled = 0;

function killPig(pig) {

    if (
        !pig.userData.alive ||
        bossStarted
    ) {
        return;
    }

    pig.userData.alive = false;

    pigsKilled++;

    const killCount =
        document.getElementById(
            "killCount"
        );

    if (killCount) {

        killCount.textContent =
            pigsKilled;
    }

    // Simple cartoon fall
    pig.rotation.x =
        Math.random() * 1.5;

    pig.rotation.z =
        Math.random() * 1.5;

    pig.position.y = 1;

    setTimeout(
        () => {

            pig.visible = false;

        },
        5000
    );

    setTimeout(
        () => {

            if (bossStarted) {
                return;
            }

            pig.position.copy(
                randomPigPosition()
            );

            pig.rotation.set(
                0,
                0,
                0
            );

            pig.userData.alive =
                true;

            pig.visible = true;

        },
        5500
    );

    if (
        pigsKilled >=
        KILLS_REQUIRED
    ) {

        startBoss();
    }
}

// ==========================================
// BIG P BOSS
// ==========================================

let boss = null;
let bossStarted = false;
let bossHealth =
    BOSS_MAX_HEALTH;

function createBoss() {

    boss =
        createPig(
            new THREE.Vector3(
                0,
                0,
                -500
            ),
            15
        );

    boss.userData.isBoss =
        true;

    boss.scale.set(
        1.5,
        1.5,
        1.5
    );

    return boss;
}

function startBoss() {

    if (bossStarted) {
        return;
    }

    bossStarted = true;

    for (
        const pig of pigs
    ) {

        if (
            !pig.userData.isBoss
        ) {

            pig.visible = false;
        }
    }

    bossHealth =
        BOSS_MAX_HEALTH;

    createBoss();

    const bossUI =
        document.getElementById(
            "bossUI"
        );

    if (bossUI) {

        bossUI.style.display =
            "block";
    }

    showMessage(
        "⚠️ BIG P HAS ARRIVED ⚠️"
    );

    updateBossUI();
}

function damageBoss() {

    if (
        !bossStarted ||
        !boss ||
        bossHealth <= 0
    ) {
        return;
    }

    bossHealth -=
        BOSS_DAMAGE;

    if (
        bossHealth < 0
    ) {

        bossHealth = 0;
    }

    updateBossUI();

    if (
        bossHealth === 0
    ) {

        boss.visible = false;

        showMessage(
            "🏆 BIG P DEFEATED!"
        );
    }
}

function updateBossUI() {

    const healthBar =
        document.getElementById(
            "bossHealth"
        );

    const healthText =
        document.getElementById(
            "bossHealthText"
        );

    if (healthBar) {

        const percentage =
            (
                bossHealth /
                BOSS_MAX_HEALTH
            ) * 100;

        healthBar.style.width =
            percentage + "%";
    }

    if (healthText) {

        healthText.textContent =
            bossHealth.toLocaleString();
    }
}

// ==========================================
// MESSAGE
// ==========================================

function showMessage(text) {

    const message =
        document.getElementById(
            "message"
        );

    if (!message) {
        return;
    }

    message.textContent =
        text;

    setTimeout(
        () => {

            message.textContent =
                "";

        },
        3000
    );
}

// ==========================================
// CANNONBALL COLLISIONS
// ==========================================

function checkCannonballHits() {

    for (
        let i =
            cannonballs.length - 1;
        i >= 0;
        i--
    ) {

        const ball =
            cannonballs[i];

        let hit = false;

        // BIG P
        if (
            bossStarted &&
            boss &&
            boss.visible &&
            bossHealth > 0
        ) {

            const distance =
                ball.position.distanceTo(
                    boss.position
                );

            if (
                distance < 25
            ) {

                damageBoss();

                hit = true;
            }
        }

        // NORMAL PIGS
        if (!bossStarted) {

            for (
                const pig of pigs
            ) {

                if (
                    !pig.userData.alive ||
                    !pig.visible
                ) {
                    continue;
                }

                const distance =
                    ball.position.distanceTo(
                        pig.position
                    );

                if (
                    distance < 18
                ) {

                    killPig(pig);

                    hit = true;

                    break;
                }
            }
        }

        if (hit) {

            scene.remove(ball);

            cannonballs.splice(
                i,
                1
            );

            continue;
        }

        if (
            performance.now() -
            ball.userData.created >
            CANNONBALL_LIFETIME
        ) {

            scene.remove(ball);

            cannonballs.splice(
                i,
                1
            );
        }
    }
}

// ==========================================
// UPDATE CANNONBALLS
// ==========================================

function updateCannonballs(delta) {

    for (
        const ball of cannonballs
    ) {

        ball.position.add(
            ball.userData.velocity
                .clone()
                .multiplyScalar(delta)
        );
    }
}

// ==========================================
// CAR MOVEMENT
// ==========================================

function updateCar(delta) {

    const forward =
        keys["w"];

    const reverse =
        keys["s"];

    const left =
        keys["a"];

    const right =
        keys["d"];

    if (forward) {

        carSpeed +=
            45 * delta;

    } else if (reverse) {

        carSpeed -=
            45 * delta;

    } else {

        carSpeed *=
            Math.pow(
                0.08,
                delta
            );
    }

    carSpeed =
        THREE.MathUtils.clamp(
            carSpeed,
            -REVERSE_SPEED,
            MAX_SPEED
        );

    if (
        Math.abs(carSpeed) > 1
    ) {

        let steering = 0;

        if (left) {
            steering += 1;
        }

        if (right) {
            steering -= 1;
        }

        car.rotation.y +=
            steering *
            STEERING_SPEED *
            delta *
            Math.min(
                Math.abs(carSpeed) /
                    MAX_SPEED,
                1
            );
    }

    const direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );

    direction.applyQuaternion(
        car.quaternion
    );

    car.position.add(
        direction.multiplyScalar(
            carSpeed * delta
        )
    );

    // Keep inside map
    const limit =
        HALF_WORLD - 100;

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

    // Suspension
    car.position.y =
        2 +
        Math.sin(
            performance.now() *
                0.008
        ) *
        Math.min(
            Math.abs(carSpeed) /
                100,
            0.12
        );

    // Wheel rotation
    for (
        const wheel of wheels
    ) {

        wheel.rotation.x +=
            carSpeed *
            delta *
            0.25;
    }
}

// ==========================================
// CAMERA
// ==========================================

const cameraOffset =
    new THREE.Vector3(
        0,
        20,
        32
    );

function updateCamera() {

    const desired =
        cameraOffset
            .clone()
            .applyQuaternion(
                car.quaternion
            )
            .add(
                car.position
            );

    camera.position.lerp(
        desired,
        0.08
    );

    const target =
        car.position.clone();

    target.y += 4;

    camera.lookAt(target);
}

// ==========================================
// GRASS VISIBILITY
// ==========================================

function updateGrassVisibility() {

    const maxDistance = 650;

    const carX =
        car.position.x;

    const carZ =
        car.position.z;

    for (
        const patch of
        grassGroup.children
    ) {

        const dx =
            patch.position.x -
            carX;

        const dz =
            patch.position.z -
            carZ;

        const distanceSquared =
            dx * dx +
            dz * dz;

        patch.visible =
            distanceSquared <
            maxDistance *
            maxDistance;
    }
}

// ==========================================
// GRASS RECYCLING
// ==========================================

function recycleGrass() {

    const recycleDistance =
        800;

    for (
        const patch of
        grassGroup.children
    ) {

        const dx =
            patch.position.x -
            car.position.x;

        const dz =
            patch.position.z -
            car.position.z;

        if (
            Math.abs(dx) >
                recycleDistance ||
            Math.abs(dz) >
                recycleDistance
        ) {

            patch.position.x =
                car.position.x +
                (Math.random() - 0.5) *
                    1000;

            patch.position.z =
                car.position.z +
                (Math.random() - 0.5) *
                    1000;

            patch.position.x =
                THREE.MathUtils.clamp(
                    patch.position.x,
                    -HALF_WORLD + 50,
                    HALF_WORLD - 50
                );

            patch.position.z =
                THREE.MathUtils.clamp(
                    patch.position.z,
                    -HALF_WORLD + 50,
                    HALF_WORLD - 50
                );

            patch.visible = true;
        }
    }
}

// ==========================================
// RESIZE
// ==========================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                1.5
            )
        );
    }
);

// ==========================================
// MAIN GAME LOOP
// ==========================================

const clock =
    new THREE.Clock();

function animate() {

    requestAnimationFrame(
        animate
    );

    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );

    updateCar(delta);

    updatePigs(delta);

    updateShooting();

    updateCannonballs(delta);

    checkCannonballHits();

    updateCamera();

    updateGrassVisibility();

    recycleGrass();

    renderer.render(
        scene,
        camera
    );
}

animate();

console.log(
    "🐷 KILL BIG P loaded!"
);

console.log(
    "🌱 Optimized grass loaded!"
);

console.log(
    "🚙 Off-road car loaded!"
);

console.log(
    "💥 Hold LEFT CLICK to rapid fire!"
);

console.log(
    "Boss requires 5000 successful hits."
);
