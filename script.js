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
// Autoplay is requested immediately on every visit/refresh. Some browsers may still
// block audible autoplay by policy; in that case playback begins on the visitor's
// first interaction anywhere on the page.
const musicToggle = document.getElementById('musicToggle');
const soundtrackAudio = document.getElementById('soundtrackAudio');
let soundtrackPlaying = false;
let userPausedSoundtrack = false;
let autoplayFallbackArmed = false;

function updateSoundtrackButton(playing){
  soundtrackPlaying = playing;
  musicToggle?.setAttribute('aria-pressed', String(playing));
  musicToggle?.setAttribute('aria-label', playing ? 'Pause BizBash soundtrack' : 'Play BizBash soundtrack');
  const label = musicToggle?.querySelector('.music-copy strong');
  if(label) label.textContent = playing ? 'PAUSE MUSIC' : 'PLAY MUSIC';
  const icon = musicToggle?.querySelector('.music-icon');
  if(icon) icon.textContent = playing ? 'Ⅱ' : '♪';
}

function removeAutoplayFallback(){
  if(!autoplayFallbackArmed) return;
  autoplayFallbackArmed = false;
  ['pointerdown','touchstart','keydown'].forEach(type =>
    document.removeEventListener(type, unlockAutoplay, true)
  );
}

async function playSoundtrack({fromAutoplay = false} = {}){
  if(!soundtrackAudio) return false;
  soundtrackAudio.volume = 0.38;
  try{
    await soundtrackAudio.play();
    userPausedSoundtrack = false;
    updateSoundtrackButton(true);
    removeAutoplayFallback();
    return true;
  }catch(err){
    updateSoundtrackButton(false);
    if(fromAutoplay) armAutoplayFallback();
    console.warn('Audible autoplay was blocked by the browser; waiting for the first page interaction.', err);
    return false;
  }
}

function pauseSoundtrack(){
  if(!soundtrackAudio) return;
  userPausedSoundtrack = true;
  removeAutoplayFallback();
  soundtrackAudio.pause();
  updateSoundtrackButton(false);
}

async function unlockAutoplay(){
  if(userPausedSoundtrack || soundtrackPlaying) return;
  await playSoundtrack();
}

function armAutoplayFallback(){
  if(autoplayFallbackArmed || userPausedSoundtrack || soundtrackPlaying) return;
  autoplayFallbackArmed = true;
  ['pointerdown','touchstart','keydown'].forEach(type =>
    document.addEventListener(type, unlockAutoplay, {capture:true, once:true})
  );
}

function attemptAutoplay(){
  if(!soundtrackAudio || userPausedSoundtrack || soundtrackPlaying) return;
  playSoundtrack({fromAutoplay:true});
}

musicToggle?.addEventListener('click', () => {
  if(soundtrackPlaying) pauseSoundtrack();
  else {
    userPausedSoundtrack = false;
    playSoundtrack();
  }
});

soundtrackAudio?.addEventListener('play', () => updateSoundtrackButton(true));
soundtrackAudio?.addEventListener('pause', () => updateSoundtrackButton(false));

// Try as soon as the document is ready, and again when restored/revisited via bfcache.
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attemptAutoplay, {once:true});
else attemptAutoplay();
window.addEventListener('pageshow', attemptAutoplay);
