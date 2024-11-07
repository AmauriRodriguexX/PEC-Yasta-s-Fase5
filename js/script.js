// MARK: TYPES
/**
 * @typedef {'enterprise' | 'history' | 'moments'} VideoCategory
 */

// MARK: CONSTANTS
// Variables
const PERCENTAGE_THRESHOLDS = [10, 25, 50, 75];
/** @type {{[key in VideoCategory]: string}} */
const VIDEOS_SRC = {
  enterprise: buildYoutubeEmbedLink("wR7bEp9A_j0"),
  history: buildYoutubeEmbedLink("wR7bEp9A_j0"),
  moments: buildYoutubeEmbedLink("wR7bEp9A_j0"),
};

/** @type {{[key in VideoCategory]: string}} */
const IMAGES_SRC = {
  enterprise: "./assets/images/premio_emprendedores.jpg",
  history: "./assets/images/yastas-participante-1.png",
  moments: "./assets/images/burbuja_principal.png",
};

const GALLERY_IMAGES = [
  "./assets/images/gallery_1.png",
  "./assets/images/gallery_2.png",
  "./assets/images/gallery_3.png",
  "./assets/images/gallery_4.png",
  "./assets/images/gallery_5.png",
];

// HTMLElements
/** @type {HTMLDivElement | null} */
const $TOGGLE_BUTTON = document.getElementById("navbar-toggle");
/** @type {HTMLDivElement | null} */
const $MENU = document.getElementById("navbar-menu");
/** @type {HTMLImageElement | null} */
const $CLOSE_BUTTON = document.getElementById("close-btn");
/** @type {HTMLDivElement | null} */
const $VIDEO_MODAL = document.getElementById("video-modal");

// Gallery
/** @type {HTMLSpanElement | null} */
const $GALLERY_AMOUNT = document.getElementById("gallery-amount");

// Gallery fullscreen
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
// MARK: UTILS
/**
 * Handles clicking the share to Facebook button.
 */
function shareToFacebook() {
  const currentUrl = encodeURIComponent(window.location.href);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&amp;src=sdkpreparse`;
  window.open(facebookUrl, "_blank");
}

/**
 * Handles clicking the share to WhatsApp button.
 */
function shareToWhatsapp() {
  const currentUrl = encodeURIComponent(window.location.href);
  const message = encodeURIComponent(""); // Example message
  const whatsAppUrl = `https://wa.me/?text=${message}${currentUrl}`;
  window.open(whatsAppUrl, "_blank");
}

/**
 * Navigates to a given URL.
 * @param {string} url The URL to navigate to.
 * @param {'_self' | '_blank' | '_parent' | '_top' | '_unfencedTop'} [target] Where to display the linked URL
 */
function navigateTo(url, target = "_self") {
  window.open(url, target);
}

function getFullImageUrl(localPath) {
  return `${window.location.origin}/${localPath.replace("./", "")}`;
}

/**
 * Generates a YouTube embed URL for a given video ID.
 * @param {string} videoId - The unique identifier for a YouTube video.
 * @returns {string} The full embed URL for the specified YouTube video.
 */
function buildYoutubeEmbedLink(videoId) {
  return "https://www.youtube.com/embed/" + videoId;
}

/**
 * Extracts the YouTube video ID from a given embed URL.
 * @param {string} embedUrl - The YouTube embed URL.
 * @returns {string|null} The video ID extracted from the embed URL, or null if not found.
 */
function extractYoutubeVideoId(embedUrl) {
  // Example of embedUrl: "https://www.youtube.com/embed/VIDEO_ID"

  // Regular expression to match the video ID pattern in the embed URL
  const regex = /(?:embed\/|v=)([\w-]+)/;

  // Use regex to extract the video ID
  const match = embedUrl.match(regex);

  // If match is found, return the video ID (first capturing group)
  // Otherwise, return null
  return match ? match[1] : null;
}

/**
 * Calculates the percentage of a video watched.
 * @param {number} totalDuration - Total time of the video in seconds.
 * @param {number} timeWatched - Time of the video watched in seconds.
 * @returns {number} Percentage of the video watched, rounded to two decimal places.
 */
function calculateWatchedPercentage(totalDuration, timeWatched) {
  const percentage = Math.floor((timeWatched / totalDuration) * 100);
  return percentage;
}

/**
 * This function keeps track of which thresholds have been met.
 * @param {number[]} thresholds
 * @returns {Record<number, boolean>}
 */
