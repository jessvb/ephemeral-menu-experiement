// This javascript file contains methods that run the experiment. The method,
// "performExperiment" is called from experimentSetup to start the actual
// experiment process.

// stages in the experiment
const STAGES = [
  'notifypractice', 'practice1', 'block1_half1', 'shortBreak1', 'block1_half2',
  'block1_survey', 'block2_half1', 'shortBreak2', 'notifypractice', 'practice2',
  'block2_half2', 'block2_survey', 'end'
];
const NUM_PRACTICE_TESTS = 8;
const NUM_TESTS_PER_BLOCK = 126;

// whether control or fading menus is first
let IS_CONTROL_FIRST;

// current stage of the experiment
let currStage;
// current index of the experiment stage
let stageIndex = -1;
// current trial within the stage
let currTest = 0;


// ---------------------------------------- //
// --- Main Experiment Progress Methods --- //
// ---------------------------------------- //

/**
 * This method starts and completes the process of the experiment. It runs
 * through all the stages of the experiment.
 */
function performExperiment(adaptiveAccuracy, isControlFirst) {
  IS_CONTROL_FIRST = isControlFirst;

  // stop showing the elements, if they are shown
  hideElement('experimentwrap');
  hideElement('basicsurveywrap');
  hideElement('gradualsurveywrap');
  hideElement('notificationwrap');

  // Do the experiment in order of the stages.
  stageIndex = -1;
  goToNextStage();

  // todo put in correct place:
  // get the first correct item
  let correctItem = getRandomItem(NUM_BLOCKS, NUM_ITEMS);
  // get predicted items based on this test's adaptiveAccuracy
  let predictedItems =
      getPredictedItems(NUM_PREDICTED_ITEMS, correctItem, adaptiveAccuracy);
}

function goToNextStage() {
  // increment the stage index
  stageIndex++;
  // get name of current stage
  currStage = STAGES[stageIndex];

  // Do different things, depending on the stage:
  let msg = '';
  switch (currStage) {
    case 'notifypractice':
      // show a notification screen telling the user that this is a practice run
      let msg =
          'In the following stage, you will practice using the system. When you are ready, click "Next".';
      notify(msg);
      break;
    case 'practice1':
      if (IS_CONTROL_FIRST) {
        performPractice('control');
      } else {
        performPractice('fading');
      }
      break;
    case 'block1_half1':
      if (IS_CONTROL_FIRST) {
        // perform 1st half of control
        performHalfBlock('control');
      } else {
        // perform 1st half of fading
        performHalfBlock('fading');
      }
      break;
    case 'shortBreak1':
      msg =
          'Feel free to take a short break. When you are ready to continue, click "Next".';
      notify(msg);
      break;
    case 'block1_half2':
      if (IS_CONTROL_FIRST) {
        // perform 2nd half of control
        performHalfBlock('control');
      } else {
        // perform 2nd half of fading
        performHalfBlock('fading');
      }
      break;
    case 'block1_survey':
      if (IS_CONTROL_FIRST) {
        // TODO: add gotonextstage in the submit buttons for the
        // conditionsurveys show control survey
        showElement('basicsurveywrap', 'grid');
      } else {
        // show gradual survey
        showElement('gradualsurveywrap', 'grid');
      }
      break;
    case 'block2_half1':
      if (IS_CONTROL_FIRST) {
        // perform 1st half of fading
        performHalfBlock('fading');
      } else {
        // perform 1st half of control
        performHalfBlock('control');
      }
      break;
    case 'shortBreak2':
      msg =
          'Feel free to take a short break. When you are ready to continue, click "Next".';
      notify(msg);
      break;
    case 'block2_half2':
      if (IS_CONTROL_FIRST) {
        // perform 2nd half of fading
        performHalfBlock('fading');
      } else {
        // perform 2nd half of control
        performHalfBlock('control');
      }
      break;
    case 'block2_survey':
      if (IS_CONTROL_FIRST) {
        // show fading survey
        showElement('gradualsurveywrap','grid');
      } else {
        // show control survey
        showElement('basicsurveywrap','grid');
      }
      break;
    case 'end':
      msg =
          'This completes the menu-clicking portion of the experiment. We have one last question for you, and then the experiment will be done.';
      notify(msg);
      break;
    default:
      console.error(
          'The stage, ' + currStage +
          ', is unknown. No code has been written for this stage.');
      break;
  }
}

/**
 * Performs the practice run.
 * @param {String} controlOrFading: 'control' or 'fading' practice.
 */
function performPractice(controlOrFading) {
  // todo

  // show experimentwrap
  showElement('experimentwrap', 'grid');
  // for __numPracticeTests

  // hide experimentwrap
  hideElement('experimentwrap');

  // todo at end, call gotonextstage
}

/**
 * Performs a half-block of control or fading menu tests.
 * @param {String} controlOrFading: 'control' or 'fading' practice.
 */
function performHalfBlock(controlOrFading) {
  // todo
  // show experimentwrap
  showElement('experimentwrap', 'grid');
  // for __numTests

  // hide experimentwrap
  hideElement('experimentwrap');
  // todo at end, call gotonextstage
}

// ---------------------- //
// --- Helper Methods --- //
// ---------------------- //

/**
 * Update the items in the menus (e.g., when the user successfully clicks on the
 * item required, update the menus to contain different items)
 * @param {Integer} numBlocks: number of blocks within a menu
 * @param {Integer} numItems: number of items within a block
 */
