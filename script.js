const fonts = document.getElementsByClassName('f')

setTimeout(() => {
  let elems = fonts.length
  for (i = 0; i < elems; i++) {
    fonts[0].classList.remove('f')
  }
}, 1500)

const body = document.body;
const app = document.getElementById('app');

let sx = 0, // For scroll positions
    sy = 0;
let dx = sx, // For container positions
    dy = sy;


body.style.height = app.clientHeight + 'px';


app.style.position = 'fixed';
app.style.top = 0;
app.style.left = 0;

// Bind a scroll function
window.addEventListener('scroll', easeScroll);


function easeScroll() {
  
  sx = window.pageXOffset;
  sy = window.pageYOffset;
}


window.requestAnimationFrame(render);

function render(){
  //We calculate our container position by linear interpolation method
  body.style.height = app.clientHeight + 'px';
  dx = li(dx,sx,0.1);
  dy = li(dy,sy,0.1);
  
  dx = Math.floor(dx * 100) / 100;
  dy = Math.floor(dy * 100) / 100;
  
  
  app.style.transform = `translate3d(-${dx}px, -${dy}px, 0px)`;
 
  
  
  window.requestAnimationFrame(render);
}

function li(a, b, n) {
  return (1 - n) * a + n * b;
}