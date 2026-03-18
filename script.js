let menuIcon=document.querySelector('#menu-icon');
let navbar=document.querySelector('.navbar');
initializeThemeSwitcher();
initializeCursorExperience();
initializeCardTiltEffect();

menuIcon.onclick= ()=>{
    menuIcon.classList.toggle('fa-xmark');
    navbar.classList.toggle('active');
}
/*scroll section*/
let sections=document.querySelectorAll('section');
let navLinks=document.querySelectorAll('header nav a');
window.onscroll =()=>{
    sections.forEach(sec=>{
        let top=window.scrollY;
        let offset=sec.offsetTop-150;
        let height = sec.offsetHeight;
        let id=sec.getAttribute('id');
        if(top>=offset && top<offset+height){
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            const activeLink = document.querySelector('header nav a[href*="' + id + '"]');
            if (activeLink) {
                activeLink.classList.add('active');
            }
        };
    });
    /*-----------------stick navbar-----------------*/
    let header=document.querySelector('header');
    header.classList.toggle('sticky',window.scrollY > 100);
    /*=================remove toggle=================*/
    menuIcon.classList.remove('fa-xmark');
    navbar.classList.remove('active');
    updateReadingProgress();
};
/*------------------scroll reveal----------------------*/
ScrollReveal({
    distance:'80px',
    duration:2000,
    delay:200,
});
ScrollReveal().reveal('.home-content, .heading',{origin:'top'});
ScrollReveal().reveal('.home-img, .services-container, .project-card, .contact form',{origin:'bottom'});
ScrollReveal().reveal('.home-content h1, .about-img',{origin:'left'});
ScrollReveal().reveal('.home-content p, .about-content',{origin:'right'});
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
        arrow.style.left = pointerX + 'px';
        arrow.style.top = pointerY + 'px';
        requestAnimationFrame(renderCursor);
    }

    document.addEventListener('mousemove', function(event) {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!isVisible) {
            document.body.classList.add('cursor-ready');
            isVisible = true;
        }
    });

    document.addEventListener('mouseleave', function() {
        document.body.classList.remove('cursor-ready', 'cursor-hover');
        isVisible = false;
    });

    interactiveNodes.forEach(function(node) {
        node.addEventListener('mouseenter', function() {
            document.body.classList.add('cursor-hover');
        });
        node.addEventListener('mouseleave', function() {
            document.body.classList.remove('cursor-hover');
        });
    });

    var nativeCursorNodes = document.querySelectorAll('.theme-btn');
    nativeCursorNodes.forEach(function(node) {
        node.addEventListener('mouseenter', function() {
            document.body.classList.add('cursor-native');
        });
        node.addEventListener('mouseleave', function() {
            document.body.classList.remove('cursor-native');
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

window.addEventListener('scroll', updateTimeline);
window.addEventListener('load', updateTimeline);
window.addEventListener('resize', updateTimeline);

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
    updateProjectMediaParallax();
    updateReadingProgress();
    animateHeroTags();
});
window.addEventListener('scroll', updateProjectMediaParallax);
window.addEventListener('resize', updateProjectMediaParallax);
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
