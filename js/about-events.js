// MARK: GPT
window.dataLayer = window.dataLayer || [];
// ---

// MARK: CONSTANTS & HTML ELEMENTS
// HTML ELEMENTS
/** @type {HTMLElement | null} */
const $PREVIOUS_WINNERS_SECTION = document.getElementById("previous-winners");
// ---

let currentScrollWebsite = 0;
/** @type {Array<boolean>} */
const sectionReached = [];
/**
 * Checks if a given HTML element is within the visible portion of the viewport.
 * @param {HTMLElement} el The HTML element to check for visibility within the viewport.
 * @returns {boolean} Returns true if the element is fully within the viewport, otherwise false.
 */
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Triggers GTP event first time each section of the
 * webpage is reached scrolling
 */
function handleScroll() {
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
}

/**
 *
 * @param {string} name participant name
 * @param {number} index participant index
 * @returns {void}
 */
function onVideoClicked(name, index) {
  if (!$PREVIOUS_WINNERS_SECTION) return;

  /** @type {HTMLElement | null} */
  const $innerTitle = $PREVIOUS_WINNERS_SECTION.querySelector("#title");
  /** @type {HTMLElement | null} */
  const $innerSubtitle = $PREVIOUS_WINNERS_SECTION.querySelector("#subtitle");

  window.dataLayer.push({
    event: "click_element",
    content_type: $innerTitle.innerText,
    event_category: "engagement",
    section: $innerSubtitle.innerText,
    action_description: "Clic en video de candidato",
    element_type: "scroll",
    element_name: name,
    element_id: $PREVIOUS_WINNERS_SECTION.id,
    detail: name,
    position: index,
  });
}

/**
 * GPT event when video popup is open
 * @param {string} name video name
 * @returns {void}
 */
function onVideoPopUp(name) {
  window.dataLayer.push({
    event: "open_popup",
    event_category: "engagement",
    pop_up_name: name,
    action_description: "Visualización de popup",
  });
}

/**
 * GPT event when video popup is closed
 * @param {string} name video description name
 * @param {"botón cerrar" | "click fuera"} method how the modal was closed
 * @param {string} timeWatched video viewed time
 * @returns {void}
 */
function onVideoPopOut(name, method, timeWatched) {
  window.dataLayer.push({
    event: "close_popup",
    event_category: "engagement",
    pop_up_name: name,
    action_description: "cerrar popup",
    method: method,
    video_duration: timeWatched,
  });
}

/**
 * GPT event when the video is played
 * @param {string} src video file route
 * @param {string} name video description name
 * @param {string} videoLength video length
 */
function onVideoPlay(src, name, videoLength) {
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
}

/**
 * GPT event when the video is paused
 * @param {string} src video file route
 * @param {string} name video description name
 * @param {string} videoLength video length
 * @param {string} timeWatched video viewed time
 */
function onVideoPaused(src, name, videoLength, timeWatched) {
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
}

/**
 * GPT event when the video is finised
 * @param {string} src video file route
 * @param {string} name video description name
 * @param {string} videoLength video length
 * @returns {void}
 */
function onVideoEnded(src, name, videoLength) {
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
}

window.addEventListener("scroll", handleScroll);
