// Rotating Lorenz attractor thingy
//
// This is a re-creation of my original demo made in 80's.
// Back then it was coded in assembly for Amiga 500 and PC/486, Motorola MC68k and Intel i486
// respectively, and took few weeks time to finish so that it played perfectly smoothly.
// Those machines were seriously limited by CPU power and all kinds of tricks needed to be utilized,
// like calculating only single new point per loop and using fixed point arithmetics, to name few.
// The task of redrawing and 3D-rotating this many points during each frame refresh (25 fps iirc)
// was huge task alone and the process consumed almost every cycle from the CPU.
//
// Now the coding took less than hour and composes much less code thanks to advanced THREE.js graphics,
// and there is no observable CPU load in the host (less than 1% in single core).
//
// For details see: en.wikipedia.org/wiki/Lorenz_system
//
// Copyright (C) 2024 Jari Kuokkanen / yarik@iki.fi
//

// Note: the parent document must have canvas defined with ID: overlayCanvas
//

// Parameters for the Lorenz Attractor
const sigma = 10.0;
const rho = 28.0;
const beta = 8.0 / 3.0;
const dt = 0.005;        // Time step
const maxPoints = 4000; // Max points for the ring buffer

const rotationBase = 0.22;          // Minimum rotation factor, base value for rotationCadence
let rotationAcceleration = 1.0;     // Rotation acceleration, cycles to 1.0 periodically
let rotationCadence = -800;         // Rotation cadence (rhythm), defines a cyclic period when rotation acceleration stays constant, ca. 1/3 of the time

const cameraBaseX = 0;              // Initial camera viewpoint
const cameraBaseY = -4;
const cameraBaseZ = 60;
let cameraZoom = 0;


// Arrays to store the points
let points = [];

// Initial values for Lorenz Attractor - these should be somewhere near the attractor and non-zero
let x = -1.1, y = -2.0, z = 18;
let drawIndex = 0;                  // Ring buffer index

// Generate a single Lorenz Attractor point, the last values are basis for each new value
function generateLorenzPoint() {
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;

    x += dx * dt;
    y += dy * dt;
    z += dz * dt;

    return [x, y, z];
}

// Initialize Three.js
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = 'overlayCanvas';
document.body.appendChild(renderer.domElement);

// Set camera position
camera.position.x = cameraBaseX;
camera.position.y = cameraBaseY;
camera.position.z = cameraBaseZ;

// Create an empty geometry for the Lorenz points
let geometry = new THREE.BufferGeometry();
let vertices = new Float32Array(maxPoints * 3); // x, y, z for each point

let totalX = .0, totalY = .0, totalZ = .0;

// Prefill the points so that the whole attractor can be seen from scene start
for (i = 0; i < maxPoints; i++) {
    let [newX, newY, newZ] = generateLorenzPoint();

    totalX += newX;
    totalY += newY;
    totalZ += newZ;
    
    // Update the current draw index in the vertices array (ring buffer)
    vertices[drawIndex * 3] = newX;      // x
    vertices[drawIndex * 3 + 1] = newY;  // y
    vertices[drawIndex * 3 + 2] = newZ;  // z

    // Move to the next point in the buffer
    drawIndex = (drawIndex + 1) % maxPoints;    // Wrap around when maxPoints is reached
}

// Calculate mass-center for pre-calculated points so that the attractor is centered
// Note that the center is not adjusted later so the attractor will travel off mass-center but the effect should be minimal if the starting point is near the attractor
let centerX = totalX / maxPoints;
let centerY = totalY / maxPoints;
let centerZ = totalZ / maxPoints;

for (i = 0; i < maxPoints; i++) {
    vertices[i * 3] -= centerX;         // Adjust x
    vertices[i * 3 + 1] -= centerY;     // Adjust y
    vertices[i * 3 + 2] -= centerZ;     // Adjust y
}

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

// Shader: Vertex and Fragment shaders for brightness adjustment
const vertexShader = `
    varying float vDistance;
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vDistance = -mvPosition.z;
        gl_PointSize = 2.5;                             // Size of each point
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
    varying float vDistance;
    void main() {
        // Calculate the distance from the center of the point
        vec2 coords = gl_PointCoord - vec2(0.5);
        float distance = length(coords);

        // Discard pixels that are outside a circle
        if (distance > 0.5) discard;

        // Calculate brightness based on distance (closer is brighter)
        float brightness = 1.0 - (vDistance / 240.0);   // Brightness scaling
        brightness = clamp(brightness, 0.1, 1.0);       // Clamp between 0.1 (darkest) and 1.0 (brightest)
        gl_FragColor = vec4(vec3(brightness), 1.0);     // Apply brightness to white color
    }
`;

// Create shader material using custom vertex and fragment shaders
let material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
});

// Create a Points object to render the Lorenz attractor
let lorenzAttractor = new THREE.Points(geometry, material);
scene.add(lorenzAttractor);


// Animate the scene
function animate() {

    requestAnimationFrame(animate);

    // Generate a new Lorenz attractor point
    let [newX, newY, newZ] = generateLorenzPoint();

    // Update the current draw index in the vertices array (ring buffer) while offsetting the new point to pre-calculated center
    vertices[drawIndex * 3] = newX - centerX;      // x
    vertices[drawIndex * 3 + 1] = newY - centerY;  // y
    vertices[drawIndex * 3 + 2] = newZ - centerZ;  // z

    // Move to the next point in the ring buffer
    drawIndex = (drawIndex + 1) % maxPoints;        // Wrap around when maxPoints is reached

    // Update the geometry with the new vertices
    geometry.attributes.position.needsUpdate = true;

    // Rotate the attractor
    lorenzAttractor.rotation.x += 0.005 + (rotationAcceleration / 800.0) * rotationBase;
    lorenzAttractor.rotation.y += 0.003 + (rotationAcceleration / 400.0) * rotationBase;
    lorenzAttractor.rotation.z += 0.001 + (rotationAcceleration / 1200.0) * rotationBase;

    rotationCadence++;
    if (rotationCadence % 1200 > 400)                                   // 400 cycles out of 1200 (1/3) without altering acceleration
    {
        rotationAcceleration += 1.0 + rotationAcceleration / 30.0;      // Increase acceleration progressively within a cycle
        if (rotationAcceleration > 200.0) rotationAcceleration = .0;
    }

    // Zoom cyclically, slowly back and forth, SIN is used for smooth direction change
    let zoomOffsetZ = Math.sin(rotationCadence / 600) * 25;    // Magic numbers: Divider makes the zoom slower if increased, factor determines the min/max positions on Z-axis
    camera.position.z = cameraBaseZ + zoomOffsetZ;

    renderer.render(scene, camera);
}

// Start the animation loop after a short delay
setTimeout(() => animate(), 1600);


// Adjust scene on window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


