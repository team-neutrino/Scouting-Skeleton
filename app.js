/*
  -- The score list is basically a tally of everything the robot has done inside of the match.

  -- The score list should be able to be computed based on the action list, but for performance reasons
  nine times out of ten it'll be a better idea to *not* do that.

  -- Actions are how the app interacts with the score list -- basically, an action can do three things:

  -- For NUMERIC entries only: add (+) or subtract (-) a certain amount, in which case the Action data should be
  [scoreListID, operation, value]

  -- or for *any* entry, but most likely things like an endgame climb, there is also the "Set" operation,
  which 'sets' the new value of the entry to a certain value (doesn't have to be a number), in which case the
  data should look like:
  [scoreListID, "Set", newValue, oldValue]

  [scoreListID, "+", newValue]
*/

var scoreList = {
  "Example": 0
};
const SCORE_LIST_TEMPLATE = structuredClone(scoreList);

const ACTION_FORMATTING = {
  "Example": {
    "+": "Added {0} Example",
    "-": "Subtracted {0} Example",
  }
}

const SCORE_WEIGHT = { // how much score is assigned to each entry in scoreList
  "Example": 1,
}

const TERMINAL_ELEMENT_NAME = "teamLog1"
const SCORE_ELEMENT_NAME = "teamLog2"

var actionList = [];

var extraData = []; //['teamNum', 'matchNum', 'scout', 'comment', 'alliance pick']

// javascript doesn't have a string.format and I realized that a little too late

function formatString(template, ...args) {
  return template.replace(/{(\d+)}/g, (match, number) => {
    return typeof args[number] !== 'undefined' ? args[number] : match;
  });
}

// Completes a numeric action (add or subtract from an entry in the score list)
function numericAction(scoreListID, operation, value) {
  let actionData = [scoreListID, operation, value];

  actionList.push(actionData);
  processAction(actionData);
  addActionToTerminal(actionData);
}

// Completes a numeric action (add or subtract from an entry in the score list)
function set(scoreListID, value) {
  let actionData = [scoreListID, "Set", value, scoreList[scoreListID]];

  actionList.push(actionData);
  processAction(actionData);
  addActionToTerminal(actionData);
}

// Recalculates the entire score list in case something went wrong or we undoed an action from a long time ago.
function recalculateScoreList() {
  scoreList = structuredClone(SCORE_LIST_TEMPLATE);

  for (let i = 0; i++; i < actionList.length) {
    processAction(actionList[i]);
  }

  updateScoreElement();
}

function calculateScore() {
  let localScore = 0;

  for (const [key, value] of Object.entries(scoreList)) {
    if (key in SCORE_WEIGHT) {
      localScore += value * SCORE_WEIGHT[key];
    }
  }

  return localScore;
}

function updateScoreElement() {
  document.getElementById("teamLog2").value = calculateScore();
}

function processAction(actionData) {
  let scoreListID = actionData[0];
  let operation = actionData[1];
  let newVal = actionData[2];

  if (operation != "Set") {
    if (operation === "+") {
      scoreList[scoreListID] += newVal;
    } else if (operation === "-") {
      scoreList[scoreListID] += newVal;
    } else {
      console.log("Invalid action: ", scoreListID, operation, newVal);
    }
  } else {
    scoreList[scoreListID] = newVal;
  }

  updateScoreElement();
}

// Undo the last action. Also allows you to undo actions from a long time ago and recalculate score list with that in mind
// todo make this smarter (make everything not just Set actions use oldValue (actiondata[3]) or just get rid of it)

function undoAction(position) {
  let actionData;

  if (position) {
    actionData = actionList[position]
  } else {
    actionData = actionList[actionList.length - 1]
  }

  if (position != null) {
    actionList.splice(position, 1);
  } else {
    actionList.pop()
  }

  let operation = actionData[1];

  if (operation != "Set") {
    actionData[2] *= -1;
    processAction(actionData);
  } else {
    if (position === actionList.length - 1 || position === null) { // if removing from the end of the action list
      let oldData = actionData[3];
      let scoreListID = actionData[0];

      scoreList[scoreListID] = oldData;
    } else {
      recalculateScoreList();
    }
  }

  reprocessTerminal();
}

