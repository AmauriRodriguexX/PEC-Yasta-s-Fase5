/** @type {HTMLDivElement | null} */
const $videoModal = document.getElementById("video-modal");
/** @type {HTMLSourceElement | null} */
const $videoSource = document.getElementById("video-source");
/** @type {HTMLVideoElement | null} */
const $video = document.getElementById("video-player");

/**
 * Function to opens modal and display video
 * @param {string} videoSrc src video
 * @param {string} name name of the video
 */
const openModal = (videoSrc, name) => {
  if ($videoModal && $videoSource && $video) {
    $videoSource.src = videoSrc;
    $video.load();
    $videoModal.style.display = "block";
    onVideoPopup(name);

    let videoLength = 0;
    $video.addEventListener("loadedmetadata", () => {
      videoLength = formatDuration($video.duration);
      onVideoPlay(videoSrc, name, videoLength);
    });

    $video.addEventListener("pause", () => {
      const timeWatched = formatDuration($video.currentTime);
      onVideoPaused(videoSrc, name, videoLength, timeWatched);
    });

    $video.addEventListener("ended", () => {
      onVideoEnded(videoSrc, name, videoLength);
    });
  }
};

const closeModal = (method = "botón cerrar") => {
  if ($videoModal && $video) {
    $video.pause();
    let timeWatched = formatDuration($video.currentTime);

    onPopupClosed($videoSource.src.split("/").pop(), method, timeWatched);

    $videoModal.style.display = "none";
  }
};

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

// MARK: VALIDATORS
/**
 * Checks if the string contains only numbers.
 * @param {string} value
 * @return {boolean} Returns true if the value is numeric, otherwise false.
 */
const IsNumeric = (value) => {
  return /^\d+$/.test(value);
};

/**
 * Checks if the given value is not empty for strings or if the checkbox is checked.
 * Accepts both string values (for text inputs) and boolean values (for checkboxes).
 * @param {string|boolean} value - The value or checked status to validate.
 * @returns {boolean} - True if the field is considered "filled", false otherwise.
 */
const IsRequired = (value) => {
  if (typeof value === "boolean") {
    return value === true; // For checkboxes
  } else {
    return value.trim().length > 0; // For string inputs
  }
};

/**
 * Considers any value (input/checkbox status) as valid, implying the field is optional.
 * @param {string|boolean} value - The value or checked status to validate.
 * @returns {boolean} - Always true, as the field is optional.
 */
const IsOptional = (value) => {
  return true;
};

/**
 * Checks if the string's length is not more than given number.
 * @param {number} min - The maximun length.
 * @returns {Function} A validator function.
 */
const MaxLength = (length) => {
  return (value) => {
    return value.length <= length;
  };
};

/**
 * Checks if the string's length is not less than given number.
 * @param {number} length - The minimun length.
 * @returns {Function} A validator function.
 */
const MinLength = (length) => {
  return (value) => {
    return value.length >= length;
  };
};

/**
 * Checks if the string contains only of letters, including letters with accents and blanks.
 * @param {string} value - The value to validate.
 * @returns {boolean} - True if the value contains only letters (and accents), false otherwise.
 */
const IsAlpha = (value) => {
  const regex = /^[\p{L}\s]+$/u;
  return regex.test(value);
};

/**
 * Validates a field value against a list of validation functions, considering special handling
 * for an optional field. If the `IsOptional` validator is used and the field is empty, it bypasses
 * further validations.
 * @param {string|boolean} value - The value to validate, can be string for textual input or boolean for checkbox.
 * @param {Array<Function>} validators - An array of validator functions to apply.
 * @returns {boolean} - True if all validations pass (or if optional and empty), false otherwise.
 */
const validateField = (value, validators) => {
  // Check if IsOptional is one of the validators and if the value is effectively "empty".
  // For strings, check if it's truly empty after trimming. For booleans, false is considered "empty".
  const isOptionalPresent = validators.includes(IsOptional);
  const isEmptyValue =
    typeof value === "string" ? value.trim().length === 0 : value === false;

  // If IsOptional is present and the value is empty, consider it valid immediately.
  if (isOptionalPresent && isEmptyValue) {
    return true;
  }

  // Otherwise, proceed with normal validation for all validators except IsOptional.
  return validators
    .filter((validator) => validator !== IsOptional) // Ignore IsOptional for non-empty cases.
    .every((validator) => validator(value));
};

