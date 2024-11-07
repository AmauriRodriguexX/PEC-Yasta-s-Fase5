const $videoModal = document.getElementById("video-modal");
const $videoSource = document.getElementById("player");

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
let videoPlayStatus = {};
let percentageSended = {};
let intervalId;
let hasBeenPaused = false;

function getYoutubeVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/embed\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return (match && match[1]) ? match[1] : null;
}

function onPlayerReady(event) {
    percentageSended = {};
}

function getNearestVideoPercentage(value) {
  const allowedValues = [10, 25, 50, 75];
  let nearest = allowedValues[0];
  let minDifference = Math.abs(value - allowedValues[0]);

  for (let i = 1; i < allowedValues.length; i++) {
    let difference = Math.abs(value - allowedValues[i]);
    if (difference < minDifference) {
      minDifference = difference;
      nearest = allowedValues[i];
    }
  }
  
  return nearest;
}

function checkVideoProgress() {
  const currentTime = player.getCurrentTime();
  const videoDuration = player.getDuration();
  if (currentTime !== undefined && videoDuration !== 0) {
    const percentageWatched = (currentTime / videoDuration) * 100;
    const roundedPercentage = Math.round(percentageWatched);
    switch (roundedPercentage) {
      case 10:
        if (!(10 in percentageSended)) {
          percentageSended[10] = false;
        }
        if(!percentageSended[10]) {
          percentageSended[10] = true;
          sendVideoProgressEvent(10);
        }
        break;
      case 25:
        if (!(25 in percentageSended)) {
          percentageSended[25] = false;
        }
        if(!percentageSended[25]) {
          percentageSended[25] = true;
          sendVideoProgressEvent(25);
        }
        break;
      case 50:
        if (!(50 in percentageSended)) {
          percentageSended[50] = false;
        }
        if(!percentageSended[50]) {
          percentageSended[50] = true;
          sendVideoProgressEvent(50);
        }
        break;
      case 75:
        if (!(75 in percentageSended)) {
          percentageSended[75] = false;
        }
        if(!percentageSended[75]) {
          percentageSended[75] = true;
          sendVideoProgressEvent(75);
        }
        break;
    }
  }
}

function onPlayerStateChange(event) {
  const ytFrame = document.getElementById('player');
  const videoId = getYoutubeVideoId(ytFrame.src);
  const competitorIndex = ytFrame.getAttribute('competitor-index');
  const group = ytFrame.getAttribute('group-name');
  const competitor = currentGroupData[competitorIndex];
  if (!(videoId in videoPlayStatus)) {
    videoPlayStatus[videoId] = false;
  }

  if (event.data == YT.PlayerState.PLAYING ) {
    hasBeenPaused = false;
    clearInterval(intervalId);
    intervalId = setInterval(checkVideoProgress, 50);
    if(!videoPlayStatus[videoId]) {
      videoPlayStatus[videoId] = true;      
      onVideoPlay(group,competitor.number,ytFrame.src)
    }
  } else if (event.data == YT.PlayerState.PAUSED) {
    hasBeenPaused = true;
    clearInterval(intervalId);
    const percentageWatched = (player.getCurrentTime() / player.getDuration()) * 100;
    sendVideoProgressEvent(percentageWatched);
  } else if (event.data == YT.PlayerState.ENDED) {
    clearInterval(intervalId);
    percentageSended = {}; 
    videoPlayStatus[videoId] = false; 
    onVideoEnded(group,competitor.number,ytFrame.src);
  }
}

const openModal = (videoSrc, name, business, index, groupName) => {
  if ($videoModal && $videoSource) {
    $videoModal.style.display = "block";
    $videoSource.setAttribute('competitor-index', index);
    $videoSource.setAttribute('group-name', groupName);
  }
  if (player) {
    player.destroy();
  }
  
  player = new YT.Player('player', {
    videoId: videoSrc,
    playerVars: {
      'rel': 0,
    },
    events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
    }
  });

  const competitorName = document.getElementById('video-competitor-name');
  const cup = document.getElementById('cup');
  const cupImg = document.getElementById('cup-img');
  const percentage = document.getElementById('percentage');
  const competitor = currentGroupData[index];
  competitorName.textContent = name;
  percentage.textContent = competitor.percentage;
  if(competitor.position == 1) {
    cup.classList.remove('cup2');
    cup.classList.add('cup1');
    cupImg.src = './assets/images/cup1.png';
  }
  else if(competitor.position == 2) {
    cup.classList.remove('cup1');
    cup.classList.add('cup2');
    cupImg.src = './assets/images/cup2.png';
  }
 
  onVideoPopup(groupName,competitor.number,competitor.videoId,competitor.image);
};

