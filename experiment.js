// TODO: MAKE THE MENUS BE CREATED USING JS, NOT HTML COPY-PASTED

// For simpler testing, always use the same seed:
Math.seedrandom(0);

// --- Variables to be logged --- //
// userID for this particular experiment (assoc w survey too):
let userID = new URL(location).searchParams.get('userID');
// increment currentTestNum before every test:
let currentTestNum = 0;
// if the click starts a test, then put 'start', if it ends, put 'end':
let startOrEndEvent = 'start';
// if this click was on an incorrect menu item, make this true:
let wrongItemClick = true;
// increment this on every click:
let clickNumber = 0;


// --- Event Listeners --- //
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