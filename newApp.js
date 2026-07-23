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

var actionList = [];

function numericAction(scoreListID, operation, value) {
  let actionData = [scoreListID, operation, value];

  actionList.push(actionData);
  processAction(actionData);
}

function reprocessActionList() {
  console.log("OH YEAAAÀ")
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
      reprocessActionList();
    }
  }
}