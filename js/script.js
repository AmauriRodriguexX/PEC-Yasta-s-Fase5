const $videoModal = document.getElementById("video-modal");
const $videoSource = document.getElementById("player");

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
let videoPlayStatus = {};
let percentageSended = {};
let intervalId;
let hasBeenPaused = false;

function getYoutubeVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/embed\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return (match && match[1]) ? match[1] : null;
}

function onPlayerReady(event) {
    percentageSended = {};
}

function getNearestVideoPercentage(value) {
  const allowedValues = [10, 25, 50, 75];
  let nearest = allowedValues[0];
  let minDifference = Math.abs(value - allowedValues[0]);

  for (let i = 1; i < allowedValues.length; i++) {
    let difference = Math.abs(value - allowedValues[i]);
    if (difference < minDifference) {
      minDifference = difference;
      nearest = allowedValues[i];
    }
  }
  
  return nearest;
}

function checkVideoProgress() {
  const currentTime = player.getCurrentTime();
  const videoDuration = player.getDuration();
  if (currentTime !== undefined && videoDuration !== 0) {
    const percentageWatched = (currentTime / videoDuration) * 100;
    const roundedPercentage = Math.round(percentageWatched);
    switch (roundedPercentage) {
      case 10:
        if (!(10 in percentageSended)) {
          percentageSended[10] = false;
        }
        if(!percentageSended[10]) {
          percentageSended[10] = true;
          sendVideoProgressEvent(10);
        }
        break;
      case 25:
        if (!(25 in percentageSended)) {
          percentageSended[25] = false;
        }
        if(!percentageSended[25]) {
          percentageSended[25] = true;
          sendVideoProgressEvent(25);
        }
        break;
      case 50:
        if (!(50 in percentageSended)) {
          percentageSended[50] = false;
        }
        if(!percentageSended[50]) {
          percentageSended[50] = true;
          sendVideoProgressEvent(50);
        }
        break;
      case 75:
        if (!(75 in percentageSended)) {
          percentageSended[75] = false;
        }
        if(!percentageSended[75]) {
          percentageSended[75] = true;
          sendVideoProgressEvent(75);
        }
        break;
    }
  }
}

function onPlayerStateChange(event) {
  const ytFrame = document.getElementById('player');
  const videoId = getYoutubeVideoId(ytFrame.src);
  const competitorIndex = ytFrame.getAttribute('competitor-index');
  const group = ytFrame.getAttribute('group-name');
  const competitor = currentGroupData[competitorIndex];
  if (!(videoId in videoPlayStatus)) {
    videoPlayStatus[videoId] = false;
    onVideoStart(group, ytFrame.src)
  }

  if (event.data == YT.PlayerState.PLAYING ) {
    hasBeenPaused = false;
    clearInterval(intervalId);
    intervalId = setInterval(checkVideoProgress, 50);
    if(!videoPlayStatus[videoId]) {
      videoPlayStatus[videoId] = true;
    }
  } else if (event.data == YT.PlayerState.PAUSED) {
    hasBeenPaused = true;
    clearInterval(intervalId);
    const percentageWatched = (player.getCurrentTime() / player.getDuration()) * 100;
    sendVideoProgressEvent(percentageWatched);
  } else if (event.data == YT.PlayerState.ENDED) {
    clearInterval(intervalId);
    percentageSended = {}; 
    videoPlayStatus[videoId] = false;
    onVideoCompletion(group, ytFrame.src)
  }
}


const openModal = (videoSrc, name, business, index, groupName) => {
  if ($videoModal && $videoSource) {
      $videoModal.style.display = "block";
      $videoSource.setAttribute('competitor-index', index);
      $videoSource.setAttribute('group-name', groupName);
      onKnowTheStory(name, buildYoutubeEmbedLink(videoSrc));
  }
  if (player) {
      player.destroy();
  }
  
  player = new YT.Player('player', {
      videoId: videoSrc, // Aquí usaremos el ID directamente
      playerVars: {
          'rel': 0,
      },
      events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
      }
  });
};


