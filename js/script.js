/**
 * Tower of Hanoi
 * Author: Shimin Rao
 * Date: 3/24/2020
 * Version: 1.0.0
 *
 * Rule:
 * 1. Move one disks at a time.
 * 2. Bigger disks cannot go on top of smaller disks.
 */

/* 
 1. After page load, there are default numbers(e.g: 7) of disks
 2. Player select the disk number or using the default number
 3. Player begin to move disk, player need moves all of the disks on source tower to target tower,
        biggest disk on the bottom, smallest disk on the top. each disk is smaller than the next bottom one.
 4. Player clicks one disk which will be moved to another tower, the disk will be highlight, the player clicks
    the tower which the disk will be moved to, check there are disks on the aim tower or not.
 5. If there is no disk on aim tower, then moves the disk to aim tower.
 6. If there are disks on the aim tower, check the top disk on aim tower is bigger than the disk which will be moved or not
 7. If the top disk on aim tower is bigger than the disk, the moves the disk to aim tower. otherwise, the disk can not
    been moved to aim tower. the player need choices another aim tower or choices another top disk to move.
 8. When player moves all of disks on source tower to target tower, player finishs the game. 
*/

/********* define the constants *******/
// store the disks in each tower
const towerDisks = [[], [], []];
// store the id of disks in each tower
const towerDiskIds = [[], [], []];
/*
store the standby disks. the max number of disks is 9. If the number the user choice is less than 9, 
  then the rest of disks will be store in this array. e.g: if user choice 6 disks to play, 
  then disk 7, 8, 9 will be store in this array in case the user will choice more disks to play in next round.
*/
const standbyDisks = [];
// store the tower's div elements
const towers = [{}, {}, {}];
// the max number of disks which user can move
const maxDiskNumber = 9;
// the min number of disks which user can move
const minDiskNumber = 3;
// the the height percent of horizontal bar, for calculation the disk's top when move the disk
const horizontalBarHeightPercent = 5;
// the height percent of each disk
const eachDiskHeightPercent = 10;
// the width percent of smallest disk. In this game, the smallest disk is disk 3
const smallestDiskWidthPercent = 25;
// the differenct width percent of each disk
const diskWidthDiffPercent = 5;

// the html element
const diskNumberSetting = document.querySelector("#disknumbers");
const solveSpeedEle = document.querySelector("#solve-speed");
const sourceTower = document.querySelector(".source");
const timeEle = document.querySelector(".time");
const scoreEle = document.querySelector(".score");
const movesEle = document.querySelector(".moves");
const minimumMovesEle = document.querySelector(".minimum-moves");
const resultEle = document.querySelector(".result");
const towerDivs = document.querySelectorAll(".tower");
const moveButtons = document.querySelectorAll(".move-button");
const startButton = document.querySelector(".start-button");
const quitButton = document.querySelector(".quit-button");
const logButton = document.querySelector(".log-button");
const solveButton = document.querySelector(".solve-button");
const logs = document.querySelector(".logs");
const logsContent = document.querySelector(".logs-content");
const logsHideButton = document.querySelector(".logs-hide-button");
const instruction = document.querySelector(".instruction");

/*
the timeout value for solve. its unit is millisecond. 
  500:  stand for Solve quickly
  1000: stand for Solve normally
  1500: stand for Solve slowly
*/
const solveSpeeds = [500, 1000, 1500];

