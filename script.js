let menuIcon=document.querySelector('#menu-icon');
let navbar=document.querySelector('.navbar');
initializeBootShell();
initializeThemeSwitcher();
initializePerformanceMode();
initializeCardTiltEffect();
initializeScrollReveal();
initializeUtilityTerminal();

let sections=document.querySelectorAll('section');
let navLinks=document.querySelectorAll('header nav a');
let scrollTicking = false;

menuIcon.onclick= ()=>{
    menuIcon.classList.toggle('fa-xmark');
    navbar.classList.toggle('active');
}
/*-----------type.js------------*/
const typed=new Typed('.multiple-text',{
    strings:['Competitive Programmer','Frontend Developer','Web Designer','Enthusiast'],
    typeSpeed:80,
    backSpeed:80,
    backDelay:900,
    loop:true,
});

function initializeBootShell() {
    var shell = document.getElementById('boot-shell');
    var form = document.getElementById('boot-form');
    var promptLabel = form ? form.querySelector('.boot-prompt') : null;
    var input = document.getElementById('boot-command');
    var output = document.getElementById('boot-output');
    var suggestions = document.getElementById('boot-suggestions');
    var skip = document.getElementById('boot-skip');
    if (!shell || !form || !promptLabel || !input || !output || !suggestions || !skip) {
        return;
    }

    document.body.classList.add('boot-active');
    input.focus();
    setCaretToEnd(input);
    
    var history = [];
    var historyIndex = -1;
    var isBusy = false;
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var outputQueue = Promise.resolve();

    var remoteOpenCommand = 'ssh portfolio@aryan.dev -p 2220';
    var remotePassword = 'greetings3000';
    var awaitingRemotePassword = false;
    var openCommands = [
        remoteOpenCommand,
        'sudo open the app -y',
        'sudo open app -y',
        'open app',
        'run app',
        'start app',
        'open the app'
    ];
    var defaultSuggestions = ['help', remoteOpenCommand, 'set theme futuristic', 'set mode lite', 'status'];
    var sectionAliases = {
        home: 'home',
        about: 'about',
        service: 'services',
        services: 'services',
        portfolio: 'portfolio',
        project: 'portfolio',
        projects: 'portfolio',
        contact: 'contact'
    };

    function setCaretToEnd(node) {
        if (!node) {
            return;
        }
        var selection = window.getSelection();
        if (!selection) {
            return;
        }
        var range = document.createRange();
        range.selectNodeContents(node);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    var actualPasswordInput = '';

    function focusInput() {
        input.focus();
        setCaretToEnd(input);
    }

    function setInputValue(value) {
        input.textContent = value;
        input.focus();
        setCaretToEnd(input);
    }

    function getInputValue() {
        return (input.textContent || '').replace(/\n/g, '');
    }

    function setPrompt(waitingForPassword) {
        if (promptLabel) {
            promptLabel.textContent = waitingForPassword ? 'password:' : 'visitor@portfolio:~$';
        }
    }

    function delay(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    }

    function normalize(value) {
        return (value || '').toLowerCase().trim().replace(/\s+/g, ' ');
    }

    function scrollOutputToBottom() {
        output.scrollTop = output.scrollHeight;
    }

    function printLine(text, className) {
        var line = document.createElement('p');
        line.textContent = '';
        if (className) {
            line.classList.add(className);
        }
        output.appendChild(line);
        var speed = prefersReducedMotion ? 0 : 13;
        return new Promise(function(resolve) {
            if (!speed) {
                line.textContent = text;
                scrollOutputToBottom();
                resolve();
                return;
            }
            var idx = 0;
            function typeNext() {
                line.textContent = text.slice(0, idx);
                scrollOutputToBottom();
                if (idx >= text.length) {
                    resolve();
                    return;
                }
                idx += 1;
                setTimeout(typeNext, speed);
            }
            typeNext();
        });
    }

    function enqueueLine(text, className) {
        outputQueue = outputQueue.then(function() {
            return printLine(text, className);
        });
        return outputQueue;
    }

    function setBusyState(state) {
        isBusy = state;
        if (input) {
            input.setAttribute('contenteditable', state ? 'false' : 'true');
            input.setAttribute('aria-disabled', state ? 'true' : 'false');
        }
        if (skip) {
            skip.disabled = state;
        }
    }

    function paintSuggestions(commands) {
        suggestions.innerHTML = '';
        commands.forEach(function(commandText) {
            var chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'boot-chip';
            chip.textContent = commandText;
            chip.addEventListener('click', function() {
                if (isBusy) {
                    return;
                }
                setInputValue(commandText);
                focusInput();
            });
            suggestions.appendChild(chip);
        });
    }

    function activeTheme() {
        if (document.body.classList.contains('theme-futuristic')) {
            return 'futuristic';
        }
        if (document.body.classList.contains('theme-minimal')) {
            return 'minimal';
        }
        return 'editorial';
    }

    function resolveSectionToken(token) {
        var normalized = normalize(token);
        return sectionAliases[normalized] || '';
    }

    function parseSectionFromCommand(command) {
        var patterns = [
            /^goto\s+([a-z-]+)$/,
            /^go\s+([a-z-]+)$/,
            /^open\s+([a-z-]+)$/,
            /^cd\s+([a-z-]+)$/,
            /^jump\s+to\s+([a-z-]+)$/,
            /^nav\s+([a-z-]+)$/
        ];
        for (var i = 0; i < patterns.length; i += 1) {
            var matched = command.match(patterns[i]);
            if (matched && matched[1]) {
                return resolveSectionToken(matched[1]);
            }
        }
        return '';
    }

    async function openPortfolio(targetSection) {
        setBusyState(true);
        await enqueueLine('[ok] validating permissions...');
        await delay(prefersReducedMotion ? 0 : 260);
        await enqueueLine('[ok] loading ui bundles...');
        await delay(prefersReducedMotion ? 0 : 240);
        await enqueueLine('[ok] applying visual profile: ' + activeTheme());
        await delay(prefersReducedMotion ? 0 : 240);
        await enqueueLine('[ok] booting portfolio UI...');
        shell.classList.add('is-exiting');
        setTimeout(function() {
            shell.style.display = 'none';
            document.body.classList.remove('boot-active');
            runScrollWork();
            if (targetSection) {
                var target = document.getElementById(targetSection);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }, 560);
    }

    function showHelp() {
        enqueueLine('[help] available commands:');
        enqueueLine('  help, status, clear, about');
        enqueueLine('  themes, modes');
        enqueueLine('  goto/go/open/cd <home|about|services|portfolio|contact>');
        enqueueLine('  set theme <editorial|futuristic|minimal>');
        enqueueLine('  set mode <full|balanced|lite>');
        enqueueLine('  ' + remoteOpenCommand);
        enqueueLine('  password: ' + remotePassword);
        paintSuggestions([
            'themes',
            'modes',
            'goto services',
            'set theme futuristic',
            'set mode full',
            remoteOpenCommand
        ]);
    }

    function showThemes() {
        enqueueLine('[themes] editorial, futuristic, minimal');
        paintSuggestions(['set theme editorial', 'set theme futuristic', 'set theme minimal']);
    }

    function showModes() {
        enqueueLine('[modes] full, balanced, lite');
        paintSuggestions(['set mode full', 'set mode balanced', 'set mode lite']);
    }

    function setThemeFromCommand(value) {
        var theme = value.split('set theme ')[1] || '';
        theme = normalize(theme);
        if (theme !== 'editorial' && theme !== 'futuristic' && theme !== 'minimal') {
            enqueueLine('[error] invalid theme. use editorial, futuristic, or minimal.', 'error');
            return;
        }
        applyTheme(theme);
        enqueueLine('[ok] theme set to ' + theme + '.');
    }

    function setModeFromCommand(value) {
        var mode = value.split('set mode ')[1] || '';
        mode = normalize(mode);
        if (mode !== 'full' && mode !== 'balanced' && mode !== 'lite') {
            enqueueLine('[error] invalid mode. use full, balanced, or lite.', 'error');
            return;
        }
        applyPerformanceMode(mode);
        enqueueLine('[ok] performance mode set to ' + mode + '.');
    }

    function showStatus() {
        enqueueLine('[status] theme=' + activeTheme() + ', mode=' + getPerformanceMode());
    }

    function handleCommand(rawCommand) {
        var command = normalize(rawCommand);
        if (!command) {
            return;
        }

        if (awaitingRemotePassword) {
            enqueueLine('password: ' + new Array((rawCommand || '').length + 1).join('*'));
            if ((rawCommand || '').trim() === remotePassword) {
                awaitingRemotePassword = false;
                setPrompt(false);
                enqueueLine('[auth] access granted. opening portfolio shell ...');
                openPortfolio();
                return;
            }
            enqueueLine('[error] invalid password. try again.', 'error');
            enqueueLine('[auth] password hint is shown above in startup details.');
            return;
        }

        enqueueLine('visitor@portfolio:~$ ' + rawCommand);

        if (command === 'help' || command === '?') {
            showHelp();
            return;
        }
        if (command === 'themes') {
            showThemes();
            return;
        }
        if (command === 'modes') {
            showModes();
            return;
        }
        if (command === 'status') {
            showStatus();
            return;
        }
        if (command === 'about') {
            enqueueLine('[about] built by Aryan Yadav: full-stack, AI, and performance-focused web apps.');
            paintSuggestions(['help', 'status', 'sudo open the app -y']);
            return;
        }
        if (command === 'clear') {
            output.innerHTML = '';
            paintSuggestions(defaultSuggestions);
            enqueueLine('[ok] terminal cleared.');
            return;
        }
        if (command.indexOf('set theme ') === 0) {
            setThemeFromCommand(command);
            return;
        }
        if (command.indexOf('set mode ') === 0) {
            setModeFromCommand(command);
            return;
        }
        var sectionFromCommand = parseSectionFromCommand(command);
        if (sectionFromCommand) {
            enqueueLine('[ok] preparing jump to #' + sectionFromCommand + ' ...');
            openPortfolio(sectionFromCommand);
            return;
        }
        if (command === normalize(remoteOpenCommand)) {
            awaitingRemotePassword = true;
            setPrompt(true);
            enqueueLine('[auth] remote endpoint: aryan.dev:2220');
            return;
        }
        if (openCommands.indexOf(command) !== -1) {
            openPortfolio();
            return;
        }

        enqueueLine('[error] unknown command. type help to view available commands.', 'error');
        paintSuggestions(defaultSuggestions);
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (isBusy) {
            return;
        }
        var command = getInputValue();
        if (!command.trim()) {
            return;
        }
        history.push(command);
        historyIndex = history.length;
        handleCommand(command);
        setInputValue('');
    });

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            form.requestSubmit();
            return;
        }
        if (!history.length) {
            return;
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            historyIndex = Math.max(0, historyIndex - 1);
            setInputValue(history[historyIndex]);
            return;
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            historyIndex = Math.min(history.length, historyIndex + 1);
            setInputValue(historyIndex === history.length ? '' : history[historyIndex]);
        }
    });

    form.addEventListener('click', function() {
        if (!isBusy) {
            focusInput();
        }
    });

    skip.addEventListener('click', function() {
        if (isBusy) {
            return;
        }
        enqueueLine('> quick open');
        enqueueLine('[ok] quick open enabled');
        openPortfolio();
    });

    paintSuggestions(defaultSuggestions);
    setPrompt(false);
    enqueueLine('[hint] type help to explore interactive commands.');
}

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

