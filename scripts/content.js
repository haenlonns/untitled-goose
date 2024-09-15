const image = document.createElement("img");
image.src = chrome.runtime.getURL("img/goose_chomp.gif");
image.alt = "GOOSE RUNNING";

image.style.position = "absolute";
image.style.top = "50vh";
image.style.left = "50vw";
image.style.width = "100px";
image.style.cursor = "default";
image.style.zIndex = "9999999999999999";

image.addEventListener("mousedown", (event) => {
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
    document.removeEventListener("mousemove", onMouseMove);
  });
});

image.ondragstart = function () {
  return false;
};

document.body.appendChild(image);