const closeModal = () => {
  if ($videoModal) {    
    clearInterval(intervalId);
    $videoModal.style.display = "none"; 
    const percentageWatched = (player.getCurrentTime() / player.getDuration()) * 100;
    if(percentageWatched < 90 && percentageWatched > 0 && !hasBeenPaused) {
      sendVideoProgressEvent(percentageWatched);
    }    
    player.destroy();
  }
};

const sendVideoProgressEvent = (percentageWatched) => {
    const ytFrame = document.getElementById('player');
    const competitorIndex = ytFrame.getAttribute('competitor-index');
    const group = ytFrame.getAttribute('group-name');
    const competitor = currentGroupData[competitorIndex];
    onVideoProgress(group,competitor.number,ytFrame.src,getNearestVideoPercentage(percentageWatched));
}

// Close the modal if the user clicks anywhere outside of it
window.onclick = (event) => {
  if (event.target === $videoModal) {
    closeModal("click fuera");
  }
};

/** @type {HTMLDivElement | null} */
const $privacyTextModal = document.getElementById("privacy-text-modal");

const openModalPrivacyText = () => {
  if ($privacyTextModal) {
    $privacyTextModal.style.display = "block";
  }
};

const closeModalPrivacyText = () => {
  $privacyTextModal.style.display = "none";
};

// Close the modal if the user clicks anywhere outside of it
window.onclick = (event) => {
  if (event.target === $privacyTextModal) {
    closeModalPrivacyText();
  }
};

/** @type {HTMLDivElement | null} */
const $videoTextModal = document.getElementById("video-text-modal");

const openModalVideoText = () => {
  if ($videoTextModal) {
    onPopup("Caracteristicas del video");
    $videoTextModal.style.display = "block";
  }
};

const closeModalVideoText = () => {
  onClosePopup("Caracteristicas del video");
  $videoTextModal.style.display = "none";
};

// Close the modal if the user clicks anywhere outside of it
window.onclick = (event) => {
  if (event.target === $videoTextModal) {
    closeModalPrivacyText();
  }
};

/** @type {HTMLDivElement | null} */
const $photoTextModal = document.getElementById("photo-text-modal");

const openModalPhotoText = () => {
  if ($photoTextModal) {
    onPopup("Caracteristicas de la foto");
    $photoTextModal.style.display = "block";
  }
};

const closeModalPhotoText = () => {
  onClosePopup("Caracteristicas de la foto");
  $photoTextModal.style.display = "none";
};

// Close the modal if the user clicks anywhere outside of it
window.onclick = (event) => {
  if (event.target === $photoTextModal) {
    closeModalPrivacyText();
  }
};

const carousel = document.querySelector('.carousel');
let isDragging = false;
let startX;
let scrollLeft;

const goToCB = () => {
  window.location.href = 'https://www.compartamos.com.mx/compartamos';
}

const goToAbout = () => {
  window.location.href = 'acerca-de.html';
}

const goToHome = () => {
  window.location.href = 'index.html';
}

carousel.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('touchstart', (e) => {
  isDragging = true;
  startX = e.touches[0].clientX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('mouseup', () => {
  isDragging = false;
});

carousel.addEventListener('touchend', () => {
  isDragging = false;
});

carousel.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 3;
  carousel.scrollLeft = scrollLeft - walk;
});

carousel.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.touches[0].clientX - carousel.offsetLeft;
  const walk = (x - startX) * 3;
  carousel.scrollLeft = scrollLeft - walk;
});

document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.carousel-button');
  const bubbles = document.querySelector('.bubbles');
  const group = document.querySelector('.group');

  buttons.forEach(button => {
    button.addEventListener('click', function() {
      buttons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      if (bubbles) {
        bubbles.classList.add('hidden');
        group.classList.add('block');
      }
    });
  });
});