const closeModal = () => {
  if ($videoModal) {    
    clearInterval(intervalId);
    $videoModal.style.display = "none"; 
    const percentageWatched = (player.getCurrentTime() / player.getDuration()) * 100;
    if(percentageWatched < 90 && percentageWatched > 0 && !hasBeenPaused) {
      sendVideoProgressEvent(percentageWatched);
    }    
    player.destroy();
  }
};

const sendVideoProgressEvent = (percentageWatched) => {
  const ytFrame = document.getElementById('player');
  const competitorIndex = ytFrame.getAttribute('competitor-index');
  const group = ytFrame.getAttribute('group-name');
  onVideoPause(group,getNearestVideoPercentage(percentageWatched),ytFrame.src);
}

// Close the modal if the user clicks anywhere outside of it
window.onclick = (event) => {
  if (event.target === $videoModal) {
    closeModal("click fuera");
  }
};

const carousel = document.querySelector('.carousel');
let isDragging = false;
let startX;
let scrollLeft;

const goToCB = () => {
  window.location.href = 'https://www.compartamos.com.mx/compartamos';
}

const goToAbout = () => {
  window.location.href = 'acerca-de.html';
}

const goToWinners = () => {
  window.location.href = 'ganadores.html';
}

document.getElementById('hamburger-icon').addEventListener('click', function() {
  this.classList.toggle('active');
  document.getElementById('mobile-nav').classList.toggle('active');
});

carousel.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('touchstart', (e) => {
  isDragging = true;
  startX = e.touches[0].clientX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('mouseup', () => {
  isDragging = false;
});

carousel.addEventListener('touchend', () => {
  isDragging = false;
});

carousel.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 3;
  carousel.scrollLeft = scrollLeft - walk;
});

carousel.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.touches[0].clientX - carousel.offsetLeft;
  const walk = (x - startX) * 3;
  carousel.scrollLeft = scrollLeft - walk;
});

document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.carousel-button');
  buttons[0].classList.add('selected');

  buttons.forEach(button => {
    button.addEventListener('click', function() {
      buttons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
    });
  });
});

const groups = {
  Participacion_familiar: [
    {
      number: "1",
      name: "Martha Ramón",
      image: "./assets/images/ganadores/yastas-participante-1.png",
      description: "Su historia es un ejemplo de emprendimiento y unión familiar, a través de su negocio Martha inspira a muchas familias a luchar por sus sueños.",
      videoId: "wR7bEp9A_j0"
  }
  ]
};




var currentGroupData = [];
document.addEventListener('DOMContentLoaded', async function () {
  const buttons = document.querySelectorAll('.carousel-button');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  let currentIndex = 0;
  const competitorGroup = document.querySelector('.competitor-group');
  currentGroupData = [];
  updateGroupContent(buttons[0].textContent,0, groups[buttons[0].getAttribute('data-group')], false);
  buttons.forEach((button,index) => {
    let disabled = false;
    const group = button.getAttribute('data-group');
    button.addEventListener('click', function () {
      const groupKey = Object.keys(groups)[index];
      buttons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      currentGroupData = groups[group];
      updateGroupContent(button.textContent,index+1, groups[group], disabled);
    });
  });
  updateCarouselArrow(0);

  function updateSelectedButton() {
    buttons.forEach(btn => btn.classList.remove('selected'));
    buttons[currentIndex].classList.add('selected');
    updateCarouselArrow(currentIndex);
  }

  prevButton.addEventListener('click', function () {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : buttons.length - 1;
    updateSelectedButton();
    updateGroupContent(buttons[currentIndex].textContent, currentIndex + 1, groups[buttons[currentIndex].getAttribute('data-group')], false);
  });

  nextButton.addEventListener('click', function () {
    currentIndex = (currentIndex < buttons.length - 1) ? currentIndex + 1 : 0;
    updateSelectedButton();
    updateGroupContent(buttons[currentIndex].textContent, currentIndex + 1, groups[buttons[currentIndex].getAttribute('data-group')], false);
  });

  function updateGroupContent(groupName,groupNumber,groupData, disabled) {
      competitorGroup.innerHTML = '';

      groupData.forEach((competitor, index) => {
        competitorGroup.innerHTML += `
          <div class="competitor">
            <div class="competitor-img" onclick="openModal('${competitor.videoId}', '${competitor.name}', '${competitor.description}', '${index}', '${groupName}')">
              <img src="${competitor.image}" alt="${competitor.name}" width="150" height="60" />
            </div>
          </div>
          <div class="actions">
            <div class="history">
              <p class="competitor-name" onclick="openModal('${competitor.videoId}', '${competitor.name}', '${competitor.description}', '${index}', '${groupName}')">
                ${competitor.name}
              </p>
              <p class="competitor-group-name">${groupName}</p>
              <p id="competitor-description" class="description">${competitor.description}</p>
              <div class="button-container" 
                onclick="openModal('${competitor.videoId}', '${competitor.name}', '${competitor.description}', '${index}', '${groupName}')">
                <button class="watch-video">
                  <p>Conoce su historia</p>
                  <div class="play-button"><img src="./assets/images/icon_play.png" alt="bubble" /></div>
                </button>
              </div>
            </div> 
          </div>
        `;
      
        const descriptions = document.querySelectorAll('#competitor-description');
      
        let maxHeight = 0;
      
        descriptions.forEach(description => {
          if (description.offsetHeight > maxHeight) {
            maxHeight = description.offsetHeight;
          }
        });
      
        descriptions.forEach(description => {
          description.style.height = maxHeight + 'px';
        });
      });
  }
});



