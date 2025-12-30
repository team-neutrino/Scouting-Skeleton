let extraData = []; //['teamNum', 'matchNum', 'scout', 'comment', 'red']
//Cluttering of Field (C 1-5), Driver Skill (D 1-5), Accuracy (AR 1-5), Align Time (AT 1-5)]
var matchNumber = []; //Match Number
var teamNumber = []; //Team Number
var actionList = [""]; //This is the list that populates the log with human friendly text.
var compressedList = []; //This is the list that collects all the IDs for the QR Code.
var comments = ""; //Comments Box
var blue1 = [1,2];
var blue2 = [3,4];
var blue3 = [5,6];
var red1 = [7,8];
var red2 = [9,10];
var red3 = [11,12];
var ipadID = localStorage.getItem("iPadId");
var incmatchnumber = "1";
var matchnum = 1;
var team = "";
var match = "";
var savescout = sessionStorage.getItem("scoutInitials");
var score = 0;

/* Function List
--- Direct Button Functions ---
changeMatchNumber: Used to change the match number
changeTeamNumber: Used to change the team number
addAction: Called everytime a button is pushed.
Undo: Pops items off of all the lists.
moveTableLeft: Used to move backwards in the table structure
moveTableRight: Used to move forward in the table structure
updateComments: Add comments
resetButton: Resets all the variables
--- Indirect Functions ---
init: Initialize everything
updateLog: Updates the human list of actions done.
updateAvail: This was created to enable/disable (validation) scoring buttons based on how many game pieces the robot has.
--- Notes ---
The updateReview and updateList using the organizedActionList variable in 2022 code was legacy code that was used to show the scouter the total # they put in. This might be useful to have on a review page.
Combined lowerCounter and raiseCounter functions into the updateAvail function to make it easier.
*/

function addAction(action, number) { //Used for buttons that have a data validation script
  actionList.push(action); //Add it to the actionList (what the scouter sees on the app)
  compressedList.push(number); //Add it to the compressedList (QR Code)//
  updateLog(); //Update what the scouter sees on the app (actionList)
  saveData();
  console.log(compressedList);
  addScore(number);
}

function addScore(num) {
  var tempScore = 0;
  switch (num) {
    case 11:
    case 23:
      tempScore = 2;
      break;
    case 1:
    case 2:
    case 12:
      tempScore = 3;
      break;
    case 3:
    case 8:
    case 13:
    case 17:
      tempScore = 4;
      break;
    case 14:
      tempScore = 5;
      break;
    case 4:
    case 7:
    case 16:
    case 21:
      tempScore = 6;
      break;
    case 5:
      tempScore = 7;
      break;
    case 19:
      tempScore = 12;
      break;
    default:
      tempScore = 0;
  }
  score = score + tempScore;
  document.getElementById("teamLog2").value = score;
}

function alliancePick(alliance) {
  extraData[4] = alliance;
  console.log(extraData);
}

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
  localStorage.setItem("iPadId", iPadID)
  sessionStorage.setItem("scoutInitials", scoutsaver)
  sessionStorage.setItem("matchNum", matchsaver)
  actionList[0] = extraData[4];
  saveData();
  if (allClear) {
    window.location.href = "./" + "auton" + ".html";
  }
  //console.log(displaySavedData());
}

function getBoxData() {
  extraData[0] = document.getElementById('teamNum').value;
  extraData[1] = document.getElementById('matchNum').value;
  extraData[2] = document.getElementById('scout').value;
  saveData();
  console.log(extraData);
}

function saveData() {
  sessionStorage.setItem("actionList", JSON.stringify(actionList));
  sessionStorage.setItem("compressedList", JSON.stringify(compressedList));
  sessionStorage.setItem("extraData", JSON.stringify(extraData));
  sessionStorage.setItem("score", score.toString());
}

function displaySavedData() {
  let compList = sessionStorage.getItem("compressedList");
  compList = JSON.parse(compList);
  let actList = sessionStorage.getItem("actionList");
  actList = JSON.parse(actList);
  let exData = sessionStorage.getItem("extraData");
  exData = JSON.parse(exData);
  score = parseInt(sessionStorage.getItem("score"), 10);
  return "compressed list: " + compList + " action list: " + actList + " extra data: " + exData;
}
function getData() {
  console.log(displaySavedData());
  let unparsedActionList = sessionStorage.getItem("actionList");
  let unparsedExtradata = sessionStorage.getItem("extraData");
  let unparsedCompressedList = sessionStorage.getItem("compressedList");
  score = parseInt(sessionStorage.getItem("score"), 10);
  actionList = JSON.parse(unparsedActionList);
  compressedList = JSON.parse(unparsedCompressedList);
  extraData = JSON.parse(unparsedExtradata);
  console.log(actionList);
  console.log(compressedList);
  console.log(extraData);
  if (document.getElementById('teamLog1') !== null) {
    updateLog();
  }
}

