const goToWinners = () => {
  window.location.href = 'ganadores.html';
}

const goToHome = () => {
  window.location.href = 'index.html';
}

const goToAbout = () => {
  window.location.href = 'acerca-de.html';
}


document.getElementById('hamburger-icon').addEventListener('click', function() {
  this.classList.toggle('active');
  document.getElementById('mobile-nav').classList.toggle('active');
});

let currentIndex = 0;
const $galleryItems = document.querySelectorAll('.fullgallery-item img');
const $modalViewGallery = document.getElementById("gallery-view-modal");
const $fullGallery = document.getElementById("gallery-modal");
const $modalImg = document.getElementById('gallery-image');
const $leftArrow = document.getElementById('left-arrow');
const $rightArrow = document.getElementById('right-arrow');
let totalImages = $galleryItems.length;

document.querySelectorAll('.fullgallery-item img').forEach((img, index) => {
  img.addEventListener('click', function() {
    openModalGallery(this.src,index);
  });
});

const openModalGallery = (imageSrc, index) => {
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
  $fullGallery.style.display = "block";
  document.querySelectorAll('.fullgallery-item img').forEach((img, index) => {
    img.addEventListener('click', function() {
      openModalGallery(this.src,index);
    });
  });
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
  $modalImg.src = $galleryItems[currentIndex].src;
  updateImageIndex();
}

const nextImage = () => {
  currentIndex = (currentIndex < totalImages - 1) ? currentIndex + 1 : 0;
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

function getFullImageUrl(localPath) {
  return `${window.location.origin}/${localPath.replace("./", "")}`;
}


const GALLERY_IMAGES = [
  "./assets/images/gallery-1.png",
  "./assets/images/gallery-2.png",
  "./assets/images/gallery-3.png",
  "./assets/images/gallery-4.png",
  "./assets/images/gallery-5.png",
  "./assets/images/gallery-6.png",
  "./assets/images/gallery-7.png",
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