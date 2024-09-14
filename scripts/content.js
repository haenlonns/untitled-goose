const article = document.querySelector("article");

const image = document.createElement("img");
image.src = "https://www.w3schools.com/images/w3schools_green.jpg"; // Replace with the actual relative path to your image
image.alt = "Goose GIF"; // Provide an appropriate alt text

// Support for API reference docs
const heading = article.querySelector("h1");
// Support for article docs with date
const date = article.querySelector("time")?.parentNode;

(date ?? heading).insertAdjacentElement("afterend", image);