/**
 * Validates an object representing form data against a set of field-specific validators.
 * @param {Object} formData - An object where keys are field names and values are the field values to validate.
 * @param {Object} formValidators - An object where keys are field names and values are arrays of validator functions.
 * @returns {boolean} - True if all fields pass their validations, false otherwise.
 */
const validateAll = (formData, formValidators) => {
  return Object.entries(formData).every(([fieldName, value]) => {
    return validateField(value, formValidators[fieldName]);
  });
};

/**
 * Function to show validation message
 * @param {string} inputId
 * @param {string} message
 * @param {string} isValid
 */
const UIValidation = (fieldId, message, isValid) => {
  const $message = document.getElementById("message-" + fieldId);
  const $field = document.getElementById(fieldId);

  if ($message) {
    $message.textContent = message;
    $message.style.display = "block";
    $message.style.color = isValid ? IS_VALID_COLOR : IS_NOT_VALID_COLOR;
  }

  if ($field) {
    $field.style.border = `1px solid ${
      isValid ? IS_VALID_COLOR : IS_NOT_VALID_COLOR
    }`;
  }
};

// MARK: FORM
const SUCCESS_MESSAGE = "Tu campo se ha llenado correctamente";
const ERROR_MESSAGES = {
  "question-2": "Ingresa un ID de cliente válido",
  "question-3": "Campo obligatorio",
  "question-4": "Campo obligatorio",
  "question-5": "Ingresa un número de celular válido",
  "question-6": "Campo obligatorio",
  "question-7": "Campo obligatorio",
  "question-8": "Caracteres invalidos",
  "question-9": "Campo obligatorio",
  "question-10": "Campo obligatorio",
  "question-11": "Ingresa un número de celular válido",
  "question-12": "Campo obligatorio",
};

const goToWinners = () => {
  window.location.href = "ganadores.html";
};

const goBackHome = () => {
  window.location.href = "index.html";
};

const goBackStepOne = () => {
  window.location.href = "paso-1.html";
};

const goBackStepTwo = () => {
  window.location.href = "paso-2.html";
};

// STEP 1
// Constants
const STEP_ONE_KEY = "step-1";
const STEP_ONE_ANSWERS = retrieveFromLocalStorage(STEP_ONE_KEY);

// Validators
const STEP_ONE_INPUT_VALIDATORS = {
  "question-2": [MinLength(3), MaxLength(12), IsRequired, IsNumeric],
  "question-3": [MinLength(2), IsRequired, IsAlpha],
  "question-4": [MinLength(2), IsRequired, IsAlpha],
  "question-5": [MinLength(10), IsNumeric, IsRequired],
  "question-8": [IsOptional, IsAlpha],
};

const STEP_ONE_SELECT_VALIDATORS = {
  "question-6": [IsRequired],
  "question-7": [IsRequired],
};

/** @type {HTMLInputElement | null} */
const $customerCheckbox = document.getElementById("customer");
/** @type {HTMLInputElement | null} */
const $colaboradorCheckbox = document.getElementById("colaborador");

if ($customerCheckbox && $colaboradorCheckbox) {
  $colaboradorCheckbox.value === STEP_ONE_ANSWERS?.["question-1"]
    ? ($colaboradorCheckbox.checked = true)
    : ($customerCheckbox.checked = true);

  $customerCheckbox.addEventListener("change", () => {
    if (!$customerCheckbox.checked && !$colaboradorCheckbox.checked) {
      $customerCheckbox.checked = true;
    } else {
      $colaboradorCheckbox.checked = !$customerCheckbox.checked;
    }
  });

  $colaboradorCheckbox.addEventListener("change", () => {
    if (!$colaboradorCheckbox.checked && !$customerCheckbox.checked) {
      $colaboradorCheckbox.checked = true;
    } else {
      $customerCheckbox.checked = !$colaboradorCheckbox.checked;
    }
  });
}

