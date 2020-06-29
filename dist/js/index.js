const grid = document.querySelector(".grid");
const navMenu = document.querySelector(".nav-menu");
const navIcon = document.querySelector(".nav-icon");
const navItems = document.querySelectorAll(".nav-menu__items--item");
const photosLinks = document.querySelectorAll(".photos-link");
const photosContainer = document.querySelector(".photos-container");
const arrowUp = document.querySelector(".go-up");
const peopleFilter = document.querySelector(".people");
const placesFilter = document.querySelector(".places");
const eventsFilter = document.querySelector(".events");
const photosUnderlay = document.querySelector(".photos__underlay");

// masonry
const msnry = new Masonry(grid, {
  itemSelector: ".grid-item",
  columnWidth: ".grid-sizer",
  percentPosition: true,
});

imagesLoaded(grid).on("progress", function () {
  msnry.layout();
});

// menu
let menuOpened = false;

navIcon.addEventListener("click", toggleMenu);

function toggleMenu() {
  if (!menuOpened) {
    navMenu.classList.add("open");
    navItems.forEach((item) => item.classList.add("open"));
    navIcon.firstChild.classList.remove("fa-minus");
    navIcon.firstChild.classList.add("fa-times");
    menuOpened = true;
  } else {
    navMenu.classList.remove("open");
    navItems.forEach((item) => item.classList.remove("open"));
    navIcon.firstChild.classList.add("fa-minus");
    navIcon.firstChild.classList.remove("fa-times");
    menuOpened = false;
  }
}

// photos
document.addEventListener("DOMContentLoaded", getPhotos);

async function getPhotos() {
  try {
    let result = await fetch("data.json");
    let data = await result.json();
    savePhotos(data);
    displayPhotos(data);
  } catch (error) {
    console.log(error);
  }
}

function savePhotos(data) {
  localStorage.setItem("photos", JSON.stringify(data));
}

function getPhotosFromStorage() {
  return localStorage.getItem("photos")
    ? JSON.parse(localStorage.getItem("photos"))
    : undefined;
}

function displayPhotos(data) {
  let photos = getPhotosFromStorage();
  if (!photos) data = photos;
  let first30photos = photos.filter((photo) => {
    return photo.id < 29;
  });
  first30photos.map((photo) => {
    photosContainer.innerHTML += `
    <div class="photo">
    <div class="photo__overlay">
    <i class="fas fa-times exit-gallery"></i>
    <i class="fas fa-chevron-left gallery-left"></i>
    <i class="fas fa-chevron-right gallery-right"></i>
    </div>
    <img class="photo-img" src=${photo.url} alt="" />
    </div>`;
  });
}

window.addEventListener("load", scrollDown);

function scrollDown() {
  window.addEventListener("mousewheel", (event) => {
    if (event.wheelDeltaY < 0) {
      arrowUp.classList.add("show");
    }
    if (event.wheelDeltaY > 0) arrowUp.classList.remove("show");
  });
}

peopleFilter.addEventListener("click", displayPeople);

function displayPeople() {
  let photos = getPhotosFromStorage();
  let filteredPhotos = photos.filter((photo) => {
    return photo.category === "people";
  });
  photosContainer.innerHTML = "";
  filteredPhotos.map((photo) => {
    photosContainer.innerHTML += `
    <div class="photo">
    <div class="photo__overlay">
    <i class="fas fa-times exit-gallery"></i>
    <i class="fas fa-chevron-left gallery-left"></i>
    <i class="fas fa-chevron-right gallery-right"></i>
    </div>
    <img class="photo-img" src=${photo.url} alt="" />
    </div>`;
  });
}

placesFilter.addEventListener("click", displayPlaces);

function displayPlaces() {
  let photos = getPhotosFromStorage();
  let filteredPhotos = photos.filter((photo) => {
    return photo.category === "places";
  });
  photosContainer.innerHTML = ``;
  filteredPhotos.map((photo) => {
    photosContainer.innerHTML += `
    <div class="photo">
    <div class="photo__overlay">
    <i class="fas fa-times exit-gallery"></i>
    <i class="fas fa-chevron-left gallery-left"></i>
    <i class="fas fa-chevron-right gallery-right"></i>
    </div>
    <img class="photo-img" src=${photo.url} alt="" />
    </div>`;
  });
}

