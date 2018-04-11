// TODO: CHANGE TO JUST HAVE THE COMPARISON Q SENT!

// Get the user id as specified by the url parameter:
let userID = localStorage.getItem("userID");
// Make the url for the next page with the given userID:
let url = 'closingPage.html?userID=' + userID;

/* ******************************************************* */
/* ****** Functions Specific to the Closing Survey ******* */
/* ******************************************************* */

/**
 * Submits the relevant variables from the form to the Google form and goes to
 * the next page.
 */
function submitAndGo() {
  let menupref, graduallikert1, graduallikert2, graduallikert3, graduallikert4,
      basiclikert1, basiclikert2, basiclikert3, basiclikert4;
  // get user input
  menupref = getSelectedRadio('menuType');

  // check for any nulls:
  if (userID == null || menupref == null) {
    console.error(
        'There is an unanswered question. Please report this error to the experimenter.');
    console.error(
        'Collected answers:', userID, menupref);
  } else {
    // send input
    sendClosingSurvey(
        userID, menupref);

    // go to next page (experiment page)
    window.location.href = url;
  }
}

// The following function was made with: curl -sL goo.gl/jUkahv | python2 -
// https://docs.google.com/forms/d/1Yw9xtBUoy5jDYmQlipbLXmy2JC3yW42ND8LyP7dz0H0/edit

// Closing Survey submission function
// submits to the google form at this URL:
// docs.google.com/forms/d/1txsQ_gjhjbR-17g2SogKAPAF5LFei3HnBhX_lcoHoPI/edit
function sendClosingSurvey(
  userid,
  menupref) {
var formid = "e/1FAIpQLSeXYMvsTku5Aa1UGRLSTYvkOD7Hkk3iAADuLmwjltNpx3Grhg";
var data = {
  "entry.1764503663": userid,
  "entry.1071152755": menupref
};
var params = [];
for (key in data) {
  params.push(key + "=" + encodeURIComponent(data[key]));
}
// Submit the form using an image to avoid CORS warnings.
(new Image).src = "https://docs.google.com/forms/d/" + formid +
   "/formResponse?" + params.join("&");
}
