//working with active item movement when clicked
const playlistItems = document.querySelectorAll('.playlist-item');
const carouselItems = document.querySelectorAll('#videoCarousel .carousel-item');

playlistItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const slideIndex = parseInt(item.getAttribute('data-slide-to'));

    //console.log(`Clicked playlist item ${slideIndex}`);

    // Update the active slide in the video carousel
    const activeCarouselItem = document.querySelector('#videoCarousel .carousel-item.active');
    if (activeCarouselItem) {
      activeCarouselItem.className = activeCarouselItem.className.replace(/\bactive\b/g, '');
    }
    if (carouselItems[slideIndex]) {
      carouselItems[slideIndex].className += ' active';
    }

    // Remove the active class from all playlist items
    document.querySelectorAll('.playlist-item.active').forEach(activeItem => {
      activeItem.className = activeItem.className.replace(/\bactive\b/g, '');
    });

    // Add the active class to the clicked playlist item
    const correspondingPlaylistItem = document.querySelector(`.playlist-item[data-slide-to="${slideIndex}"]`);
    if (correspondingPlaylistItem) {
      correspondingPlaylistItem.className += ' active';
    }
  });
});

const carousel = document.querySelector('#videoCarousel');
const playlist = document.querySelector('#videoPlaylist');
let activeSlide = 0;

carousel.addEventListener('slid.bs.carousel', () => {
 activeSlide = carousel.querySelector('.active').dataset.slideTo;
 //console.log(`Slide to playlist item 1 ${activeSlide}`)
  updatePlaylistActiveClass();
});
//console.log('test')
//console.log(`Slide to playlist item 2 ${activeSlide}`);

function updatePlaylistActiveClass() {
  const playlistItems = playlist.querySelectorAll('.playlist-item');
  playlistItems.forEach((item) => {
    const itemIndex = item.dataset.slideTo;
    if (itemIndex == activeSlide) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
    item.addEventListener('click', () => {
      //console.log(`Clicked videolist item ${itemIndex}`);
    });
  });
}
