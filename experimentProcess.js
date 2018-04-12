// TODO: TEST THE RESULTS FROM THE CLICKING IN THE GOOGLE FORMS

// TODO: CREATE PAGE WHERE YOU CAN CHANGE THE NUM_TESTS_PER_BLOCK AND
// NUM_PRACTICE_TESTS

// This javascript file contains methods that run the experiment. The method,
// "performExperiment" is called from experimentSetup to start the actual
// experiment process.

// stages in the experiment
const STAGES = [
  'notifypractice', 'practice1', 'notifyblock', 'block1_half1', 'shortBreak1',
  'block1_half2', 'block1_survey', 'notifypractice', 'practice2', 'notifyblock',
  'block2_half1', 'shortBreak2', 'block2_half2', 'block2_survey', 'end',
  'goToClosingSurvey'
];
// TODO: RETURN TO ORIG!
// const NUM_PRACTICE_TESTS = 8;
// const NUM_TESTS_PER_BLOCK = 126;
const NUM_PRACTICE_TESTS = 3;   // todo test
const NUM_TESTS_PER_BLOCK = 8;  // todo test half block

// whether control or fading menus is first
let IS_CONTROL_FIRST;

// current stage of the experiment
let currStage;
// current index of the experiment stage
let stageIndex = -1;
// current trial within the stage
let currTest = 0;
// current number of tests we're looking to complete before the next stage
let currTotalTests = 9999;

// the current correct item
let currCorrectItem;
// Note: when user clicks correct item^^ AND we're currently in a practice or
// block stage, then check if currTest < currTotalTests, and
// either perform another single test or go to the next stage (NOTE: tests are
// 0-indexed)

// the current test type (either 'control' or 'fading')
let currTestType;
// When menu opens, the fading process is started if currTestType == 'fading'

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
}

/**
 * This method moves the experiment to the next stage. It is repeated until the
 * current stage is 'goToClosingSurvey', and then the user is taken to the
 * closing survey.
 */
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
      msg =
          'In the following stage, you will practice using the system. When you are ready to continue, click "Next".';
      notify(msg);
      break;
    case 'practice1':
      // reset the random seed to have the same default sequence for practice
      Math.seedrandom(0);
      // go to the practice sequence
      if (IS_CONTROL_FIRST) {
        performPractice('control');
      } else {
        performPractice('fading');
      }
      break;
    case 'notifyblock':
      // show a notification screen telling the user that this is the real
      // experiment
      msg =
          'In the following stage, you will use the system similarly to how you just used it in the practice stage. When you are ready to continue, click "Next".';
      notify(msg);
      break;
    case 'block1_half1':
      // reset the random seed based on the user id such that the random
      // sequence is the same between control / fading blocks (but different per
      // user)
      Math.seedrandom(userID);
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
      // Show the survey. Once the user submits, it hides the survey and goes to
      // the next stage.
      if (IS_CONTROL_FIRST) {
        showElement('basicsurveywrap', 'grid');
      } else {
        // show gradual survey
        showElement('gradualsurveywrap', 'grid');
      }
      break;
    case 'practice2':
      // reset the random seed to have the same default sequence for practice
      Math.seedrandom(0);
      if (IS_CONTROL_FIRST) {
        performPractice('fading');
      } else {
        performPractice('control');
      }
      break;
    case 'block2_half1':
      // reset the random seed based on the user id such that the random
      // sequence is the same between control / fading blocks (but different per
      // user)
      Math.seedrandom(userID);
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
        showElement('gradualsurveywrap', 'grid');
      } else {
        // show control survey
        showElement('basicsurveywrap', 'grid');
      }
      break;
    case 'end':
      msg =
          'This completes the menu-clicking portion of the experiment. We have one last question for you, and then the experiment will be done.';
      notify(msg);
      break;
    case 'goToClosingSurvey':
      // go to next page (closing survey)
      window.location.href = 'closingSurvey.html';
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
  // set current test type as either control or fading
  currTestType = controlOrFading;
  // update the number of tests we're performing before the next stage
  currTotalTests = NUM_PRACTICE_TESTS;
  // reset the current test value to zero
  currTest = 0;
  // ensure the menus are hidden at start
  hideAllMenus();
  // show experimentwrap
  showElement('experimentwrap', 'grid');
  // The performSingleTest method continues to perform a single test until
  // the number of tests reaches the currTotalTest value and then calls
  // goToNextStage()
  performSingleTest();
}

/**
 * Performs a half-block of control or fading menu tests.
 * @param {String} controlOrFading: 'control' or 'fading' practice.
 */
function performHalfBlock(controlOrFading) {
  // set current test type as either control or fading
  currTestType = controlOrFading;
  // update the number of tests we're performing before the next stage
  currTotalTests = NUM_TESTS_PER_BLOCK / 2;
  // reset the current test value to zero
  currTest = 0;
  // ensure the menus are hidden at start
  hideAllMenus();
  // show experimentwrap
  showElement('experimentwrap', 'grid');
  // The performSingleTest method continues to perform a single test until
  // the number of tests reaches the currTotalTest value and then calls
  // goToNextStage()
  performSingleTest();
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
  // get the associated menu:
  let menuTitle = menutitles.item(menuIndex);
  return getRandomItemFromMenu(menuTitle, numBlocks);
}

/**
 * Returns a random item from the given menu.
 */