/*
percent value for disk 3,4...9
  the value will as base weight of final score which user will get 
  user will get whole score of this part if finished the game
*/
const baseWeights = [35, 40, 45, 50, 55, 60, 65];
// time weight percent value for disk 3,4...9
const timeWights = [40, 35, 30, 30, 25, 25, 20];
// step weight percent value for disk 3,4...9
const stepWights = [25, 25, 25, 20, 20, 15, 15];
// the standare value of time which spend on moving each step
const baseTimeEachSteps = [1, 1, 1, 1.5, 1.5, 2, 2];
// the total score for disk 3,4...9
const totalScores = [300, 400, 500, 600, 700, 800, 900];
let logsInfos = [];
let autoMoveSteps = [];
let timeouts = [];
let towerTopPercents = [];
let diskNumber = 3;
let moves = 0;
let sourceTowerHight = $(sourceTower).height();
let sourceTowerWidth = $(sourceTower).width();
let isFinish = false;
let isAuto = false;
let startTime = 0;
let spendTime = 0;
let interval;
let solveSpeedOption = 1;
let solveTimeOut = solveSpeeds[solveSpeedOption];
let finalScore = 0;

/**
 * invoked when user choice the number of disks.
 * when user choice different number, the number of disks stack on the source tower will change
 * @param {Object} e
 */
function settingDiskNumber(e) {
  let newDiskNumber = parseInt(this.value);
  if (newDiskNumber != diskNumber) {
    // if user choice different number with last time, then the number of disks stack on the source tower will change
    if (newDiskNumber > diskNumber) {
      // if user choice more disks to move, need showing more disks on the source tower
      for (let i = 1; i <= diskNumber; i++) {
        let disk = towerDisks[0][i - 1];
        // calculate the new top percent of the disk.
        let topPercent =
          100 -
          horizontalBarHeightPercent -
          (newDiskNumber + 1 - i) * eachDiskHeightPercent;
        let newTop = (topPercent / 100) * sourceTowerHight;
        disk.style.top = newTop + "px";
      }
      for (let i = 0; i < newDiskNumber - diskNumber; i++) {
        let disk = standbyDisks.shift();
        if (disk != null) {
          let topPercent =
            100 -
            horizontalBarHeightPercent -
            (newDiskNumber - diskNumber - i) * eachDiskHeightPercent;
          let newTop = (topPercent / 100) * sourceTowerHight;
          disk.style.top = newTop + "px";
          disk.style.display = "block";
          // append new disk to div, then thd disk will showed on the source tower
          sourceTower.appendChild(disk);
          towerDisks[0].push(disk);
          towerDiskIds[0].push(parseInt(diskNumber) + parseInt(i) + 1);
          towerTopPercents[0] -= eachDiskHeightPercent;
        }
      }
    } else {
      let sourceDisks = towerDisks[0];
      for (let i = sourceDisks.length - 1; i > newDiskNumber - 1; i--) {
        let disk = sourceDisks.pop();
        towerDiskIds[0].pop();
        // disappeared the disk which don't needed
        disk.style.display = "none";
        standbyDisks.splice(0, 0, disk);
        towerTopPercents[0] += eachDiskHeightPercent;
      }

      for (let i = 0; i < newDiskNumber; i++) {
        let disk = sourceDisks[i];
        // calculate the new top percent of the disk.
        let topPercent =
          100 -
          horizontalBarHeightPercent -
          (newDiskNumber - i) * eachDiskHeightPercent;
        let newTop = (topPercent / 100) * sourceTowerHight;
        disk.style.top = newTop + "px";
      }
    }
    diskNumber = newDiskNumber;
    // display the new Minimum Moves
    minimumMovesEle.innerText = Math.pow(2, diskNumber) - 1;
  }
}

/**
 * move the disk for the tower which its id is oriTowerId to the tower which its id is aimTowerId
 * @param {Object} disk - thd disk will be moved
 * @param {Number} oriTowerId - thd id of tower which thd disk will be moved from
 * @param {Number} aimTowerId - the id of tower which thd disk will be moved to
 */
