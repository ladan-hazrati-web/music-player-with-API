const URL = "https://6609107ca2a5dd477b150c30.mockapi.io/playList";
const wrapperMusicPlayer = document.querySelector(".wrapper-music-player");
const loading = document.querySelector(".info");
const errorMessage = document.querySelector(".error-message");
let playList = null;
let currentIndex = 0;
let isPlaying = false;
const fetchData = async () => {
  try {
    const response = await fetch(URL);
    const json = await response.json();
    playList = json;

    loadmusic();
  } catch (error) {
    hideLoading();
    errorMessage.style.display = "flex";
    errorMessage.firstElementChild.innerText = error.message;
  }
};

//call function fetchData
fetchData();

function loadmusic() {
  hideLoading();
  const track = playList[currentIndex];
  const { singerName, musicName, coverSrc, audioSrc } = track;
  console.log(audioSrc);
  const musicPlayer = `
  <div class="music-player">
  <figure class="cover-music">
      <img src=${coverSrc} alt=${musicName}>
  </figure>
  <audio src=${audioSrc}  id="audio" ontimeupdate="eventHandle()" onended="endHandler()"></audio>
  <div class="info-music">
      <h2 class="singer-name">${singerName}</h2>
      <h3 class="music-name">${musicName}</h3>
  </div>
  <div class="wrapper-buttons">
      <div class="buttons">
          <button id="prev-btn"><i class="fa fa-backward" onclick="prevHandler()"></i></button>
          <button id="play-btn" onclick="playPauseMusic()"><i class="fa fa-play"></i></button>
          <button id="next-btn"><i class="fa fa-forward" onclick='nextHandler()'></i></button>
      </div>
  </div>
  <div class="time-music">
          <div>
              <p class="current-time">0:00</p>
              <p class="duration-time">0:00</p>
          </div>
          <input type="range" min="0" value="0" step="0.01" class="seek-slider" oninput='goToCurrentMusic()'>
  </div>
  <div class="volume-music">
      <div>
          <i class="fa fa-volume-down"></i>
          <input
          type="range"
          class="volume-slider"
          min="0"
          max="1"
          step="0.01"
          value="1"
          oninput='volumeHandler()'
        />
        <i class="fa fa-volume-up"></i>
      </div>
  </div>
</div>
  `;
  wrapperMusicPlayer.innerHTML = musicPlayer;
  wrapperMusicPlayer.style.display = "flex";
  if (isPlaying) {
    audio.play();
  }
}

function hideLoading() {
  loading.style.display = "none";
}

function playPauseMusic() {
  const audio = document.querySelector("#audio");
  const playBtn = document.querySelector("#play-btn");
  const playPauseBtn = playBtn.firstElementChild;
  const coverMusic = document.querySelector(".cover-music>img");
  if (isPlaying) {
    audio.pause();
    playPauseBtn.classList.replace("fa-pause", "fa-play");
    coverMusic.classList.remove("animation-rotate");
    isPlaying = false;
  } else {
    audio.play();
    playPauseBtn.classList.replace("fa-play", "fa-pause");
    coverMusic.classList.add("animation-rotate");
    isPlaying = true;
  }
}

function goToCurrentMusic() {
  const audio = document.querySelector("#audio");
  const seekSLider = document.querySelector(".seek-slider");
  let newTime = audio.duration * (seekSLider.value / 100);
  audio.currentTime = newTime;
}

function prevHandler() {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = playList.length - 1;
  }
  isPlaying = true;
  loadmusic();
  const coverMusic = document.querySelector(".cover-music>img");
  const playBtn = document.querySelector("#play-btn");
  playBtn.firstElementChild.classList.replace("fa-play", "fa-pause");
  coverMusic.classList.add("animation-rotate");
}

function nextHandler() {
  currentIndex++;
  if (currentIndex > playList.length - 1) {
    currentIndex = 0;
  }
  isPlaying = true;
  loadmusic();
  const playBtn = document.querySelector("#play-btn");
  const coverMusic = document.querySelector(".cover-music>img");
  playBtn.firstElementChild.classList.replace("fa-play", "fa-pause");
  coverMusic.classList.add("animation-rotate");
}
function volumeHandler() {
  const audio = document.getElementById("audio");
  const volumeSlider = document.querySelector(".volume-slider");
  audio.volume = volumeSlider.value;
}

function eventHandle() {
  const audio = document.getElementById("audio");
  const current = audio.currentTime;
  const duration = audio.duration;
  const precentage = (current / duration) * 100;
  const seekSLider = document.querySelector(".seek-slider");
  if (precentage) {
    seekSLider.value = precentage;
  }
  const total = document.querySelector(".duration-time");
  const currentTime = document.querySelector(".current-time");
  if (duration && current) {
    total.innerText = formatedTime(duration);
    currentTime.innerText = formatedTime(current);
  }
}

function formatedTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function endHandler() {
  const audio = document.querySelector("#audio");
  const playBtn = document.querySelector("#play-btn");
  const coverMusic = document.querySelector(".cover-music>img");
  playBtn.firstElementChild.classList.replace("fa-pause", "fa-play");
  coverMusic.classList.remove("animation-rotate");
  isPlaying = false;
}
