window.dataLayer = window.dataLayer || [];

// Helper para convertir URLs relativas a absolutas
function getFullUrl(url) {
  return url.startsWith('http') || url.startsWith('//') 
    ? url 
    : new URL(url, window.location.origin).href;
}

// MARK: EVENTS
function onKnowTheStory(label, videoUrl) {
  const fullVideoUrl = getFullUrl(videoUrl);

  window.dataLayer.push({
    event: "click_element",
    CDAction: "conoce_mi_historia",
    CDLabel: label,
    CDValue: fullVideoUrl,
    detail: "",
    CDFunnel: "PE Etapa Final 2024",
  });

  console.log("Evento registrado (onKnowTheStory):", { fullVideoUrl });
}

function onGallery(watchedImageUrl) {
  const fullImageUrl = getFullUrl(watchedImageUrl);

  window.dataLayer.push({
    event: "galeria_PEC",
    CDCategory: "Galería etapa final PEC",
    CDAction: "ver_foto",
    CDFunnel: "PE Etapa Final 2024",
    CDValue: fullImageUrl,
  });

  console.log("Evento registrado (onGallery):", { fullImageUrl });
}

function onHomeShare(socialNetwork) {
  window.dataLayer.push({
    event: "click_element",
    CDCategory: "compartir_pagina",
    CDLabel: socialNetwork,
    CDFunnel: "PE Etapa Final 2024",
  });

  console.log("Evento registrado (onHomeShare):", { socialNetwork });
}

function onVideoStart(videoCategory, videoUrl) {
  const fullVideoUrl = getFullUrl(videoUrl);

  window.dataLayer.push({
    event: "pec_2024_videos",
    CDCategory: videoCategory,
    CDAction: "01. Inicio",
    CDLabel: "",
    CDValue: fullVideoUrl,
    CDFunnel: "PE Etapa Final 2024",
  });

  console.log("Evento registrado (onVideoStart):", { fullVideoUrl });
}

function onVideoPause(videoCategory, timeWatched, videoSource) {
  const fullVideoUrl = getFullUrl(videoSource);

  window.dataLayer.push({
    event: "pec_2024_videos",
    CDCategory: videoCategory,
    CDAction: `02. Progreso ${timeWatched}%`,
    CDLabel: "",
    CDValue: fullVideoUrl,
    CDFunnel: "PE Etapa Final 2024",
  });

  console.log("Evento registrado (onVideoPause):", { fullVideoUrl });
}

function onVideoCompletion(videoCategory, videoSource) {
  const fullVideoUrl = getFullUrl(videoSource);

  window.dataLayer.push({
    event: "pec_2024_videos",
    CDCategory: videoCategory,
    CDAction: "03. Completado",
    CDLabel: "",
    CDValue: fullVideoUrl,
    CDFunnel: "PE Etapa Final 2024",
  });

  console.log("Evento registrado (onVideoCompletion):", { fullVideoUrl });
}

function onGalleryDownload(imageUrl) {
  const fullImageUrl = getFullUrl(imageUrl);

  window.dataLayer.push({
    event: "galeria_PEC",
    CDCategory: "Galería etapa final PEC",
    CDAction: "descargar_foto",
    CDFunnel: "PE Etapa Final 2024",
    CDValue: fullImageUrl,
  });

  console.log("Evento registrado (onGalleryDownload):", { fullImageUrl });
}

function onGalleryShare(imageUrl) {
  const fullImageUrl = getFullUrl(imageUrl);

  window.dataLayer.push({
    event: "galeria_PEC",
    CDCategory: "Galería etapa final PEC",
    CDAction: "compartir_foto",
    CDLabel: "",
    CDFunnel: "PE Etapa Final 2024",
    CDValue: fullImageUrl,
  });

  console.log("Evento registrado (onGalleryShare):", { fullImageUrl });
}


function onDropdownShare(platform, imageUrl) {
  const fullImageUrl = getFullUrl(imageUrl || window.location.href);

  window.dataLayer.push({
    event: "galeria_PEC",
    CDCategory: "Galería etapa final PEC",
    CDAction: "compartir_foto",
    CDLabel: platform, // Puede ser "facebook" o "whatsapp"
    CDFunnel: "PE Etapa Final 2024",
    CDValue: fullImageUrl,
  });

  console.log(`Evento registrado (onDropdownShare - ${platform}):`, { fullImageUrl });
}

// Uso en los enlaces del dropdown
function shareInFacebook() {
  onDropdownShare("facebook");
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
}

function shareInWhatsapp() {
  onDropdownShare("whatsapp");
  window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, "_blank");
}
