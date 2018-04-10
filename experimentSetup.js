// This javascript file contains methods to set up the experiment, and calls
// functions in experimentProcess to begin the experiment

// For simpler testing, always use the same seed:
Math.seedrandom(0);

// ------------------------------ //
// --- Variables to be logged --- //
// ------------------------------ //
// userID for this particular experiment (assoc w survey too):
// todo: get from localstorage instead
let userID = new URL(location).searchParams.get('userID');
// increment currentTestNum before every test:
let currentTestNum = 0;
// if the click starts a test, then put 'start', if it ends, put 'end':
let startOrEndEvent = 'start';
// if this click was on an incorrect menu item, make this true:
let wrongItemClick = true;
// increment this on every click:
let clickNumber = 0;

// number of blocks within a menu:
const NUM_BLOCKS = 4;
// number of items within a block:
const NUM_ITEMS = 4;
// number of predicted items:
const NUM_PREDICTED_ITEMS = 3;

// ------------------ //
// --- On Startup --- //
// ------------------ //
document.addEventListener('DOMContentLoaded', function(event) {
  // Create menus with NUMBLOCKS subsections each and NUMITEMS items within each
  // subsection
  createMenus(NUM_BLOCKS, NUM_ITEMS);
  updateMenus(NUM_BLOCKS, NUM_ITEMS);

  // The accuracy is randomly chosen on a per-subject basis to be either high or
  // low
  const adaptiveAccuracy = getAccuracy();

  // Whether the control or the fading menu tests are first depends on whether
  // the user id is odd or even (every second user sees the fading menu tests
  // first). I.e., control vs long-onset: within-subjects, fully counterbalanced
  // TODO: is this correct?? or should it just be random?
  let isControlFirst = true;
  if (userID % 2 == 0) {
    isControlFirst = false;
  }

  // Start the experiment
  performExperiment(adaptiveAccuracy, isControlFirst);
});

// ----------------------- //
// --- Event Listeners --- //
// ----------------------- //
document.addEventListener('mousedown', function(evt) {
  // send information to the Google Form
  document.dispatchEvent(new CustomEvent('log', {
    detail: {
      userID: userID,
      event: evt,
      customName: null,  // if customName is set, it overwrites the name
      clickNumber: clickNumber++,
      currentTestNum: currentTestNum,
      startOrEndEvent: startOrEndEvent,
      wrongItemClick: wrongItemClick
    }
  }));

  let targ = evt.target;
  // if this was a menutitle, open the menu
  if (targ != null && targ.getAttribute('class') != null &&
      targ.getAttribute('class').includes('menutitle')) {
    let menudropdown = targ.getElementsByClassName('menudropdown')[0];

    // stop showing the other menus
    let menus = document.getElementsByClassName('menutitle');
    for (let i = 0; i < menus.length; i++) {
      let menu = menus.item(i).getElementsByClassName('menudropdown')[0];
      // check if not the same id as the one we clicked on:
      if (menu.parentElement.id != menudropdown.parentElement.id) {
        // hide menu
        menu.setAttribute('class', 'menudropdown');
        // revert the menutitle's colour to normal
        menu.parentElement.setAttribute('class', 'menutitle');
      } else {
        // this is the menu we clicked on
        // Toggle this menu between shown and not shown:
        toggleShowMenu(menudropdown);
      }
    }
  } else {
    // the user clicked on something that wasn't a menu, so hide all menus
    hideAllMenus();
  }
  // if this was a menuitem, check if it was the correct item
});


// ---------------------- //
// --- Helper Methods --- //
// ---------------------- //

/**
 * Create menus wherever 'menutitle's are placed in the HTML document. Each menu
 * will have numBlocks number of blocks of related items. Each block will
 * contain numItems number of items.
 * @param {Integer} numBlocks
 * @param {Integer} numItems
 */
function createMenus(numBlocks, numItems) {
  // Find menu divs in the html
  let menutitles = document.getElementsByClassName('menutitle');
  // Create menudropdowns for each menutitle
  for (let i = 0; i < menutitles.length; i++) {
    let innerHTMLString = 'Menu' + (i + 1) + '<div class="menudropdown">';
    for (let numBlock = 0; numBlock < numBlocks; numBlock++) {
      // create block
      innerHTMLString += '<div class="menublock">';
      for (let numItem = 0; numItem < numItems; numItem++) {
        // the item in the menu TODO:
        let item = 'item';
        // create menuitem
        innerHTMLString += '<div class="menuitem">' + item + '</div>'
      }
      // end div for menublock
      innerHTMLString += '</div>';
    }
    // end div for menudropdown
    innerHTMLString += '</div>';

    // place the innerHTMLString in the menutitle div:
    menutitles.item(i).innerHTML = innerHTMLString;
  }
}

/**
 * Toggle whether the menu provided is shown or not.
 * @param {HTML element} menudropdown
 */
function toggleShowMenu(menudropdown) {
  // menudropdown.classList.toggle('showmenu');
  let menutitle = menudropdown.parentElement;
  // If the menu is shown, hide it and remove the menutitle another colour
  if (menudropdown.getAttribute('class').includes('showmenu')) {
    menudropdown.setAttribute('class', 'menudropdown');
    menutitle.setAttribute('class', 'menutitle');
  } else {
    // The menu is hidden, so show it, and make menutitle another colour
    menudropdown.setAttribute('class', 'menudropdown showmenu');
    menutitle.setAttribute('class', 'menutitle menuselected');
  }
}

function hideAllMenus() {
  let menus = document.getElementsByClassName('menutitle');
  // remove 'showmenu' class
  for (let i = 0; i < menus.length; i++) {
    let menutitle = menus.item(i);
    let menudropdown = menutitle.getElementsByClassName('menudropdown')[0];
    // set the menudropdown to not visible
    menudropdown.setAttribute('class', 'menudropdown');
    // remove the additional colour on the menutitle
    menutitle.setAttribute('class', 'menutitle');
  }
}

/**
 * Randomly return an accuracy value of 'high' or 'low'. There is a 50%
 * chance of getting 'high'.
 */
function getAccuracy() {
  let acc = 'high';
  if (Math.random() < 0.5) {
    acc = 'low';
  }
  return acc;
}