const updateCarouselArrow = (index) => {
  if(index == 0) {
    $carouselLeftArrow.classList.remove('active');
    $carouselLeftArrow.classList.add('inactive');
  }
  else {
    $carouselLeftArrow.classList.remove('inactive');
    $carouselLeftArrow.classList.add('active');
  }
  if(index == Object.keys(groups).length-1) {
    $carouselRightArrow.classList.remove('active');
    $carouselRightArrow.classList.add('inactive');
  }
  else {
    $carouselRightArrow.classList.remove('inactive');
    $carouselRightArrow.classList.add('active');
  }
}

function share(to) {
  const currentUrl = encodeURIComponent(window.location.href);
  url = "";
  switch (to) {
    case 'Facebook':
      url = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
      break;
    case 'Whatsapp':
      url = `https://wa.me/?text=${currentUrl}`;
      break;
  }
  if (url) {
    window.open(url, "_blank");
  }
}

let currentIndex = 0;
const $galleryItems = document.querySelectorAll('.gallery-item img');
const $modalViewGallery = document.getElementById("gallery-view-modal");
const $fullGallery = document.getElementById("gallery-modal");
const $imageCount = document.getElementById('image-count');
const $modalImg = document.getElementById('gallery-image');
const $leftArrow = document.getElementById('left-arrow');
const $rightArrow = document.getElementById('right-arrow');
let totalImages = $galleryItems.length;
$imageCount.textContent = `${totalImages}`;

document.querySelectorAll('.gallery-item img').forEach((img, index) => {
  img.addEventListener('click', function() {
    openModalGallery(this.src,index);
  });
});

const openModalGallery = (imageSrc, index) => {
  onGallery(imageSrc)
  currentIndex = index;
  const $galleryImage = document.getElementById("gallery-image");
  updateImageIndex();
  $galleryImage.src= imageSrc;
  $modalViewGallery.style.display = "block";
  updateGalleryArrow(index);
};

const closeModalGallery = () => {
  if ($modalViewGallery) {
    $modalViewGallery.style.display = "none";
  }
};

const openFullGallery = () => {
  window.location.href= "galeria.html"
};

const closeFullGallery = () => {
  if ($fullGallery) {
    $fullGallery.style.display = "none";
  }
};

function updateImageIndex() {
  const $imageIndex = document.getElementById('imageIndex');
  $imageIndex.textContent = `${currentIndex + 1} / ${totalImages}`;
  updateGalleryArrow(currentIndex)
}

const prevImage = () => {
  currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalImages - 1;
  onGallery($galleryItems[currentIndex].src)
  $modalImg.src = $galleryItems[currentIndex].src;
  updateImageIndex();
}

