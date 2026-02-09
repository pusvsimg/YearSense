(() => {
    'use strict';

    // ===== DATA =====

    const Q = [
        { key: 'home',       icon: '🏠', label: '是否回家过年？',       w: 30 },
        { key: 'redpacket',  icon: '🧧', label: '是否发红包？',         w: 20 },
        { key: 'overtime',   icon: '💼', label: '是否春节加班？',       w: -30 },
        { key: 'pressure',   icon: '💍', label: '是否被催婚催生？',     w: 15 },
        { key: 'chunwan',    icon: '📺', label: '是否看春晚？',         w: 10 },
        { key: 'fireworks',  icon: '🧨', label: '是否放烟花/鞭炮？',   w: 15 },
        { key: 'dumplings',  icon: '🥟', label: '是否吃饺子？',         w: 10 },
        { key: 'couplets',   icon: '📝', label: '是否贴春联？',         w: 10 },
        { key: 'newclothes', icon: '👔', label: '是否穿新衣？',         w: 10 },
        { key: 'visit',      icon: '👨‍👩‍👧‍👦', label: '是否走亲戚？', w: 15 },
        { key: 'mahjong',    icon: '🎴', label: '是否打麻将/打牌？',   w: 10 },
        { key: 'reunion',    icon: '🍲', label: '是否吃年夜饭？',       w: 15 },
        { key: 'paynewyear', icon: '🙏', label: '是否拜年？',           w: 15 },
        { key: 'receive',    icon: '🧧', label: '是否收到红包？',       w: 20 }
    ];

    const COMBOS = [
        { keys: ['reunion', 'chunwan'],       bonus: 5,   tag: '🌙 完美除夕夜' },
        { keys: ['fireworks', 'couplets'],    bonus: 5,   tag: '🎆 传统年味组合' },
        { keys: ['paynewyear', 'visit'],      bonus: 5,   tag: '🤝 社交达人' },
        { keys: ['redpacket', 'receive'],     bonus: 10,  tag: '🧧 红包大赢家' },
        { keys: ['home', 'overtime'],         bonus: -10, tag: '😢 打工人悲歌' },
        { keys: ['pressure', 'mahjong'],      bonus: 5,   tag: '🀄 以牌解压' },
        { keys: ['newclothes', 'paynewyear'], bonus: 5,   tag: '✨ 精神焕发' },
        { keys: ['dumplings', 'reunion'],     bonus: 5,   tag: '🥟 年味满桌' },
        { keys: ['home', 'visit', 'reunion'], bonus: 8,   tag: '👨‍👩‍👧‍👦 阖家团圆' }
    ];

    const LEVELS = [
        { min: 0,  max: 10,  title: '年味稀薄',     icon: '☕', desc: '这是过年吗？感觉像普通周末…' },
        { min: 11, max: 25,  title: '年味淡如水',   icon: '💧', desc: '宅家过年族，年味都被Wi-Fi信号吸收了' },
        { min: 26, max: 40,  title: '年味若有若无', icon: '🤔', desc: '勉强算过年，但总觉得少了点什么' },
        { min: 41, max: 55,  title: '年味半糖半甜', icon: '🍯', desc: '还行还行，有点过年的意思了' },
        { min: 56, max: 70,  title: '年味刚刚好',   icon: '😊', desc: '标准的过年模式，中规中矩' },
        { min: 71, max: 85,  title: '年味浓郁',     icon: '🎆', desc: '很充实！这才是该有的春节氛围' },
        { min: 86, max: 95,  title: '年味超标',     icon: '🎉', desc: '年味太足了！你是过年专业户吧？' },
        { min: 96, max: 100, title: '年味天花板',   icon: '🏆', desc: '完美春节！你就是年味本味！' }
    ];

    // ===== STATE =====

    const answers = {};
    let current = 0;
    const total = Q.length;

    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    // ===== DOM REFS =====

    const welcomeScreen = $('#welcomeScreen');
    const quizScreen    = $('#quizScreen');
    const resultScreen  = $('#resultScreen');
    const startBtn      = $('#startBtn');
    const prevBtn       = $('#prevBtn');
    const nextBtn       = $('#nextBtn');
    const submitBtn     = $('#submitBtn');
    const resetBtn      = $('#resetBtn');
    const track         = $('#track');
    const dotsContainer = $('#dots');
    const progressFill  = $('#progressFill');
    const currentNum    = $('#currentNum');
    const scoreRing     = $('#scoreRing');
    const scoreValue    = $('#scoreValue');
    const levelTitle    = $('#levelTitle');
    const levelDesc     = $('#levelDescription');
    const bonusTags     = $('#bonusTags');
    const canvas        = $('#particleCanvas');

    // ===== BUILD SLIDES =====

    function buildSlides() {
        track.innerHTML = '';
        Q.forEach((q, i) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.dataset.index = i;
            slide.innerHTML = `
                <div class="slide__icon">${q.icon}</div>
                <div class="slide__label">${q.label}</div>
                <div class="slide__options">
                    <button class="opt-btn" data-key="${q.key}" data-val="yes"><span>是</span></button>
                    <button class="opt-btn" data-key="${q.key}" data-val="no"><span>否</span></button>
                </div>
            `;
            track.appendChild(slide);
        });

        track.querySelectorAll('.opt-btn').forEach(btn => {
            btn.addEventListener('click', () => onAnswer(btn));
        });
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const d = document.createElement('span');
            d.className = 'dot';
            d.dataset.i = i;
            d.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(d);
        }
    }

    // ===== NAVIGATION =====

    function goTo(index) {
        current = Math.max(0, Math.min(total - 1, index));
        track.style.transform = `translateX(-${current * 100}%)`;
        currentNum.textContent = current + 1;
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === total - 1;
        updateDots();
        updateSubmitVisibility();
    }

    function updateDots() {
        dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
            d.classList.toggle('dot--active', i === current);
            d.classList.toggle('dot--done', answers[Q[i].key] != null);
        });
    }

    function updateProgress() {
        const count = Object.keys(answers).length;
        progressFill.style.width = ((count / total) * 100) + '%';
    }

    function updateSubmitVisibility() {
        const allDone = Object.keys(answers).length >= total;
        submitBtn.classList.toggle('hidden', !allDone);
    }

    // ===== ANSWER HANDLING =====

    function onAnswer(btn) {
        const key = btn.dataset.key;
        const val = btn.dataset.val;

        const slide = btn.closest('.slide');
        slide.querySelectorAll('.opt-btn').forEach(b => {
            b.classList.remove('opt-btn--selected', 'opt-btn--pop');
        });

        btn.classList.add('opt-btn--selected', 'opt-btn--pop');
        answers[key] = val;

        updateDots();
        updateProgress();
        updateSubmitVisibility();

        if (current < total - 1) {
            setTimeout(() => goTo(current + 1), 350);
        }
    }

    // ===== SCREEN TRANSITIONS =====

    function switchScreen(from, to) {
        from.classList.remove('screen--active');
        from.classList.add('screen--exit');
        setTimeout(() => {
            from.classList.remove('screen--exit');
            to.classList.add('screen--active');
        }, 350);
    }

    // ===== CALCULATE =====

    function calculate() {
        let score = 0;
        const activeCombos = [];

        for (const q of Q) {
            if (answers[q.key] === 'yes') score += q.w;
        }
        for (const c of COMBOS) {
            if (c.keys.every(k => answers[k] === 'yes')) {
                score += c.bonus;
                activeCombos.push(c);
            }
        }
        return { score: Math.max(0, Math.min(100, score)), activeCombos };
    }

    function getLevel(score) {
        for (const l of LEVELS) {
            if (score >= l.min && score <= l.max) return l;
        }
        return LEVELS[LEVELS.length - 1];
    }

    function animateNumber(el, target) {
        const start = performance.now();
        const dur = 1200;
        (function tick(now) {
            const t = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * ease);
            if (t < 1) requestAnimationFrame(tick);
        })(start);
    }

    function animateRing(score) {
        const circ = 2 * Math.PI * 85;
        const off = circ - (score / 100) * circ;
        scoreRing.style.strokeDasharray = circ;
        scoreRing.style.strokeDashoffset = circ;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scoreRing.style.strokeDashoffset = off;
            });
        });
    }

    function renderTags(combos) {
        bonusTags.innerHTML = '';
        combos.forEach((c, i) => {
            const s = document.createElement('span');
            s.className = 'bonus-tag';
            s.textContent = c.tag;
            s.style.animationDelay = (0.8 + i * 0.1) + 's';
            bonusTags.appendChild(s);
        });
    }

    function showResult() {
        const { score, activeCombos } = calculate();
        const level = getLevel(score);

        switchScreen(quizScreen, resultScreen);

        setTimeout(() => {
            animateNumber(scoreValue, score);
            animateRing(score);
            levelTitle.textContent = level.icon + ' ' + level.title;
            levelDesc.textContent = level.desc;
            renderTags(activeCombos);
            if (score >= 86) launchFireworks();
        }, 400);
    }

    function resetAll() {
        for (const k in answers) delete answers[k];

        track.querySelectorAll('.opt-btn').forEach(b => {
            b.classList.remove('opt-btn--selected', 'opt-btn--pop');
        });

        const circ = 2 * Math.PI * 85;
        scoreRing.style.strokeDashoffset = circ;
        scoreValue.textContent = '0';
        bonusTags.innerHTML = '';
        current = 0;

        switchScreen(resultScreen, quizScreen);
        setTimeout(() => {
            goTo(0);
            updateProgress();
            updateSubmitVisibility();
        }, 400);
    }

    // ===== SWIPE SUPPORT =====

    let touchStartX = 0;
    let touchDeltaX = 0;
    const carousel = $('#carousel');

    carousel.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchDeltaX = 0;
        track.style.transition = 'none';
    }, { passive: true });

    carousel.addEventListener('touchmove', e => {
        touchDeltaX = e.touches[0].clientX - touchStartX;
        const base = -current * carousel.offsetWidth;
        track.style.transform = `translateX(${base + touchDeltaX}px)`;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
        track.style.transition = '';
        if (Math.abs(touchDeltaX) > 50) {
            if (touchDeltaX < 0 && current < total - 1) goTo(current + 1);
            else if (touchDeltaX > 0 && current > 0) goTo(current - 1);
            else goTo(current);
        } else {
            goTo(current);
        }
    });

    // ===== KEYBOARD =====

    document.addEventListener('keydown', e => {
        if (!quizScreen.classList.contains('screen--active')) return;
        if (e.key === 'ArrowRight' && current < total - 1) goTo(current + 1);
        if (e.key === 'ArrowLeft' && current > 0) goTo(current - 1);
    });

    // ===== PARTICLE SYSTEM =====

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() { this.reset(true); }

        reset(scatter) {
            this.x = Math.random() * canvas.width;
            this.y = scatter ? Math.random() * canvas.height : -10;
            this.size = Math.random() * 3 + 1;
            this.vy = Math.random() * 0.5 + 0.2;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.isGold = Math.random() > 0.5;
            this.life = 1;
        }

        update() {
            this.y += this.vy;
            this.x += this.vx + Math.sin(this.y * 0.01) * 0.3;
            if (this.y > canvas.height + 10) this.reset(false);
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.isGold
                ? `rgba(212,160,23,${this.opacity})`
                : `rgba(196,30,42,${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        resizeCanvas();
        particles = [];
        const n = Math.min(40, Math.floor(canvas.width / 25));
        for (let i = 0; i < n; i++) particles.push(new Particle());
    }

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) { p.update(); p.draw(); }
        requestAnimationFrame(tick);
    }

    function launchFireworks() {
        for (let i = 0; i < 30; i++) {
            const p = new Particle();
            p.x = canvas.width / 2 + (Math.random() - 0.5) * 200;
            p.y = canvas.height * 0.3 + (Math.random() - 0.5) * 100;
            p.vx = (Math.random() - 0.5) * 4;
            p.vy = (Math.random() - 0.5) * 4;
            p.size = Math.random() * 4 + 2;
            p.opacity = 1;
            p.life = 1;
            const orig = p.update.bind(p);
            p.update = function () {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.02;
                this.life -= 0.008;
                this.opacity = this.life;
                this.size *= 0.998;
                if (this.life <= 0) {
                    const idx = particles.indexOf(this);
                    if (idx > -1) particles.splice(idx, 1);
                }
            };
            particles.push(p);
        }
    }

    window.addEventListener('resize', resizeCanvas);

    // ===== EVENTS =====

    startBtn.addEventListener('click', () => {
        switchScreen(welcomeScreen, quizScreen);
        setTimeout(() => goTo(0), 400);
    });

    prevBtn.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
    nextBtn.addEventListener('click', () => { if (current < total - 1) goTo(current + 1); });
    submitBtn.addEventListener('click', showResult);
    resetBtn.addEventListener('click', resetAll);

    // ===== INIT =====

    buildSlides();
    buildDots();
    initParticles();
    tick();
})();