function updateMenus(numBlocks, numItems) {
  // Find menu divs in the html
  let menutitles = document.getElementsByClassName('menutitle');
  // loop through the menus and menu blocks and put different items inside
  for (let i = 0; i < menutitles.length; i++) {
    // get a random array of non-repeating integers (we'll only use the first 12
    // of these)
    let blocksIndices = getShuffledArray(getListOfThings().length);
    let currMenuTitle = menutitles.item(i);

    // loop through the blocks in the menu
    for (let numBlock = 0; numBlock < numBlocks; numBlock++) {
      // get the random items we will put in this block
      let itemBlock = getListOfThings()[blocksIndices[numBlock]];

      // get a random array of non-repeating integers to randomly order the
      // items in the blocks
      let itemIndices = getShuffledArray(numItems);

      // loop through the items in the block
      for (let numItem = 0; numItem < numItems; numItem++) {
        // get the item we're putting in the menu
        let item = itemBlock[itemIndices[numItem]];

        // add the item to the menu
        let htmlItem = currMenuTitle.getElementsByClassName('menudropdown')[0]
                           .getElementsByClassName('menublock')[numBlock]
                           .getElementsByClassName('menuitem')[numItem];
        htmlItem.innerText = item;
      }
    }
  }
}

/**
 * Returns a random item from in the menus.
 * @param {Integer} numBlocks
 * @param {Integer} numItems
 */
function getRandomItem(numBlocks, numItems) {
  // get all the menus
  let menutitles = document.getElementsByClassName('menutitle');
  // get random menu index:
  let menuIndex = Math.floor(Math.random() * (menutitles.length));
  // random block index:
  let blockIndex = Math.floor(Math.random() * (numBlocks));
  // random item index:
  let itemIndex = Math.floor(Math.random() * (numBlocks));

  let menuTitle = menutitles.item(menuIndex);
  let item = menuTitle.getElementsByClassName('menudropdown')[0]
                 .getElementsByClassName('menublock')[blockIndex]
                 .getElementsByClassName('menuitem')[itemIndex];
  return item;
}

/**
 * Returns a set of numItems predicted items. Depending on the adaptive accuracy
 * (high or low) the predicted items may or may not include the correct item.
 * High accuracy means there is a 79% chance the correct item will be included.
 * Low accuracy means there is a 50% chance the correct item will be included.
 * @param {HTML element} correctItem
 * @param {String} adaptiveAccuracy: either 'high' or 'low'
 */
function getPredictedItems(numItems, correctItem, adaptiveAccuracy) {
  let predictedItems = new Array();
  let threshold;

  // Get threshold value for adaptive accuracy
  if (adaptiveAccuracy == 'high') {
    threshold = 0.79;
  } else if (adaptiveAccuracy == 'low') {
    threshold = 0.50;
  } else {
    // incorrect value for adaptiveAccuracy
    console.error(
        'The value for adaptive accuracy, ' + adaptiveAccuracy +
        ', sent to getPredictedItems is not a valid value. Adaptive accuracy should either be "high" or "low".');
  }

  // Determine whether the correctItem should be included in the prediction:
  let num = Math.random();
  if (num < threshold) {
    // the correct item should be included in the list
    predictedItems.push(correctItem);
  }

  // continue to get random items from the menu, making sure they're not already
  // added to the list of items
  let correctMenu = correctItem.parentElement.parentElement;
  while (predictedItems.length < numItems) {
    // get random item from the menu
    let randBlockIndex = Math.floor(
        Math.random() *
        (correctMenu.getElementsByClassName('menublock').length));
    let randBlock =
        correctMenu.getElementsByClassName('menublock').item(randBlockIndex);
    let randItemIndex = Math.floor(
        Math.random() * (randBlock.getElementsByClassName('menuitem').length));
    let randItem =
        randBlock.getElementsByClassName('menuitem').item(randItemIndex);

    // check to make sure the item is not in the list already
    let isInList = false;
    for (let i = 0; i < predictedItems.length; i++) {
      let predItem = predictedItems[i];
      if (randItem == predItem) {
        isInList = true;
        break;
      }
    }

    // also make sure the random item isn't the correct item (we never want to
    // add the correct item at this point in the code)
    let isCorrectItem = false;
    if (randItem == correctItem) {
      isCorrectItem = true;
    }

    // if this item is not in the list already and isn't the 'correct item', add
    // it to the list
    if (!isInList && !isCorrectItem) {
      predictedItems.push(randItem);
    }
  }

  return predictedItems;
}

/**
 * Returns a randomly-shuffled array of numbers from 0 to length-1.
 * @param {Integer} length
 */
function getShuffledArray(length) {
  // create an array of length 'length' with increasing numbers
  let array = Array.from(Array(length).keys());

  // loop through and shuffle the numbers using a Fisher–Yates Shuffle
  // (https://stackoverflow.com/questions/18806210/generating-non-repeating-random-numbers-in-js)
  let i = length, j = 0, temp;
  while (i--) {
    j = Math.floor(Math.random() * (i + 1));

    // swap randomly chosen element with current element
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

/**
 * Hides the given element such that another page (e.g., a survey or a short
 * break page) can be shown.
 */
function hideElement(id) {
  document.getElementById(id).setAttribute('style', 'display: none;');
}

/**
 * Shows the given element with the given display type (e.g., 'grid').
 */
function showElement(id, displayType) {
  document.getElementById(id).setAttribute(
      'style', 'display: ' + displayType + ';');
  setSubmitBtn('ans');
}