function loadPage() {
  getData();
  displayBoxData();
  document.getElementById("teamLog2").value = score;
}

function qualLoad() {
  getData();
  document.getElementById('teamNumberBox').value = extraData[0];
  document.getElementById('matchNumberBox').value = extraData[1];
  addStarRate("clutter;" + extraData[5]);
  addStarRate("driver;" + extraData[6]);
  addStarRate("accuracy;" + extraData[7]);
  addStarRate("defence;" + extraData[8]);
}

function displayBoxData() {
  if (extraData[0] !== undefined) {
    document.getElementById('teamNumberBox').value = extraData[0];
    console.log(document.getElementById('teamNumberBox').value);
  }
  if (extraData[1] !== undefined) {
    document.getElementById('matchNumberBox').value = extraData[1];
  }
  console.log(document.getElementById('teamNumberBox').value);
  if (extraData[3] !== undefined) {
    document.getElementById('coment').value = extraData[3];
  }
}

function updateLog() {
  var logText = actionList.slice().reverse().join("\n");
  document.getElementById("teamLog1").value = logText;
}

function commentEdit(comment) {
  extraData[3] = comment;
  saveData();
}
function Undo() {
  var lastAction = actionList.pop();

  if (lastAction) {
    document.getElementById('teamLog1').style.border = '3px solid red';
    setTimeout(() => {
      document.getElementById('teamLog1').style.border = '3px solid white';
      document.getElementById('teamLog1').style.transition = 'border 1s ease-in-out';
    }, 100);
    setTimeout(() => {
      document.getElementById('teamLog1').removeAttribute('style');
    }, 1100);
    compressedList.pop();
    updateLog();
  } else {
    console.log("Nothing to undo");
  }
}
function pullIPadID() {
  document.getElementById("iPadIDarea").value = localStorage.getItem("iPadId");
  console.log(sessionStorage.getItem("matchNum"));
  savescout = sessionStorage.getItem("scoutInitials");

  console.log(sessionStorage.getItem('matchNumber'));
  if (sessionStorage.getItem('matchNumber') !== null) {
    incmatchnumber = sessionStorage.getItem('matchNumber');
    console.log("used the incremented match number");
    console.log("new match number value: " + incmatchnumber);
  }
  document.getElementById("matchNum").value = incmatchnumber;
  document.getElementById("scout").value = savescout;
}

function setTeam(matchnumb, id) {

  var teamnumb = document.getElementById("teamNum");

  var ipadID = id
  console.log(sessionStorage.getItem('matchNumber'));
  if (sessionStorage.getItem('matchNumber') !== null) {
    matchnum = sessionStorage.getItem('matchNumber');
    console.log("used the incremented match number");
  }
  matchnum = parseInt(matchnumb);

  if (blue1[0] != -12) {
    if (ipadID == 1) {

      document.getElementById("teamNum").value = blue1[matchnum - 1];
      console.log(blue1[matchnum - 1]);
    }
    if (ipadID == 2) {
      document.getElementById("teamNum").value = blue2[matchnum - 1];
      console.log(blue2[matchnum - 1]);
    }
    if (ipadID == 3) {
      document.getElementById("teamNum").value = blue3[matchnum - 1];
      console.log(blue3[matchnum - 1]);
    }
    if (ipadID == 4) {
      document.getElementById("teamNum").value = red1[matchnum - 1];
      console.log(red1[matchnum - 1]);
    }
    if (ipadID == 5) {
      document.getElementById("teamNum").value = red2[matchnum - 1];
      console.log(red2[matchnum - 1]);
    }
    if (ipadID == 6) {
      document.getElementById("teamNum").value = red3[matchnum - 1];
      console.log(red3[matchnum - 1]);
    }
  }
}

