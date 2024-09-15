import goose from './../img/1.2_default_run.gif';

const article = document.querySelector('article');

const image = document.createElement('img');
// image.src = 'https://cdnb.artstation.com/p/assets/images/images/050/026/891/original/luiz-aquino-playing-exp.gif?1653908904';
image.src = goose;
image.alt = 'GOOOSE RUNNINGGGG'; // Provide an appropriate alt text

// set css to make the position absolute and draggable
image.style.position = 'absolute';
image.style.top = '100px';
image.style.left = '100px';
image.style.width = '150px';
image.style.cursor = 'move';
image.style.zIndex = '999';

image.addEventListener('mousedown', (event) => {
    event.preventDefault();
    
    // get cursor and image pos
    let shiftX = event.clientX - image.getBoundingClientRect().left;
    let shiftY = event.clientY - image.getBoundingClientRect().top;

    // fucking jank lol
    function moveAt(pageX, pageY) {
        image.style.left = pageX - shiftX + 'px';
        image.style.top  = pageY - shiftY + 'px';
    }

    // move the image
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // thanks gpt老师
    document.addEventListener('mousemove', onMouseMove);

    // remove listener when mouse is up
    image.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', onMouseMove);
    });
});

// ???
image.ondragstart = function() {
    return false;
};

// Support for API reference docs
const heading = article.querySelector('h1');
// Support for article docs with date
const date = article.querySelector('time')?.parentNode;

(date ?? heading).insertAdjacentElement('afterend', image);
