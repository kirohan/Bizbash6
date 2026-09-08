const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const deadline = new Date('2026-09-15T23:59:00+06:00').getTime();
function updateCountdown(){
  const diff = deadline - Date.now();
  const ids = ['days','hours','minutes','seconds'];
  if(diff <= 0){
    document.querySelector('.countdown-label').textContent = 'Registration deadline reached';
    ids.forEach(id => document.getElementById(id).textContent = '00');
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  [d,h,m,s].forEach((v,i)=>document.getElementById(ids[i]).textContent=String(v).padStart(2,'0'));
}
updateCountdown();
setInterval(updateCountdown, 1000);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// BizBash soundtrack — user-provided local audio asset.
// Browsers require a user gesture before audio playback, so this starts only when the visitor presses the header control.
const musicToggle = document.getElementById('musicToggle');
const soundtrackAudio = document.getElementById('soundtrackAudio');
let soundtrackPlaying = false;

function updateSoundtrackButton(playing){
  soundtrackPlaying = playing;
  musicToggle?.setAttribute('aria-pressed', String(playing));
  musicToggle?.setAttribute('aria-label', playing ? 'Pause BizBash soundtrack' : 'Play BizBash soundtrack');
  const label = musicToggle?.querySelector('.music-copy strong');
  if(label) label.textContent = playing ? 'PAUSE MUSIC' : 'PLAY MUSIC';
  const icon = musicToggle?.querySelector('.music-icon');
  if(icon) icon.textContent = playing ? 'Ⅱ' : '♪';
}

async function playSoundtrack(){
  if(!soundtrackAudio) return;
  soundtrackAudio.volume = 0.38;
  try{
    await soundtrackAudio.play();
    updateSoundtrackButton(true);
  }catch(err){
    updateSoundtrackButton(false);
    console.warn('Soundtrack playback was blocked by the browser.', err);
  }
}

function pauseSoundtrack(){
  if(!soundtrackAudio) return;
  soundtrackAudio.pause();
  updateSoundtrackButton(false);
}

musicToggle?.addEventListener('click', () => soundtrackPlaying ? pauseSoundtrack() : playSoundtrack());
soundtrackAudio?.addEventListener('play', () => updateSoundtrackButton(true));
soundtrackAudio?.addEventListener('pause', () => updateSoundtrackButton(false));
