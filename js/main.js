document.addEventListener('DOMContentLoaded', () => {

    // ========== 1. DARK / LIGHT THEME TOGGLE ==========
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    htmlEl.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    // ========== 2. MOBILE HAMBURGER MENU ==========
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // ========== 3. SCROLLSPY — ACTIVE NAV LINKS ==========
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    function highlightNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const top = section.offsetTop - 100;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);

    // ========== 4. FADE-IN ON SCROLL ==========
    const fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        fadeElements.forEach(el => observer.observe(el));
    } else {
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // ========== 5. INTERACTIVE LIGHTBOX GALLERY ==========
    const modal = document.getElementById('interactiveModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalProjectBadge = document.getElementById('modalProjectBadge');
    const modalCounter = document.getElementById('modalCounter');
    const modalMainImg = document.getElementById('modalMainImg');
    const modalCaption = document.getElementById('modalCaption');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const modalClose = document.getElementById('modalClose');
    const modalThumbsStrip = document.getElementById('modalThumbsStrip');

    let currentProjectImages = [];
    let currentImageIndex = 0;

    const projectData = {
        'cpu': {
            title: '8-Bit Single-Cycle CPU',
            badge: 'FPGA / RTL / Verilog',
            images: [
                { src: 'assets/cpu-1.png', alt: 'Vivado Simulation 1', caption: 'Behavioral simulation showing clock cycle execution and register updates.' },
                { src: 'assets/cpu-2.png', alt: 'Vivado Simulation 2', caption: 'Timing waveform verification for ALU arithmetic instructions.' },
                { src: 'assets/cpu-3.png', alt: 'Vivado Simulation 3', caption: 'Control logic signals and instruction decoder state validation.' },
                { src: 'assets/cpu-4.png', alt: 'Vivado Simulation 4', caption: 'Data memory read/write pulse timing diagram.' },
                { src: 'assets/cpu-5.png', alt: 'Vivado Simulation 5', caption: '12-instruction ISA opcode decoder verification.' },
                { src: 'assets/cpu-6.png', alt: 'Vivado Synthesis', caption: 'RTL synthesis schematic and logic utilization report.' }
            ]
        },
        'drone': {
            title: 'Autonomous Drone System',
            badge: 'ROS 2 / PX4 / Python',
            images: [
                { src: 'assets/drone-1.png', alt: 'Drone System 1', caption: 'ROS 2 node graph and real-time telemetry output.' },
                { src: 'assets/drone-2.png', alt: 'Drone System 2', caption: 'Gazebo 3D simulation with PX4 flight stack.' },
                { src: 'assets/drone-3.png', alt: 'Drone System 3', caption: 'Waypoint navigation and trajectory visualizer.' },
                { src: 'assets/drone-4.png', alt: 'Drone System 4', caption: 'Obstacle avoidance sensor feed and state estimation.' }
            ]
        }
    };

    function openGallery(projectId, startIndex = 0) {
        const data = projectData[projectId];
        if (!data) return;

        currentProjectImages = data.images;
        currentImageIndex = startIndex;

        if (modalProjectBadge) modalProjectBadge.textContent = data.badge;
        if (modalTitle) modalTitle.textContent = data.title;

        renderThumbs();
        updateModalDisplay();

        if (modal) modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function updateModalDisplay() {
        if (!currentProjectImages.length) return;
        const img = currentProjectImages[currentImageIndex];

        if (modalMainImg) {
            modalMainImg.style.opacity = '0';
            setTimeout(() => {
                modalMainImg.src = img.src;
                modalMainImg.alt = img.alt;
                modalMainImg.style.opacity = '1';
            }, 100);
        }

        if (modalCaption) modalCaption.textContent = img.caption || img.alt;
        if (modalCounter) {
            modalCounter.textContent = `${String(currentImageIndex + 1).padStart(2, '0')} / ${String(currentProjectImages.length).padStart(2, '0')}`;
        }

        if (modalThumbsStrip) {
            modalThumbsStrip.querySelectorAll('.modal-thumb').forEach((thumb, i) => {
                thumb.classList.toggle('active', i === currentImageIndex);
            });
        }
    }

    function renderThumbs() {
        if (!modalThumbsStrip) return;
        modalThumbsStrip.innerHTML = '';

        currentProjectImages.forEach((img, idx) => {
            const thumb = document.createElement('img');
            thumb.src = img.src;
            thumb.alt = img.alt;
            thumb.className = `modal-thumb ${idx === currentImageIndex ? 'active' : ''}`;
            thumb.addEventListener('click', () => { currentImageIndex = idx; updateModalDisplay(); });
            modalThumbsStrip.appendChild(thumb);
        });
    }

    function closeModal() {
        if (modal) modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Gallery image clicks
    document.querySelectorAll('.project-gallery img').forEach(img => {
        img.addEventListener('click', function () {
            const row = this.closest('.project-row');
            const projectId = row ? row.getAttribute('data-project') : null;
            if (!projectId) return;
            const index = parseInt(this.getAttribute('data-index') || '0', 10);
            openGallery(projectId, index);
        });
    });

    // Launch gallery buttons
    document.querySelectorAll('.open-gallery-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            openGallery(this.getAttribute('data-project-id'), 0);
        });
    });

    if (modalPrev) modalPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
        updateModalDisplay();
    });

    if (modalNext) modalNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % currentProjectImages.length;
        updateModalDisplay();
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('show')) return;
        if (e.key === 'ArrowLeft' && modalPrev) modalPrev.click();
        if (e.key === 'ArrowRight' && modalNext) modalNext.click();
        if (e.key === 'Escape') closeModal();
    });

    // ========== 6. DOWNLOAD CHECKMARK ANIMATION ==========
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.add('downloaded');
            setTimeout(() => btn.classList.remove('downloaded'), 2500);
        });
    });

});
