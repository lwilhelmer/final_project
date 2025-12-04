const pins = document.querySelectorAll(".pin");
const box = document.getElementById("memory-box");
const title = document.getElementById("memory-title");
const text = document.getElementById("memory-text");
const img = document.getElementById("memory-img");
const closeBtn = document.getElementById("close-btn");

pins.forEach(pin => {
    pin.addEventListener("click", () => {
        title.textContent = pin.dataset.title;
        text.textContent = pin.dataset.text;
        img.src = pin.dataset.img;
        box.classList.remove("hidden");
    });
});

closeBtn.addEventListener("click", () => {
    box.classList.add("hidden");
});