function moveDisk(disk, oriTowerId, aimTowerId) {
  let oriTower = towers[oriTowerId];
  let aimTower = towers[aimTowerId];

  let oriTowerDisks = towerDisks[oriTowerId];
  let oriDiskId = towerDiskIds[oriTowerId][0];
  let aimTowerDisks = towerDisks[aimTowerId];

  // disappeared the disk on original tower
  disk.remove();
  towerTopPercents[oriTowerId] =
    towerTopPercents[oriTowerId] + eachDiskHeightPercent;
  towerTopPercents[aimTowerId] =
    towerTopPercents[aimTowerId] - eachDiskHeightPercent;
  let newTop = (towerTopPercents[aimTowerId] / 100) * sourceTowerHight;
  disk.style.top = newTop + "px";
  // append the disk to aim tower
  aimTower.appendChild(disk);

  oriTowerDisks.shift();
  towerDiskIds[oriTowerId].shift();
  aimTowerDisks.splice(0, 0, disk);
  towerDiskIds[aimTowerId].splice(0, 0, oriDiskId);

  // add the number of step
  moves++;
  movesEle.innerText = moves;
  // generate the log
  let logInfo =
    "Disk " +
    disk.id +
    ": " +
    oriTower.getAttribute("name") +
    " -> " +
    aimTower.getAttribute("name");
  logsInfos.push(logInfo);
  console.log(logInfo);
  if (towerDisks[2].length == diskNumber) {
    finishGame();
  }
}

/**
 * invoked when user click the button to move disk
 * 1. If there is no disk on the original tower to move, then give user a alert message
 * 2. If there are disks on the original tower, then check the aim tower is empty or not
 * 3. If the aim tower is empty, then move the disk to aim tower directly
 * 3. If there are disks on aim tower, then check the top disk on aim tower
 *    is bigger than the disk which will be moved or not
 *    1) If the top disk on aim tower is bigger, then move the disk to aim tower directly
 *    2) If the top disk on aim tower is smaller, then user can't move the disk to aim tower
 */
function moveDishHandle() {
  let oriTowerId = parseInt($(this).attr("oriId"));
  let aimTowerId = parseInt($(this).attr("aimId"));
  let oriTowerDisks = towerDisks[oriTowerId];
  let aimTowerDisks = towerDisks[aimTowerId];
  if (oriTowerDisks.length > 0) {
    let oriDisk = oriTowerDisks[0];
    let oriDiskId = towerDiskIds[oriTowerId][0];
    if (aimTowerDisks.length == 0) {
      // the aim tower is empty, move the disk to aim tower directly
      moveDisk(oriDisk, oriTowerId, aimTowerId);
    } else {
      let aimTowerTopDiskId = towerDiskIds[aimTowerId][0];
      if (aimTowerTopDiskId != null && aimTowerTopDiskId != "") {
        if (oriDiskId < aimTowerTopDiskId) {
          // the top disk on aim tower is bigger, move the disk to aim tower directly
          moveDisk(oriDisk, oriTowerId, aimTowerId);
        } else {
          // the top disk on aim tower is smaller, user can't move the disk to aim tower, gives a alert message to user
          let oriTower = towers[oriTowerId];
          let aimTower = towers[aimTowerId];
          alert(
            "Can't move! the top disk on " +
              oriTower.getAttribute("name") +
              " tower is bigger than top disk on " +
              aimTower.getAttribute("name") +
              " tower!"
          );
        }
      }
    }
  } else {
    alert("There is no disk to move!");
  }
}

/**
 * invoked when user click the "Start" button to play the game
 */
function startGame() {
  isFinish = false;
  isAuto = false;
  logsInfos = [];
  moveButtons.forEach(button => (button.disabled = false));
  diskNumberSetting.disabled = true;
  quitButton.disabled = false;
  this.disabled = true;
  timeEle.innerText = "";
  scoreEle.innerText = "";
  finalScore = 0;
  movesEle.innerText = "";
  startTime = new Date().getTime();
  interval = setInterval(showRunTime, 1000);
  let logInfo = "Start the Game.";
  logsInfos.push(logInfo);
  console.log(logInfo);
}

/**
 * for Solve method
 * invoked when user click the "Solve!" button to play the game
 */
