// MARK: GPT
window.dataLayer = window.dataLayer || [];

// MARK: EVENTS
/**
 * Event that occurs when the user clicks on "know my story".
 * @param {participantName} participantName participants name
 * @returns {void}
 */
function onKnowTheStory(participantName) {
  const participantLabel = getParticipantLabel(participantName);
  const participantVideo = getParticipantYoutubeVideo(participantName);
  const participantImage = getParticipantSourceImage(participantName);

  window.dataLayer.push({
    event: "click_element",
    CDCategory: "",
    CDAction: "conoce_mi_historia",
    CDLabel: participantLabel,
    pantalla: "home",
    CDValue: participantVideo,
    detail: participantImage,
    CDFunnel: "PE Ganadores 2024",
  });
}

/**
 * Event that occurs when the user clicks on share in the home page.
 * @param {'facebook' | 'whatsapp'} socialNetwork Social network in which the user shared
 */
function onHomeShare(socialNetwork) {
  window.dataLayer.push({
    event: "click_element",
    CDCategory: "compartir_pagina",
    CDLabel: socialNetwork,
    CDFunnel: "PE Ganadores 2024",
  });
}

/**
 * Event that occurs when the user clicks the play button for the first time.
 * @param {participantName} participantName participants name
 * @returns {void}
 */
function onVideoStart(participantName, videoSource) {
  const participantLabel = getParticipantLabel(participantName);

  window.dataLayer.push({
    event: "pec_2024_videos",
    CDCategory: "",
    CDAction: "01. Inicio",
    CDLabel: participantLabel,
    CDValue: videoSource,
    CDFunnel: "PE Ganadores 2024",
  });
}

/**
 * Event that occurs when the user pauses the video or closes the modal.
 * @param {participantName} participantName participants name
 * @param {string} timeWatched percentage of the video the user watched
 * @param {string} videoSource video url
 * @returns {void}
 */
function onVideoPause(participantName, timeWatched, videoSource) {
  const participantLabel = getParticipantLabel(participantName);

  window.dataLayer.push({
    event: "pec_2024_videos",
    CDCategory: "",
    CDAction: `02. Progreso ${timeWatched}%`,
    CDLabel: participantLabel,
    CDValue: videoSource,
    CDFunnel: "PE Ganadores 2024",
  });
}

/**
 * Event that occurs when the user completes viewing the video.
 * @param {participantName} participantName participants name
 * @param {string} videoSource video url
 * @returns {void}
 */
function onVideoCompletion(participantName, videoSource) {
  const participantLabel = getParticipantLabel(participantName);

  window.dataLayer.push({
    event: "pec_2024_videos",
    CDCategory: "",
    CDAction: "03. Completado",
    CDLabel: participantLabel,
    CDValue: videoSource,
    CDFunnel: "PE Ganadores 2024",
  });
}