function initializeUtilityTerminal() {
    var root = document.getElementById('utility-terminal');
    var toggle = document.getElementById('term-toggle');
    var panel = document.getElementById('term-panel');
    var head = panel ? panel.querySelector('.term-panel-head') : null;
    var close = document.getElementById('term-close');
    var output = document.getElementById('term-panel-output');
    var suggestions = document.getElementById('term-panel-suggestions');
    if (!root || !toggle || !panel || !head || !close || !output || !suggestions) {
        return;
    }

    var commandRow = null;
    var promptLabel = null;
    var input = null;
    var inlineCursor = null;

    var history = [];
    var historyIndex = -1;
    var dragKey = 'portfolio-terminal-position';
    var dragState = {
        active: false,
        offsetX: 0,
        offsetY: 0
    };
    var autoCompleteState = {
        base: '',
        matches: [],
        index: -1
    };
    var baseChips = ['help', 'status', 'set theme futuristic', 'set mode lite', 'goto contact', 'neofetch', 'joke', 'black hole', 'whoami', 'play song'];
    var spotifyEmbedUrl = 'https://open.spotify.com/embed/track/4CprMw8YzWNAuUg7hchwnB?utm_source=generator';
    var spotifyWarmFrame = null;
    var currentDir = '~';
    var projectDir = '~/portfolio';
    var projectFiles = {
        'sandboxed.txt': {
            title: 'Sandboxed Remote Code Executor',
            intro: 'Secure sandboxed code execution with Docker isolation and real-time job status updates.',
            repo: 'https://github.com/Sandrocottus1/sandboxed_code_execution_platform',
            live: 'https://codexecutor.tech/'
        },
        'finboard.txt': {
            title: 'FinBoard',
            intro: 'Responsive Next.js dashboard with WebSockets and smooth mobile interactions.',
            repo: 'https://github.com/Sandrocottus1/FinBoard',
            live: 'https://fin-board-theta.vercel.app'
        },
        'rag.txt': {
            title: 'Internal Knowledge Assistant (RAG)',
            intro: 'Streamlit + FAISS assistant for retrieval-augmented responses over internal knowledge.',
            repo: 'https://github.com/Sandrocottus1/RAG_based_AI_Assistant.git',
            live: 'https://rag-agent-tps6p.ondigitalocean.app/'
        },
        'shared-cart.txt': {
            title: 'Shared-Cart',
            intro: 'Realtime collaborative cart concept where multiple users shop together in sync.',
            repo: 'https://github.com/zordican/walmart-frontend',
            live: 'https://sharedcart-system.vercel.app/'
        },
        'assignmentkaro.txt': {
            title: 'AssignmentKaro.com',
            intro: 'Full-stack platform built with PHP and MySQL for student support workflows.',
            repo: 'https://github.com/Sandrocottus1/AssignmentKaro.com'
        },
        'hospitalsnearme.txt': {
            title: 'HospitalsNearme',
            intro: 'Hospital discovery and slot booking solution built during Smart India Hackathon.',
            repo: 'https://github.com/Sandrocottus1/Hospitals'
        }
    };
    var sectionAliases = {
        home: 'home',
        about: 'about',
        service: 'services',
        services: 'services',
        portfolio: 'portfolio',
        project: 'portfolio',
        projects: 'portfolio',
        contact: 'contact'
    };

    function resolveSectionToken(token) {
        var normalized = normalize(token);
        return sectionAliases[normalized] || '';
    }

    function extractSection(command) {
        var patterns = [
            /^goto\s+([a-z-]+)$/,
            /^go\s+([a-z-]+)$/,
            /^open\s+([a-z-]+)$/,
            /^jump\s+to\s+([a-z-]+)$/,
            /^nav\s+([a-z-]+)$/
        ];
        for (var i = 0; i < patterns.length; i += 1) {
            var matched = command.match(patterns[i]);
            if (matched && matched[1]) {
                return resolveSectionToken(matched[1]);
            }
        }
        return '';
    }

    function updatePrompt() {
        if (promptLabel) {
            promptLabel.textContent = 'user@portfolio:' + currentDir + '$';
        }
    }

    function setCaretToEnd(node) {
        if (!node) {
            return;
        }
        var selection = window.getSelection();
        if (!selection) {
            return;
        }
        var range = document.createRange();
        range.selectNodeContents(node);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function getCaretOffsetInInput(node) {
        var selection = window.getSelection();
        if (!selection || !selection.rangeCount) {
            return getInputValue().length;
        }
        if (!node.contains(selection.anchorNode)) {
            return getInputValue().length;
        }
        var range = selection.getRangeAt(0).cloneRange();
        var preRange = range.cloneRange();
        preRange.selectNodeContents(node);
        preRange.setEnd(range.endContainer, range.endOffset);
        return preRange.toString().length;
    }

    function syncInlineCursorPosition() {
        if (!input || !inlineCursor) {
            return;
        }
        var value = getInputValue();
        var index = getCaretOffsetInInput(input);
        if (index < 0) {
            index = 0;
        }
        if (index > value.length) {
            index = value.length;
        }
        inlineCursor.style.setProperty('--cursor-index', String(index));
    }

    function focusInput() {
        if (!input) {
            return;
        }
        input.focus();
        setCaretToEnd(input);
        syncInlineCursorPosition();
    }

    function setInputValue(value) {
        if (!input) {
            return;
        }
        input.textContent = value;
        setCaretToEnd(input);
        syncInlineCursorPosition();
    }

    function getInputValue() {
        if (!input) {
            return '';
        }
        return (input.textContent || '').replace(/\n/g, '');
    }

    function ensureCommandRow() {
        if (commandRow && output.contains(commandRow)) {
            return;
        }
        commandRow = document.createElement('p');
        commandRow.className = 'term-input-row';

        promptLabel = document.createElement('span');
        promptLabel.className = 'term-input-prompt';
        commandRow.appendChild(promptLabel);

        var inputWrap = document.createElement('span');
        inputWrap.className = 'term-inline-wrap';
        commandRow.appendChild(inputWrap);

        input = document.createElement('span');
        input.className = 'term-inline-input';
        input.contentEditable = 'true';
        input.setAttribute('role', 'textbox');
        input.setAttribute('aria-label', 'Terminal command input');
        input.setAttribute('spellcheck', 'false');
        inputWrap.appendChild(input);

        inlineCursor = document.createElement('span');
        inlineCursor.className = 'term-inline-cursor';
        inlineCursor.setAttribute('aria-hidden', 'true');
        inlineCursor.textContent = '_';
        inputWrap.appendChild(inlineCursor);

        output.appendChild(commandRow);
        updatePrompt();
        syncInlineCursorPosition();

        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                var value = getInputValue();
                if (!value.trim()) {
                    setInputValue('');
                    return;
                }
                history.push(value);
                historyIndex = history.length;
                handleCommand(value);
                setInputValue('');
                return;
            }
            if (!history.length) {
                return;
            }
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                historyIndex = Math.max(0, historyIndex - 1);
                setInputValue(history[historyIndex]);
            }
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                historyIndex = Math.min(history.length, historyIndex + 1);
                setInputValue(historyIndex === history.length ? '' : history[historyIndex]);
            }
        });

        input.addEventListener('input', syncInlineCursorPosition);
        input.addEventListener('keyup', syncInlineCursorPosition);
        input.addEventListener('click', syncInlineCursorPosition);
        input.addEventListener('mouseup', syncInlineCursorPosition);
        input.addEventListener('focus', syncInlineCursorPosition);

        document.addEventListener('selectionchange', function() {
            if (document.activeElement === input) {
                syncInlineCursorPosition();
            }
        });
    }

    function normalizeFileName(value) {
        var cleaned = normalize(value).replace(/^\.\//, '');
        if (!cleaned) {
            return '';
        }
        if (cleaned.indexOf('.txt') === -1) {
            cleaned += '.txt';
        }
        return cleaned;
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function startDrag(event) {
        if (event.button !== 0) {
            return;
        }
        if (event.target === close || close.contains(event.target)) {
            return;
        }
        var rect = panel.getBoundingClientRect();
        dragState.active = true;
        dragState.offsetX = event.clientX - rect.left;
        dragState.offsetY = event.clientY - rect.top;
        root.classList.add('is-dragging');
        panel.style.position = 'fixed';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        panel.style.left = rect.left + 'px';
        panel.style.top = rect.top + 'px';
    }

    function onDrag(event) {
        if (!dragState.active) {
            return;
        }
        var maxX = Math.max(8, window.innerWidth - panel.offsetWidth - 8);
        var maxY = Math.max(8, window.innerHeight - panel.offsetHeight - 8);
        var x = clamp(event.clientX - dragState.offsetX, 8, maxX);
        var y = clamp(event.clientY - dragState.offsetY, 8, maxY);
        panel.style.left = x + 'px';
        panel.style.top = y + 'px';
    }

    function stopDrag() {
        if (!dragState.active) {
            return;
        }
        dragState.active = false;
        root.classList.remove('is-dragging');
    }


    function normalize(value) {
        return (value || '').toLowerCase().trim().replace(/\s+/g, ' ');
    }

    function writeLine(text, className) {
        var row = document.createElement('p');
        var content = text === undefined || text === null ? '' : String(text);
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        var startIndex = 0;
        var match;
        while ((match = urlRegex.exec(content)) !== null) {
            var url = match[0];
            var matchIndex = match.index;
            if (matchIndex > startIndex) {
                row.appendChild(document.createTextNode(content.slice(startIndex, matchIndex)));
            }
            var anchor = document.createElement('a');
            anchor.href = url;
            anchor.textContent = url;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            row.appendChild(anchor);
            startIndex = matchIndex + url.length;
        }
        if (startIndex < content.length) {
            row.appendChild(document.createTextNode(content.slice(startIndex)));
        }
        if (className) {
            row.classList.add(className);
        } else {
            if (/^\[help\]/.test(content)) {
                row.classList.add('line-help');
            } else if (/^\[status\]/.test(content)) {
                row.classList.add('line-status');
            } else if (/^\[ok\]/.test(content)) {
                row.classList.add('line-ok');
            } else if (/^\[warn\]/.test(content)) {
                row.classList.add('line-warn');
            } else if (/^\[theme\]/.test(content)) {
                row.classList.add('line-theme');
            } else if (/^\[mode\]/.test(content)) {
                row.classList.add('line-mode');
            } else if (/^\[whoami\]/.test(content)) {
                row.classList.add('line-whoami');
            }
        }
        if (commandRow && output.contains(commandRow)) {
            output.insertBefore(row, commandRow);
        } else {
            output.appendChild(row);
        }
        output.scrollTop = output.scrollHeight;
    }

    function writeSpotifyEmbed(title, embedUrl) {
        var wrap = document.createElement('div');
        wrap.className = 'term-media-card';

        var heading = document.createElement('p');
        heading.className = 'term-media-title';
        heading.textContent = '[music] ' + title;
        wrap.appendChild(heading);

        var frame = null;
        if (spotifyWarmFrame && embedUrl === spotifyEmbedUrl) {
            frame = spotifyWarmFrame;
            frame.className = 'term-media-frame';
            frame.width = '100%';
            frame.height = '152';
            frame.style.cssText = '';
        } else {
            frame = document.createElement('iframe');
            frame.className = 'term-media-frame';
            frame.src = embedUrl;
            frame.loading = 'lazy';
            frame.width = '100%';
            frame.height = '152';
            frame.frameBorder = '0';
            frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
            frame.referrerPolicy = 'strict-origin-when-cross-origin';
        }
        wrap.appendChild(frame);

        if (commandRow && output.contains(commandRow)) {
            output.insertBefore(wrap, commandRow);
        } else {
            output.appendChild(wrap);
        }
        output.scrollTop = output.scrollHeight;
    }

    function stopTerminalMediaPlayback() {
        var mediaCards = output.querySelectorAll('.term-media-card');
        mediaCards.forEach(function(card) {
            var frame = card.querySelector('iframe');
            if (frame) {
                frame.src = 'about:blank';
            }
            card.remove();
        });
        if (spotifyWarmFrame) {
            spotifyWarmFrame.src = 'about:blank';
            spotifyWarmFrame.remove();
            spotifyWarmFrame = null;
            setTimeout(prewarmSpotify, 250);
        }
    }

    function prewarmSpotify() {
        if (spotifyWarmFrame) {
            return;
        }
        spotifyWarmFrame = document.createElement('iframe');
        spotifyWarmFrame.className = 'term-media-frame';
        spotifyWarmFrame.src = spotifyEmbedUrl;
        spotifyWarmFrame.loading = 'eager';
        spotifyWarmFrame.width = '1';
        spotifyWarmFrame.height = '1';
        spotifyWarmFrame.frameBorder = '0';
        spotifyWarmFrame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        spotifyWarmFrame.referrerPolicy = 'strict-origin-when-cross-origin';
        spotifyWarmFrame.style.position = 'fixed';
        spotifyWarmFrame.style.left = '-9999px';
        spotifyWarmFrame.style.top = '-9999px';
        spotifyWarmFrame.style.width = '1px';
        spotifyWarmFrame.style.height = '1px';
        spotifyWarmFrame.style.opacity = '0';
        spotifyWarmFrame.style.pointerEvents = 'none';
        document.body.appendChild(spotifyWarmFrame);
    }

    function writePromptLine(raw) {
        var row = document.createElement('p');
        row.className = 'line-prompt';

        var user = document.createElement('span');
        user.className = 'prompt-user';
        user.textContent = 'user';
        row.appendChild(user);

        var at = document.createTextNode('@');
        row.appendChild(at);

        var host = document.createElement('span');
        host.className = 'prompt-host';
        host.textContent = 'portfolio';
        row.appendChild(host);

        var colon = document.createTextNode(':');
        row.appendChild(colon);

        var path = document.createElement('span');
        path.className = 'prompt-path';
        path.textContent = currentDir;
        row.appendChild(path);

        var dollar = document.createElement('span');
        dollar.className = 'prompt-dollar';
        dollar.textContent = '$';
        row.appendChild(dollar);

        var cmd = document.createElement('span');
        cmd.className = 'prompt-command';
        cmd.textContent = ' ' + raw;
        row.appendChild(cmd);

        if (commandRow && output.contains(commandRow)) {
            output.insertBefore(row, commandRow);
        } else {
            output.appendChild(row);
        }
        output.scrollTop = output.scrollHeight;
    }

    function paintChips(list) {
        suggestions.innerHTML = '';
        list.forEach(function(cmd) {
            var chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'term-panel-chip';
            chip.textContent = cmd;
            chip.addEventListener('click', function() {
                setInputValue(cmd);
                focusInput();
            });
            suggestions.appendChild(chip);
        });
    }

    function openPanel() {
        panel.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
        setTimeout(function() {
            focusInput();
        }, 50);
    }

    function closePanel() {
        panel.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
    }

    function getCurrentTheme() {
        if (document.body.classList.contains('theme-futuristic')) {
            return 'futuristic';
        }
        if (document.body.classList.contains('theme-minimal')) {
            return 'minimal';
        }
        return 'editorial';
    }

    function navigateTo(sectionId) {
        var target = document.getElementById(sectionId);
        if (!target) {
            writeLine('[error] section not found: ' + sectionId, 'error');
            return;
        }
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        writeLine('[ok] moved to #' + sectionId);
    }

    function renderTerminalDashboard() {
        writeLine('Portfolio shell :: live overview');
        writeLine('--------------------------------------------');
        writeLine('user: aryan yadav');
        writeLine('role: Full Stack Developer');
        writeLine('cwd: ' + currentDir);
        writeLine('quick start: help | ls | cd portfolio | whoami');
        writeLine('featured files: sandboxed.txt, finboard.txt, rag.txt');
        writeLine('tip: use ls -a for hidden entries');
    }

    function handleCommand(raw) {
        var command = normalize(raw);
        if (!command) {
            return;
        }
        writePromptLine(raw);

        if (command === 'help' || command === '?') {
            writeLine('[help] commands: help, status, clear, close, themes, modes');
            writeLine('[help] set theme <editorial|futuristic|minimal>');
            writeLine('[help] set mode <full|balanced|lite>');
            writeLine('[help] goto/go/open/nav <home|about|portfolio|services|contact>');
            writeLine('[help] fs: cd <portfolio|..|~>, ls, pwd, cat/type/file <name>');
            writeLine('[help] fun: neofetch, joke, black hole, whoami, play song');
            paintChips(['status', 'themes', 'modes', 'goto portfolio', 'close']);
            return;
        }
        if (command === 'status') {
            writeLine('[status] theme=' + getCurrentTheme() + ', mode=' + getPerformanceMode());
            return;
        }
        if (command === 'themes') {
            writeLine('[themes] editorial, futuristic, minimal');
            paintChips(['set theme editorial', 'set theme futuristic', 'set theme minimal']);
            return;
        }
        if (command === 'modes') {
            writeLine('[modes] full, balanced, lite');
            paintChips(['set mode full', 'set mode balanced', 'set mode lite']);
            return;
        }
        if (command === 'clear') {
            output.innerHTML = '';
            ensureCommandRow();
            writeLine('[ok] terminal cleared');
            renderTerminalDashboard();
            paintChips(baseChips);
            return;
        }
        if (command === 'pwd') {
            writeLine(currentDir);
            return;
        }
        var lsMatch = command.match(/^ls(?:\s+(-[a-z]+))?$/);
        if (lsMatch) {
            var flags = lsMatch[1] || '';
            var showAll = flags.indexOf('a') !== -1;
            if (currentDir === '~') {
                if (showAll) {
                    writeLine('.');
                    writeLine('..');
                }
                writeLine('portfolio/');
            } else {
                if (showAll) {
                    writeLine('.');
                    writeLine('..');
                }
                Object.keys(projectFiles).forEach(function(name) {
                    writeLine(name);
                });
            }
            return;
        }
        if (command === 'cd' || command === 'cd ~' || command === 'cd /' || command === 'cd ..') {
            currentDir = command === 'cd ..' ? '~' : '~';
            updatePrompt();
            return;
        }
        if (command === 'cd portfolio' || command === 'cd ./portfolio' || command === 'cd ~/portfolio') {
            currentDir = projectDir;
            updatePrompt();
            return;
        }
        if (command.indexOf('cd ') === 0) {
            writeLine('[error] path not found', 'error');
            return;
        }
        if (command.indexOf('cat ') === 0 || command.indexOf('type ') === 0 || command.indexOf('file ') === 0) {
            if (currentDir !== projectDir) {
                writeLine('[error] cd portfolio first', 'error');
                return;
            }
            var rawName = command.replace(/^(cat|type|file)\s+/, '');
            var fileName = normalizeFileName(rawName);
            var projectInfo = projectFiles[fileName];
            if (!projectInfo) {
                writeLine('[error] file not found: ' + rawName, 'error');
                return;
            }
            writeLine(projectInfo.title + ': ' + projectInfo.intro);
            writeLine('repo: ' + projectInfo.repo);
            if (projectInfo.live) {
                writeLine('live: ' + projectInfo.live);
            }
            return;
        }
        if (command === 'close' || command === 'exit') {
            writeLine('[ok] minimizing terminal');
            stopTerminalMediaPlayback();
            setTimeout(closePanel, 120);
            return;
        }
        if (command === 'neofetch') {
            writeLine('aryan@portfolio');
            writeLine('---------------------------');
            writeLine('Role: Full-stack developer');
            writeLine('Focus: High-performance apps + AI tools');
            writeLine('Stack: Node.js | Next.js | Docker | MongoDB');
            writeLine('Status: open to internships');
            return;
        }
        if (command === 'joke') {
            var jokes = [
                'I told my code to stop being lazy. It replied: later.',
                'There are 10 kinds of people: those who understand binary and those who do not.',
                'My code does not have bugs. It develops random features.',
                'All these years of grinding skills and doing good deeds has brought me nothing but misery.',
                'Love is not for me I suppose.'
            ];
            var randomIndex = Math.floor(Math.random() * jokes.length);
            writeLine('[joke] ' + jokes[randomIndex]);
            return;
        }
        if (command === 'black hole') {
            var quotes = [
                'A black hole is what happens when space gives up arguing with mass',
                'A black hole bends reality so hard, even time loses direction.',
                'You don’t see a black hole—you see everything else trying to avoid it.',
                'Time slows down due to two things one is if you travel close to SOL and other if the gravitational force is too high due to space-time fabric curvature ,however is it not possible that an object travelling near SOL can wrap space time and hence time slows?'
            ];
            var quoteIndex = Math.floor(Math.random() * quotes.length);
            writeLine('[quote] ' + quotes[quoteIndex]);
            return;
        }
        if (command === 'whoami') {
            writeLine('user: aryan yadav');
            writeLine('location: India');
            writeLine('role: Full Stack Developer');
            writeLine('passion: Building scalable backends & responsive interfaces');
            writeLine('github: https://github.com/Sandrocottus1');
            writeLine('leetcode: https://leetcode.com/u/_aryan0205/');
            writeLine('codeforces: https://codeforces.com/profile/itsmearyan0205');
            writeLine('status: Actively seeking opportunities ');
            return;
        }
        if (command === 'play song') {
            writeLine('[ok] now playing from spotify...');
            writeSpotifyEmbed('Now Playing', spotifyEmbedUrl);
            return;
        }
        if (command.indexOf('set theme ') === 0) {
            var theme = normalize(command.replace('set theme ', ''));
            if (theme !== 'editorial' && theme !== 'futuristic' && theme !== 'minimal') {
                writeLine('[error] invalid theme', 'error');
                return;
            }
            applyTheme(theme);
            writeLine('[ok] theme set to ' + theme);
            return;
        }
        if (command.indexOf('set mode ') === 0) {
            var mode = normalize(command.replace('set mode ', ''));
            if (mode !== 'full' && mode !== 'balanced' && mode !== 'lite') {
                writeLine('[error] invalid mode', 'error');
                return;
            }
            applyPerformanceMode(mode);
            writeLine('[ok] mode set to ' + mode);
            return;
        }
        var sectionId = extractSection(command);
        if (sectionId) {
            navigateTo(sectionId);
            return;
        }
        writeLine('[error] unknown command. type help', 'error');
    }

    toggle.addEventListener('click', function() {
        if (panel.hidden) {
            openPanel();
            return;
        }
        closePanel();
    });

    close.addEventListener('click', function() {
        stopTerminalMediaPlayback();
        closePanel();
    });

    output.addEventListener('click', function() {
        if (!panel.hidden) {
            focusInput();
        }
    });

    head.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !panel.hidden) {
            closePanel();
        }
    });

    document.addEventListener('click', function(event) {
        if (panel.hidden) {
            return;
        }
        if (root.contains(event.target)) {
            return;
        }
        if (toggle.contains(event.target)) {
            return;
        }
        closePanel();
    });

    toggle.setAttribute('aria-expanded', panel.hidden ? 'false' : 'true');

    paintChips(baseChips);
    ensureCommandRow();
    updatePrompt();
    renderTerminalDashboard();
    setTimeout(prewarmSpotify, 900);
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