function solveGame() {
  autoMoveSteps = [];
  isFinish = false;
  isAuto = true;
  logsInfos = [];
  moveButtons.forEach(button => (button.disabled = false));
  diskNumberSetting.disabled = true;
  solveSpeedEle.disabled = true;
  quitButton.disabled = false;
  this.disabled = true;
  timeEle.innerText = "";
  scoreEle.innerText = "";

  moves = 0;
  clearInterval(interval);
  resetTowerDisks();

  solveSpeedOption = parseInt(solveSpeedEle.value);
  solveTimeOut = solveSpeeds[solveSpeedOption];
  let logInfo = "Start the Game.";
  logsInfos.push(logInfo);
  console.log(logInfo);
  startTime = new Date().getTime();
  interval = setInterval(showRunTime, 1000);
  // invoke the recursive function to get all of the steps
  hanoi(diskNumber, 0, 1, 2);

  // delay performing each step to show the user how to move
  if (autoMoveSteps.length > 0) {
    for (let i = 0; i < autoMoveSteps.length; i++) {
      timeouts.push(
        setTimeout(function() {
          let step = autoMoveSteps[i];
          let diskId = step[0];
          let soureTowerId = step[1];
          let targetTowerId = step[2];
          let oriDisk = towerDisks[soureTowerId][0];
          moveDisk(oriDisk, soureTowerId, targetTowerId);
        }, (i + 1) * solveTimeOut)
      );
    }
  }
}

/**
 * recursive function, the core idea of hanio
 * @param {Nuber} disc - the id of disk which will be moved
 * @param {Number} src - the id of original tower
 * @param {Number} aux - thd id of aux tower
 * @param {Number} dst - the id of aim tower
 */
function hanoi(disc, src, aux, dst) {
  if (disc > 0) {
    hanoi(disc - 1, src, dst, aux);
    autoMoveSteps.push([disc, src, dst]);
    hanoi(disc - 1, aux, src, dst);
  }
}

/**
 * handle the logic when user quit the game by clicking "Quit" button
 */
function quitGame() {
  moveButtons.forEach(button => (button.disabled = true));
  diskNumberSetting.disabled = false;
  startButton.disabled = false;
  this.innerText = "Quit";
  this.disabled = true;
  solveButton.disabled = false;
  solveSpeedEle.disabled = false;

  clearInterval(interval);
  // move all disks to source tower
  resetTowerDisks();

  if (isAuto) {
    // clear all the timeout event
    for (let i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
    }
    timeouts = [];
  }
  if (!isFinish) {
    if (!isAuto) {
      scoreEle.innerText = "0";
      finalScore = 0;
    }
    logInfo =
      "Quit the Game! Total steps:" +
      moves +
      ".  Total times:" +
      timeEle.innerText;
    logsInfos.push(logInfo);
    console.log(logInfo);
  }
  moves = 0;
}

/**
 * handle the logic when user finish the game
 */
function finishGame() {
  isFinish = true;
  moveButtons.forEach(button => (button.disabled = true));
  diskNumberSetting.disabled = true;
  startButton.disabled = true;
  quitButton.innerText = "Restart";
  quitButton.disabled = false;
  solveSpeedEle.disabled = false;
  clearInterval(interval);
  let logInfo =
    "Success! Total steps:" + moves + ".  Total times:" + timeEle.innerText;
  if (isAuto) {
    timeouts = [];
  } else {
    // calculate the score for user
    calculateScore(moves);
    logInfo += ". Score:" + finalScore;
  }

  logsInfos.push(logInfo);
  console.log(logInfo);
  resultEle.innerText = "Well Done!";
  setTimeout(function() {
    resultEle.innerText = "";
  }, 1500);
}

/**
 * move all disks to source tower when user quit the game or restart the game
 */
