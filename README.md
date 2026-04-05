# 3D Web Portfolio

A high-end, dynamic, and fully responsive personal web portfolio template featuring 3D visualizations using Three.js and modern UI implementation using Tailwind CSS. This project was initially generated and has been refactored into a structured frontend codebase.

## 🚀 Features

- **3D Background Canvas**: Interactive and animated background with ambient particles and abstract geometric objects powered by Three.js.
- **Glassmorphism UI**: Modern frosted glass effect applied on navigation and cards, providing a sleek premium look.
- **Responsive Design**: Tailored layout for mobile, tablet, and desktop viewing sizes. Includes a toggleable mobile menu.
- **Smooth Animations**: Scroll-reveal text and sections, 3D tilt effects on project cards, and smooth hovering components.
- **Dynamic Technologies**: 
  - HTML5 & CSS3 with Vanilla JavaScript
  - [Tailwind CSS](https://tailwindcss.com/) (imported via CDN) for rapid utility-first styling
  - [Three.js](https://threejs.org/) for the WebGL 3D context
  - [Font Awesome](https://fontawesome.com/) for scalable vector icons

## 📁 Project Structure

The project has been structured for better maintainability:

```text
3d-web-portfolio/
│
├── index.html              # Main HTML entry point.
├── README.md               # Project documentation.
│
├── css/
│   └── style.css           # Custom CSS (Glassmorphism, Scrollbars, Animations).
│
└── js/
    ├── main.js             # Interactions, IntersectObservers, and Three.js logic.
    └── tailwind-config.js  # Tailwind CSS theme extension configurations.
```

## 🛠️ Setup & Usage

To run this project locally, simply open the `index.html` file in your preferred web browser, or use a local development server for a better experience.

**Using simple local server (requires Python or Node):**

- **Option A: Python 3**
  ```bash
  python -m http.server 8000
  ```
  Then visit `http://localhost:8000`

- **Option B: Node.js (via npx runner)**
  ```bash
  npx http-server .
  ```
  Then visit `http://localhost:8080`

## 👨‍💻 Development and Customization

- **Updating the 3D Object**: Open `js/main.js` and modify the `initThreeJS()` function to tweak the geometric shape, colors, or particle speed.
- **Changing Colors**: You can update the main theme colors in `js/tailwind-config.js`. The gradients and glass features use these defined colors (like `#00f0ff` neon cyan).
- **Adding Projects**: Edit the `<section id="projects">` in `index.html` by duplicating existing `<div class="glass-card">` components. Make sure they have the `js-tilt-element` class to maintain the 3D hover effect.

## 📄 License

This template is free to use and modify for your personal usage.
