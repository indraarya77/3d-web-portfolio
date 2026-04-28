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


    // --- Procedural Texture Generation (For Realism) ---
    function createTechTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#444';
        ctx.fillRect(0, 0, 1024, 1024);

        ctx.strokeStyle = '#111';
        ctx.lineWidth = 3;
        for(let i = 0; i < 1024; i += 64) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1024); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke();
        }

        for(let i = 0; i < 300; i++) {
            const shade = Math.floor(Math.random() * 80) + 20; 
            ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
            const x = Math.floor(Math.random() * 16) * 64;
            const y = Math.floor(Math.random() * 16) * 64;
            const w = Math.floor(Math.random() * 4 + 1) * 64;
            const h = Math.floor(Math.random() * 4 + 1) * 64;
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    function createEnvTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#010205');
        grad.addColorStop(0.5, '#051025');
        grad.addColorStop(1, '#010205');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(200, 200, 150, 30);
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(700, 150, 100, 20);
        ctx.fillStyle = '#0055ff';
        ctx.fillRect(400, 300, 250, 50);

        const tex = new THREE.CanvasTexture(canvas);
        tex.mapping = THREE.EquirectangularReflectionMapping;
        return tex;
    }

    scene.environment = createEnvTexture();

    // --- 4. The Main Object (Realistic Futuristic Core) ---
    const coreGroup = new THREE.Group();
    
    // Position it to the right for Desktop, center for mobile
    const updateObjectPosition = () => {
        if (window.innerWidth > 1024) {
            coreGroup.position.x = 14.5; // Digeser sedikit ke tengah untuk menghindari distorsi lensa (lonjong) di ujung layar
            coreGroup.position.y = -2.5;
        } else {
            coreGroup.position.x = 0;
            coreGroup.position.y = -5; // Move down to not block text
        }
    };
    updateObjectPosition();
    scene.add(coreGroup);

    const coreRadius = 6.5; // Diperbesar lagi dari 5.5
    const panelTex = createTechTexture();

    // A. Inner Metallic Core (Realistic PBR Material)
    const sphereGeo = new THREE.SphereGeometry(coreRadius, 128, 128);
    const sphereMat = new THREE.MeshPhysicalMaterial({
        color: 0x030815,
        metalness: 1.0,
        roughness: 0.5,
        bumpMap: panelTex,
        bumpScale: 0.04,
        roughnessMap: panelTex,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2
    });
    const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    coreGroup.add(coreSphere);

    // B. Glowing Circuit/Energy Grid 
    const gridGeo = new THREE.IcosahedronGeometry(coreRadius + 0.1, 4);
    const gridMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });
    const coreGrid = new THREE.Mesh(gridGeo, gridMat);
    coreGroup.add(coreGrid);

    // C. Refractive Outer Glass Shell
    const glassGeo = new THREE.SphereGeometry(coreRadius + 0.25, 64, 64);
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x00bbff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 1.0,
        ior: 1.4,
        thickness: 1.5,
        transparent: true,
        opacity: 1.0,
        side: THREE.FrontSide
    });
    const glassSphere = new THREE.Mesh(glassGeo, glassMat);
    coreGroup.add(glassSphere);

    // D. Animated Light Pulses (Energy Nodes)
    const nodesGroup = new THREE.Group();
    coreGroup.add(nodesGroup);
    const nodeCount = 60;
    const nodeGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({
        color: 0x88ffff,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const nodesData = [];
    for (let i = 0; i < nodeCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / nodeCount);
        const theta = Math.sqrt(nodeCount * Math.PI) * phi;
        const node = new THREE.Mesh(nodeGeo, nodeMat.clone());
        
        const r = coreRadius + 0.15;
        node.position.setFromSphericalCoords(r, phi, theta);
        
        nodesGroup.add(node);
        nodesData.push({ mesh: node, speed: 0.5 + Math.random() * 2, offset: Math.random() * Math.PI * 2 });
    }

    // E. Realistic Orbit Rings
    const createRing = (radius, thickness, color, roughness, rotX, rotY) => {
        const ringGeo = new THREE.TorusGeometry(radius, thickness, 16, 128);
        const ringMat = new THREE.MeshPhysicalMaterial({
            color: color,
            metalness: 1.0,
            roughness: roughness,
            clearcoat: 1.0,
            emissive: color,
            emissiveIntensity: 0.3 // Diturunkan dari 0.8 agar tidak terlalu menyala, tapi lebih terlihat dari versi awal
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.set(rotX, rotY, 0);
        return ring;
    };

    const ring1 = createRing(coreRadius + 1.8, 0.04, 0x00ffff, 0.2, Math.PI / 2.5, 0);
    const ring2 = createRing(coreRadius + 3.0, 0.02, 0x0055ff, 0.4, -Math.PI / 3, Math.PI / 4);
    const ring3 = createRing(coreRadius + 4.0, 0.01, 0x88ccff, 0.1, 0, Math.PI / 6);
    coreGroup.add(ring1, ring2, ring3);

    // F. Custom Fresnel Glow Shader
    const glowGeo = new THREE.SphereGeometry(coreRadius + 1.2, 64, 64);
    const glowMat = new THREE.ShaderMaterial({
        uniforms: {
            "c": { type: "f", value: 0.1 },
            "p": { type: "f", value: 3.5 },
            glowColor: { type: "c", value: new THREE.Color(0x0055ff) },
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader: `
            uniform vec3 viewVector;
            uniform float c;
            uniform float p;
            varying float intensity;
            void main() {
                vec3 vNormal = normalize( normalMatrix * normal );
                vec3 vNormel = normalize( normalMatrix * viewVector );
                intensity = pow( max(0.0, c - dot(vNormal, vNormel)), p );
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
                vec3 glow = glowColor * intensity;
                gl_FragColor = vec4( glow, intensity * 0.8 );
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    coreGroup.add(glowMesh);

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
        
        coreGroup.rotation.y += 0.01 + (targetX - coreGroup.rotation.y) * 0.05;
        coreGroup.rotation.x += 0.01 + (targetY - coreGroup.rotation.x) * 0.05;

        // Rotate core elements
        coreSphere.rotation.y += 0.001;
        glassSphere.rotation.y += 0.001;
        coreGrid.rotation.y += 0.002;
        coreGrid.rotation.z += 0.001;
        nodesGroup.rotation.y += 0.001;

        // Rotate Rings
        ring1.rotation.z += 0.002;
        ring2.rotation.z -= 0.003;
        ring3.rotation.y += 0.001;
        ring3.rotation.x -= 0.002;

        nodesData.forEach(data => {
            const pulse = 0.5 + 0.5 * Math.sin(elapsedTime * data.speed + data.offset);
            data.mesh.scale.setScalar(pulse);
            data.mesh.material.opacity = pulse;
        });

        // Update glow shader view vector
        const viewVector = new THREE.Vector3().subVectors(camera.position, coreGroup.position);
        glowMat.uniforms.viewVector.value = viewVector;

        // Scroll parallax: Move group up as you scroll down
        // Also scale it down slightly so it disappears nicely
        coreGroup.position.y = (window.innerWidth > 1024 ? -2.5 : -5) + (scrollY * -0.01);
        particlesMesh.position.y = scrollY * -0.005; // Slower parallax for background

        renderer.render(scene, camera);
    };

    animate();
}