function resetTowerDisks() {
  if (!isFinish) {
    if (towerDisks[0].length < diskNumber) {
      for (let i = 0; i < towerDisks.length; i++) {
        for (let j = 0; j < towerDisks[i].length; j++) {
          // remove all disks from all of towers
          towerDisks[i][j].remove();
        }
        towerDisks[i] = [];
        towerDiskIds[i] = [];
        towerTopPercents[i] = 100 - horizontalBarHeightPercent;
      }

      // generate the new disks and append to source tower
      for (let i = 1; i <= diskNumber; i++) {
        let disk = document.createElement("div");
        disk.setAttribute("id", i);
        disk.classList.add("disk");
        disk.innerText = i;

        // calculate the width of disk
        let newWidth =
          ((smallestDiskWidthPercent +
            diskWidthDiffPercent * (parseInt(i) - 1)) /
            100) *
          sourceTowerWidth;
        disk.style.width = newWidth + "px";
        // calculate the top of disk
        let topPercent =
          100 -
          horizontalBarHeightPercent -
          (parseInt(diskNumber) + 1 - parseInt(i)) * eachDiskHeightPercent;
        let newTop = (topPercent / 100) * sourceTowerHight;
        disk.style.top = newTop + "px";
        // append the disk to div
        sourceTower.appendChild(disk);
        towerDisks[0].push(disk);
        towerDiskIds[0].push(i);
      }

      towerTopPercents[0] =
        100 - horizontalBarHeightPercent - diskNumber * eachDiskHeightPercent;
    }
  } else {
    // if user has finished the game and want to restart game,
    // then move all of the disks from target tower to source tower
    towerDiskIds[0] = [...towerDiskIds[2]];
    towerDiskIds[2] = [];
    towerTopPercents[2] = 100 - horizontalBarHeightPercent;
    towerDisks[0] = [...towerDisks[2]];
    towerTopPercents[0] =
      100 - horizontalBarHeightPercent - diskNumber * eachDiskHeightPercent;
    towerDisks[2].forEach(item => item.remove());
    towerDisks[2] = [];
    for (let i = 0; i < towerDisks[0].length; i++) {
      sourceTower.appendChild(towerDisks[0][i]);
    }
  }
}

/**
 * calculate the score for user
 * @param {Number} stepNumber - the steps which user move disk
 */
function calculateScore(stepNumber) {
  let baseWeight = baseWeights[diskNumber - minDiskNumber];
  let timeWight = timeWights[diskNumber - minDiskNumber];
  let stepWight = stepWights[diskNumber - minDiskNumber];
  let baseTimeEachStep = baseTimeEachSteps[diskNumber - minDiskNumber];
  let totalScore = totalScores[diskNumber - minDiskNumber];
  // because the user finish the game, so the user get whole score of the base part
  finalScore = (totalScore * baseWeight) / 100;
  // calculate the time part score
  let timeEachStep = spendTime / stepNumber;
  let timeRatio = timeEachStep / baseTimeEachStep - 1;
  if (timeRatio > 0) {
    let timeScore = (totalScore * timeWight * Math.pow(0.8, timeRatio)) / 100;
    finalScore += timeScore;
  } else {
    finalScore += (totalScore * timeWight) / 100;
  }

  // calculate the step part score
  let mininumStep = Math.pow(2, diskNumber) - 1;
  let stepRatio = stepNumber / mininumStep - 1;
  let stepScore = (totalScore * stepWight * Math.pow(0.8, stepRatio)) / 100;
  finalScore += stepScore;
  finalScore = Math.round(finalScore);
  scoreEle.innerText = finalScore;
}

/**
 * calculate how long did the user play on current round
 * invoked in each second
 */
function showRunTime() {
  let now = new Date().getTime();
  let runTime = now - startTime;
  spendTime = runTime / 1000;
  timeEle.innerText = convertToShowTime(runTime);
}

/**
 * convert the format of the time interval to string which will be showed on page
 * @param {Number} timeInterval
 * @returns {String} - the format string for time, e.g: x minutes x seconds
 */
