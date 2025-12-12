const mapContainer = document.getElementById("map-container");
const pins = document.querySelectorAll(".pin");
const memoryBox = document.getElementById("memory-box");
const memoryTitle = document.getElementById("memory-title");
const memoryText = document.getElementById("memory-text");
const memoryImg = document.getElementById("memory-img");
const closeBtn = document.getElementById("close-btn");
const playBtn = document.getElementById("play-audio-btn");
const pauseBtn = document.getElementById("pause-audio-btn");

const pinForm = document.getElementById("pin-form");
const pinTitle = document.getElementById("pin-title");
const pinText = document.getElementById("pin-text");
const pinImg = document.getElementById("pin-img");
const pinImgFile = document.getElementById("pin-img-file");
const pinAudio = document.getElementById("pin-audio");
const savePinBtn = document.getElementById("save-pin-btn");
const cancelPinBtn = document.getElementById("cancel-pin-btn");

let audioPlayer = null;
let editingPin = null;
let uploadedImageURL = "";

// ----------- MEMORY BOX FUNCTION -----------
function showMemory(pin) {
  memoryBox.classList.remove("hidden");
  memoryTitle.textContent = pin.dataset.title;
  memoryText.textContent = pin.dataset.text;
  memoryImg.src = pin.dataset.img;

  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }

  if (pin.dataset.audio) {
    audioPlayer = new Audio(pin.dataset.audio);
    audioPlayer.play().catch((e) => console.log("Audio blocked:", e));
    playBtn.classList.remove("hidden");
    pauseBtn.classList.remove("hidden");
  } else {
    playBtn.classList.add("hidden");
    pauseBtn.classList.add("hidden");
  }
}

pins.forEach((pin) => {
  pin.addEventListener("click", (e) => {
    e.stopPropagation();
    showMemory(pin);
  });
});

playBtn.addEventListener("click", () => {
  if (audioPlayer) audioPlayer.play();
});
pauseBtn.addEventListener("click", () => {
  if (audioPlayer) audioPlayer.pause();
});
closeBtn.addEventListener("click", () => {
  memoryBox.classList.add("hidden");
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }
});

// ----------- CREATE PIN FUNCTION -----------
function createPin(data) {
  const pin = document.createElement("div");
  pin.classList.add("user-pin");
  pin.style.top = data.top;
  pin.style.left = data.left;
  pin.dataset.title = data.title;
  pin.dataset.text = data.text;
  pin.dataset.img = data.img;
  pin.dataset.audio = data.audio || "";

  // create delete button
  const delBtn = document.createElement("div");
  delBtn.textContent = "×";
  delBtn.style.position = "absolute";
  delBtn.style.top = "-8px";
  delBtn.style.right = "-8px";
  delBtn.style.width = "16px";
  delBtn.style.height = "16px";
  delBtn.style.background = "white";
  delBtn.style.border = "1px solid red";
  delBtn.style.borderRadius = "50%";
  delBtn.style.color = "red";
  delBtn.style.fontSize = "12px";
  delBtn.style.textAlign = "center";
  delBtn.style.lineHeight = "14px";
  delBtn.style.cursor = "pointer";
  delBtn.style.zIndex = "5";
  delBtn.classList.add("pin-delete-btn");
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    pin.remove();
    savePinsToStorage();
  });

  pin.appendChild(delBtn);

  // single click shows memory box
  pin.addEventListener("click", (e) => {
    e.stopPropagation();
    showMemory(pin);
  });

  mapContainer.appendChild(pin);
  return pin;
}

// ----------- CLICK MAP TO ADD PIN -----------
mapContainer.addEventListener("click", (e) => {
  if (e.target.id !== "map-img") return;
  const rect = mapContainer.getBoundingClientRect();
  const top = ((e.clientY - rect.top) / rect.height) * 100 + "%";
  const left = ((e.clientX - rect.left) / rect.width) * 100 + "%";

  editingPin = createPin({
    top,
    left,
    title: "",
    text: "",
    img: "",
    audio: "",
  });

  pinForm.classList.remove("hidden");
});

// ----------- HANDLE IMAGE UPLOAD -----------
pinImgFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    uploadedImageURL = event.target.result;
  };
  reader.readAsDataURL(file);
});

// ----------- SAVE / EDIT PIN -----------
savePinBtn.addEventListener("click", () => {
  if (!editingPin) return;

  editingPin.dataset.title = pinTitle.value;
  editingPin.dataset.text = pinText.value;
  editingPin.dataset.audio = pinAudio.value;
  editingPin.dataset.img = uploadedImageURL || pinImg.value;

  pinForm.classList.add("hidden");
  savePinsToStorage();
  editingPin = null;

  uploadedImageURL = "";
  pinImgFile.value = "";
});

// ----------- CANCEL PIN ----------
cancelPinBtn.addEventListener("click", () => {
  if (
    editingPin &&
    editingPin.classList.contains("user-pin") &&
    !editingPin.dataset.title
  ) {
    editingPin.remove();
  }
  pinForm.classList.add("hidden");
  editingPin = null;
});

// ----------- LOCAL STORAGE ----------
function savePinsToStorage() {
  const userPins = [];
  document.querySelectorAll(".user-pin").forEach((pin) => {
    userPins.push({
      top: pin.style.top,
      left: pin.style.left,
      title: pin.dataset.title,
      text: pin.dataset.text,
      img: pin.dataset.img,
      audio: pin.dataset.audio,
    });
  });
  localStorage.setItem("userPins", JSON.stringify(userPins));
}

function loadPinsFromStorage() {
  const pinsData = JSON.parse(localStorage.getItem("userPins") || "[]");
  pinsData.forEach((data) => createPin(data));
}

loadPinsFromStorage();
