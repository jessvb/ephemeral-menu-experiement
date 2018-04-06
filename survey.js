let currentTestNum = 0;         // increment currentTestNum before every test
let startOrEndEvent = 'start';  // if the click starts a test, then put 'start',
                                // if it ends, put 'end'
let wrongItemClick =
    true;  // if this click was on an incorrect menu item, make this true
let clickNumber = 0;  // increment this on every click

let userID = new URL(location).searchParams.get('userID');

// once the DOM has finished loading, do stuff:
document.addEventListener('DOMContentLoaded', function(event) {
  // make the submit button pass the userID onto the experiment page
  let url = 'GradualOnsetExperiment.html?userID=' + userID;
  let btn = document.getElementById('submit');
  btn.setAttribute('href', url);

  // todo: only allow the submit button to be pressed if there is an entry in
  // the age box

  // TODO: submit survey results to a spreadsheet too!
  // document.getElementById('submit').addEventListener('click', function(evt) {
  //   document.dispatchEvent(new CustomEvent('log', {
  //     detail: {
  //       userID: userID

  //     }
  //   }));
  // });
});