function getRandomItemFromMenu(menuTitle, numBlocks) {
  // random block index:
  let blockIndex = Math.floor(Math.random() * (numBlocks));
  // random item index:
  let itemIndex = Math.floor(Math.random() * (numBlocks));

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

/**
 * Performs a single experiment test by setting various parameters.
 */
function performSingleTest() {
  // get a random menu item and set the prompt
  currCorrectItem = getRandomItem(NUM_BLOCKS, NUM_ITEMS);
  setPrompt(currCorrectItem);
}

/**
 * Sets the prompt with the given item.
 */
function setPrompt(menuItem) {
  let itemName = menuItem.innerText;
  let menuName = 'Menu ' +
      (menuItem.parentElement.parentElement.parentElement.id).match(/\d+/)[0];
  let prompt = document.getElementById('promptarea');

  prompt.innerText = menuName + ' > ' + itemName;
}

/**
 * Animates the UN-predicted items fading in (based on the given, predicted
 * items), and once done, removes the animation class from them. Note that this
 * randomly fades items in other menus too, not just the predicted menu.
 * @param {HTML elements} predictedItems
 */
function fadeItems(predictedItems) {
  let itemsToFade = getItemsToFade(predictedItems);

  for (let i = 0; i < itemsToFade.length; i++) {
    itemsToFade[i].setAttribute('class', 'menuitem animFade');
  }
  // use afterFade() to remove animFade after the promise is resolved
  afterFade(itemsToFade).then(function() {
    removeFade(itemsToFade);
  });
}

/**
 * Removes the fade animation class from the given array of menuitems.
 */
function removeFade(menuItems) {
  for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].setAttribute('class', 'menuitem');
  }
}

/**
 * Returns unpredicted items based on the predicted items given. This function
 * returns all the menuitems (in all menus) minus the actually predicted items,
 * and a couple of 'fake predicted items' in the other menus.
 */
function getItemsToFade(predictedItems) {
  // add some 'fake' predicted items to the predicted items array that are from
  // the other menus

  // get the menus that weren't predicted
  let unpredictedMenus = new Array();
  let allMenus = document.getElementsByClassName('menutitle')
  for (let i = 0; i < allMenus.length; i++) {
    let menu = allMenus.item(i);
    if (menu.id !=
        predictedItems[0].parentElement.parentElement.parentElement.id) {
      unpredictedMenus.push(menu);
    }
  }

  // add some fake predictions to the predicteditems list from the other menus
  // for each menu...
  for (let i = 0; i < unpredictedMenus.length; i++) {
    let menu = unpredictedMenus[i];
    let fakeCorrectItem = getRandomItemFromMenu(menu, NUM_BLOCKS);
    // now "predict" based on this fake correct item
    let fakePredictions =
        getPredictedItems(NUM_PREDICTED_ITEMS, fakeCorrectItem, 'low');

    // add each of the fake predictions to the predictedItems list
    for (let j = 0; j < fakePredictions.length; j++) {
      predictedItems.push(fakePredictions[j]);
    }
  }

  // find the unpredicted items based on the predicted items
  let unpredicted = new Array();
  // get all the menu items in the document as an array of items
  let menuItems =
      Array.prototype.slice.call(document.getElementsByClassName('menuitem'));

  // loop through all the menu items
  for (let i = 0; i < menuItems.length; i++) {
    let isItemPredicted = false;
    let currItem = menuItems[i];
    // check against all the predicted items
    for (let j = 0; j < predictedItems.length; j++) {
      if (currItem == predictedItems[j]) {
        isItemPredicted = true;
        break;
      }
    }
    // if the item isn't predicted, then add to the unpredicted list
    if (!isItemPredicted) {
      unpredicted.push(currItem);
    }
  }
  return unpredicted;
}

/**
 * TODO DEL
 * Returns the UNpredicted items based on the predicted items. This function
 * returns ONLY the menuitems that are in the same menu as the predicted items.
 */
// function getUnpredictedItems(predictedItems) {
//   // find the unpredicted items based on the predicted items
//   let unpredicted = new Array();
//   let itemsInMenu =
//       predictedItems[0].parentElement.parentElement.getElementsByClassName(
//           'menuitem');
//   // loop through all the menu items
//   for (let i = 0; i < itemsInMenu.length; i++) {
//     let isItemPredicted = false;
//     let currItem = itemsInMenu[i];
//     // check against all the predicted items
//     for (let j = 0; j < predictedItems.length; j++) {
//       if (currItem == predictedItems[j]) {
//         isItemPredicted = true;
//         break;
//       }
//     }
//     // if the item isn't predicted, then add to the unpredicted list
//     if (!isItemPredicted) {
//       unpredicted.push(currItem);
//     }
//   }
//   return unpredicted;
// }

/**
 * Get fake predicted items for the other menus
 */

/**
 * Returns a promise that is resolved after the unpredicted items have completed
 * fading in.
 * @param unpredictedItems
 */
function afterFade(unpredictedItems) {
  let arr = new Array();
  for (let i = 0; i < unpredictedItems.length; i++) {
    arr.push(afterAnimation(unpredictedItems[i], 'keyFade'))
  }
  return Promise.all(arr);
}

/**
 * NOTE: This method comes from MIT's 6.831 Candy Crush Assignment.
 *
 * Return a promise that is resolved after all animations of a given name
 * have stopped on one or more elements.
 * Caveat: The animations need to be *already* applied when this is called.
 * @param target {Element|Array<Element>}
 * @param animationName {String}
 */
function afterAnimation(target, animationName) {
  target = Array.isArray(target) ? target : [target];
  var animating = target.filter(
      candy => getComputedStyle(candy).animationName.includes(animationName));

  return Promise.all(animating.map(
      el => Util.when(
          el, 'animationend', evt => evt.animationName == animationName)));
}