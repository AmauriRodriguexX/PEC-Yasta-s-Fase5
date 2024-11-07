// MARK: TYPES
/**
 * @typedef {'Martha Ramón' | 'Uvaldo Baron' | 'María Candila'} participantName
 */

// MARK: CONSTANTS & HTML ELEMENTS
// CONSTANTS
const PERCENTAGE_THRESHOLDS = [10, 25, 50, 75];

/** @type {Record<participantName, string>} */
const IMAGES_SRC = {
  "Martha Ramón": "./assets/images/yastas-participante-1.png",
  "Uvaldo Baron": "./assets/images/yastas-participante-2.png",
  "María Candila": "./assets/images/yastas-participante-3.png",
};

/** @type {Record<participantName, string>} */
const VIDEOS_SRC = {
  "Martha Ramón": buildYoutubeEmbedLink("wR7bEp9A_j0"),
  "Uvaldo Baron": buildYoutubeEmbedLink("NWa83GptpSY"),
  "María Candila": buildYoutubeEmbedLink("JTP_RoWRr0c"),
};

/** @type {Record<participantName, string>} */
const PARTICIPANTS_TROPHIES = {
  "Martha Ramón": "./assets/images/second-place-trophy.png",
  "Uvaldo Baron": "./assets/images/first-place-trophy.jpg",
  "María Candila": "./assets/images/third-place-trophy.png",
};

/** @type {Record<participantName, number>} */
const PARTICIPANTS_PERCETAGES = {
  "Martha Ramón": 25,
  "Uvaldo Baron": 51,
  "María Candila": 24,
};

/** @type {Record<participantName, string>} */
const PARTICIPANTS_LABEL = {
  "Martha Ramón": "participante_1",
  "Uvaldo Baron": "participante_2",
  "María Candila": "participante_3",
};

// HTML ELEMENTS
/** @type {HTMLDivElement | null} */
const $VIDEO_MODAL = document.getElementById("video-modal");
/** @type {NodeListOf<HTMLSpanElement>} */
const $PARTICIPANT_NAME_VIDEO = document.querySelectorAll(
  "#participant-name-video"
);
/** @type {HTMLImageElement | null} */
const $PARTICIPANT_TROPHY = document.getElementById("trophy");
/** @type {HTMLSpanElement | null} */
const $PARTICIPANT_PERCENTAGE = document.getElementById("percentage");

// MARK: MODALS
/**
 * Opens the video modal
 * @param {participantName} participantName
 */
function openVideoModal(participantName) {
  if ($PARTICIPANT_NAME_VIDEO.length > 0) {
    $PARTICIPANT_NAME_VIDEO.forEach((span) => {
      span.innerText = participantName;
    });
  }

  if ($VIDEO_MODAL && $PARTICIPANT_TROPHY && $PARTICIPANT_PERCENTAGE) {
    $PARTICIPANT_TROPHY.src = PARTICIPANTS_TROPHIES[participantName];
    $PARTICIPANT_PERCENTAGE.innerText = `${PARTICIPANTS_PERCETAGES[participantName]}%`;
    //Load video
    loadYoutubeVideo(
      extractYoutubeVideoId(VIDEOS_SRC[participantName]),
      participantName
    );
    $VIDEO_MODAL.style.display = "block";
  }
}

