const pins = document.querySelectorAll(".pin");
const memoryBox = document.getElementById("memory-box");
const memoryTitle = document.getElementById("memory-title");
const memoryText = document.getElementById("memory-text");
const memoryImg = document.getElementById("memory-img");
const closeBtn = document.getElementById("close-btn");
const playBtn = document.getElementById("play-audio-btn");
const pauseBtn = document.getElementById("pause-audio-btn");

// Global audio variable (initially null)
let audioPlayer = null;

pins.forEach((pin) => {
  pin.addEventListener("click", () => {
    // Show memory box
    memoryBox.classList.remove("hidden");
    memoryTitle.textContent = pin.dataset.title;
    memoryText.textContent = pin.dataset.text;
    memoryImg.src = pin.dataset.img;

    // Stop previous audio if any
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }

    // If pin has audio, create new Audio object and play
    if (pin.dataset.audio && pin.dataset.audio !== "") {
      audioPlayer = new Audio(pin.dataset.audio);
      audioPlayer
        .play()
        .catch((e) =>
          console.log("Audio play blocked until user interaction:", e)
        );

      // Show play/pause buttons
      playBtn.classList.remove("hidden");
      pauseBtn.classList.remove("hidden");
    } else {
      // Hide buttons if no audio
      playBtn.classList.add("hidden");
      pauseBtn.classList.add("hidden");
    }
  });
});

// Play/pause buttons
playBtn.addEventListener("click", () => {
  if (audioPlayer) audioPlayer.play();
});

pauseBtn.addEventListener("click", () => {
  if (audioPlayer) audioPlayer.pause();
});

// Close memory box
closeBtn.addEventListener("click", () => {
  memoryBox.classList.add("hidden");

  // Stop audio when closing
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }
});