function createWatchedThresholds(thresholds) {
  return thresholds.reduce((acc, cur) => ((acc[cur] = false), acc), {});
}

/** Checks the video progress and triggers the callback if a threshold is reached.
 * @param {number[]} thresholds
 * @param {Record<number, boolean>} watchedThresholds
 */
function checkVideoProgress(thresholds, watchedThresholds) {
  const totalDuration = player.getDuration();
  const currentTime = player.getCurrentTime();
  const watchedPercentage = calculateWatchedPercentage(
    totalDuration,
    currentTime
  );

  if (
    thresholds.includes(watchedPercentage) &&
    !watchedThresholds[watchedPercentage]
  ) {
    watchedThresholds[watchedPercentage] = true;
    onThresholdReached(watchedPercentage);
  }
}

/**
 * Calculates the closest percentage based on predefined thresholds.
 * @param {number} totalDuration - Total time of the video in seconds.
 * @param {number} timeWatched - Time of the video watched in seconds.
 * @returns {number} Percentage of the video watched, rounded to two decimal places.
 */
function calculateClosestWatchedPercentage(totalDuration, timeWatched) {
  const percentage = (timeWatched / totalDuration) * 100;
  const closestPercentage = PERCENTAGE_THRESHOLDS.reduce((prev, curr) =>
    Math.abs(curr - percentage) < Math.abs(prev - percentage) ? curr : prev
  );
  return closestPercentage;
}

/**
 *  @param {HTMLIFrameElement} $iframe
 * @param {string} attributeName
 * @param {string} attributeValue
 * @returns {void}
 */
function setAttributeToYoutubePlayer($iframe, attributeName, attributeValue) {
  $iframe.setAttribute(attributeName, attributeValue);
}

// MARK: NAVBAR
if ($TOGGLE_BUTTON && $MENU && $CLOSE_BUTTON) {
  $TOGGLE_BUTTON.addEventListener("click", function () {
    $MENU.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
  });

  $CLOSE_BUTTON.addEventListener("click", function () {
    $MENU.classList.remove("active");
    document.body.classList.remove("no-scroll");
  });
}

// MARK: MODALS
/**
 * Opens the video modal
 * @param {VideoCategory} videoCategory
 */
function openVideoModal(videoCategory) {
  if ($VIDEO_MODAL) {
    //Load video
    loadYoutubeVideo(
      extractYoutubeVideoId(VIDEOS_SRC[videoCategory]),
      videoCategory
    );
    $VIDEO_MODAL.style.display = "block";
    if (videoCategory === "history") {
      onKnowTheStory(VIDEOS_SRC[videoCategory], IMAGES_SRC[videoCategory]);
    }
  }
}

/** Closes the video modal */
function closeVideoModal() {
  if ($VIDEO_MODAL) {
    if (player) {
      const $iframe = player.getIframe();
      onVideoPause(
        $iframe.getAttribute("video-category"),
        calculateClosestWatchedPercentage(
          player.getDuration(),
          player.getCurrentTime()
        ),
        player.getVideoUrl()
      );

      destroyPlayer();
      isFirstPlay = true;
    }
    $VIDEO_MODAL.style.display = "none";
  }
}

// MARK: YOUTUBE API
let player;
let intervalId;
let watchedThresholds = createWatchedThresholds(PERCENTAGE_THRESHOLDS);

/**
 * Function to load YouTube player API
 * @param {string} videoId YouTube video ID that is going to be reproduced
 * @param {string} videoCategory Video category
 */
