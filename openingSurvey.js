// Get the user id as specified by the url parameter:
let userID = new URL(location).searchParams.get('userID');
// Make the url for the next page with the given userID:
let url = 'gradualOnsetExperiment.html?userID=' + userID;

/* ******************************************************* */
/* ****** Functions Specific to the Opening Survey ******* */
/* ******************************************************* */

/**
 * Submits the relevant variables from the form to the Google form and goes to
 * the next page.
 */
function submitAndGo() {
  let age, sex, computerUsage, email;
  // get user input
  age = document.getElementById('age').value;
  sex = document.getElementById('sex').value;
  computerUsage = document.getElementById('compUsage').value;
  email = document.getElementById('email').value;
  if (userID == null || age == null || sex == null || computerUsage == null || email == null) {
    console.error(
        'There is an unanswered question. Please report this error to the experimenter.');
    console.error('Collected answers:', userID, age, sex, computerUsage, email);
  } else {
    // send input
    sendOpeningSurvey(userID, age, sex, computerUsage, email);

    // go to next page (experiment page)
    window.location.href = url;
  }
}


// Opening Survey submission function
// submits to the google form at this URL:
// docs.google.com/forms/d/1f9qtQD0-huSpA0mMTRioZ8TgjR_oq1qBgnGWXmXO8ds/edit
function sendOpeningSurvey(userid, age, sex, computerusage, email) {
  var formid = 'e/1FAIpQLSerVcxiOQjjudTDcQZ1JPn7Q-18ZiHV3GMjL7UQCIKYIPam3w';
  var data = {
    'entry.984098112': userid,
    'entry.92610198': age,
    'entry.152620830': sex,
    'entry.576772796': computerusage,
    'entry.1311721311': email
  };
  var params = [];
  for (key in data) {
    params.push(key + '=' + encodeURIComponent(data[key]));
  }
  // Submit the form using an image to avoid CORS warnings.
  (new Image).src = 'https://docs.google.com/forms/d/' + formid +
      '/formResponse?' + params.join('&');
}