function setTeampull(matchnumb) {
  var ipadID = localStorage.getItem("iPadId")

  matchnum = parseInt(matchnumb);

  if (blue1[0] != -12) {
    if (ipadID == 1) {
      console.log("testagain")
      document.getElementById("teamNum").value = blue1[matchnum - 1];
      console.log(blue1[matchnum - 1]);
    }
    if (ipadID == 2) {
      document.getElementById("teamNum").value = blue2[matchnum - 1];
      console.log(blue2[matchnum - 1]);
    }
    if (ipadID == 3) {
      document.getElementById("teamNum").value = blue3[matchnum - 1];
      console.log(blue3[matchnum - 1]);
    }
    if (ipadID == 4) {
      document.getElementById("teamNum").value = red1[matchnum - 1];
      console.log(red1[matchnum - 1]);
    }
    if (ipadID == 5) {
      document.getElementById("teamNum").value = red2[matchnum - 1];
      console.log(red2[matchnum - 1]);
    }
    if (ipadID == 6) {
      document.getElementById("teamNum").value = red3[matchnum - 1];
      console.log(red3[matchnum - 1]);
    }
  }
}

function ChangeRatingValue(selectedRating, value) {
  if (!isNaN(value)) {
    document.getElementById(selectedRating).innerText = "Selected Rating: " + value;
  } else {
    document.getElementById(selectedRating).innerText = "Selected Rating: 0";
  }
}

function addStarRate(id) {
  let rateText = id.split(";")[0];
  console.log(rateText);
  let value = Number(id.split(";")[1]);
  const ogValue = value;
  console.log(value);
  console.log("Clearing Stars...");
  let listOfClasses = "";
  if (value > 0) {
    listOfClasses = Array.from(document.getElementById(id).classList);
  }

  if (listOfClasses.includes("lastClicked")) {
    value = 0;
  }

  //Clears all the filled values regardless if they have them, screw optimizations
  for (let i = 1; i < 6; i++) {
    let starID = rateText + ";" + i;
    document.getElementById(starID).classList.remove("filled");
  }
  console.log("Filling Stars...");

  //Fills the stars that need it
  for (let i = 1; i < value + 1; i++) {
    let starID = rateText + ";" + i;
    document.getElementById(starID).classList.add("filled");
  }
  //Basicly a fancy if statement
  switch (rateText) {
    case "clutter":
      console.log("Updating Clutter Star Rating to " + value);
      extraData[5] = value;
      ChangeRatingValue("ratingValue1", value)
      break;
    case "driver":
      console.log("Updating Driver Skill Star Rating. " + value);
      extraData[6] = value;
      ChangeRatingValue("ratingValue2", value)
      break;
    case "accuracy":
      console.log("Updating Accuracy Star Rating " + value);
      extraData[7] = value;
      ChangeRatingValue("ratingValue3", value)
      break;
    case "defence":
      console.log("Updating Defence Star Rating " + value);
      extraData[8] = value;
      ChangeRatingValue("ratingValue4", value)
      break;
  }

  console.log(extraData);

  if (ogValue > 0) {
    updateLastClicked(id);
  } else {
    resetAllClicked(rateText + ";" + 1);
  }

  saveData();
}

function resetQual() {
  const goOn = confirm("Are you sure you want to reset the stars?");
  if (goOn) {
    addStarRate("defence;0");
    addStarRate("clutter;0");
    addStarRate("driver;0");
    addStarRate("accuracy;0");
  }
}

function resetAllClicked(elementID) {
  const element = document.getElementById(elementID);
  const parentElement = element.parentNode;
  const parentId = parentElement.id;

  const nodesList = parentElement.getElementsByClassName("lastClicked");

  const nodes = Array.from(nodesList);

  for (let i in nodes) {
    nodes[i].classList.remove("lastClicked");
  }
  const check = parentElement.getElementsByClassName("lastClicked");
}

function updateLastClicked(elementID) {

  const listOfClasses = Array.from(document.getElementById(elementID).classList);


  const element = document.getElementById(elementID);
  const parentElement = element.parentNode;
  const parentId = parentElement.id;

  const nodesList = parentElement.getElementsByClassName("lastClicked");

  const nodes = Array.from(nodesList);

  for (let i in nodes) {
    nodes[i].classList.remove("lastClicked");
  }

  const check = parentElement.getElementsByClassName("lastClicked");

  if (listOfClasses.includes("lastClicked")) {
    document.getElementById(elementID).classList.remove("lastClicked");
  } else {
    document.getElementById(elementID).classList.add("lastClicked");
  }

}