eventsFilter.addEventListener("click", displayEvents);

function displayEvents() {
  let photos = getPhotosFromStorage();
  let filteredPhotos = photos.filter((photo) => {
    return photo.category === "events";
  });
  photosContainer.innerHTML = ``;
  filteredPhotos.map((photo) => {
    photosContainer.innerHTML += `
    <div class="photo">
    <div class="photo__overlay">
    <i class="fas fa-times exit-gallery"></i>
    <i class="fas fa-chevron-left gallery-left"></i>
    <i class="fas fa-chevron-right gallery-right"></i>
    </div>
    <img class="photo-img" src=${photo.url} alt="" />
    </div>`;
  });
}

// gallery

photosContainer.addEventListener("click", (e) => showGallery(e));

function showGallery(e) {
  if (e.target.classList.contains("photo-img")) {
    e.target.parentElement.classList.add("show-in-gallery");
    e.target.classList.add("show-photo-in-gallery");
    e.target.parentElement.classList.add("clicked");
    e.target.previousElementSibling.classList.add("show");
    photosUnderlay.classList.add("show");
  }
}

photosContainer.addEventListener("click", (e) => exitGallery(e));

function exitGallery(e) {
  if (e.target.classList.contains("exit-gallery")) {
    e.target.parentElement.parentElement.classList.remove("show-in-gallery");
    e.target.parentElement.parentElement.lastElementChild.classList.remove(
      "show-photo-in-gallery"
    );
    e.target.parentElement.parentElement.classList.add("clicked");
    e.target.parentElement.classList.remove("show");
    photosUnderlay.classList.remove("show");
  }
}

photosContainer.addEventListener("click", (e) => showNextPhoto(e));

function showNextPhoto(e) {
  if (e.target.classList.contains("gallery-right")) {
    e.target.parentElement.parentElement.classList.remove("show-in-gallery");
    e.target.parentElement.parentElement.lastElementChild.classList.remove(
      "show-photo-in-gallery"
    );
    e.target.parentElement.parentElement.classList.remove("clicked");
    e.target.parentElement.classList.remove("show");

    if (!e.target.parentElement.parentElement.nextElementSibling) {
      e.target.parentElement.parentElement.parentElement.firstElementChild.classList.add(
        "show-in-gallery"
      );
      e.target.parentElement.parentElement.parentElement.firstElementChild.lastElementChild.classList.add(
        "show-photo-in-gallery"
      );
      e.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.classList.add(
        "show"
      );
    } else {
      e.target.parentElement.parentElement.nextElementSibling.classList.add(
        "show-in-gallery"
      );
      e.target.parentElement.parentElement.nextElementSibling.lastElementChild.classList.add(
        "show-photo-in-gallery"
      );
      e.target.parentElement.parentElement.nextElementSibling.firstElementChild.classList.add(
        "show"
      );
    }
  }
}

photosContainer.addEventListener("click", (e) => showPreviousPhoto(e));

function showPreviousPhoto(e) {
  if (e.target.classList.contains("gallery-left")) {
    e.target.parentElement.parentElement.classList.remove("show-in-gallery");
    e.target.parentElement.parentElement.lastElementChild.classList.remove(
      "show-photo-in-gallery"
    );
    e.target.parentElement.parentElement.classList.remove("clicked");
    e.target.parentElement.classList.remove("show");
    if (!e.target.parentElement.parentElement.previousElementSibling) {
      e.target.parentElement.parentElement.parentElement.lastElementChild.classList.add(
        "show-in-gallery"
      );
      e.target.parentElement.parentElement.parentElement.lastElementChild.lastElementChild.classList.add(
        "show-photo-in-gallery"
      );
      e.target.parentElement.parentElement.parentElement.lastElementChild.firstElementChild.classList.add(
        "show"
      );
    } else {
      e.target.parentElement.parentElement.previousElementSibling.classList.add(
        "show-in-gallery"
      );
      e.target.parentElement.parentElement.previousElementSibling.lastElementChild.classList.add(
        "show-photo-in-gallery"
      );
      e.target.parentElement.parentElement.previousElementSibling.firstElementChild.classList.add(
        "show"
      );
    }
  }
}