function closeVideoModal() {
  if ($VIDEO_MODAL) {
    if (player) {
      const $iframe = player.getIframe();
      onVideoPause(
        $iframe.getAttribute("data-participant"),
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

// MARK: SIMPLE FUNCTIONS
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
 * Opens a specified URL in a new browser tab.
 * @param {string} url
 * @returns {void}
 */
function openInNewTab(url) {
  window.open(url, "_blank");
}

/**
 * Calculates the percentage of a video watched.
 * @param {number} totalDuration - Total time of the video in seconds.
 * @param {number} timeWatched - Time of the video watched in seconds.
 * @returns {string} Percentage of the video watched, rounded to two decimal places.
 */
function calculateWatchedPercentage(totalDuration, timeWatched) {
  const percentage = Math.floor((timeWatched / totalDuration) * 100);
  return percentage;
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

/**
 * Generates a YouTube embed URL for a given video ID.
 * @param {string} videoId - The unique identifier for a YouTube video.
 * @returns {string} The full embed URL for the specified YouTube video.
 */
function buildYoutubeEmbedLink(videoId) {
  return "https://www.youtube.com/embed/" + videoId;
}

/**
 * Get participant label based on the dictionary
 * @param {participantName} participantName
 * @returns {string}
 */
function getParticipantLabel(participantName) {
  return PARTICIPANTS_LABEL[participantName];
}

/**
 * Get participant photo based on the dictionary
 * @param {participantName} participantName
 * @returns {string}
 */
function getParticipantSourceImage(participantName) {
  return IMAGES_SRC[participantName];
}

/**
 * Get participant youtube url based on the dictionary
 * @param {participantName} participantName
 * @returns {string}
 */
function getParticipantYoutubeVideo(participantName) {
  return VIDEOS_SRC[participantName];
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
 * This function keeps track of which thresholds have been met.
 * @returns {{}}
 */
function createWatchedThresholds() {
  return PERCENTAGE_THRESHOLDS.reduce(
    (acc, cur) => ((acc[cur] = false), acc),
    {}
  );
}
// ---

// MARK: YOUTUBE API
let player;
let intervalId;
function loadYoutubeVideo(videoId, participantName) {
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
    "data-participant",
    participantName
  );
}

/**
 * Destroys the existing player and clears the interval.
 */
function destroyPlayer() {
  if (player) {
    player.destroy();
    rewatch = false;
  }
  if (intervalId) {
    clearInterval(intervalId);
  }
}

let watchedThresholds = createWatchedThresholds();

/**
 * Executes when the player is ready.
 */
function onPlayerReady() {
  watchedThresholds = createWatchedThresholds();
  intervalId = setInterval(checkVideoProgress, 100);
}

/**
 * Checks the video progress and triggers the callback if a threshold is reached.
 */
function checkVideoProgress() {
  const totalDuration = player.getDuration();
  const currentTime = player.getCurrentTime();
  const watchedPercentage = calculateWatchedPercentage(
    totalDuration,
    currentTime
  );

  if (
    PERCENTAGE_THRESHOLDS.includes(watchedPercentage) &&
    !watchedThresholds[watchedPercentage]
  ) {
    watchedThresholds[watchedPercentage] = true;
    onThresholdReached(watchedPercentage);
  }
}

/**
 * Callback function to execute when a percentage threshold is reached.
 * @param {number} threshold - The percentage threshold reached.
 */
function onThresholdReached(threshold) {
  /** @type {HTMLIFrameElement} */
  const $iframe = player.getIframe();
  const videoUrl = player.getVideoUrl();

  onVideoPause($iframe.getAttribute("data-participant"), threshold, videoUrl);
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
  const dataParticipant = $iframe.getAttribute("data-participant");

  if (event.data === YT.PlayerState.PLAYING) {
    if (isFirstPlay) {
      onVideoStart(dataParticipant, videoUrl);
      isFirstPlay = false;
    }

    if (rewatch) {
      onVideoStart(dataParticipant, videoUrl);
      onPlayerReady();
      rewatch = false;
    }
  }

  if (event.data === YT.PlayerState.PAUSED) {
    const timeWatched = calculateClosestWatchedPercentage(
      videoDuration,
      player.getCurrentTime()
    );
    onVideoPause(dataParticipant, timeWatched, videoUrl);
  }

  if (event.data === YT.PlayerState.ENDED) {
    onVideoCompletion(dataParticipant, videoUrl);
    rewatch = true;
    clearInterval(intervalId);
  }
}