var themeTransitionTimer = null;
var themeSwapTimer = null;
var themeFadeTimer = null;

function getCurrentThemeName() {
    var root = document.body;
    if (!root) {
        return 'editorial';
    }
    if (root.classList.contains('theme-futuristic')) {
        return 'futuristic';
    }
    if (root.classList.contains('theme-minimal')) {
        return 'minimal';
    }
    return 'editorial';
}

function applyTheme(themeName) {
    var root = document.body;
    if (!root) {
        return;
    }
    var safeTheme = themeName || 'editorial';
    var currentTheme = getCurrentThemeName();

    if (themeTransitionTimer) {
        clearTimeout(themeTransitionTimer);
    }
    if (themeSwapTimer) {
        clearTimeout(themeSwapTimer);
    }
    if (themeFadeTimer) {
        clearTimeout(themeFadeTimer);
    }

    if (safeTheme !== currentTheme) {
        root.classList.add('theme-fade-active');
        themeSwapTimer = setTimeout(function() {
            root.classList.add('theme-transition');
            root.classList.remove('theme-editorial', 'theme-futuristic', 'theme-minimal');
            root.classList.add('theme-' + safeTheme);
        }, 130);
        themeTransitionTimer = setTimeout(function() {
            root.classList.remove('theme-transition');
        }, 640);
        themeFadeTimer = setTimeout(function() {
            root.classList.remove('theme-fade-active');
        }, 500);
    } else {
        root.classList.remove('theme-editorial', 'theme-futuristic', 'theme-minimal');
        root.classList.add('theme-' + safeTheme);
    }

    localStorage.setItem('portfolio-theme', safeTheme);
    var buttons = document.querySelectorAll('.theme-btn');
    buttons.forEach(function(button) {
        var isActive = button.getAttribute('data-theme') === safeTheme;
        button.classList.toggle('is-active', isActive);
    });
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
