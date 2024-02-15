let numbers = [];
let lockedNumbers = [];
let rotateOnMouseMove = false;

function lockNumbers() {
  rotateOnMouseMove = false;
  document.body.style.transform = "";
  lockedNumbers = numbers.slice();
  clearNumbers();
}

function clearNumbers() {
  const floatingNumbers = document.querySelectorAll(".number");
  floatingNumbers.forEach((numberElement) => {
    document.body.removeChild(numberElement);
  });

  numbers = [];
}

function randomizeCharacter(char) {
  if (char === " ") {
    return " ";
  } else {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const currentChar = char.toLowerCase();
    const randomIndex = (alphabet.indexOf(currentChar) + 1) % alphabet.length;
    const randomizedChar = alphabet[randomIndex];

    return char === char.toUpperCase()
      ? randomizedChar.toUpperCase()
      : randomizedChar;
  }
}

document.getElementById("ageInput").addEventListener("click", function () {
  rotateOnMouseMove = !rotateOnMouseMove;
});

document.addEventListener("mousemove", function (event) {
  if (rotateOnMouseMove) {
    const sensitivityFactor = 0.1;
    const angle = Math.atan2(
      event.clientY - window.innerHeight / 2,
      event.clientX - window.innerWidth / 2
    );
    const degree = angle * (180 / Math.PI) * sensitivityFactor;
    const rotation = `rotate(${degree}deg)`;

    document.body.style.transform = rotation;
  }
});

document.getElementById("nameInput").addEventListener("input", function () {
  const nameInput = document.getElementById("nameInput");
  const currentValue = nameInput.value;
  const lastChar = nameInput.dataset.lastChar || "";

  if (currentValue.length > 1 && currentValue.slice(-1) !== lastChar) {
    const randomizedChar = randomizeCharacter(currentValue.slice(-1));
    nameInput.value = currentValue.slice(0, -1) + randomizedChar;
    nameInput.dataset.lastChar = randomizedChar;
  } else if (currentValue.length === 1) {
    nameInput.dataset.lastChar = currentValue;
  }

  const name = nameInput.value;
  document.getElementById("clearButton").textContent = `Klar`;
});

document.getElementById("clearButton").addEventListener("click", lockNumbers);

document.getElementById("ageInput").addEventListener("click", function () {
  generateNumbers();
});

function generateNumbers() {
  clearNumbers();

  for (let i = 0; i < 30; i++) {
    const numberElement = document.createElement("div");
    const randomNumber = Math.floor(Math.random() * 10);

    numberElement.textContent = randomNumber;
    numberElement.classList.add("number");
    numberElement.style.left = Math.random() * (window.innerWidth - 50) + "px";
    numberElement.style.top = Math.random() * (window.innerHeight - 50) + "px";
    numberElement.style.animation =
      "float 1s linear infinite, moveRandom 3s linear infinite";

    numberElement.onclick = function () {
      selectNumber(randomNumber);
      document.body.removeChild(numberElement);
    };

    document.body.appendChild(numberElement);
    numbers.push(randomNumber);
  }
}

function selectNumber(number) {
  const ageInput = document.getElementById("ageInput");
  ageInput.value += number;
}


const papper = document.getElementById("papper");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureButton = document.getElementById("captureButton");
const fleeingButton = document.querySelector(".fleeing-button");
const imageContainer = document.getElementById("imageProfile");

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(function (stream) {
    video.srcObject = stream;
  })
  .catch(function (error) {
    console.error("Kunde inte hämta kameran: ", error);
  });

captureButton.addEventListener("click", function () {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d");

  tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

  const existingImage = imageContainer.querySelector("img");
  if (existingImage) {
    existingImage.parentNode.removeChild(existingImage);
  }

  const newCanvas = document.createElement("canvas");
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;
  const newCtx = newCanvas.getContext("2d");

  newCtx.drawImage(tempCanvas, 0, 0, newCanvas.width, newCanvas.height);

  pixelate(newCanvas, 25);

  const img = new Image();
  img.src = newCanvas.toDataURL();

  imageContainer.appendChild(img);
  imageContainer.style.float = "right"; // Flytta resultatet till höger sida
});

function pixelate(canvas, size) {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, size, size);
  ctx.drawImage(canvas, 0, 0, size, size, 0, 0, canvas.width, canvas.height);
}

// Lyssna på Klar-knappen för namn
document.getElementById("nameSubmitButton").addEventListener("click", function () {
  const nameInput = document.getElementById("nameInput").value;
  document.getElementById("nameProfile").textContent = `Namn: ${nameInput}`;
});

// Lyssna på Klar-knappen för ålder
document.getElementById("clearButton").addEventListener("click", function () {
  const ageInput = document.getElementById("ageInput").value;
  document.getElementById("ageProfile").textContent = `Ålder: ${ageInput}`;
});

// Eventlyssnare för den flygande knappen
const overlay = document.getElementById('overlay');
let isFleeing = false;

function updatePosition(event) {
  const rect = fleeingButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distanceX = centerX - event.clientX;
  const distanceY = centerY - event.clientY;

  // Begränsa den nya positionen till sidans gränser
  const newX = Math.min(
    Math.max(centerX + (centerX - event.clientX) * 1.5, 0),
    window.innerWidth
  );
  const newY = Math.min(
    Math.max(centerY + (centerY - event.clientY) * 1.5, 0),
    window.innerHeight
  );

  // Uppdatera knappens position
  fleeingButton.style.transition = "transform 0.5s ease-out";
  fleeingButton.style.transform = `translate(${newX - centerX}px, ${
    newY - centerY
  }px)`;
}

document.addEventListener("mousemove", updatePosition);

fleeingButton.addEventListener("click", function (event) {
  isFleeing = true;
  overlay.style.display = 'block'; // Visa overlay när knappen klickas
  event.preventDefault();
  event.stopPropagation();

  // Starta timeout för att refresha sidan efter 15 sekunder
  setTimeout(function() {
    location.reload();
  }, 13000); // 15000 millisekunder = 15 sekunder
});

const errorSound = new Audio("https://cdn.glitch.global/626ab5de-6812-4aea-b816-83553b116de8/WINDOWS%20ERRORERROR.mp3?v=1707646955573");

function playErrorSound() {
    errorSound.play();
}

document.querySelector('.fleeing-button').addEventListener('click', function() {
    for (let i = 0; i < 12; i++) {
        setTimeout(playErrorSound, i * 100); // Spela ljudet med 100ms fördröjning för varje iteration
    }
});

document.getElementById("backButton").addEventListener("click", function () {
  window.location.href = "https://un-fortu.net/";
});

document.getElementById("nextButton").addEventListener("click", function () {
  window.location.href = "https://ai-robot-rom.com/";
});
