const image = document.createElement("img");

const goose_idle  = chrome.runtime.getURL("img/goose_idle.gif");
const goose_run   = chrome.runtime.getURL("img/goose_run.gif");
const goose_chomp = chrome.runtime.getURL("img/goose_chomp.gif");

image.src = goose_idle;
image.alt = "GOOSE";

image.style.position = "absolute";
image.style.top = "100px";
image.style.left = "100px";
image.style.width = "150px";
image.style.cursor = "move";
image.style.zIndex = "9999999999999999";

image.addEventListener("mousedown", (event) => {
  image.src = goose_chomp;
  event.preventDefault();

  let shiftX = event.clientX - image.getBoundingClientRect().left;
  let shiftY = event.clientY - image.getBoundingClientRect().top;

  function moveAt(pageX, pageY) {
    image.style.left = pageX - shiftX + "px";
    image.style.top =  pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  document.addEventListener("mousemove", onMouseMove);

  image.addEventListener("mouseup", () => {
    image.src = goose_idle;
    document.removeEventListener("mousemove", onMouseMove);
  });
});

image.ondragstart = function () {
  return false;
};

document.body.appendChild(image);
