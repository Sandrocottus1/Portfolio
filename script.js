let menuIcon=document.querySelector('#menu-icon');
let navbar=document.querySelector('.navbar');
initializeThemeSwitcher();
initializePerformanceMode();
initializeCursorExperience();
initializeCardTiltEffect();
initializeScrollReveal();

let sections=document.querySelectorAll('section');
let navLinks=document.querySelectorAll('header nav a');
let scrollTicking = false;

menuIcon.onclick= ()=>{
    menuIcon.classList.toggle('fa-xmark');
    navbar.classList.toggle('active');
}
/*scroll section*/
/*-----------type.js------------*/
const typed=new Typed('.multiple-text',{
    strings:['Competitive Programmer','Frontend Developer','Web Designer','Enthusiast'],
    typeSpeed:80,
    backSpeed:80,
    backDelay:900,
    loop:true,
});

function updateReadingProgress() {
    var progress = document.getElementById('scroll-progress');
    if (!progress) {
        return;
    }
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var width = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    progress.style.width = Math.min(100, Math.max(0, width)) + '%';
}

function initializePerformanceMode() {
    var root = document.body;
    if (!root) {
        return;
    }
    var buttons = document.querySelectorAll('.perf-btn');
    var savedMode = localStorage.getItem('portfolio-performance');
    var initialMode = savedMode || 'balanced';
    applyPerformanceMode(initialMode);
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            var selectedMode = button.getAttribute('data-performance');
            applyPerformanceMode(selectedMode);
            runScrollWork();
        });
    });
}

function getPerformanceMode() {
    if (document.body.classList.contains('performance-lite')) {
        return 'lite';
    }
    if (document.body.classList.contains('performance-full')) {
        return 'full';
    }
    return 'balanced';
}

function applyPerformanceMode(modeName) {
    var safeMode = modeName || 'balanced';
    if (safeMode !== 'full' && safeMode !== 'balanced' && safeMode !== 'lite') {
        safeMode = 'balanced';
    }
    document.body.classList.remove('performance-full', 'performance-balanced', 'performance-lite');
    document.body.classList.add('performance-' + safeMode);
    localStorage.setItem('portfolio-performance', safeMode);
    var buttons = document.querySelectorAll('.perf-btn');
    buttons.forEach(function(button) {
        var isActive = button.getAttribute('data-performance') === safeMode;
        button.classList.toggle('is-active', isActive);
    });
    if (safeMode === 'lite') {
        document.body.classList.remove('cursor-ready', 'cursor-hover', 'cursor-native', 'cursor-text');
        resetProjectCardTransforms();
    }
}

function initializeScrollReveal() {
    if (typeof ScrollReveal === 'undefined') {
        return;
    }
    var mode = getPerformanceMode();
    if (mode === 'lite') {
        return;
    }
    var config = mode === 'full'
        ? { distance: '80px', duration: 2000, delay: 200 }
        : { distance: '44px', duration: 900, delay: 80 };
    ScrollReveal(config);
    ScrollReveal().reveal('.home-content, .heading',{origin:'top'});
    ScrollReveal().reveal('.home-img, .services-container, .project-card, .contact form',{origin:'bottom'});
    ScrollReveal().reveal('.home-content h1, .about-img',{origin:'left'});
    ScrollReveal().reveal('.home-content p, .about-content',{origin:'right'});
}

function requestScrollWork() {
    if (scrollTicking) {
        return;
    }
    scrollTicking = true;
    window.requestAnimationFrame(function() {
        runScrollWork();
        scrollTicking = false;
    });
}

function runScrollWork() {
    var top = window.scrollY;
    sections.forEach(function(sec){
        var offset=sec.offsetTop-150;
        var height = sec.offsetHeight;
        var id=sec.getAttribute('id');
        if(top>=offset && top<offset+height){
            navLinks.forEach(function(link) {
                link.classList.remove('active');
            });
            var activeLink = document.querySelector('header nav a[href*="' + id + '"]');
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });

    var header=document.querySelector('header');
    header.classList.toggle('sticky',top > 100);

    menuIcon.classList.remove('fa-xmark');
    navbar.classList.remove('active');

    updateReadingProgress();
    updateTimeline();
    updateProjectMediaParallax();
}

function initializeThemeSwitcher() {
    var root = document.body;
    if (!root) {
        return;
    }
    var buttons = document.querySelectorAll('.theme-btn');
    if (!buttons.length) {
        return;
    }
    var savedTheme = localStorage.getItem('portfolio-theme');
    var initialTheme = savedTheme || 'editorial';
    applyTheme(initialTheme);
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            var selected = button.getAttribute('data-theme');
            applyTheme(selected);
        });
    });
}