Object.keys(STEP_ONE_INPUT_VALIDATORS).map((fieldId) => {
  /** @type {HTMLInputElement | null} */
  const $input = document.getElementById(fieldId);
  if ($input) {
    $input.value = STEP_ONE_ANSWERS?.[fieldId] || "";
    $input.addEventListener("input", (e) => {
      const isValid = validateField(
        e.target.value,
        STEP_ONE_INPUT_VALIDATORS[fieldId]
      );
      if (isValid) {
        UIValidation(fieldId, SUCCESS_MESSAGE, true);
      } else {
        UIValidation(fieldId, ERROR_MESSAGES[fieldId], false);
      }
    });
  }
});

Object.keys(STEP_ONE_SELECT_VALIDATORS).map((fieldId) => {
  /** @type {HTMLSelectElement | null} */
  const $select = document.getElementById(fieldId);
  if ($select) {
    $select.value = STEP_ONE_ANSWERS?.[fieldId] || "";
    $select.addEventListener("change", (e) => {
      const isValid = validateField(
        e.target.value,
        STEP_ONE_SELECT_VALIDATORS[fieldId]
      );
      if (isValid) {
        UIValidation(fieldId, SUCCESS_MESSAGE, true);
      } else {
        UIValidation(fieldId, ERROR_MESSAGES[fieldId], false);
      }
    });
  }
});

let submitOneCounter = 0; //How many times first step submit button was clicked
const stepOneValidation = () => {
  submitOneCounter++;
  let inputFormData = {};
  let selectFormData = {};
  Object.keys(STEP_ONE_INPUT_VALIDATORS).map((fieldId) => {
    /** @type {HTMLInputElement | null} */
    const $input = document.getElementById(fieldId);
    if ($input) {
      const event = new Event("input");
      $input.dispatchEvent(event);
      inputFormData[fieldId] = $input.value;
    }
  });

  Object.keys(STEP_ONE_SELECT_VALIDATORS).map((fieldId) => {
    /** @type {HTMLSelectElement | null} */
    const $select = document.getElementById(fieldId);
    if ($select) {
      const event = new Event("change");
      $select.dispatchEvent(event);
      selectFormData[fieldId] = $select.value;
    }
  });

  const areInputsValid = validateAll(inputFormData, STEP_ONE_INPUT_VALIDATORS);
  const areSelectsValid = validateAll(
    selectFormData,
    STEP_ONE_SELECT_VALIDATORS
  );
  onSubmit(submitOneCounter, 9, areInputsValid && areSelectsValid);
  if (!areInputsValid || !areSelectsValid) return;

  const checkbox = $customerCheckbox.checked
    ? $customerCheckbox.value
    : $colaboradorCheckbox.value;
  const stepOneData = combineObjects([
    inputFormData,
    selectFormData,
    { "question-1": checkbox },
  ]);
  saveToLocalStorage(STEP_ONE_KEY, stepOneData);
  window.location.href = "paso-2.html";
};

// STEP 2
// Constants
const STEP_TWO_KEY = "step-2";
const STEP_TWO_ANSWERS = retrieveFromLocalStorage(STEP_TWO_KEY);

// Validators
const STEP_TWO_INPUT_VALIDATORS = {
  "question-9": [IsRequired, IsAlpha],
  "question-10": [IsRequired, IsAlpha],
  "question-11": [IsRequired, IsNumeric, MinLength(10)],
};

const STEP_TWO_CHECKBOX_VALIDATORS = {
  "question-12": [IsRequired],
};

Object.keys(STEP_TWO_INPUT_VALIDATORS).map((fieldId) => {
  /** @type {HTMLInputElement | null} */
  const $input = document.getElementById(fieldId);
  if ($input) {
    $input.value = STEP_TWO_ANSWERS?.[fieldId] || "";
    $input.addEventListener("input", (e) => {
      const isValid = validateField(
        e.target.value,
        STEP_TWO_INPUT_VALIDATORS[fieldId]
      );
      if (isValid) {
        UIValidation(fieldId, SUCCESS_MESSAGE, true);
      } else {
        UIValidation(fieldId, ERROR_MESSAGES[fieldId], false);
      }
    });
  }
});

