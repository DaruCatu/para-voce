// ========== ELEMENTOS DO DOM ==========
const slides = document.querySelectorAll('.slide');
const player = document.getElementById('player');
const start = document.getElementById('start');
const startBtn = document.getElementById('start-btn');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');

let started = false;
let currentSlideIndex = 0;

// ========== INÍCIO DO SITE ==========
startBtn.addEventListener('click', () => {
  started = true;
  start.style.display = 'none';
  progressBar.style.display = 'block';

  const firstSlide = slides[0];
  player.src = firstSlide.dataset.music;
  player.volume = 0.3;
  player.play().catch(e => console.log('Erro ao tocar música:', e));
  
  initCanvasAnimations();
});

// ========== OBSERVADOR DE SLIDES ==========
const observer = new IntersectionObserver(entries => {
  if (!started) return;

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      slides.forEach(s => s.classList.remove('active'));
      entry.target.classList.add('active');

      const music = entry.target.dataset.music;
      if (player.src && !player.src.includes(music)) {
        player.src = music;
        player.volume = 0.3;
        player.play().catch(e => console.log('Erro ao trocar música:', e));
      }

      // Atualizar índice do slide atual
      currentSlideIndex = Array.from(slides).indexOf(entry.target);
      updateProgressBar();
    }
  });
}, { threshold: 0.6 });

slides.forEach(slide => observer.observe(slide));

// ========== BARRA DE PROGRESSO ==========
function updateProgressBar() {
  const progress = ((currentSlideIndex + 1) / slides.length) * 100;
  progressFill.style.width = `${progress}%`;
}

// ========== ANIMAÇÕES DE CANVAS ==========
function initCanvasAnimations() {
  slides.forEach((slide, index) => {
    const canvas = slide.querySelector('.bg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const theme = slide.dataset.theme;
    
    // Ajustar tamanho do canvas
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Iniciar animação baseada no tema
    switch(theme) {
      case 'wave-pink':
        animateWaves(ctx, canvas, '#ff6b9d', '#000000');
        break;
      case 'wave-red':
        animateWaves(ctx, canvas, '#ff0844', '#ffffff');
        break;
      case 'stars-brown':
        animateStars(ctx, canvas, '#8d6e63', '#000000');
        break;
      case 'stars-cyan':
        animateStars(ctx, canvas, '#00bcd4', '#0a2540');
        break;
      case 'stars-golden':
        animateStars(ctx, canvas, '#ffd700', '#1a0f00');
        break;
      case 'liquid-red':
        animateLiquid(ctx, canvas);
        break;
      case 'sunflower':
        animateSunflower(ctx, canvas);
        break;
      case 'final':
        animateFinal(ctx, canvas);
        break;
    }
  });
}

// ========== ANIMAÇÃO DE ONDAS FLUIDAS ==========
function animateWaves(ctx, canvas, waveColor, bgColor) {
  let time = 0;
  
  function draw() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Múltiplas ondas
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + 
                  Math.sin((x * 0.01) + time + (i * 2)) * 100 * (i + 1) +
                  Math.sin((x * 0.02) + time * 1.5 + (i * 3)) * 50;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      
      const opacity = 0.3 - (i * 0.1);
      ctx.fillStyle = waveColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
      ctx.fill();
    }
    
    time += 0.02;
    requestAnimationFrame(draw);
  }
  
  draw();
}