let zoom = false;
let regenOpen = false;
let resetMenuVisible = false;



function reset(action) {
  let resetQr = document.getElementById('resetQr');
  let qrHtml = '<div class="qr-holder" id="qrArea"  onclick="qrZoom()" style="opacity:0;transform:scale(1.1, 1.1) rotate(3deg)"> \n </div>';
  let resetHTML = '<div class="reset-pop-up" id="resetPopUp" style="opacity:0;transform:scale(0.9, 0.9) rotate(-3deg)"> \n <div class="reset-pop-up-top"> \n <h2>Do You Really Want To Reset?</h2> \n </div> \n <div class="reset-pop-up-bottom"> \n <button class="reset-pop-up-button color1" onclick="toQuotes()" id="yesButton">Yes</button> \n<button class="reset-pop-up-button color2" onclick="reset(\'no\')" id="noButton">No</button> \n </div> \n </div>';
  if (regenOpen) {
    regenQR();
  }
  if (action == 'reset') {
    resetMenuVisible = true;
    let qrArea = document.getElementById('qrArea');
    qrArea.style.transition = 'transform 0.4s ease-out, opacity 0.25s ease-out';
    qrArea.style.opacity = 0;
    qrArea.style.transform = 'scale(1.1, 1.1) rotate(3deg)';
    setTimeout(() => {
      resetQr.innerHTML = "";
      resetQr.innerHTML = resetHTML;
    }, 260);
    setTimeout(() => {
      document.getElementById("resetPopUp").style.removeProperty("opacity");
      document.getElementById("resetPopUp").style.removeProperty("transform");
    }, 300);
  }
  if (action == 'no') {
    resetMenuVisible = false;
    let resetPopUp = document.getElementById("resetPopUp");
    resetPopUp.style.opacity = 0;
    resetPopUp.style.transform = 'scale(0.9, 0.9) rotate(-3deg)';
    setTimeout(() => {
      resetQr.innerHTML = "";
      resetQr.innerHTML = qrHtml;
      initQRCode();
    }, 260);
    setTimeout(() => {
      document.getElementById("qrArea").style.removeProperty("opacity");
      document.getElementById("qrArea").style.removeProperty("transform");
    }, 300);
  }

}



function load(loadOut, windowLocation) {
  const targetElements = Array.from(document.querySelectorAll('div.flex-container *')).filter(element => {
    const children = element.children;
    return (
      element.tagName !== 'SVG' && // Exclude <svg> elements
      !(element.tagName === 'DIV' && children.length > 0 && children[0].tagName === 'SVG') && // Exclude <div> where the first child is <svg>
      (children.length === 0 || // Childless element
        (children.length === 1 && children[0].tagName === 'SPAN')) // Only one child, and it's a <span>
    );
  });



  if (loadOut) {
    targetElements.reverse();
  }
  for (let b in targetElements) {
    setTimeout(() => {
      if (loadOut) {
        targetElements[b].style.opacity = "0";
        targetElements[b].style.transform = "scale(0.5, 0.5)";
        window.location.href = `./${windowLocation}.html`;
      } else {
        targetElements[b].style.opacity = "1";
        targetElements[b].style.transform = "scale(1, 1)";
      }
    }, 15 * b);
  }
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
  /*body.innerHTML += '<svg width="100vw" height="120vh" style="top:110vh;animation: slide-in 2.5s linear;box-shadow: 0px 0px 100px white;"> \n <rect width="100vw" height="120vh" x="0" y="0" rx="0" ry="20" fill="white" /> \n </svg>';*/
  document.getElementById("yesButton").style.transform = "scale(1.2, 1.2)";
  document.getElementById('changeStyle').innerHTML = "";
  document.getElementById('waveHolder').style.animationName = "slide-in-no-fade";
  extraData[1] = parseInt(extraData[1])
  console.log(extraData[1] + " adding 1 gives.. " + (extraData[1] + 1));
  sessionStorage.setItem('matchNumber', extraData[1] + 1);
  console.log("New Match Number: " + sessionStorage.getItem('matchNumber'));
  setTimeout(() => {
    document.getElementById('path').style.animationDuration = "0.5s";
    document.getElementById('waveBottom').style.animationDuration = "0.5s";
    document.getElementById('path').style.animationName = "color-shift";
    document.getElementById('waveBottom').style.animationName = "color-shift";

  }, 2800);
  let takeout = getQuote();
  let quote = takeout[0];
  let author = takeout[1];
  let length = takeout[2];
  setTimeout(() => {

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
      insertQuote.innerHTML += "<button onclick='resetToIndex()' class='continuieButton' id='contineButton'>Continue</button>";
      var sums = Array(27).fill(0);
      for (const item of compressedList) {
        sums[item]++;
      }
      //alert(sums);
      localStorage.setItem("oldCompList" + extraData[1], sums);
      localStorage.setItem("oldExtraData" + extraData[1], extraData);
    }, 20 * repeat);

  }, 3400);

  setTimeout(() => {



    //alert(compressedList);

    //window.location.href = `./index.html`;



  }, 3500 + length);


}




