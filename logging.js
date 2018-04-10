// A simple Google-spreadsheet-based event logging framework.
// This is currently set up to log every mousedown event

var ENABLE_NETWORK_LOGGING = true;  // Controls network logging.
var ENABLE_CONSOLE_LOGGING = true;  // Controls console logging.

// These event types are intercepted for logging before jQuery handlers.
var EVENT_TYPES_TO_LOG = {mousedown: true};

(function() {
// A persistent unique id for the user.
var uid = getUniqueId();

// Initialize event listeners.
function initLoggingEvents() {
  // Once the page is loaded, show our own unique id.
  Util.events(document, {
    // Final initalization entry point: the Javascript code inside this block
    // runs at the end of start-up when the DOM is ready
    'DOMContentLoaded': function() {
      console.log('Your unique id is', uid);
      Util.one('#bottomtext').innerHTML =
          'Logging to the network as <nobr>' + uid + '</nobr>';
    },
    'log': function(evt) {
      var detail = evt.detail;
      logEvent(
          detail, detail.customName, detail.clickNumber, detail.currentTestNum,
          detail.startOrEndEvent, detail.wrongItemClick);
    }
  });
  // Listen to 'log' events which are triggered anywhere in the document.
}

// Parse user agent string by looking for recognized substring.
function findFirstString(str, choices) {
  for (var j = 0; j < choices.length; j++) {
    if (str.indexOf(choices[j]) >= 0) {
      return choices[j];
    }
  }
  return '?';
}

// Genrates or remembers a somewhat-unique ID with distilled user-agent info.
function getUniqueId() {
  if (!('uid' in localStorage)) {
    var browser = findFirstString(navigator.userAgent, [
      'Seamonkey', 'Firefox', 'Chromium', 'Chrome', 'Safari', 'OPR', 'Opera',
      'Edge', 'MSIE', 'Blink', 'Webkit', 'Gecko', 'Trident', 'Mozilla'
    ]);
    var os = findFirstString(navigator.userAgent, [
               'Android', 'iOS', 'Symbian', 'Blackberry', 'Windows Phone',
               'Windows', 'OS X', 'Linux', 'iOS', 'CrOS'
             ]).replace(/ /g, '_');
    var unique = ('' + Math.random()).substr(2);
    localStorage['uid'] = os + '-' + browser + '-' + unique;
  }
  return localStorage['uid'];
}

// Log the given event.
function logEvent(
    event, customName, clickNumber, currentTestNum, startOrEndEvent,
    wrongItemClick) {
  var time = (new Date).getTime();
  var name = customName || event.event.type;
  var targetID = event.event.target.id || event.event.target.className;

  if (ENABLE_CONSOLE_LOGGING) {
    console.log(event.event.target);
    console.log(
        uid, time, name, targetID, clickNumber, currentTestNum, startOrEndEvent,
        wrongItemClick);
  }
  if (ENABLE_NETWORK_LOGGING) {
    sendNetworkLog(
        userID, uid, time, name, targetID, clickNumber, currentTestNum,
        startOrEndEvent, wrongItemClick);
  }
}

// OK, go.
if (ENABLE_NETWORK_LOGGING) {
  initLoggingEvents();
}
})();

/////////////////////////////////////////////////////////////////////////////
// CHANGE ME:
// ** Replace the function below by substituting your own google form. **
/////////////////////////////////////////////////////////////////////////////
//
// 1. Create a Google form called "Network Log" at forms.google.com.
// 2. Set it up to have several "short answer" questions; here we assume
//    seven questions: uid, time, name, target, info, state, version.
// 3. Run googlesender.py (at goo.gl/jUkahv) to make a javascript
//    function that submits records directly to the form.
// 4. Put that function in here, and replace the current sendNetworkLog
//    so that your version is called to log events to your form.
//
// For example, the following code was written as follows:
// curl -sL goo.gl/jUkahv | python - https://docs.google.com/forms/d/1A...0/edit
// My code was written as follows:
// curl -sL goo.gl/jUkahv | python2 -
// https://docs.google.com/forms/d/1-ZRb7ZPCF3yIGvW5PqgEBVcuw3OSHMujjOfk3IkS-_U/edit
//
// Example google form:
// docs.google.com/forms/d/1VwF3VbXPSu7kseXA-Q5UElB_0Sf-HMWkIAcj1Wi3OY8/edit
//
// This preocess changes the ids below to direct your data into your own
// form and spreadsheet. The formid must be customized, and also the form
// field names such as "entry.1291686978" must be matched to your form.
// (The numerical field names for a Google form can be found by inspecting
// the form input fields.) This can be done manually, but since this is an
// error-prone process, it can be easier to use googlesender.py.
//
/////////////////////////////////////////////////////////////////////////////

// Things I want to log:
// clickNumber: the number (ith) click during the experiment

// currentTestNum: the number of the current test the user is on (e.g., test
// number 73 out of 255)

// startOrEndEvent: whether the click is a "starting"
// click for the test (i.e., logging the time at which the test starts) or an
// "ending click" (i.e., logging the time at which the test ends -- they found
// the correct menu item) or neither

// wrongItemClick: true/false depending on if the click was on a wrong menu item



// Network Log submission function
// submits to the google form at this URL:
// docs.google.com/forms/d/1-ZRb7ZPCF3yIGvW5PqgEBVcuw3OSHMujjOfk3IkS-_U/edit
function sendNetworkLog(
    userid, uid, time, name, targetid, clicknumber, currenttestnum,
    startorendevent, wrongitemclick) {
  var formid = 'e/1FAIpQLSf9mT5037w8mgBtlR3bX6SWqanROdM8bnwWuYktgSM6C1Wg_Q';
  var data = {
    'entry.1165309888': userid,
    'entry.984098112': uid,
    'entry.92610198': time,
    'entry.152620830': name,
    'entry.576772796': targetid,
    'entry.1832629466': clicknumber,
    'entry.704587025': currenttestnum,
    'entry.803438567': startorendevent,
    'entry.500568131': wrongitemclick
  };
  var params = [];
  for (key in data) {
    params.push(key + '=' + encodeURIComponent(data[key]));
  }
  // Submit the form using an image to avoid CORS warnings.
  (new Image).src = 'https://docs.google.com/forms/d/' + formid +
      '/formResponse?' + params.join('&');
}
