interface GeeseCoords {
  top?: string;
  left?: string;
}

const image = document.createElement("img");

const goose_idle = chrome.runtime.getURL("img/goose_idle.gif");
const goose_run = chrome.runtime.getURL("img/goose_run.gif");
const goose_chomp = chrome.runtime.getURL("img/goose_chomp.gif");
const goose_dangle = chrome.runtime.getURL("img/goose_dangling.gif");
const goose_poop = chrome.runtime.getURL("img/goose_walk_poop.gif");

image.src = goose_idle;
image.alt = "GOOSE";

image.style.position = "absolute";
image.style.width = "100px";
image.style.cursor = "default";
image.style.zIndex = "9999999999999999";

let scale = 1.0;

const defaultCoords = { top: "50vh", left: "50vw" };

function getGeeseCoords(): Promise<{ top: string; left: string }> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["geeseCoords"], (result) => {
      const geeseCoords = result.geeseCoords || defaultCoords;
      resolve(geeseCoords); // Resolve the promise with the geeseCoords value
    });
  });
}

async function setGeeseCoords() {
  const geeseCoords = await getGeeseCoords(); // Await the value and assign it to a 'const'
  image.style.top = geeseCoords.top;
  image.style.left = geeseCoords.left;
  console.log("Geese Coordinates:", geeseCoords);
}

setGeeseCoords();

const IDLING = "IDLING";
const HUNT = "HUNT";

let gooseMode = IDLING;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "pomodoroEvent") {
    gooseMode = IDLING
    scale = 1.0;
    console.log("Pomodoro Event: ", message.message);
    console.log("Time: ", message.time);
    // Handle the Pomodoro event here (e.g., start a background task)
  }

  if (message.type === "breakEvent") {
    gooseMode = HUNT;
    console.log("Break Event: ", message.message);
    console.log("Time: ", message.time);
    // Handle the break event here (e.g., set a timer for the break)
  }
});

image.addEventListener("mousedown", (event) => {

  if (gooseMode === HUNT) {
    return;
  }

  image.src = goose_dangle;
  event.preventDefault();
  scale = 1;
  image.style.transform = `scale(${scale})`;

  let shiftX = event.clientX - image.getBoundingClientRect().left;
  let shiftY = event.clientY - image.getBoundingClientRect().top;

  function moveAt(pageX, pageY) {
    image.style.left = pageX - shiftX + "px";
    image.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  document.addEventListener("mousemove", onMouseMove);

  image.addEventListener("mouseup", () => {
    image.src = goose_idle;
    document.removeEventListener("mousemove", onMouseMove);
    const geeseCoords = { top: image.style.top, left: image.style.left };

    chrome.storage.local.set({ geeseCoords: geeseCoords }, function () {
      console.log("Geese Coords saved locally: ", geeseCoords);
    });
  });
});

document.addEventListener('mousemove', (event) => {


  const speed = 8;  // Adjust this to make it faster or slower

  let imageX = parseInt(image.style.left); 
  let imageY = parseInt(image.style.top);

  let mouseX = event.pageX - image.offsetWidth / 2;
  let mouseY = event.pageY - image.offsetHeight / 2; 

  function moveImage() {
    // Calculate the difference between the image and the mouse position

    if (gooseMode === IDLING) {
      return;
    }
    
    image.src = goose_chomp;
  
    let deltaX = mouseX - imageX;
    let deltaY = mouseY - imageY;

    // Calculate the distance to move this frame
    let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Only move if the distance is greater than a small threshold (to prevent jittering)
    if (distance > 1) {
      // Move the image in the direction of the mouse
      imageX += (deltaX / distance) * speed;
      imageY += (deltaY / distance) * speed;

      // Update the image position
      image.style.left = `${imageX}px`;
      image.style.top = `${imageY}px`;
      image.style.transform = `scale(${scale})`
      if (scale < 10) {
        scale += 0.001
      }
    }

    // Call this function again on the next frame
    requestAnimationFrame(moveImage);
  }

  // Start moving the image
  moveImage();
});

image.ondragstart = function () {
  return false;
};

document.body.appendChild(image);