function makeBubble() {
  let offset = Math.random() * 110;
  let size = Math.random() * (50 - 5) + 5;
  let topOffset = ((Math.random() * (30 - 5) + 5) / 2) + 100;
  let time = Math.random() * (2 - 0) + 0;
  return `<svg width="100" height="100"  id="bubble" style="right:${offset + 10}vw;top:${topOffset}vh;animation: slide-in ${time + 0.8}s linear;animation-delay: ${time};"> \n <circle cx="50" cy="50" r="${size}" stroke="white" stroke r="${size}" stroke="white" stroke-width="4" fill="white" /> \n </svg>`;
}

function makeOldMatches() {
  for (let i = 1; i < 30; i++) {
    oldMatches.push(i);
  }
}
makeOldMatches(); // delete me for regen stuff
function regenQR() {
  let container = document.getElementById('resetQr');
  let regenHTML = '<h2 class="matchHeader">What Match?</h2> \n<div class="matchSelect" id="matchSelect"> \n</div>';
  if (resetMenuVisible) {
    regenHTML = '<h2 class="matchHeader">Ya Ha Ha! You found me!</h2>';
  }
  if (!regenOpen) {

    const boxes = [...container.children];
    const firstRects = boxes.map(box => box.getBoundingClientRect());


    const newBox = document.createElement('div');
    newBox.classList.add("oldQrs");
    newBox.innerHTML = regenHTML;
    newBox.setAttribute('id', 'oldQr');
    container.appendChild(newBox);
    if (!resetMenuVisible) {
      addOldMatches();
    }

    const lastRects = [...container.children].map(box => box.getBoundingClientRect());
    // Step 3: Apply FLIP animation
    boxes.forEach((box, i) => {
      const dx = firstRects[i].left - lastRects[i].left;
      console.log(dx);
      const dy = firstRects[i].top - lastRects[i].top;
      console.log(dy);
      box.style.transition = 'none';
      box.style.transform = `translate(${dx}px, ${dy}px)`;
      let newBoxx = document.getElementById('oldQr');
      newBoxx.style.transform = `translate(${dx * 4}px, ${dy}px)`;
      setTimeout(() => {
        requestAnimationFrame(() => {
          box.style.transition = 'transform 0.5s ease';
          box.style.transform = "";
          newBoxx.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
          newBoxx.style.transform = "";
        });
      }, 1);

    });


    regenOpen = true;
  } else {
    regenOpen = false;
    const boxes = [...container.children];
    const firstRects = boxes.map(box => box.getBoundingClientRect());

    document.getElementById('oldQr').style.transform = 'translate(50vw, 0)'
    document.getElementById('oldQr').style.opacity = '0'

    setTimeout(() => {
      container.removeChild(document.getElementById('oldQr'));

      const lastRects = [...container.children].map(box => box.getBoundingClientRect());

      // Step 3: Apply FLIP animation
      boxes.forEach((box, i) => {
        const dx = firstRects[i].left - lastRects[i].left;
        console.log(dx);
        const dy = firstRects[i].top - lastRects[i].top;
        console.log(dy);
        box.style.transition = 'none';
        box.style.transform = `translate(${dx}px, ${dy}px)`;
        setTimeout(() => {
          requestAnimationFrame(() => {
            box.style.transition = 'transform 0.5s ease';
            box.style.transform = "";
          });
        }, 1);
      });
    }, 200);



  }
}

function resetToIndex() {

  document.getElementById('contineButton').innerText = "";
  document.getElementById('contineButton').style.transform = 'scale(7,30)';

  setTimeout(() => {
    window.location.href = `./index.html`;
  }, 750);
  setTimeout(() => {

  }, 850);

}
