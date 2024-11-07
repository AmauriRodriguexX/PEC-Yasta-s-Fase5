window.dataLayer = window.dataLayer || [];

// MARK: EVENTS
/**
 * Event that occurs when the user clicks on "know my story".
 * @param {string} videoUrl YouTube video url
 * @param {string} imageUrl Image url
 * @returns {void}
 */
function onKnowTheStory(videoUrl, imageUrl) {
  window.dataLayer.push({
    event: "click_element",
    CDAction: "conoce_mi_historia",
    CDLabel: "ganadora",
    CDValue: videoUrl,
    detail: imageUrl,
    CDFunnel: "PE Etapa Final 2024",
  });
}

/**
 *
 * @param {string} watchedImageUrl The image url that is watching the user
 */
function onGallery(watchedImageUrl) {
  window.dataLayer.push({
    event: "galeria_PEC",
    CDCategory: "Galería etapa final PEC",
    CDAction: "ver_foto",
    CDFunnel: "PE Etapa Final 2024",
    CDValue: watchedImageUrl,
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
    CDFunnel: "PE Etapa Final 2024",
  });
}

/**
 * Event that occurs when the user clicks the play button for the first time.
 * @param {VideoCategory} videoCategory Video section opened
 * @param {string} videoUrl YouTube video URL
 * @returns {void}
 */
function onVideoStart(videoCategory, videoUrl) {
  window.dataLayer.push({
    event: "pec_2024_videos",
    CDCategory: videoCategory,
    CDAction: "01. Inicio",
    CDLabel: "",
    CDValue: videoUrl,
    CDFunnel: "PE Etapa Final 2024",
  });
}

/**
 * Event that occurs when the user pauses the video or reaches a threshold.
 * @param {VideoCategory} videoCategory
 * @param {string} timeWatched percentage of the video the user watched
 * @param {string} videoSource video url
 * @returns {void}
 */
function onVideoPause(videoCategory, timeWatched, videoSource) {
  window.dataLayer.push({
    event: "pec_2024_videos",
    CDCategory: videoCategory,
    CDAction: `02. Progreso ${timeWatched}%`,
    CDLabel: "",
    CDValue: videoSource,
    CDFunnel: "PE Etapa Final 2024",
  });
}

/**
 * Event that occurs when the user completes viewing the video.
 * @param {participantName} participantName participants name
 * @param {string} videoSource video url
 * @returns {void}
 */
function onVideoCompletion(videoCategory, videoSource) {
  window.dataLayer.push({
    event: "pec_2024_videos",
    CDCategory: videoCategory,
    CDAction: "03. Completado",
    CDLabel: "",
    CDValue: videoSource,
    CDFunnel: "PE Etapa Final 2024",
  });
}

function onGalleryDownload(imageUrl) {
  window.dataLayer.push({
    event: "galeria_PEC",
    CDCategory: "Galería etapa final PEC",
    CDAction: "descargar_foto",
    CDFunnel: "PE Etapa Final 2024",
    CDValue: imageUrl,
  });
}

function onGalleryShare(imageUrl) {
  window.dataLayer.push({
    event: "galeria_PEC",
    CDCategory: "Galería etapa final PEC",
    CDAction: "compartir_foto",
    CDLabel: "",
    CDFunnel: "PE Etapa Final 2024",
    CDValue: imageUrl,
  });
}
