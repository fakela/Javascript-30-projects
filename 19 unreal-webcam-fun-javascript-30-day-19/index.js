const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const rgb = document.querySelector('.rgb');

let filter = '';

function getVideo() {
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
  .then(MediaStream => {
    video.srcObject = MediaStream;
    video.play();
  })
  .catch(err => {
    console.error('Oh no!', err);
  })
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // // mess with them
    switch (filter) {
      case 'red':
        pixels = redEffect(pixels)
        ctx.globalAlpha = 1;
        rgb.style.display = 'none';
        break;
      case 'green':
        pixels = greenEffect(pixels)
        ctx.globalAlpha = 1;
        rgb.style.display = 'none';
        break;
      case 'blue':
        pixels = blueEffect(pixels)
        ctx.globalAlpha = 1;
        rgb.style.display = 'none';
        break;
      case 'rgb':
        pixels = rgbSplit(pixels)
        ctx.globalAlpha = 0.4;
        rgb.style.display = 'none';
        break;
      case 'greenScreen':
        pixels = greenScreen(pixels)
        ctx.globalAlpha = 1;
        rgb.style.display = 'block';
        break;
      default:
        pixels = pixels
        rgb.style.display = 'none';
    }
    // // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16)
}

function takePhoto() {

  // take the data out of the canvas
  const data = canvas.toDataURL('images/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML= `<img src="${data}" alt="Handsome Man" />`
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 50 // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 500 // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // BLUE
  }
  return pixels;
}

function greenEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] - 500 // RED
    pixels.data[i + 1] = pixels.data[i + 1] + 50 // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] - 500 // BLUE
  }
  return pixels;
}

function blueEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] - 500 // RED
    pixels.data[i + 1] = pixels.data[i + 1] * 0.5 // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] + 50 // BLUE
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 100] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 150] = pixels.data[i + 2]; // BLUE
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i+=4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
    && green >= levels.gmin
    && blue >= levels.gmin
    && red <= levels.rmax
    && green <= levels.gmax
    && blue <= levels.bmax) {
      // take it out
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

function setFilter(currentFilter) {
  filter = currentFilter;
  return filter;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);