# 🌌 CosmoSim – Interactive Solar System Simulation

## Overview

CosmoSim is a web-based application that simulates the solar system and provides detailed information about planets through an interactive and visually engaging interface. The project demonstrates the use of animation, data modeling, and dynamic rendering using modern web technologies.

---

## Features

* Real-time simulation of planetary motion
* Interactive user interface with hover and click actions
* Display of planetary data (orbital speed, rotation period, distance from the sun)
* Dynamic side panel with detailed information
* Search functionality for quick navigation
* Fullscreen simulation mode
* Dedicated pages for individual planets

---

## Tech Stack

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* DOM Manipulation
* Browser APIs 

---

## How It Works

The application uses trigonometric functions to simulate planetary motion. Each planet is assigned an orbital radius and angular velocity. The position is continuously updated using:

x = r cos(θ)
y = r sin(θ)

The animation loop is handled using `requestAnimationFrame()` for smooth performance. User interactions such as hovering and clicking dynamically update the interface.

---

## Project Structure

```
CosmoSim/
│── index.html
│── app.js
│── script.js
│── data.js
│── planet.js
│── app.css
│── images/
```

---

## Live Demo

https://mahekk-hub.github.io/Cosmosim/

---

## Limitations

* Uses simplified circular orbits
* Does not include real gravitational physics
* Limited to 2D visualization

---

## Future Enhancements

* 3D simulation using Three.js
* Elliptical orbits based on Kepler’s laws
* Planet comparison feature
* Integration with real-time space APIs
* Migration to React for better scalability

---

## References

* NASA Planetary Data – https://science.nasa.gov/
* MDN Web Docs
* W3Schools

---

## Author

Mahek Lapsiwala
Mayank

---