const groups = {
  Centro: [
      {
          number: "1",
          name: "Jose Robles",
          image: "./assets/images/JoseRobles.png",
          description: "Agua purificada",
          videoId: "8VE4moocPTo",
          percentage: "51%",
          position: 1,

      },
      {
          number: "2",
          name: "María López",
          image: "./assets/images/MariaLopez.png",
          description: "Elaboración de mole",
          videoId: "tg67nDhPUgs",
          percentage: "49%",
          position: 2
      }
  ],
  CentroNorte: [
    {
      number: "3",
      name: "Participante 3",
      image: "./assets/images/JoseRobles.png",
      description: "Agua purificada",
      videoId: "dCouUDxPKrU",
      percentage: "51%",
      position: 1
    },
    {
        number: "4",
        name: "Participante 4",
        image: "./assets/images/MariaLopez.png",
        description: "Elaboración de mole",
        videoId: "ciE7Md0VeSE",
        percentage: "49%",
        position: 2
    }
  ],
  Metro: [
    {
        number: "5",
        name: "Participante 5",
        image: "./assets/images/JoseRobles.png",
        description: "Agua purificada",
        videoId: "BQl-VY834S8",
        percentage: "51%",
        position: 1
    },
    {
        number: "6",
        name: "Participante 6",
        image: "./assets/images/MariaLopez.png",
        description: "Elaboración de mole",
        videoId: "cT4Sj-cn7Uk",
        percentage: "49%",
        position: 2
    }
  ],
  Noreste: [
    {
      number: "7",
      name: "Participante 7",
      image: "./assets/images/JoseRobles.png",
      description: "Agua purificada",
      videoId: "03ESY8XHCoc",
      percentage: "51%",
      position: 1
    },
    {
        number: "8",
        name: "Participante 8",
        image: "./assets/images/MariaLopez.png",
        description: "Elaboración de mole",
        videoId: "03ESY8XHCoc",
        percentage: "49%",
        position: 2
    }
  ],
  Occidente: [
    {
      number: "9",
      name: "Participante 9",
      image: "./assets/images/JoseRobles.png",
      description: "Agua purificada",
      videoId: "-SAFYUOgP6I",
      percentage: "51%",
      position: 1
    },
    {
        number: "10",
        name: "Participante 10",
        image: "./assets/images/MariaLopez.png",
        description: "Elaboración de mole",
        videoId: "SeRrhVLx3qo",
        percentage: "49%",
        position: 2
    }
  ],
  Pacífico: [
    {
      number: "11",
      name: "Participante 11",
      image: "./assets/images/JoseRobles.png",
      description: "Agua purificada",
      videoId: "xCVRyNGMdis",
      percentage: "51%",
      position: 1
    },
    {
        number: "12",
        name: "Participante 12",
        image: "./assets/images/MariaLopez.png",
        description: "Elaboración de mole",
        videoId: "b2x8NSyUBU8",
        percentage: "49%",
        position: 2
    }
  ],
  Península: [
    {
      number: "13",
      name: "Participante 13",
      image: "./assets/images/JoseRobles.png",
      description: "Agua purificada",
      videoId: "owT38PCfMrk",
      percentage: "51%",
      position: 1
    },
    {
        number: "14",
        name: "Participante 14",
        image: "./assets/images/MariaLopez.png",
        description: "Elaboración de mole",
        videoId: "xowHeg3a5UQ",
        percentage: "49%",
        position: 2
    }
  ],
  Sur: [
    {
      number: "15",
      name: "Participante 15",
      image: "./assets/images/JoseRobles.png",
      description: "Agua purificada",
      videoId: "Mm8AkGcpM3s",
      percentage: "51%",
      position: 1
    },
    {
        number: "16",
        name: "Participante 16",
        image: "./assets/images/MariaLopez.png",
        description: "Elaboración de mole",
        videoId: "-U1XVjyiOr4",
        percentage: "49%",
        position: 2
    }
  ]
};

