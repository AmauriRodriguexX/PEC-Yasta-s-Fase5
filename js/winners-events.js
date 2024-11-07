// MARK: LAYOUTS
window.dataLayer = window.dataLayer || [];

const onChooseGroup = (group) => {
  window.dataLayer.push({
    event: 'click_element',
    CDCategory: group,
    CDAction: "eleccion_zona",
    CDFunnel: "PE Ganadores 2024"
  });
}

const onVideoPopup = (groupName,competitorNumber,competitorvideoId,competitorImage) => {
  let group = groupName.charAt(0).toLowerCase() + groupName.slice(1);
  window.dataLayer.push({
    event: "click_element",
    CDCategory: group,
    CDAction: 'conoce_mi_historia',
    CDLabel: `participante_${competitorNumber}`,
    pantalla: 'home',
    CDValue: `https://www.youtube.com/embed/${competitorvideoId}`,
    detail: competitorImage,
    CDFunnel: 'PE Ganadores 2024'
  });
};

const onVideoPlay = (groupName, competitorNumber, videoSource) => {
  let group = groupName.charAt(0).toLowerCase() + groupName.slice(1);
  window.dataLayer.push({
    event: "pec_2024_videos",
    CDCategory: group,
    CDAction: '01. Inicio',
    CDLabel: `participante_${competitorNumber}`,
    CDValue: videoSource,
    CDFunnel: 'PE Ganadores 2024',
  });
};


const onVideoProgress = (groupName, competitorNumber, videoSource, timeWatched) => {
  let group = groupName.charAt(0).toLowerCase() + groupName.slice(1);
  window.dataLayer.push({
    event: "pec_2024_videos",
    CDCategory: group,
    CDAction: `02. Progreso ${timeWatched}%`,
    CDLabel: `participante_${competitorNumber}`,
    CDValue: videoSource,
    CDFunnel: 'PE Ganadores 2024',
  });
};


const onVideoEnded = (groupName, competitorNumber, videoSource) => {
  let group = groupName.charAt(0).toLowerCase() + groupName.slice(1);
  window.dataLayer.push({
    event: "pec_2024_videos",
    CDCategory: group,
    CDAction: '03. Completado',
    CDLabel: `participante_${competitorNumber}`,
    CDValue: videoSource,
    CDFunnel: 'PE Ganadores 2024',
  });
};

const onShareHome = (social) => {
  window.dataLayer.push({
    event: "click_element",
    CDCategory: 'compartir_pagina',
    CDLabel: social,
    CDFunnel: 'PE Ganadores 2024',
  });
};