// If an action has no formatting, just give it a default line
function concatenateActionDefaultLine(action, terminalText) {
  if (action[1] == "+") {
    terminalText = "Added " + action[2] + " to " + action[0] + "\n" + terminalText
  } else {
    terminalText = "Subtracted " + action[2] + " from " + action[0] + "\n" + terminalText
  }

  return terminalText
}

/* 
Take an action and add it to the terminal, assuming the rest of the terminal is still good.
The latter two parameters are mainly for reprocessTerminal() below.
*/
function addActionToTerminal(action, doNotUpdateUIElement, terminalText) {
  if (!terminalText) {
    terminalText = document.getElementById(TERMINAL_ELEMENT_NAME).value;
  }

  let modifiedEntry = action[0];
  let operation = action[1];
  let newValue = action[2];

  if (operation != "Set") {
    if (modifiedEntry in ACTION_FORMATTING) {
      if (operation in ACTION_FORMATTING[modifiedEntry]) {
        let text = ACTION_FORMATTING[modifiedEntry][operation]

        text = formatString(text, newValue)
        terminalText = terminalText + text + "\n"
      } else {
        terminalText = concatenateActionDefaultLine(action, terminalText);
      }
    } else {
      terminalText = concatenateActionDefaultLine(action, terminalText);
    }
  } else {
    terminalText = "Set " + modifiedEntry + " to " + newValue + "\n" + terminalText
  }

  if (doNotUpdateUIElement) {
    return terminalText;
  }

  document.getElementById(TERMINAL_ELEMENT_NAME).value = terminalText
}

// Erase the terminal and reconstruct the terminal from the whole action list in case something went wrong.
function reprocessTerminal() {
  let terminalText = "";

  if (actionList.length === 0) {
    return terminalText;
  }

  for (let i = actionList.length - 1; i--; i >= 0) {
    console.log(actionList[i], i);
    terminalText = addActionToTerminal(actionList[i], true, terminalText);
  }

  document.getElementById(TERMINAL_ELEMENT_NAME).value = terminalText;
}

// Todo : Make the website work :D this will Surely be Fun and Epic

function GO(iPadID, matchsaver, scoutsaver) {
  getBoxData();

  var allClear = true;
  var team = document.getElementById("teamNum");
  var match = document.getElementById("matchNum");
  var scout = document.getElementById("scout");

  if (extraData[0] === "" || extraData[1] === "" || extraData[2] === "") {
    if (extraData[0] === "") {
      team.style.border = "5px solid red";
    }
    if (extraData[1] === "") {
      match.style.border = "5px solid red";
    }
    if (extraData[2] === "") {
      scout.style.border = "5px solid red";
    }
    allClear = false;
  }

  localStorage.setItem("iPadId", iPadID);
  sessionStorage.setItem("scoutInitials", scoutsaver);
  sessionStorage.setItem("matchNum", matchsaver);

  // actionList[0] = extraData[4];
  saveData();
  if (allClear) {
    window.location.href = "./" + "auton" + ".html";
  }
}

function getBoxData() {
  extraData[0] = document.getElementById('teamNum').value;
  extraData[1] = document.getElementById('matchNum').value;
  extraData[2] = document.getElementById('scout').value;
  saveData();
}

function saveData() {
  sessionStorage.setItem("scoreList", JSON.stringify(scoreList));
  sessionStorage.setItem("actionList", JSON.stringify(actionList));
  sessionStorage.setItem("extraData", JSON.stringify(extraData));
}