function applyTheme(themeName) {
    var root = document.body;
    if (!root) {
        return;
    }
    var safeTheme = themeName || 'editorial';
    root.classList.remove('theme-editorial', 'theme-futuristic', 'theme-minimal');
    root.classList.add('theme-' + safeTheme);
    localStorage.setItem('portfolio-theme', safeTheme);
    var buttons = document.querySelectorAll('.theme-btn');
    buttons.forEach(function(button) {
        var isActive = button.getAttribute('data-theme') === safeTheme;
        button.classList.toggle('is-active', isActive);
    });
}

function initializeCursorExperience() {
    var supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supportsFinePointer) {
        return;
    }
    var arrow = document.getElementById('cursor-arrow');
    if (!arrow) {
        return;
    }
    var pointerX = window.innerWidth * 0.5;
    var pointerY = window.innerHeight * 0.5;
    var isVisible = false;
    var interactiveSelector = 'a, button, .btn, .theme-btn, .project-card, .services-box, .social-media a, input, textarea, select, label';
    var interactiveNodes = document.querySelectorAll(interactiveSelector);

    function renderCursor() {
        if (getPerformanceMode() === 'lite') {
            requestAnimationFrame(renderCursor);
            return;
        }
        arrow.style.left = pointerX + 'px';
        arrow.style.top = pointerY + 'px';
        requestAnimationFrame(renderCursor);
    }

    document.addEventListener('mousemove', function(event) {
        if (getPerformanceMode() === 'lite') {
            return;
        }
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!isVisible) {
            document.body.classList.add('cursor-ready');
            isVisible = true;
        }
    });

    document.addEventListener('mouseleave', function() {
        document.body.classList.remove('cursor-ready', 'cursor-hover', 'cursor-text');
        isVisible = false;
    });

    interactiveNodes.forEach(function(node) {
        node.addEventListener('mouseenter', function() {
            if (getPerformanceMode() === 'lite') {
                return;
            }
            document.body.classList.add('cursor-hover');
        });
        node.addEventListener('mouseleave', function() {
            document.body.classList.remove('cursor-hover');
        });
    });

    var nativeCursorNodes = document.querySelectorAll('.theme-btn, .perf-btn');
    nativeCursorNodes.forEach(function(node) {
        node.addEventListener('mouseenter', function() {
            if (getPerformanceMode() === 'lite') {
                return;
            }
            document.body.classList.add('cursor-native');
        });
        node.addEventListener('mouseleave', function() {
            document.body.classList.remove('cursor-native');
        });
    });

    var textInputNodes = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="search"], input[type="url"], input[type="password"], input:not([type]), textarea');
    textInputNodes.forEach(function(node) {
        node.addEventListener('mouseenter', function() {
            if (getPerformanceMode() === 'lite') {
                return;
            }
            document.body.classList.add('cursor-text');
        });
        node.addEventListener('mouseleave', function() {
            document.body.classList.remove('cursor-text');
        });
        node.addEventListener('focus', function() {
            if (getPerformanceMode() === 'lite') {
                return;
            }
            document.body.classList.add('cursor-text');
        });
        node.addEventListener('blur', function() {
            document.body.classList.remove('cursor-text');
        });
    });

    requestAnimationFrame(renderCursor);
}

function initializeCardTiltEffect() {
    var supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!supportsFinePointer || reducedMotion) {
        return;
    }
    var cards = document.querySelectorAll('.project-card');
    if (!cards.length) {
        return;
    }
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(event) {
            if (getPerformanceMode() !== 'full') {
                return;
            }
            var rect = card.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            var px = (x / rect.width) * 100;
            var py = (y / rect.height) * 100;
            var rotateY = ((x / rect.width) - 0.5) * 8;
            var rotateX = (0.5 - (y / rect.height)) * 8;
            card.style.setProperty('--card-x', px + '%');
            card.style.setProperty('--card-y', py + '%');
            card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.removeProperty('transform');
            card.style.setProperty('--card-x', '50%');
            card.style.setProperty('--card-y', '50%');
        });
    });
}