const $voteModal = document.getElementById("vote-modal");
var currentGroupData = [];
document.addEventListener('DOMContentLoaded', async function () {
  const buttons = document.querySelectorAll('.carousel-button');
  const groupTitle = document.querySelector('.group-title');
  const competitorGroup = document.querySelector('.competitor-group');
  currentGroupData = [];

  buttons.forEach((button,index) => {
    button.addEventListener('click', function () {
      const groupKey = Object.keys(groups)[index];
      let disabled = false;
      buttons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      const group = button.getAttribute('data-group');
      currentGroupData = groups[group];
      updateGroupContent(button.textContent,index+1, groups[group], disabled);
    });
  });

  function updateGroupContent(groupName,groupNumber,groupData, disabled) {
      groupTitle.textContent = `Grupo ${groupNumber} ${groupName}`;
      competitorGroup.innerHTML = '';

      groupData.forEach((competitor,index) => {
          competitorGroup.innerHTML += `
              <div class="competitor">
                  <div class="competitor-img">
                      <img src="${competitor.image}" alt="${competitor.name}" width="150" height="60" />
                      <div class="name">
                        <p>${competitor.name}</p>
                      </div> 
                  </div>
                  <div class="actions">
                      <div class="history">
                          <p id="competitor-description" class="description">${competitor.description}</p>
                          <div class="competitor-votes">
                              ${competitor.position == 1 ? '<div class="cup1"><img src="./assets/images/cup1.png" alt="cup1" /></div>' : '<div class="cup2"><img src="./assets/images/cup2.png" alt="cup2" /></div>' }
                              <div class="info"><p class="percentage">${competitor.percentage}</p><p>de los votos</p></div>
                          </div>
                          <div
                            onclick="openModal('${competitor.videoId}', '${competitor.name}', '${competitor.description}', '${index}', '${groupName}')"
                          >
                              <div class="watch-video">
                                <p>Conoce mi historia</p><div class="play-button"><img src="./assets/images/play-video.png" alt="bubble" /></div>
                              </div>
                          </div>
                      </div> 
                  </div>
              </div>
          `;

          const descriptions = document.querySelectorAll('#competitor-description');
  
          let maxHeight = 0;
        
          descriptions.forEach(description => {
            if (description.offsetHeight > maxHeight) {
              maxHeight = description.offsetHeight;
            }
          });
        
          descriptions.forEach(description => {
            description.style.height = maxHeight + 'px';
          });
      });
  }
});

const closeVoteModal = () => {
  if ($voteModal) {
    $voteModal.style.display = "none";
  }
};

function share(to) {
  const currentUrl = encodeURIComponent(window.location.href);
  url = "";
  switch (to) {
    case 'Facebook':
      url = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
      break;
    case 'Whatsapp':
      url = `https://wa.me/?text=${currentUrl}`;
      break;
  }
  if (url) {
    window.open(url, "_blank");
  }
}

// MARK: HELPERS
/**
 * Formats a duration from seconds into a string formatted as mm:ss.
 * @param {number} duration - The video duration in seconds.
 * @returns {string} The formatted duration in the format of mm:ss.
 */
const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
};

/**
 * Calculates the scroll percentage of the webpage.
 * @returns {number} The scroll percentage, a value between 0 and 100.
 */
const calculateScrollPercentage = () => {
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
};

/**
 * Combines an array of objects into a single object.
 * @param {Object[]} arrayOfObjects - The array of objects to combine.
 * @return {Object} - The combined object.
 */
const combineObjects = (arrayOfObjects) => {
  return arrayOfObjects.reduce((accumulator, currentObject) => {
    return { ...accumulator, ...currentObject };
  }, {});
};

/**
 * Saves an object to localStorage.
 * @param {string} key - The key under which to store the object.
 * @param {Object} objectToSave - The object to save.
 */
const saveToLocalStorage = (key, objectToSave) => {
  const objectString = JSON.stringify(objectToSave);
  window.localStorage.setItem(key, objectString);
};

/**
 * Retrieves an object from localStorage.
 * @param {string} key - The key of the object to retrieve.
 * @return {Object|null} - The retrieved object or null if not found.
 */
const retrieveFromLocalStorage = (key) => {
  const objectString = window.localStorage.getItem(key);
  return objectString ? JSON.parse(objectString) : null;
};

/**
 * Formats a date object into a string with the format "DD/MMMM/YYYY".
 * @param {Date} date - The date object to format.
 * @return {string} - A string representation of the date in the format "DD MMMM YYYY".
 */
const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "2-digit" };
  const formattedParts = new Intl.DateTimeFormat(
    "es-MX",
    options
  ).formatToParts(date);

  let day, month, year;

  formattedParts.forEach((part) => {
    if (part.type === "day") day = part.value;
    if (part.type === "month") month = part.value;
    if (part.type === "year") year = part.value;
  });

  // Ensure month starts with an uppercase letter
  month = month.charAt(0).toUpperCase() + month.slice(1);

  return `${day}/${month.toLowerCase()}/${year}`;
};