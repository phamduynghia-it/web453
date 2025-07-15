const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let animationId = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

window.addEventListener("resize", () => {
    resizeCanvas();
    initParticlesForText(texts[currentIndex]);
});

let introTexts = ["3", "2", "1", "🖤"];
let mainTexts = [
    "HAPPY BIRTHDAY",
    "HUY HOÀNG",
    "HAPPY BIRTHDAY\n TO YOU",
    "thành công và \nhạnh phúc nhé🍀",
];
let texts = introTexts;
let phase = "intro";
let currentIndex = 0;
let particles = [];
let mode = "gather";
let lastSwitchTime = Date.now();
const gatherDuration = 5000; // 2s
const explodeDuration = 1000; // 0.8s

function getFontSize() {
    return Math.min(canvas.width, canvas.height) * 0.2;
}

function splitTextToLines(text) {
    return text.split("\n");
}

function createTextPoints(text) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${getFontSize()}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#B08088";

    const lines = splitTextToLines(text);
    const lineHeight = getFontSize() * 1.2;
    lines.forEach((line, i) => {
        ctx.fillText(
            line,
            canvas.width / 2,
            canvas.height / 2 + (i - (lines.length - 1) / 2) * lineHeight
        );
    });

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const points = [];
    for (let y = 0; y < canvas.height; y += 5) {
        for (let x = 0; x < canvas.width; x += 5) {
            let i = (y * canvas.width + x) * 4;
            if (data[i + 3] > 128) {
                points.push({ x, y });
            }
        }
    }
    return points;
}

function Particle(x, y) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.dest = { x, y };
    this.r = 2;
    this.vx = 0;
    this.vy = 0;
    this.friction = 0.9;
    this.blinkPhase = Math.random() * Math.PI * 2;

    this.update = function () {
        if (mode === "gather") {
            let dx = this.dest.x - this.x;
            let dy = this.dest.y - this.y;
            this.vx += dx * 0.01;
            this.vy += dy * 0.01;
        } else if (mode === "explode") {
            this.vx += (Math.random() - 0.5) * 2;
            this.vy += (Math.random() - 0.5) * 2;
        }
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
    };

    this.draw = function () {
        let blink =
            0.4 + 0.2 * Math.abs(Math.sin(Date.now() / 300 + this.blinkPhase));
        ctx.beginPath();
        // Pha màu: 50% hạt màu #B08088, 50% hạt màu trắng
        let useWhite = Math.random() < 0.5;
        if (useWhite) {
            ctx.fillStyle = `rgba(255,255,255,${blink * 1.5})`;
        } else {
            ctx.fillStyle = `rgba(176,128,136,${blink * 1.5})`;
        }
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255,255,255,0.6)";
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    };
}

function initParticlesForText(text) {
    const points = createTextPoints(text);
    for (let i = 0; i < points.length; i++) {
        if (!particles[i]) {
            particles[i] = new Particle(points[i].x, points[i].y);
        } else {
            particles[i].dest = points[i];
        }
    }
    particles = particles.slice(0, points.length);
}

function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
        p.update();
        p.draw();
    });

    const now = Date.now();
    const duration = mode === "gather" ? gatherDuration : explodeDuration;

    if (now - lastSwitchTime > duration) {
        mode = mode === "gather" ? "explode" : "gather";

        if (mode === "gather") {
            currentIndex++;
            if (currentIndex >= texts.length) {
                if (phase === "intro") {
                    phase = "main";
                    texts = mainTexts;
                    currentIndex = 0;
                } else {
                    currentIndex = 0;
                }
            }
            initParticlesForText(texts[currentIndex]);
        }

        lastSwitchTime = now;
    }
}

initParticlesForText(texts[currentIndex]);
animate();

// === MUSIC TOGGLE ===
let isMusicMuted = false;

function toggleMusic() {
    const audio = document.getElementById("bg-music");
    const musicToggle = document.getElementById("music-toggle");
    if (!audio) return;

    if (audio.paused) {
        audio.muted = false;
        audio
            .play()
            .then(() => {
                isMusicMuted = false;
                musicToggle.textContent = "🎵";
            })
            .catch((e) => console.warn("Play blocked:", e));
        return;
    }

    isMusicMuted = !isMusicMuted;
    audio.muted = isMusicMuted;
    musicToggle.textContent = isMusicMuted ? "🔇" : "🎵";
}

const musicToggleBtn = document.getElementById("music-toggle");
musicToggleBtn.addEventListener("click", toggleMusic);

// === ORIENTATION ===
let lastOrientation =
    window.innerWidth > window.innerHeight ? "landscape" : "portrait";

function checkOrientation() {
    const alertDiv = document.getElementById("rotate-alert");
    const isPortrait = window.innerHeight > window.innerWidth;
    document.body.classList.toggle("portrait", isPortrait);

    if (isPortrait) {
        alertDiv.style.display = "flex";
        noLoop();
        cancelAnimationFrame(animationId);
    } else {
        alertDiv.style.display = "none";
        loop();
        animate();
    }

    const newOrientation = isPortrait ? "portrait" : "landscape";
    if (lastOrientation === "portrait" && newOrientation === "landscape") {
        window.location.reload();
    }
    lastOrientation = newOrientation;
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("DOMContentLoaded", checkOrientation);