function loadYoutubeVideo(videoId, videoCategory) {
  if (player) {
    destroyPlayer();
  }

  player = new YT.Player("player", {
    videoId: videoId,
    playerVars: {
      playsinline: 1,
      rel: 0,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });

  setAttributeToYoutubePlayer(
    player.getIframe(),
    "video-category",
    videoCategory
  );
}

/** Destroys the existing player and clears the interval. */
function destroyPlayer() {
  if (player) {
    player.destroy();
    rewatch = false;
  }
  if (intervalId) {
    clearInterval(intervalId);
  }
}

/** Executes when the player is ready. */
function onPlayerReady() {
  watchedThresholds = createWatchedThresholds(PERCENTAGE_THRESHOLDS);
  intervalId = setInterval(
    checkVideoProgress(PERCENTAGE_THRESHOLDS, watchedThresholds),
    100
  );
}

/**
 * Callback function to execute when a percentage threshold is reached.
 * @param {number} threshold - The percentage threshold reached.
 */
function onThresholdReached(threshold) {
  /** @type {HTMLIFrameElement} */
  const videoUrl = player.getVideoUrl();

  onVideoPause($iframe.getAttribute("video-category"), threshold, videoUrl);
}

let done = false;
let isFirstPlay = true;
let rewatch = false;
/**
 * This event fires whenever the player's state changes.
 * @param {{target: Object, data: number}} event
 */
function onPlayerStateChange(event) {
  const videoDuration = player.getDuration();
  const videoUrl = player.getVideoUrl();
  /** @type {HTMLIFrameElement} */
  const $iframe = player.getIframe();
  const videoCategory = $iframe.getAttribute("video-category");

  if (event.data === YT.PlayerState.PLAYING) {
    if (isFirstPlay) {
      onVideoStart(videoCategory, videoUrl);
      isFirstPlay = false;
    }

    if (rewatch) {
      onVideoStart(videoCategory, videoUrl);
      onPlayerReady();
      rewatch = false;
    }
  }

  if (event.data === YT.PlayerState.PAUSED) {
    const timeWatched = calculateClosestWatchedPercentage(
      videoDuration,
      player.getCurrentTime()
    );
    onVideoPause(videoCategory, timeWatched, videoUrl);
  }

  if (event.data === YT.PlayerState.ENDED) {
    onVideoCompletion(videoCategory, videoUrl);
    rewatch = true;
    clearInterval(intervalId);
  }
}

// MARK: GALLERY - FULLSCREEN
let currentImageIndex = 0;

function openGalleryModal(index) {
  currentImageIndex = index;
  if ($GALLERY_MODAL) {
    document.body.classList.toggle("no-scroll");
    $GALLERY_MODAL.style.display = "flex";
    showImage($GALLERY_IMAGE, GALLERY_IMAGES, index);
    updateGalleryCounter(index + 1);
    onGallery(GALLERY_IMAGES[index]);
  }
}

function closeGalleryModal() {
  if ($GALLERY_MODAL) {
    document.body.classList.remove("no-scroll");
    $GALLERY_MODAL.style.display = "none";
  }
}

function updateGalleryCounter(number) {
  if ($GALLERY_COUNTER) {
    $GALLERY_COUNTER.innerText = `${number}/${GALLERY_IMAGES.length}`;
  }
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % GALLERY_IMAGES.length;
  onGallery(GALLERY_IMAGES[currentImageIndex]);
  showImage($GALLERY_IMAGE, GALLERY_IMAGES, currentImageIndex);
  updateGalleryCounter(currentImageIndex + 1);
}

function prevImage() {
  currentImageIndex =
    currentImageIndex === 0 ? GALLERY_IMAGES.length - 1 : currentImageIndex - 1;
  onGallery(GALLERY_IMAGES[currentImageIndex]);
  showImage($GALLERY_IMAGE, GALLERY_IMAGES, currentImageIndex);
  updateGalleryCounter(currentImageIndex + 1);
}

/**
 * Changes the current image on the fullscreen gallery
 * @param {HTMLImageElement} container
 * @param {string[]} images
 * @param {number} imageIndex
 */
function showImage(container, images, imageIndex) {
  container.src = images[imageIndex];
}

// MARK: Web Share API
/**
 * Downloads the currently selected image from the gallery.
 * @returns {void}
 * @throws {Error} If the currentImageUrl is not valid or if the download fails.
 */
function download() {
  const currentImageUrl = getCurrentImageUrl(currentImageIndex);
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
    const currentImageUrl = getCurrentImageUrl(currentImageIndex);
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
 * @param {number} [imageIndex=currentImageIndex] - The index of the image to share. Defaults to currentImageIndex.
 */
function shareInFacebook(imageIndex = currentImageIndex) {
  shareOnPlatform(imageIndex, "https://www.facebook.com/sharer/sharer.php?u=");
}

/**
 * Shares an image link on WhatsApp.
 * @param {number} [imageIndex=currentImageIndex] - The index of the image to share. Defaults to currentImageIndex.
 */
function shareInWhatsapp(imageIndex = currentImageIndex) {
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
  if ($GALLERY_AMOUNT) {
    $GALLERY_AMOUNT.innerText = GALLERY_IMAGES.length;
  }

  if ($SHARE_DROPDOWN && $GALLERY_SHARE) {
    bindOutsideClick($SHARE_DROPDOWN, $GALLERY_SHARE);
  }
});
