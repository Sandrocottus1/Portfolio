let menuIcon=document.querySelector('#menu-icon');
let navbar=document.querySelector('.navbar');
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
});
window.addEventListener('scroll', updateProjectMediaParallax);
window.addEventListener('resize', updateProjectMediaParallax);

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