function resetProjectCardTransforms() {
    var cards = document.querySelectorAll('.project-card');
    cards.forEach(function(card) {
        card.style.removeProperty('transform');
        card.style.setProperty('--card-x', '50%');
        card.style.setProperty('--card-y', '50%');
    });
}

function animateHeroTags() {
    var tags = document.querySelectorAll('.hero-tags span');
    if (!tags.length) {
        return;
    }
    tags.forEach(function(tag, index) {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(10px)';
        setTimeout(function() {
            tag.style.transition = 'transform 0.35s ease, opacity 0.35s ease, border-color 0.3s ease';
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
        }, 140 + index * 70);
    });
}

function updateTimeline() {
    var element = document.getElementById('timeline');
    if (!element) {
        return;
    }
    var line = element.querySelector('.timeline-line');
    var items = element.querySelectorAll('.contain');
    var rect = element.getBoundingClientRect();
    var scrollTop = window.scrollY;
    var timelineTop = scrollTop + rect.top;
    var timelineHeight = element.offsetHeight;
    var viewportTrigger = scrollTop + window.innerHeight * 0.65;
    var progress = (viewportTrigger - timelineTop) / timelineHeight;
    var clamped = Math.max(0, Math.min(1, progress));
    var lineHeight = clamped * timelineHeight;
    if (line) {
        line.style.height = lineHeight + 'px';
    }
    items.forEach(function(item) {
        var itemOffset = item.offsetTop;
        if (lineHeight >= itemOffset + 40) {
            item.classList.add('show');
        }
    });
}

window.addEventListener('scroll', requestScrollWork, { passive: true });
window.addEventListener('resize', requestScrollWork);

function revealProjectCards() {
    var cards = document.querySelectorAll('.project-card');
    if (!cards.length) {
        return;
    }
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    cards.forEach(function(card) {
        observer.observe(card);
    });
}

function updateProjectMediaParallax() {
    var mediaBlocks = document.querySelectorAll('.project-media');
    if (!mediaBlocks.length) {
        return;
    }
    if (getPerformanceMode() !== 'full') {
        mediaBlocks.forEach(function(block) {
            block.style.setProperty('--parallax-y', '50%');
        });
        return;
    }
    var viewportHeight = window.innerHeight;
    mediaBlocks.forEach(function(block) {
        var rect = block.getBoundingClientRect();
        var progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        var offset = Math.max(-12, Math.min(12, progress * 24));
        block.style.setProperty('--parallax-y', (50 + offset) + '%');
    });
}

window.addEventListener('load', function() {
    revealProjectCards();
    runScrollWork();
    animateHeroTags();
});
window.addEventListener('resize', updateReadingProgress);

window.addEventListener('load', function() {
    var thankYou = document.getElementById('thank-you');
    if (!thankYou) {
        return;
    }
    var params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') {
        thankYou.classList.add('is-visible');
        var contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.classList.add('is-hidden');
        }
        launchConfetti();
        thankYou.scrollIntoView({ behavior: 'smooth' });
    }
});

function launchConfetti() {
    var container = document.querySelector('.confetti');
    if (!container) {
        return;
    }
    container.innerHTML = '';
    var colors = ['#0f8b8d', '#d96f32', '#1b4332', '#f4a261'];
    for (var i = 0; i < 26; i += 1) {
        var piece = document.createElement('span');
        var left = Math.random() * 100;
        var delay = Math.random() * 0.6;
        var duration = 2.2 + Math.random() * 1.2;
        var rotate = Math.floor(Math.random() * 180) + 'deg';
        var color = colors[i % colors.length];
        piece.style.left = left + '%';
        piece.style.animationDelay = delay + 's';
        piece.style.setProperty('--duration', duration + 's');
        piece.style.setProperty('--rotate', rotate);
        piece.style.setProperty('--color', color);
        container.appendChild(piece);
    }
    setTimeout(function() {
        container.innerHTML = '';
    }, 3500);
}