const nextImage = () => {
  currentIndex = (currentIndex < totalImages - 1) ? currentIndex + 1 : 0;
  onGallery($galleryItems[currentIndex].src)
  $modalImg.src = $galleryItems[currentIndex].src;
  updateImageIndex();
}

const updateGalleryArrow = (index) => {
  if(index == 0) {
    $leftArrow.classList.remove('active');
    $leftArrow.classList.add('inactive');
  }
  else {
    $leftArrow.classList.remove('inactive');
    $leftArrow.classList.add('active');
  }
  if(index == totalImages-1) {
    $rightArrow.classList.remove('active');
    $rightArrow.classList.add('inactive');
  }
  else {
    $rightArrow.classList.remove('inactive');
    $rightArrow.classList.add('active');
  }
}

// MARK: HELPERS

function getFullImageUrl(localPath) {
  return `${window.location.origin}/${localPath.replace("./", "")}`;
}

/**
 * Formats a duration from seconds into a string formatted as mm:ss.
 * @param {number} duration - The video duration in seconds.
 * @returns {string} The formatted duration in the format of mm:ss.
 */
const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
};

/**
 * Calculates the scroll percentage of the webpage.
 * @returns {number} The scroll percentage, a value between 0 and 100.
 */
const calculateScrollPercentage = () => {
  // Getting the scroll position of the current document
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;

  // Getting the entire height of the document
  const scrollHeight =
    document.documentElement.scrollHeight || document.body.scrollHeight;

  // Getting the height of the viewport
  const clientHeight = document.documentElement.clientHeight;

  // The total scrollable area is the total height minus the viewport height
  const scrollableHeight = scrollHeight - clientHeight;

  // Calculating the percentage of the scroll
  const scrolledPercentage = Math.floor((scrollTop / scrollableHeight) * 100);

  return scrolledPercentage;
};

/**
 * Combines an array of objects into a single object.
 * @param {Object[]} arrayOfObjects - The array of objects to combine.
 * @return {Object} - The combined object.
 */
const combineObjects = (arrayOfObjects) => {
  return arrayOfObjects.reduce((accumulator, currentObject) => {
    return { ...accumulator, ...currentObject };
  }, {});
};

/**
 * Saves an object to localStorage.
 * @param {string} key - The key under which to store the object.
 * @param {Object} objectToSave - The object to save.
 */
const saveToLocalStorage = (key, objectToSave) => {
  const objectString = JSON.stringify(objectToSave);
  window.localStorage.setItem(key, objectString);
};

/**
 * Retrieves an object from localStorage.
 * @param {string} key - The key of the object to retrieve.
 * @return {Object|null} - The retrieved object or null if not found.
 */
const retrieveFromLocalStorage = (key) => {
  const objectString = window.localStorage.getItem(key);
  return objectString ? JSON.parse(objectString) : null;
};

/**
 * Generates a YouTube embed URL for a given video ID.
 * @param {string} videoId - The unique identifier for a YouTube video.
 * @returns {string} The full embed URL for the specified YouTube video.
 */
function buildYoutubeEmbedLink(videoId) {
  return "https://www.youtube.com/embed/" + videoId;
}

const GALLERY_IMAGES = [
  "./assets/images/gallery-1.png",
  "./assets/images/gallery-2.png",
  "./assets/images/gallery-3.png",
  "./assets/images/gallery-4.png",
  "./assets/images/gallery-5.png",
  "./assets/images/gallery-6.png",
  "./assets/images/gallery-7.png"
];


/** @type {HTMLDivElement | null} */
const $GALLERY_MODAL = document.getElementById("gallery-modal");
/** @type {HTMLImageElement | null} */
const $GALLERY_IMAGE = document.getElementById("gallery-image");
/** @type {HTMLSpanElement | null} */
const $CLOSE_GALLERY = document.getElementById("close_modal");
/** @type {HTMLButtonElement | null} */
const $PREV_BUTTON = document.querySelector(".prev");
/** @type {HTMLButtonElement | null} */
const $NEXT_BUTTON = document.querySelector(".next");
/** @type {HTMLSpanElement | null} */
const $GALLERY_COUNTER = document.getElementById("counter-number");
/** @type {HTMLDivElement | null} */
const $GALLERY_SHARE = document.getElementById("gallery-share");
/** @type {HTMLDivElement | null} */
const $SHARE_DROPDOWN = document.getElementById("share-dropdown");


