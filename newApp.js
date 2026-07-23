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

  
*/

var scoreList = {
  "Example": 1
};

const SCORE_LIST_TEMPLATE = structuredClone(scoreList);

const ACTION_FORMATTING = {
  "Example": {
    "+": "Added {0} Example",
    "-": "Subtracted {0} Example",
  }
}

const TERMINAL_ELEMENT_NAME = "teamLog1"

// support for stacking actions together like in 2026 can be added at some point I'm like really lazy
// and I'm writing this after a really short LC meeting too and I have like 30 minutes before graphics
// give me a break

var actionList = [];

// javascript doesn't have a string.format and I realized that a little too late
if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}

// Completes a numeric action (add or subtract from an entry in the score list)
function numericAction(scoreListID, operation, value) {
  let actionData = [scoreListID, operation, value];

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
}

// Undo the last action. Also allows you to undo actions from a long time ago and recalculate score list with that in mind
function undoAction(position) {
  let actionData;

  if (position) {
    actionData = actionList[position]
  } else {
    actionData = actionList[actionList.length - 1]
  }

  let operation = actionData[1];

  if (operation != "Set") {
    actionData[2] *= -1;
    processAction(actionData);

    if (position != null) {
      actionList.splice(position, 1);
    } else {
      actionList.pop()
    }
  } else {
    if (position === actionList.length - 1 || position === null) {
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

        text.format(newValue)
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
  let terminalText = ""

  for (let i = actionList.length - 1; i--; i >= 0) {
    terminalText = addActionToTerminal(actionList[i], true, terminalText);
  }

  document.getElementById(TERMINAL_ELEMENT_NAME).value = terminalText;
}

// Todo : Make the website work :D this will Surely be Fun and Epic