function convertToShowTime(timeInterval) {
  let showTime = "";
  let millisecondsInOneDay = 24 * 60 * 60 * 1000;
  let d = timeInterval / millisecondsInOneDay;
  let D = Math.floor(d); // get the value of days
  let h = (d - D) * 24;
  let H = Math.floor(h); // get the value of hours
  let m = (h - H) * 60;
  let M = Math.floor(m); // get the value of minutes
  let s = (m - M) * 60;
  let S = Math.floor(s); // get the value of seconds
  if (D > 0) showTime += D + (D > 1 ? " days " : " day ");
  if (H > 0) showTime += H + (H > 1 ? " hours " : " hour ");
  if (M > 0) showTime += M + (M > 1 ? " minutes " : " minute ");
  if (S > 0) showTime += S + (S > 1 ? " seconds " : " second ");
  return showTime;
}

/**
 * invoked when user click the "Log" button, show the logs to user
 * @param {Object} e - refer to the click event
 */
function showLogs(e) {
  let showorhide = e.target.dataset.showorhide;
  showorhide = showorhide == "" ? 0 : parseInt(showorhide);
  if (showorhide == 1) {
    $(logs).effect("slide", {}, 500, function() {});
    $(logsContent).empty();
    if (logsInfos.length > 0) {
      // generate the p element for each log message
      for (let i = 0; i < logsInfos.length; i++) {
        let p = document.createElement("p");
        p.innerText = logsInfos[i];
        // append the p element to log div
        logsContent.appendChild(p);
      }
    }
    e.target.dataset.showorhide = 0;
  } else {
    // hide the log div
    $(logs).effect("drop", {}, 500);
    e.target.dataset.showorhide = 1;
  }
}

/**
 * hide the log div
 */
function hideLogs() {
  // hide the log div
  $(logs).effect("drop", {}, 500);
  logButton.dataset.showorhide = 1;
}

/**
 * show the instructions
 */
function showInstruction() {
  $(".instruction-detail").slideToggle("slow");
}

/**
 * initialization when page load
 */
function init() {
  diskNumber = parseInt(diskNumberSetting.value);
  let initTopPercents = 100 - horizontalBarHeightPercent;
  towerTopPercents = [initTopPercents, initTopPercents, initTopPercents];
  for (let i = 1; i <= maxDiskNumber; i++) {
    // generate the disks and append to source tower div
    let disk = document.createElement("div");
    disk.setAttribute("id", i);
    disk.classList.add("disk");
    disk.innerText = i;

    // calculate the width of disk
    let newWidth =
      ((smallestDiskWidthPercent + diskWidthDiffPercent * (i - 1)) / 100) *
      sourceTowerWidth;

    disk.style.width = newWidth + "px";
    if (i <= diskNumber) {
      // calculate the top of the disk
      let topPercent =
        100 -
        horizontalBarHeightPercent -
        (diskNumber + 1 - i) * eachDiskHeightPercent;
      let newTop = (topPercent / 100) * sourceTowerHight;
      disk.style.top = newTop + "px";
      // append to source tower div
      sourceTower.appendChild(disk);
      towerDisks[0].push(disk);
      towerDiskIds[0].push(i);
      towerTopPercents[0] -= eachDiskHeightPercent;
    } else {
      // store the disks which are dont't need to standby array in case for next round
      standbyDisks.push(disk);
    }
  }
  minimumMovesEle.innerText = Math.pow(2, diskNumber) - 1;

  for (let i = 0; i < towerDivs.length; i++) {
    let towerId = towerDivs[i].id;
    towers[parseInt(towerId)] = towerDivs[i];
  }

  diskNumberSetting.addEventListener("change", settingDiskNumber);
  startButton.addEventListener("click", startGame);
  quitButton.addEventListener("click", quitGame);
  solveButton.addEventListener("click", solveGame);
  moveButtons.forEach(button =>
    button.addEventListener("click", moveDishHandle)
  );
  moveButtons.forEach(button => (button.disabled = true));
  logButton.addEventListener("click", showLogs);
  logsHideButton.addEventListener("click", hideLogs);
  instruction.addEventListener("click", showInstruction);
  quitButton.disabled = true;
  logs.style.display = "none";
}

window.onload = init;
