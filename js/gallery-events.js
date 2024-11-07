window.dataLayer = window.dataLayer || [];

// MARK: EVENTS
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
