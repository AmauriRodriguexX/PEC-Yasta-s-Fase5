// MARK: CONSTANTS & HTML ELEMENTS
// HTML ELEMENTS
/** @type {HTMLDivElement | null} */
const $VIDEO_MODAL = document.getElementById("video-modal");
/** @type {HTMLSourceElement | null} */
const $VIDEO_SOURCE = document.getElementById("video-source");
/** @type {HTMLVideoElement | null} */
const $VIDEO_PLAYER = document.getElementById("video-player");

// MARK: MODALS
function openModal(videoSrc, name) {
  if ($VIDEO_MODAL && $VIDEO_SOURCE && $VIDEO_PLAYER) {
    $VIDEO_SOURCE.src = videoSrc;
    $VIDEO_PLAYER.load();
    $VIDEO_MODAL.style.display = "block";
    onVideoPopUp(name);

    let videoLength = 0;
    $VIDEO_PLAYER.addEventListener("loadedmetadata", () => {
      videoLength = formatDuration($VIDEO_PLAYER.duration);
      onVideoPlay(videoSrc, name, videoLength);
    });

    $VIDEO_PLAYER.addEventListener("pause", () => {
      const timeWatched = formatDuration($VIDEO_PLAYER.currentTime);
      onVideoPaused(videoSrc, name, videoLength, timeWatched);
    });

    $VIDEO_PLAYER.addEventListener("ended", () => {
      onVideoEnded(videoSrc, name, videoLength);
    });
  }
}

function closeModal(method = "botón cerrar") {
  if ($VIDEO_MODAL && $VIDEO_PLAYER && $VIDEO_SOURCE) {
    $VIDEO_PLAYER.pause();
    let timeWatched = formatDuration($VIDEO_PLAYER.currentTime);

    onVideoPopOut($VIDEO_SOURCE.src.split("/").pop(), method, timeWatched);

    $VIDEO_MODAL.style.display = "none";
  }
}

// Close the modal if the user clicks anywhere outside of it
window.onclick = (event) => {
  if (event.target === $VIDEO_MODAL) {
    closeModal("click fuera");
  }
};
// ---

// MARK: HELPERS
/**
 * Formats a duration from seconds into a string formatted as mm:ss.
 * @param {number} duration - The video duration in seconds.
 * @returns {string} The formatted duration in the format of mm:ss.
 */
function formatDuration(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
}

/**
 * Calculates the scroll percentage of the webpage.
 * @returns {number} The scroll percentage, a value between 0 and 100.
 */
function calculateScrollPercentage() {
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
}

/**
 * Redirects the current window to the specified URL
 * @param {string} url
 * @returns {void}
 */
function navigateToUrl(url) {
  window.location.href = url;
}
