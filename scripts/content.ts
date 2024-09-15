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

image.ondragstart = function () {
  return false;
};

document.body.appendChild(image);
