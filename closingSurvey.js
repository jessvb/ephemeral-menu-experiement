// total "length" value for calculating progress
const totalLengthVal = localStorage.getItem('totalLengthVal');

/* ******************************************************* */
/* ****** Functions Specific to the Closing Survey ******* */
/* ******************************************************* */

/**
 * Submits the relevant variables from the form to the Google form and goes to
 * the next page.
 */
function submitAndGo() {
  // Get the user id for this computer and person:
  let userID = localStorage.getItem('userID');
  let uid = localStorage.getItem('uid');

  let menupref;
  // get user input
  menupref = getSelectedRadio('menuType');

  // check for any nulls:
  if (userID == null || uid == null || menupref == null) {
    console.error(
        'There is an unanswered question. Please report this error to the experimenter.');
    console.error('Collected answers:', userID, uid, menupref);
  } else {
    // send input
    sendClosingSurvey(userID, uid, menupref);

    // go to next page (experiment page)
    window.location.href = 'closingPage.html';
  }
}

// When the DOM is finished being created:
document.addEventListener('DOMContentLoaded', function(event) {
  // Set the progress bar.
  // subtract surveyVal since we haven't completed the final survey yet.
  let progress =
      (totalLengthVal - parseInt(localStorage.getItem('surveyVal'))) /
      totalLengthVal;
  document.getElementsByClassName('progressBar')[0].innerText =
      'Progress: ' + Math.floor(progress * 100) + '%';
});

// The following function was made with: curl -sL goo.gl/jUkahv | python2 -
// https://docs.google.com/forms/d/1Yw9xtBUoy5jDYmQlipbLXmy2JC3yW42ND8LyP7dz0H0/edit

// Closing Survey submission function
// submits to the google form at this URL:
// docs.google.com/forms/d/1txsQ_gjhjbR-17g2SogKAPAF5LFei3HnBhX_lcoHoPI/edit
function sendClosingSurvey(userid, uid, menupref) {
  var formid = 'e/1FAIpQLSeXYMvsTku5Aa1UGRLSTYvkOD7Hkk3iAADuLmwjltNpx3Grhg';
  var data = {
    'entry.1764503663': userid,
    'entry.1043748381': uid,
    'entry.1071152755': menupref
  };
  var params = [];
  for (key in data) {
    params.push(key + '=' + encodeURIComponent(data[key]));
  }
  // Submit the form using an image to avoid CORS warnings.
  (new Image).src = 'https://docs.google.com/forms/d/' + formid +
      '/formResponse?' + params.join('&');
}