Object.keys(STEP_TWO_CHECKBOX_VALIDATORS).map((fieldId) => {
  /** @type {HTMLInputElement | null} */
  const $checkbox = document.getElementById(fieldId);
  if ($checkbox) {
    $checkbox.checked = STEP_TWO_ANSWERS?.[fieldId] || false;
    $checkbox.addEventListener("change", (e) => {
      const isValid = validateField(
        e.target.checked,
        STEP_TWO_CHECKBOX_VALIDATORS[fieldId]
      );
      if (isValid) {
        UIValidation(fieldId, "", true);
      } else {
        UIValidation(fieldId, ERROR_MESSAGES[fieldId], false);
      }
    });
  }
});

let submitTwoCounter = 0;
const stepTwoValidation = () => {
  submitTwoCounter++;
  let inputFormData = {};
  let checkboxFormData = {};

  Object.keys(STEP_TWO_INPUT_VALIDATORS).map((fieldId) => {
    /** @type {HTMLInputElement | null} */
    const $input = document.getElementById(fieldId);
    if ($input) {
      const event = new Event("input");
      $input.dispatchEvent(event);
      inputFormData[fieldId] = $input.value;
    }
  });

  Object.keys(STEP_TWO_CHECKBOX_VALIDATORS).map((fieldId) => {
    /** @type {HTMLInputElement | null} */
    const $checkbox = document.getElementById(fieldId);
    if ($checkbox) {
      const event = new Event("change");
      $checkbox.dispatchEvent(event);
      checkboxFormData[fieldId] = $checkbox.checked;
    }
  });

  const areInputsValid = validateAll(inputFormData, STEP_TWO_INPUT_VALIDATORS);
  const areCheckboxsValid = validateAll(
    checkboxFormData,
    STEP_TWO_CHECKBOX_VALIDATORS
  );
  onSubmit(submitTwoCounter, 5, areInputsValid && areCheckboxsValid);
  if (!areInputsValid || !areCheckboxsValid) return;

  const stepTwoData = combineObjects([inputFormData, checkboxFormData]);
  saveToLocalStorage(STEP_TWO_KEY, stepTwoData);
  window.location.href = "paso-3.html";
};

// STEP 3
//CONSTANTS
const IS_VALID_COLOR = "#63963B";
const IS_NOT_VALID_COLOR = "#B83021";
const VALID_VIDEO_TYPES = ["video/mp4", "video/quicktime"];
const VALID_PHOTO_TYPES = ["image/jpeg", "image/jpg", "image/png"];

/**
 * Displays a message to the user.
 * @param {HTMLSpanElement} htmlElement
 * @param {string} text - The message to display.
 * @param {string} color - The color of the message text.
 */
const displayMessage = (htmlElement, text, color) => {
  htmlElement.textContent = text;
  htmlElement.style.color = color;
};

/** @type {HTMLInputElement | null} */
const $videoInput = document.getElementById("video");
/** @type {HTMLSpanElement | null} */
const $videoMessage = document.getElementById("video-message");
/** @type {HTMLImageElement | null} */
const $videoIcon = document.getElementById("video-icon");
/** @type {HTMLLabelElement | null} */
const $videoLabel = document.getElementById("video-label");
/** @type {HTMLSpanElement | null} */
const $videoName = document.getElementById("video-name");

const IS_VALID_VIDEO_ICON = "./assets/images/video_active.png";
const IS_NOT_VALID_VIDEO_ICON = "./assets/images/video_false.png";
const DEFAULT_VIDEO_ICON = "./assets/images/video.png";

