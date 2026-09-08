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
// We request audible autoplay immediately. Modern browsers can block first-visit
// audible autoplay at browser level; when that happens, ANY normal user gesture
// on the page (not specifically the music button) unlocks playback automatically.
const musicToggle = document.getElementById('musicToggle');
const soundtrackAudio = document.getElementById('soundtrackAudio');
let soundtrackPlaying = false;
let userPausedSoundtrack = false;
let unlockArmed = false;

function updateSoundtrackButton(playing){
  soundtrackPlaying = playing;
  musicToggle?.setAttribute('aria-pressed', String(playing));
  musicToggle?.setAttribute('aria-label', playing ? 'Pause BizBash soundtrack' : 'Play BizBash soundtrack');
  const label = musicToggle?.querySelector('.music-copy strong');
  if(label) label.textContent = playing ? 'PAUSE MUSIC' : 'PLAY MUSIC';
  const icon = musicToggle?.querySelector('.music-icon');
  if(icon) icon.textContent = playing ? 'Ⅱ' : '♪';
}

function disarmUnlock(){
  if(!unlockArmed) return;
  unlockArmed = false;
  ['pointerup','click','touchend','keydown'].forEach(type =>
    document.removeEventListener(type, unlockOnGesture, true)
  );
}

async function playSoundtrack({fromAutoplay = false} = {}){
  if(!soundtrackAudio || userPausedSoundtrack) return false;
  soundtrackAudio.loop = true;
  soundtrackAudio.volume = 0.38;
  soundtrackAudio.muted = false;
  try{
    await soundtrackAudio.play();
    updateSoundtrackButton(true);
    disarmUnlock();
    try{ localStorage.setItem('bizbashSound', 'on'); }catch(_){}
    return true;
  }catch(err){
    updateSoundtrackButton(false);
    if(fromAutoplay) armUnlock();
    return false;
  }
}

function pauseSoundtrack(){
  if(!soundtrackAudio) return;
  userPausedSoundtrack = true;
  disarmUnlock();
  soundtrackAudio.pause();
  updateSoundtrackButton(false);
  try{ localStorage.setItem('bizbashSound', 'off'); }catch(_){}
}

async function unlockOnGesture(){
  if(userPausedSoundtrack || soundtrackPlaying) {
    disarmUnlock();
    return;
  }
  const ok = await playSoundtrack();
  if(ok) disarmUnlock();
}

function armUnlock(){
  if(unlockArmed || userPausedSoundtrack || soundtrackPlaying) return;
  unlockArmed = true;
  // Use gesture events that browsers recognize as user activation. Keep all
  // listeners until playback actually succeeds rather than consuming one early.
  ['pointerup','click','touchend','keydown'].forEach(type =>
    document.addEventListener(type, unlockOnGesture, true)
  );
}

function attemptAutoplay(){
  if(!soundtrackAudio || userPausedSoundtrack || soundtrackPlaying) return;
  playSoundtrack({fromAutoplay:true});
}

musicToggle?.addEventListener('click', (event) => {
  // Prevent the global unlock listener from racing this explicit control.
  event.stopPropagation();
  if(soundtrackPlaying) pauseSoundtrack();
  else {
    userPausedSoundtrack = false;
    playSoundtrack();
  }
});

soundtrackAudio?.addEventListener('play', () => updateSoundtrackButton(true));
soundtrackAudio?.addEventListener('pause', () => updateSoundtrackButton(false));

// Ask the browser for autoplay at the earliest useful moments.
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attemptAutoplay, {once:true});
} else {
  attemptAutoplay();
}
window.addEventListener('load', attemptAutoplay, {once:true});
window.addEventListener('pageshow', attemptAutoplay);

// If the browser blocks first-visit audible autoplay, this ensures the first
// click/tap/key anywhere on the website starts it without requiring PLAY MUSIC.
armUnlock();

