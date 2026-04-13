const planets = document.querySelectorAll(".planetBtn");
const slider = document.getElementById("speedSlider");
const btn = document.getElementById("toggleBtn");

let running = true;
let speed = Math.max(1, Number(slider.value));

// orbit radii (must match your CSS orbit sizes / 2)
const radius = [60, 90, 120, 150, 180, 210, 240, 270];

// base angular speeds (smaller = slower planet)
const baseSpeed = [0.02, 0.015, 0.01, 0.008, 0.006, 0.005, 0.004, 0.003];

// starting angles
let angles = new Array(planets.length).fill(0);

function animate() {
    if (running) {
        planets.forEach((planet, i) => {
            angles[i] += baseSpeed[i] * (speed / 10);

            const x = radius[i] * Math.cos(angles[i]);
            const y = radius[i] * Math.sin(angles[i]);

            planet.style.transform =
                `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        });
    }

    requestAnimationFrame(animate);
}

animate();

// slider control
slider.addEventListener("input", () => {
    speed = Math.max(1, Number(slider.value));
});

// start/stop button
btn.addEventListener("click", () => {
    running = !running;
    btn.innerText = running ? "⏸ Stop" : "▶ Start";
});