if ($videoInput) {
  $videoInput.addEventListener("change", (event) => {
    /** @type {File} */
    const file = event.target.files[0];
    // If no file is selected, do nothing
    if (!file) {
      return;
    }

    $videoName.textContent = file.name;
    const fileType = file.type;
    const fileSize = file.size / 1024 / 1024;

    // Check if the file type is MOV or MP4
    if (!VALID_VIDEO_TYPES.includes(fileType)) {
      displayMessage(
        $videoMessage,
        "Seleccione un archivo MP4 o MOV",
        IS_NOT_VALID_COLOR
      );
      $videoIcon.src = IS_NOT_VALID_VIDEO_ICON;
      $videoLabel.classList.add("is-not-correct");
      onSuccessUpload("video", fileSize, fileType, false);
      return;
    }

    // Check if the file size is less than 25MB
    if (fileSize > 25) {
      displayMessage(
        $videoMessage,
        "El video debe pesar menos de 25 MB",
        IS_NOT_VALID_COLOR
      );
      $videoIcon.src = IS_NOT_VALID_VIDEO_ICON;
      $videoLabel.classList.add("is-not-correct");
      onSuccessUpload("video", fileSize, fileType, false);
      return;
    }

    // If file is both a correct type and within the size limit
    displayMessage(
      $videoMessage,
      "Tu video se ha cargado correctamente",
      IS_VALID_COLOR
    );
    $videoIcon.src = IS_VALID_VIDEO_ICON;
    $videoLabel.classList.remove("is-not-correct");
    $videoLabel.classList.add("is-correct");
    onSuccessUpload("video", fileSize, fileType, true);
  });
}

/** @type {HTMLInputElement | null} */
const $photoInput = document.getElementById("photo");
/** @type {HTMLSpanElement | null} */
const $photoMessage = document.getElementById("photo-message");
/** @type {HTMLImageElement | null} */
const $photoIcon = document.getElementById("photo-icon");
/** @type {HTMLLabelElement | null} */
const $photoLabel = document.getElementById("photo-label");
/** @type {HTMLSpanElement | null} */
const $photoName = document.getElementById("photo-name");

const IS_VALID_PHOTO_ICON = "./assets/images/img_active.png";
const IS_NOT_VALID_PHOTO_ICON = "./assets/images/img_false.png";
const DEFAULT_PHOTO_ICON = "./assets/images/img.png";

if ($photoInput) {
  $photoInput.addEventListener("change", (event) => {
    /** @type {File} */
    const file = event.target.files[0];
    // If no file is selected, do nothing
    if (!file) {
      return;
    }

    $photoName.textContent = file.name;
    const fileType = file.type;
    const fileSize = file.size / 1024 / 1024;

    if (!VALID_PHOTO_TYPES.includes(fileType)) {
      displayMessage(
        $photoMessage,
        "Seleccione un archivo JPG, JPEG o PNG",
        IS_NOT_VALID_COLOR
      );
      $photoIcon.src = IS_NOT_VALID_PHOTO_ICON;
      $photoLabel.classList.add("is-not-correct");
      onSuccessUpload("photo", fileSize, fileType, false);
      return;
    }

    if (fileSize > 5) {
      displayMessage(
        $photoMessage,
        "La fotografía debe pesar menos de 5 MB",
        IS_NOT_VALID_COLOR
      );
      $photoIcon.src = IS_NOT_VALID_PHOTO_ICON;
      $photoLabel.classList.add("is-not-correct");
      onSuccessUpload("photo", fileSize, fileType, false);
      return;
    }

    // If file is both a correct type and within the size limit
    displayMessage(
      $photoMessage,
      "Tu fotografía se ha cargado correctamente",
      IS_VALID_COLOR
    );
    $photoIcon.src = IS_VALID_PHOTO_ICON;
    $photoLabel.classList.remove("is-not-correct");
    $photoLabel.classList.add("is-correct");
    onSuccessUpload("photo", fileSize, fileType, true);
  });
}

let submitThreeCounter = 0;
const sendForm = () => {
  submitThreeCounter++;
  if (
    $photoInput &&
    $photoInput.files.length > 0 &&
    $videoInput &&
    $videoInput.files.length > 0
  ) {
    localStorage.setItem('submitted-form',true);
    onSubmit(submitThreeCounter, 3, true);
    window.location.href = "gracias.html";
    return;
  }

  onSubmit(submitThreeCounter, 3, false);
};

// MARK: THANK-YOU
/** @type {HTMLElement | null} */
const $userRegistration = document.getElementById("current-date");

if ($userRegistration) {
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  $userRegistration.textContent = formattedDate;
}