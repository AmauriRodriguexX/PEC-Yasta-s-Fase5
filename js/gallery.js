// MARK: CONSTANTS
// Variables
const GALLERY_IMAGES = [
  "./assets/images/gallery_1.png",
  "./assets/images/gallery_2.png",
  "./assets/images/gallery_3.png",
  "./assets/images/gallery_4.png",
  "./assets/images/gallery_5.png",
];

// HTMLElements
// Navbar
/** @type {HTMLDivElement | null} */
const $TOGGLE_BUTTON = document.getElementById("navbar-toggle");
/** @type {HTMLDivElement | null} */
const $MENU = document.getElementById("navbar-menu");
/** @type {HTMLImageElement | null} */
const $CLOSE_BUTTON = document.getElementById("close-btn");

// Gallery . Grid
/** @type {HTMLDivElement | null} */
const $GALLERY_GRID = document.getElementById("gallery-container");

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
 * Navigates to a given URL.
 * @param {string} url The URL to navigate to.
 * @param {'_self' | '_blank' | '_parent' | '_top' | '_unfencedTop'} [target] Where to display the linked URL
 */
function navigateTo(url, target = "_self") {
  window.open(url, target);
}

/**
 * Clears the content of the provided HTML element.
 * @param {HTMLElement} element - The element to clear.
 */
function clearContainer(element) {
  element.innerHTML = "";
}

function getFullImageUrl(localPath) {
  return `${window.location.origin}/${localPath.replace("./", "")}`;
}

// MARK: GALLERY - GRID
/**
 * Creates an image element with the provided source.
 * @param {string} src The source URL of the image.
 * @returns {HTMLImageElement} The created image element.
 */
function createImageElement(src) {
  const $imageElement = document.createElement("img");
  $imageElement.classList.add("gallery_image");
  $imageElement.src = src;
  return $imageElement;
}

/**
 * Creates a gallery item element containing an image.
 * @param {string} imageSrc The source URL of the image.
 * @param {number} index The image selected.
 * @returns {HTMLDivElement} The created gallery item element.
 */
function createGalleryItem(imageSrc, index) {
  const galleryDiv = document.createElement("div");
  galleryDiv.classList.add("gallery_item");
  galleryDiv.onclick = () => openGalleryModal(index);

  const imageElement = createImageElement(imageSrc);
  galleryDiv.appendChild(imageElement);

  return galleryDiv;
}

/**
 * Renders a grid of images in the provided container element.
 * @param {HTMLDivElement} container - The container element for the gallery.
 * @param {string[]} images - Array of image URLs to render.
 */
function renderGallery(container, images) {
  clearContainer(container);
  images.forEach((imageSrc, index) => {
    const galleryItem = createGalleryItem(imageSrc, index);
    container.appendChild(galleryItem);
  });
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
  // Gallery grid
  if ($GALLERY_GRID) {
    renderGallery($GALLERY_GRID, GALLERY_IMAGES);
  }

  if ($SHARE_DROPDOWN && $GALLERY_SHARE) {
    bindOutsideClick($SHARE_DROPDOWN, $GALLERY_SHARE);
  }
});
