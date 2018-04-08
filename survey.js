

// once the DOM has finished loading, do stuff:
document.addEventListener('DOMContentLoaded', function(event) {
  // if there are Likert scale questions, generate the scale using javascript
  let likertScaleNum = 7;  // the number of divisions on the likert scale
  let likerts = document.getElementsByClassName('likert');
  if (likerts.length > 0) {
    for (let i = 0; i < likerts.length; i++) {
      let innerHTMLString = '';
      let likert = likerts.item(i);
      for (let j = 1; j <= likertScaleNum; j++) {
        innerHTMLString += '<label>';
        innerHTMLString += '<input type="radio" name="likertQ' + (i + 1) +
            '" value="' + j + '">' + j;
        innerHTMLString += '</label>';
      }
      likert.innerHTML = innerHTMLString;
    }
  }

  // focus on the first input element
  document.getElementsByClassName('ans').item(0).focus();

  // disable the submit button:
  setSubmitBtn('submit', 'ans');

  // make the submit button pass the userID onto the experiment page (when
  // enabled)
  let btn = document.getElementById('submit');
  btn.addEventListener('click', submitAndGo);

  // add event listener for keystroke etc. such that we can tell if the user has
  // entered information into the input boxes before submitting
  document.addEventListener('input', function() {
    // get all input boxes, check if they all have values
    // enable or disable the submit button:
    setSubmitBtn('submit', 'ans');
  });
  // This ensures the radio button changes also trigger setSubmitBtn
  document.addEventListener('change', function() {
    setSubmitBtn('submit', 'ans');
  });
});



/**
 * Enable or disable a submit button depending on whether the inputs have values
 * entered or not.
 *
 * @param {String} btnID: a string containing the id of the button you want to
 *                      enable/disable
 * @param {String} inputClassName: a string containing the class name of the inputs
 *                      you want to check to see if they have value entered
 */
function setSubmitBtn(btnID, inputClassName) {
  // Assume the form is completed, check each input element and set
  // formCompleted = false if one of the elements has no value
  let inputs = document.getElementsByClassName(inputClassName);
  let formCompleted = true;
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs.item(i);

    // check if there are sub-items with inputs (meaning that there are probably
    // radio buttons)
    let subElms = input.getElementsByTagName('input');
    if (subElms.length > 0 && subElms.item(0).type == 'radio') {
      // radio button input is more difficult to check b/c you have to loop
      // through all radio buttons with the same name and check if one of them
      // is selected. Thus, let's use the method 'getSelectedRadio' to do so:
      let radioGroupName = subElms.item(0).name;
      if (getSelectedRadio(radioGroupName) == null) {
        // there aren't any radio buttons selected in this group.
        // The form isn't complete.
        formCompleted = false;
        break;
      }

    } else {
      // check non-radio button input types
      if (!input.value || input.value == 'select') {
        formCompleted = false;
        break;
      }
    }
  }
  // enable/disable submit btn
  let btn = document.getElementById(btnID);
  if (formCompleted) {
    // enable the submit button:
    btn.disabled = false;
    btn.setAttribute('class', 'button');
  } else {
    // disable the submit button:
    btn.disabled = true;
    btn.setAttribute('class', 'button disabled');
  }
}

/**
 * Get the selected radio button value. Returns null if none selected.
 */
function getSelectedRadio(radioGroupName) {
  let radios = document.getElementsByName(radioGroupName);
  let selectedVal = null;
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      selectedVal = radios[i].value;
      // don't bother checking the rest, since only one can be selected
      break;
    }
  }
  return selectedVal;
}