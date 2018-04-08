// Get the user id as specified by the url parameter:
let userID = new URL(location).searchParams.get('userID');
// Make the url for the next page with the given userID:
let url = 'closingPage.html?userID=' + userID;

/* ******************************************************* */
/* ****** Functions Specific to the Opening Survey ******* */
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
  graduallikert1 = getSelectedRadio('likertQ1');
  graduallikert2 = getSelectedRadio('likertQ2');
  graduallikert3 = getSelectedRadio('likertQ3');
  graduallikert4 = getSelectedRadio('likertQ4');
  basiclikert1 = getSelectedRadio('likertQ5');
  basiclikert2 = getSelectedRadio('likertQ6');
  basiclikert3 = getSelectedRadio('likertQ7');
  basiclikert4 = getSelectedRadio('likertQ8');
  // check for any nulls:
  if (userID == null || menupref == null || graduallikert1 == null ||
      graduallikert2 == null || graduallikert3 == null ||
      graduallikert4 == null || basiclikert1 == null || basiclikert2 == null ||
      basiclikert3 == null || basiclikert4 == null) {
    console.error(
        'There is an unanswered question. Please report this error to the experimenter.');
    console.error(
        'Collected answers:', userID, menupref, graduallikert1, graduallikert2,
        graduallikert3, graduallikert4, basiclikert1, basiclikert2,
        basiclikert3, basiclikert4);
  } else {
    // send input
    sendClosingSurvey(
        userID, menupref, graduallikert1, graduallikert2, graduallikert3,
        graduallikert4, basiclikert1, basiclikert2, basiclikert3, basiclikert4);

    // go to next page (experiment page)
    window.location.href = url;
  }
}


// Closing Survey submission function
// submits to the google form at this URL:
// docs.google.com/forms/d/1txsQ_gjhjbR-17g2SogKAPAF5LFei3HnBhX_lcoHoPI/edit
function sendClosingSurvey(
  userid,
  menupref,
  graduallikert1,
  graduallikert2,
  graduallikert3,
  graduallikert4,
  basiclikert1,
  basiclikert2,
  basiclikert3,
  basiclikert4) {
var formid = "e/1FAIpQLSeXYMvsTku5Aa1UGRLSTYvkOD7Hkk3iAADuLmwjltNpx3Grhg";
var data = {
  "entry.1764503663": userid,
  "entry.1071152755": menupref,
  "entry.1180349519": graduallikert1,
  "entry.1292228520": graduallikert2,
  "entry.2131411416": graduallikert3,
  "entry.1836131283": graduallikert4,
  "entry.1492751820": basiclikert1,
  "entry.248355498": basiclikert2,
  "entry.1345795253": basiclikert3,
  "entry.371927758": basiclikert4
};
var params = [];
for (key in data) {
  params.push(key + "=" + encodeURIComponent(data[key]));
}
// Submit the form using an image to avoid CORS warnings.
(new Image).src = "https://docs.google.com/forms/d/" + formid +
   "/formResponse?" + params.join("&");
}