// ========== ANIMAÇÃO DE ESTRELAS ==========
function animateStars(ctx, canvas, starColor, bgColor) {
  const stars = [];
  const numStars = 100;
  
  // Criar estrelas
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.01,
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }
  
  function draw() {
    // Gradiente de fundo
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, starColor);
    gradient.addColorStop(1, bgColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar estrelas
    stars.forEach(star => {
      star.alpha += star.speed * star.direction;
      
      if (star.alpha <= 0 || star.alpha >= 1) {
        star.direction *= -1;
      }
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.fill();
      
      // Glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'white';
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    
    requestAnimationFrame(draw);
  }
  
  draw();
}

// ========== ANIMAÇÃO LÍQUIDA DISTORCIDA ==========
function animateLiquid(ctx, canvas) {
  let time = 0;
  const particles = [];
  
  // Criar partículas
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 100 + 50,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      color: Math.random() > 0.5 ? '#ff0844' : '#000000'
    });
  }
  
  function draw() {
    ctx.fillStyle = 'rgba(20, 20, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce nas bordas
      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      
      // Distorção
      const distortX = Math.sin(time + particle.x * 0.01) * 20;
      const distortY = Math.cos(time + particle.y * 0.01) * 20;
      
      ctx.beginPath();
      ctx.arc(
        particle.x + distortX,
        particle.y + distortY,
        particle.size,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = particle.color + '40';
      ctx.fill();
    });
    
    time += 0.02;
    requestAnimationFrame(draw);
  }
  
  draw();
}

// ========== ANIMAÇÃO DE GIRASSÓIS ==========
function animateSunflower(ctx, canvas) {
  const sunflowers = [];
  
  // Criar girassóis na base
  for (let i = 0; i < 5; i++) {
    sunflowers.push({
      x: (canvas.width / 6) * (i + 1),
      y: canvas.height - 100,
      size: Math.random() * 30 + 40,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    });
  }
  
  function draw() {
    // Céu degradê
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#ffeb3b');
    gradient.addColorStop(0.5, '#ffa726');
    gradient.addColorStop(1, '#8d6e63');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar girassóis
    sunflowers.forEach(flower => {
      ctx.save();
      ctx.translate(flower.x, flower.y);
      ctx.rotate(flower.rotation);
      
      // Pétalas
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        ctx.beginPath();
        ctx.ellipse(0, -flower.size / 2, flower.size / 4, flower.size / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd700';
        ctx.fill();
      }
      
      // Centro
      ctx.beginPath();
      ctx.arc(0, 0, flower.size / 3, 0, Math.PI * 2);
      ctx.fillStyle = '#8d6e63';
      ctx.fill();
      
      ctx.restore();
      
      flower.rotation += flower.rotationSpeed;
    });
    
    requestAnimationFrame(draw);
  }
  
  draw();
}

// ========== ANIMAÇÃO FINAL ==========
function animateFinal(ctx, canvas) {
  const hearts = [];
  
  function createHeart() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.5,
      wobble: Math.random() * Math.PI * 2
    };
  }
  
  // Criar corações iniciais
  for (let i = 0; i < 20; i++) {
    hearts.push(createHeart());
  }
  
  function draw() {
    // Gradiente de fundo
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width
    );
    gradient.addColorStop(0, '#ff6b9d');
    gradient.addColorStop(0.5, '#ff1744');
    gradient.addColorStop(1, '#880e4f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar e atualizar corações
    hearts.forEach((heart, index) => {
      heart.y -= heart.speed;
      heart.wobble += 0.05;
      const wobbleX = Math.sin(heart.wobble) * 20;
      
      // Resetar se sair da tela
      if (heart.y < -50) {
        hearts[index] = createHeart();
      }
      
      // Desenhar coração
      ctx.save();
      ctx.translate(heart.x + wobbleX, heart.y);
      ctx.globalAlpha = heart.opacity;
      ctx.fillStyle = '#ffffff';
      ctx.font = `${heart.size}px serif`;
      ctx.fillText('❤️', 0, 0);
      ctx.restore();
    });
    
    requestAnimationFrame(draw);
  }
  
  draw();
}

// ========== CONTROLES DO PLAYER ==========
player.addEventListener('ended', () => {
  player.currentTime = 0;
  player.play().catch(e => console.log('Erro ao reiniciar música:', e));
});

// Ajustar volume gradualmente ao trocar música
player.addEventListener('play', () => {
  player.volume = 0;
  let vol = 0;
  const fadeIn = setInterval(() => {
    if (vol < 0.3) {
      vol += 0.05;
      player.volume = vol;
    } else {
      clearInterval(fadeIn);
    }
  }, 100);
});