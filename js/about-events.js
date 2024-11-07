// MARK: LAYOUTS
window.dataLayer = window.dataLayer || [];
const $previousWinnersSection = document.getElementById("previous-winners");
let currentScrollWebsite = 0;

const sectionReached = [];
/**
 *
 * @param {HTMLElement} el
 * @returns {boolean}
 */
const isElementInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const handleScroll = () => {
  currentScrollWebsite = calculateScrollPercentage();
  const sections = document.querySelectorAll("section");
  sections.forEach((section, index) => {
    if (isElementInViewport(section) && !sectionReached[index]) {
      /** @type {HTMLElement | null} */
      const $innerTitle = section.querySelector("#title");
      /** @type {HTMLElement | null} */
      const $innerSubtitle = section.querySelector("#subtitle");
      window.dataLayer.push({
        event: "view_content",
        content_type: $innerTitle ? $innerTitle.innerText : null,
        event_category: "engagement",
        section: $innerSubtitle ? $innerSubtitle.innerText : null,
        action_description: "ver sección",
        element_type: "scroll",
        element_name: $innerTitle ? `Bloque ${$innerTitle.innerText}` : null,
        element_id: section.id,
        position: index,
      });
      sectionReached[index] = true;
    }
  });
};

/**
 *
 * @param {string} name
 * @param {number} index
 * @returns
 */
const onVideoClicked = (name, index) => {
  if (!$previousWinnersSection) return;

  /** @type {HTMLElement | null} */
  const $innerTitle = $previousWinnersSection.querySelector("#title");
  /** @type {HTMLElement | null} */
  const $innerSubtitle = $previousWinnersSection.querySelector("#subtitle");

  window.dataLayer.push({
    event: "click_element",
    content_type: $innerTitle.innerText,
    event_category: "engagement",
    section: $innerSubtitle.innerText,
    action_description: "Clic en video de candidato",
    element_type: "scroll",
    element_name: name,
    element_id: $previousWinnersSection.id,
    detail: name,
    position: index,
  });
};

const onVideoPopup = (name) => {
  window.dataLayer.push({
    event: "open_popup",
    event_category: "engagement",
    pop_up_name: name,
    action_description: "Visualización de popup",
  });
};

/**
 *
 * @param {string} src video file route
 * @param {string} name video description name
 * @param {string} videoLength video length
 */
const onVideoPlay = (src, name, videoLength) => {
  window.dataLayer.push({
    event: "video_start",
    event_category: "engagement",
    pop_up_name: name,
    action_description: "Visualización de popup",
    video_provider: "Interno",
    video_title: src.split("/").pop(),
    video_url: src,
    visible: "0",
    video_duration: videoLength,
  });
};

const onVideoPaused = (src, name, videoLength, timeWatched) => {
  window.dataLayer.push({
    event: "video_progress",
    event_category: "engagement",
    pop_up_name: name,
    action_description: "Visualización de popup",
    video_provider: "Interno",
    video_title: src.split("/").pop(),
    video_url: src,
    visible: ((timeWatched / videoLength) * 100).toFixed(2),
    video_duration: videoLength,
  });
};

const onVideoEnded = (src, name, videoLength) => {
  window.dataLayer.push({
    event: "video_complete",
    event_category: "engagement",
    pop_up_name: name,
    action_description: "Visualización de popup",
    video_provider: "Interno",
    video_title: src.split("/").pop(),
    video_url: src,
    visible: "100",
    video_duration: videoLength,
  });
};

/**
 *
 * @param {string} name
 * @param {"botón cerrar" | "click fuera"} method
 * @param {string} timeWatched
 */
const onPopupClosed = (name, method, timeWatched) => {
  window.dataLayer.push({
    event: "close_popup",
    event_category: "engagement",
    pop_up_name: name,
    action_description: "cerrar popup",
    method: method,
    video_duration: timeWatched,
  });
};

const onStartForm = (percentage = currentScrollWebsite) => {
  window.dataLayer.push({
    event: "open_form",
    event_category: "engagement",
    section: "Botón sticky",
    action_description: "Abrir formulario",
    element_type: "Botón sticky",
    element_name: "Participa",
    element_id: null,
    detail: "Participa",
    scroll_percentaje: percentage,
  });
};

window.addEventListener("scroll", handleScroll);
