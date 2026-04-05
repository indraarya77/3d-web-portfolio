document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Mobile Menu Toggle ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
        });
    });

    // --- 2. Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 5, 5, 0.85)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.6)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
        }
    });

    // --- 3. Scroll Reveal & Skill Bar Animation via Intersection Observer ---
    const revealElements = document.querySelectorAll('.reveal');
    const skillFills = document.querySelectorAll('.skill-fill');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it contains skill bars, animate them
                const bars = entry.target.querySelectorAll('.skill-fill');
                bars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width');
                });
                
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // --- 4. Custom 3D Tilt Effect for Cards ---
    const tiltCards = document.querySelectorAll('.js-tilt-element');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            // Add smooth transition back
            card.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                card.style.transition = ''; // Remove to prevent lag on next enter
            }, 500);
        });
    });

    // --- 4.5. Auto Slider & Manual Navigation ---
    const sliders = document.querySelectorAll('.auto-slider');
    sliders.forEach(slider => {
        const images = slider.querySelectorAll('.slide-img');
        if (images.length <= 1) {
            // Hide navigation if only 1 image
            const btns = slider.querySelectorAll('.slider-prev, .slider-next');
            btns.forEach(btn => btn.style.display = 'none');
            return;
        }

        let currentIndex = 0;
        let slideInterval;

        const showImage = (index) => {
            images.forEach(img => {
                img.classList.remove('opacity-100');
                img.classList.add('opacity-0');
            });
            images[index].classList.remove('opacity-0');
            images[index].classList.add('opacity-100');
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        };

        const startSlider = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 3500);
        };

        startSlider();

        // Control buttons
        const btnNext = slider.querySelector('.slider-next');
        const btnPrev = slider.querySelector('.slider-prev');

        if (btnNext) {
            btnNext.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
                startSlider();
            });
        }
        
        if (btnPrev) {
            btnPrev.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
                startSlider();
            });
        }
    });

    // --- 5. Three.js Background Implementation ---
    initThreeJS();
});

function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    
    // Scene setup
    const scene = new THREE.Scene();
    // Fog to fade out particles in the distance
    scene.fog = new THREE.FogExp2(0x050505, 0.001);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Perf optimization

    // 1. Particle System (Ambient Dust)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color(0x00f0ff); // Cyan
    const color2 = new THREE.Color(0x8a2be2); // Purple

    for(let i = 0; i < particlesCount * 3; i+=3) {
        // Spread widely across the scene
        posArray[i] = (Math.random() - 0.5) * 100;     // x
        posArray[i+1] = (Math.random() - 0.5) * 100;   // y
        posArray[i+2] = (Math.random() - 0.5) * 100;   // z

        // Mix colors randomly
        const mixedColor = color1.clone().lerp(color2, Math.random());
        colorsArray[i] = mixedColor.r;
        colorsArray[i+1] = mixedColor.g;
        colorsArray[i+2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    // Custom circular texture for particles
    const createCircleTexture = () => {
        const matCanvas = document.createElement('canvas');
        matCanvas.width = 32;
        matCanvas.height = 32;
        const ctx = matCanvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        return new THREE.CanvasTexture(matCanvas);
    };

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.3,
        map: createCircleTexture(),
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);


    // 2. Abstract Geometric Object (Hero Section visually)
    const abstractGroup = new THREE.Group();
    
    // Outer wireframe Icosahedron
    const geoOuter = new THREE.IcosahedronGeometry(8, 1);
    const matOuter = new THREE.MeshBasicMaterial({
        color: 0x8a2be2, // Purple
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const meshOuter = new THREE.Mesh(geoOuter, matOuter);
    
    // Inner solid Torus Knot
    const geoInner = new THREE.TorusKnotGeometry(4, 1.2, 100, 16);
    const matInner = new THREE.MeshStandardMaterial({
        color: 0x050505,
        emissive: 0x00f0ff, // Cyan glow
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8
    });
    const meshInner = new THREE.Mesh(geoInner, matInner);

    abstractGroup.add(meshOuter);
    abstractGroup.add(meshInner);
    
    // Position it to the right for Desktop, center for mobile
    const updateObjectPosition = () => {
        if (window.innerWidth > 1024) {
            abstractGroup.position.x = 12;
            abstractGroup.position.y = 2;
        } else {
            abstractGroup.position.x = 0;
            abstractGroup.position.y = -5; // Move down to not block text
        }
    };
    updateObjectPosition();
    scene.add(abstractGroup);

    // 3. Lighting for the inner object
    const pointLight1 = new THREE.PointLight(0x00f0ff, 2, 50);
    pointLight1.position.set(10, 10, 10);
    const pointLight2 = new THREE.PointLight(0x8a2be2, 2, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight1, pointLight2);

    // Interaction state
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Scroll Parallax connection
    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Resize handling
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        updateObjectPosition();
    });

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotate Particle System slowly
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        // Mouse interactivity (smooth follow)
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        abstractGroup.rotation.y += 0.01 + (targetX - abstractGroup.rotation.y) * 0.05;
        abstractGroup.rotation.x += 0.01 + (targetY - abstractGroup.rotation.x) * 0.05;

        // Inner knot custom rotation
        meshInner.rotation.x = elapsedTime * 0.2;
        meshInner.rotation.y = elapsedTime * 0.3;

        // Scroll parallax: Move group up as you scroll down
        // Also scale it down slightly so it disappears nicely
        abstractGroup.position.y = (window.innerWidth > 1024 ? 2 : -5) + (scrollY * -0.01);
        particlesMesh.position.y = scrollY * -0.005; // Slower parallax for background

        renderer.render(scene, camera);
    };

    animate();
}