/**
 * Downloads the currently selected image from the gallery.
 * @returns {void}
 * @throws {Error} If the currentImageUrl is not valid or if the download fails.
 */
function download() {
  const currentImageUrl = getCurrentImageUrl(currentIndex);
  if (!currentImageUrl) {
    throw new Error("URL de imagen no válida.");
  }

  try {
    const link = createDownloadLink(currentImageUrl);
    onGalleryDownload(currentImageUrl);
    link.click();
  } catch (error) {
    console.error("No se ha podido descargar la imagen:", error);
  }
}

/**
 * Creates a "download link" for the specified image URL.
 * @param {string} imageUrl - The URL of the image to download.
 * @returns {HTMLAnchorElement} The anchor element configured for download.
 */
function createDownloadLink(imageUrl) {
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = extractFileName(imageUrl);
  return link;
}

/**
 * Extracts the filename from the provided image URL.
 * @param {string} url - The URL of the image.
 * @returns {string} The extracted filename.
 */
function extractFileName(url) {
  return url.split("/").pop();
}

/**
 * Retrieves the current image URL based on the provided index.
 * @param {number} index - The index of the current image.
 * @returns {string|null} The URL of the current image or null if invalid.
 */
function getCurrentImageUrl(index) {
  return GALLERY_IMAGES[index] || null;
}

/**
 * Shares the currently selected image from the gallery using the Web Share API.
 * @returns {void}
 * @throws {Error} If sharing fails due to a fetch error or unsupported sharing.
 */
async function share() {
  try {
    const currentImageUrl = getCurrentImageUrl(currentIndex);
    const blob = await fetchImageBlob(currentImageUrl);
    const file = createFileFromBlob(blob, currentImageUrl);

    if (await isShareSupported(file)) {
      await navigator.share({
        title: "Imagen de la galeria.",
        files: [file],
      });
      onGalleryShare(currentImageUrl);
    } else {
      openShareDropdown($SHARE_DROPDOWN, $GALLERY_SHARE);
    }
  } catch (error) {
    console.error("Error al compartir imagen:", error);
  }
}

/**
 * Fetches the image blob from the given URL.
 * @param {string} url - The URL of the image.
 * @returns {Promise<Blob>} The image blob.
 * @throws {Error} If the fetch fails.
 */