function getData() {
  actionList = JSON.parse(sessionStorage.getItem("actionList"));
  extraData = JSON.parse(sessionStorage.getItem("extraData"));
  scoreList = JSON.parse(sessionStorage.getItem("scoreList"));

  console.log(actionList, extraData, scoreList)

  reprocessTerminal();
}

function loadPage() {
  getData();
  displayBoxData();
  // document.getElementById("teamLog2").value = score;
}

function displayBoxData() {
  console.log("EXTRA DATA IS   ", extraData, "!!!!!!!!")

  if (extraData[0] !== undefined) {
    document.getElementById('teamNumberBox').value = extraData[0];
  }
  if (extraData[1] !== undefined) {
    document.getElementById('matchNumberBox').value = extraData[1];
  }
  if (extraData[3] !== undefined) {
    document.getElementById('coment').value = extraData[3];
  }

  updateScoreElement();
}

function commentEdit(comment) {
  extraData[3] = comment;
  saveData();
}

function pullIPadID() {
  document.getElementById("iPadIDarea").value = localStorage.getItem("iPadId");
  savescout = sessionStorage.getItem("scoutInitials");
  if (sessionStorage.getItem('matchNumber') !== null) {
    incmatchnumber = sessionStorage.getItem('matchNumber');
  }
  document.getElementById("matchNum").value = incmatchnumber;
  document.getElementById("scout").value = savescout;
}

function setTeam(matchnumb, ipadID) {
  if (sessionStorage.getItem('matchNumber') !== null) {
    matchnum = sessionStorage.getItem('matchNumber');
  }

  matchnum = parseInt(matchnumb);

  if (ipadID == 1) {
    document.getElementById("teamNum").value = blue1[matchnum - 1];
  }
  else if (ipadID == 2) {
    document.getElementById("teamNum").value = blue2[matchnum - 1];
  }
  else if (ipadID == 3) {
    document.getElementById("teamNum").value = blue3[matchnum - 1];
  }
  else if (ipadID == 4) {
    document.getElementById("teamNum").value = red1[matchnum - 1];
  }
  else if (ipadID == 5) {
    document.getElementById("teamNum").value = red2[matchnum - 1];
  }
  else if (ipadID == 6) {
    document.getElementById("teamNum").value = red3[matchnum - 1];
  }
}

function load(windowLocation) {
  saveData()
  window.location.href = `./${windowLocation}.html`;
}

function qrZoom() {
  let qr = document.getElementById('qrArea');
  if (zoom) {
    qr.style.transform = "scale(1, 1)";
    zoom = false;
    qr.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    return;
  }
  if (!zoom) {
    qr.style.transform = "scale(1.25, 1.25)";
    qr.style.backgroundColor = "white";
    zoom = true;
    return;
  }
}

function toQuotes() {
  document.getElementById("yesButton").style.transform = "scale(1.2, 1.2)";
  document.getElementById('changeStyle').innerHTML = "";
  extraData[1] = parseInt(extraData[1])
  sessionStorage.setItem('matchNumber', extraData[1] + 1);
  let takeout = getQuote();
  let quote = takeout[0];
  let author = takeout[1];

  document.getElementById('body').innerHTML = '<div class="quoteDiv" id="insertQuote"></div>';
  let insertQuote = document.getElementById('insertQuote');
  let repeat = quote.length;
  for (let i = 0; i < repeat; i++) {

    setTimeout(() => {
      insertQuote.innerHTML += quote[i];
    }, 15 * i);

  }
  setTimeout(() => {
    insertQuote.innerHTML += "<br><br><strong>" + author + "</strong>";
    insertQuote.innerHTML += "<button onclick='window.location.href = `./index.html`' class='continuieButton' id='contineButton'>Continue</button>";
    var compressedList = Array()

    for (const [key, value] of Object.entries(scoreList)) {
      compressedList.push(value)
    }

    localStorage.setItem("oldCompList" + extraData[1], compressedList);
    localStorage.setItem("oldExtraData" + extraData[1], extraData);
  }, 20 * repeat);
}