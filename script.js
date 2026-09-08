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

// BizBash soundtrack — the only audio source used by this site.
// Browsers block unsolicited audio, so playback begins only after the visitor presses the control.
const musicToggle = document.getElementById('musicToggle');
const youtubeAudio = document.getElementById('youtubeAudio');
const soundtrackId = 'Qm-eDEx5qaQ';
let soundtrackPlaying = false;

function startSoundtrack(){
  if (!youtubeAudio || soundtrackPlaying) return;
  const iframe = document.createElement('iframe');
  iframe.width = '1';
  iframe.height = '1';
  iframe.title = 'BizBash 6.0 soundtrack';
  iframe.allow = 'autoplay; encrypted-media';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.src = `https://www.youtube.com/embed/${soundtrackId}?autoplay=1&loop=1&playlist=${soundtrackId}&controls=0&disablekb=1&fs=0&playsinline=1&rel=0`;
  youtubeAudio.replaceChildren(iframe);
  soundtrackPlaying = true;
  musicToggle?.setAttribute('aria-pressed','true');
  musicToggle?.setAttribute('aria-label','Stop BizBash soundtrack');
  const label = musicToggle?.querySelector('.music-copy strong');
  if(label) label.textContent = 'STOP MUSIC';
}

function stopSoundtrack(){
  if (!youtubeAudio) return;
  youtubeAudio.replaceChildren();
  soundtrackPlaying = false;
  musicToggle?.setAttribute('aria-pressed','false');
  musicToggle?.setAttribute('aria-label','Play BizBash soundtrack');
  const label = musicToggle?.querySelector('.music-copy strong');
  if(label) label.textContent = 'PLAY MUSIC';
}

musicToggle?.addEventListener('click', () => soundtrackPlaying ? stopSoundtrack() : startSoundtrack());
