// ==================== AUDIO MODULE ====================
// One audio element, one play request. No duplicate playback.
const BirthdayAudio=(()=>{let audio=null,started=false;function init(el){audio=el;audio.src='audio/birthday.mp3';audio.preload='auto';audio.loop=false;audio.load();}async function arm(){if(!audio||started)return;started=true;audio.muted=true;try{await audio.play()}catch(e){started=false;throw e}}function revealFromBeginning(){if(!audio)return;audio.currentTime=0;audio.muted=false;audio.play().catch(()=>{});}return{init,arm,revealFromBeginning}})();