async function fetchImageBlob(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al recuperar la imagen: ${response.statusText}`);
  }

  return await response.blob();
}

/**
 * Creates a File object from the given blob and image URL.
 * @param {Blob} blob - The image blob.
 * @param {string} imageUrl - The URL of the image.
 * @returns {File} The created File object.
 */
function createFileFromBlob(blob, imageUrl) {
  const fileExtension = extractFileExtension(imageUrl);
  const mimeType = getMimeType(fileExtension);
  const fileName = `imagen.${fileExtension}`;

  return new File([blob], fileName, { type: mimeType });
}

/**
 * Extracts the file extension from the provided image URL.
 * @param {string} url - The URL of the image.
 * @returns {string} The extracted file extension.
 */
function extractFileExtension(url) {
  return url.split(".").pop().toLowerCase();
}

/**
 * Determines the MIME type based on the file extension.
 * @param {string} extension - The file extension.
 * @returns {string} The corresponding MIME type or application/octet-stream.
 */
function getMimeType(extension) {
  const mimeMap = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };

  return mimeMap[extension] || "application/octet-stream";
}

/**
 * Checks if the sharing is supported for the given file.
 * @param {File} file - The file to share.
 * @returns {Promise<boolean>} Whether sharing is supported.
 */
async function isShareSupported(file) {
  return navigator.canShare && navigator.canShare({ files: [file] });
}

/**
 * Opens the share dropdown and applies gallery share styles.
 * @param {HTMLDivElement} shareDropdown - The share dropdown element.
 * @param {HTMLDivElement} galleryShare - The gallery share element.
 */
function openShareDropdown(shareDropdown, galleryShare) {
  displayShareDropdown(shareDropdown);
  setGalleryShareStyles(galleryShare);
}

/**
 * Closes the share dropdown and resets gallery share styles.
 * @param {HTMLDivElement} shareDropdown - The share dropdown element.
 * @param {HTMLDivElement} galleryShare - The gallery share element.
 */
function closeShareDropdown(shareDropdown, galleryShare) {
  hideShareDropdown(shareDropdown);
  unsetGalleryShareStyles(galleryShare);
}

/**
 * Displays the share dropdown by setting its display style to "block".
 * @param {HTMLDivElement} shareDropdown - The share dropdown element.
 */
function displayShareDropdown(shareDropdown) {
  if (shareDropdown) {
    shareDropdown.style.display = "block";
  }
}

/**
 * Hides the share dropdown by setting its display style to "none".
 * @param {HTMLDivElement} shareDropdown - The share dropdown element.
 */
function hideShareDropdown(shareDropdown) {
  if (shareDropdown) {
    shareDropdown.style.display = "none";
  }
}

/**
 * Applies specific styles to the gallery share element.
 * @param {HTMLDivElement} galleryShare - The gallery share element.
 */
function setGalleryShareStyles(galleryShare) {
  if (galleryShare) {
    galleryShare.style.borderRadius = "34.5px 34.5px 0 34.5px";
  }
}

/**
 * Resets styles for the gallery share element to its original state.
 * @param {HTMLDivElement} galleryShare - The gallery share element.
 */
function unsetGalleryShareStyles(galleryShare) {
  if (galleryShare) {
    galleryShare.style.borderRadius = "34.5px";
  }
}

/**
 * Handles clicks outside the dropdown to close it.
 * @param {Event} event - The click event.
 * @param {HTMLDivElement} shareDropdown - The share dropdown element.
 * @param {HTMLDivElement} galleryShare - The gallery share element.
 */
function handleOutsideClick(event, shareDropdown, galleryShare) {
  if (
    !event.target.closest(".share_wrapper") &&
    !event.target.matches(".share-dropdown")
  ) {
    closeShareDropdown(shareDropdown, galleryShare);
  }
}

/**
 * Binds the outside click event to close the share dropdown when clicking outside.
 * @param {HTMLDivElement} shareDropdown - The share dropdown element.
 * @param {HTMLDivElement} galleryShare - The gallery share element.
 */
function bindOutsideClick(shareDropdown, galleryShare) {
  window.addEventListener("click", (event) =>
    handleOutsideClick(event, shareDropdown, galleryShare)
  );
}

/**
 * Shares an image link on Facebook.
 * @param {number} [imageIndex=currentIndex] - The index of the image to share. Defaults to currentImageIndex.
 */
function shareInFacebook(imageIndex = currentIndex) {
  shareOnPlatform(imageIndex, "https://www.facebook.com/sharer/sharer.php?u=");
}

/**
 * Shares an image link on WhatsApp.
 * @param {number} [imageIndex=currentIndex] - The index of the image to share. Defaults to currentImageIndex.
 */
function shareInWhatsapp(imageIndex = currentIndex) {
  shareOnPlatform(imageIndex, "https://wa.me/?text=");
}

/**
 * Generic function to share a link on a specified platform.
 *
 * @param {number} imageIndex - The index of the image to share.
 * @param {string} baseUrl - The base URL for the sharing platform.
 */
function shareOnPlatform(imageIndex, baseUrl) {
  const imageUrl = getCurrentImageUrl(imageIndex);
  const fullImagePath = getFullImageUrl(imageUrl);
  const shareUrl = baseUrl + encodeURIComponent(fullImagePath);

  // Open the sharing URL in a new tab
  window.open(shareUrl, "_blank");
}

document.addEventListener("DOMContentLoaded", function () {
  if ($SHARE_DROPDOWN && $GALLERY_SHARE) {
    bindOutsideClick($SHARE_DROPDOWN, $GALLERY_SHARE);
  }
});