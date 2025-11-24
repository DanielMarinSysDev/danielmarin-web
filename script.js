// Esperamos a que todo el contenido del DOM esté cargado
document.addEventListener('DOMContentLoaded', (event) => {
    
    // --- 1. Botón de Subir (Scroll to Top) ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (scrollTopBtn) {
        // Mostrar/ocultar el botón basado en el scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.remove('hidden');
            } else {
                scrollTopBtn.classList.add('hidden');
            }
        });

        // Acción de clic para subir
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 2. Scroll Suave para Anclas (Navegación) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. Navegación Activa (Resaltar sección actual) ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let currentSectionId = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                // Se activa cuando la sección está a 1/3 de la pantalla
                if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('nav-link-active');
                if (link.getAttribute('data-section') === currentSectionId) {
                    link.classList.add('nav-link-active');
                }
            });
        });
    }
    
    // --- 4. Animación de Aparición (Fade-in on scroll) ---
    const fadeInElements = document.querySelectorAll('.fade-in');

    if (fadeInElements.length > 0) {
        // Opciones del Intersection Observer
        const observerOptions = {
            root: null, // usa el viewport
            rootMargin: '0px',
            threshold: 0.2 // 20% del elemento debe ser visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                    // Dejamos de observar el elemento una vez que es visible
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar cada elemento con la clase .fade-in
        fadeInElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- 5. Año Actual en el Footer ---
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // --- 6. Menú Móvil ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn') || document.querySelector('.md\\:hidden button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // --- 7. Enlaces Seguros (Anti-Scraping) ---
    const secureLinks = document.querySelectorAll('.secure-link');
    
    secureLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const type = link.getAttribute('data-type');
            const part1 = link.getAttribute('data-part1');
            const part2 = link.getAttribute('data-part2');
            
            let url = '';
            
            switch (type) {
                case 'email':
                    url = `mailto:${part1}@${part2}`;
                    window.location.href = url;
                    break;
                case 'whatsapp':
                    const msg = link.getAttribute('data-msg');
                    url = `https://wa.me/${part1}?text=${encodeURIComponent(msg)}`;
                    window.open(url, '_blank');
                    break;
            }
        });
    });

    // --- 8. Fondo de Partículas (tsParticles) ---
    const iniciarParticulas = async () => {
        await tsParticles.load('tsparticles', {
            particles: {
                color: { value: "#ffffff" },
                links: {
                    enable: true,
                    color: "#ffffff",
                    opacity: 0.1,
                    distance: 150
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: false,
                    straight: false,
                    outModes: { default: "bounce" }
                },
                number: {
                    value: 60,
                    density: { enable: true, area: 800 }
                },
                opacity: { value: 0.1 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } }
            },
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "grab" },
                    onClick: { enable: true, mode: "push" }
                },
                modes: {
                    grab: { distance: 140, links: { opacity: 0.5 } },
                    push: { quantity: 4 }
                }
            },
            background: { color: "transparent" }, // Fondo transparente para ver el gradiente del body
            detectRetina: true
        });
    };
    iniciarParticulas();

    // --- 9. Cargar Proyectos desde GitHub ---
    const cargarProyectos = async () => {
        const container = document.getElementById('proyectos-container');
        if (!container) return;

        try {
            const response = await fetch('https://api.github.com/users/DanielMarinSysDev/repos?sort=updated');
            if (!response.ok) throw new Error('Error al cargar repositorios');
            
            const repos = await response.json();
            // Filtrar forks y tomar los 3 primeros
            const proyectos = repos.filter(repo => !repo.fork).slice(0, 3);

            container.innerHTML = ''; // Limpiar loader

            proyectos.forEach(repo => {
                const card = document.createElement('div');
                card.className = 'bg-gray-800 rounded-lg shadow-xl overflow-hidden transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl fade-in fade-in-visible';
                
                // Imagen por defecto o personalizada si existiera
                const imgUrl = `https://opengraph.githubassets.com/1/DanielMarinSysDev/${repo.name}`;

                card.innerHTML = `
                    <img src="${imgUrl}" alt="Imagen del proyecto ${repo.name}" class="w-full h-56 object-cover">
                    <div class="p-6">
                        <h3 class="text-2xl font-bold text-Sky-600 mb-3 capitalize">${repo.name.replace(/-/g, ' ')}</h3>
                        <p class="text-gray-300 mb-4 line-clamp-3">
                            ${repo.description || 'Sin descripción disponible.'}
                        </p>
                        <div class="mb-5 flex flex-wrap gap-2">
                            <span class="inline-block bg-gray-700 text-gray-300 rounded-full px-3 py-1 text-sm font-semibold">${repo.language || 'Code'}</span>
                            <span class="inline-block bg-gray-700 text-gray-300 rounded-full px-3 py-1 text-sm font-semibold">★ ${repo.stargazers_count}</span>
                        </div>
                        <div class="flex space-x-4">
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="text-Sky-400 font-medium hover:text-Sky-300 transition duration-300">Ver Demo</a>` : ''}
                            <a href="${repo.html_url}" target="_blank" class="text-Sky-400 font-medium hover:text-Sky-300 transition duration-300">Código (GitHub)</a>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });

        } catch (error) {
            console.error(error);
            container.innerHTML = '<p class="text-red-400 col-span-full text-center">No se pudieron cargar los proyectos. Intenta más tarde.</p>';
        }
    };
    cargarProyectos();

    // --- 10. Easter Eggs (Konami + Mobile Tap) ---
    // Konami Code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activarModoSysDev();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Mobile Tap (5 toques en imagen de perfil)
    const profileImg = document.getElementById('profile-img');
    let tapCount = 0;
    let tapTimer;

    if (profileImg) {
        profileImg.addEventListener('click', () => {
            tapCount++;
            clearTimeout(tapTimer);
            
            if (tapCount === 5) {
                activarModoSysDev();
                tapCount = 0;
            } else {
                tapTimer = setTimeout(() => {
                    tapCount = 0;
                }, 500); // Resetear si pasa medio segundo sin click
            }
        });
    }

    function activarModoSysDev() {
        alert('¡Modo SysDev Activado! 🐇💻');
        document.body.classList.toggle('sysdev-mode');
    }

});