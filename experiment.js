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
});
