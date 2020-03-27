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

const towerDisks = [[], [], []];
const towerDiskIds = [[], [], []];
const standbyDisks = [];
const towers = [{}, {}, {}];

const maxDiskNumber = 9;
const minDiskNumber = 3;
const horizontalBarHeightPercent = 5;
const eachDiskHeightPercent = 10;
const smallestDiskWidthPercent = 25;
const diskWidthDiffPercent = 5;

const diskNumberSetting = document.querySelector("#disknumbers");
const solveSpeedEle = document.querySelector("#solve-speed");
const sourceTower = document.querySelector(".source");
const timeEle = document.querySelector(".time");
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
const solveSpeeds = [500, 1000, 1500];
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
let endTime = 0;
let interval;
let solveSpeedOption = 1;
let solveTimeOut = solveSpeeds[solveSpeedOption];

function settingDiskNumber(e) {
  let newDiskNumber = parseInt(this.value);
  if (newDiskNumber != diskNumber) {
    if (newDiskNumber > diskNumber) {
      for (let i = 1; i <= diskNumber; i++) {
        let disk = towerDisks[0][i - 1];
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
        disk.style.display = "none";
        standbyDisks.splice(0, 0, disk);
        towerTopPercents[0] += eachDiskHeightPercent;
      }

      for (let i = 0; i < newDiskNumber; i++) {
        let disk = sourceDisks[i];
        let topPercent =
          100 -
          horizontalBarHeightPercent -
          (newDiskNumber - i) * eachDiskHeightPercent;
        let newTop = (topPercent / 100) * sourceTowerHight;
        disk.style.top = newTop + "px";
      }
    }
    diskNumber = newDiskNumber;
    minimumMovesEle.innerText = Math.pow(2, diskNumber) - 1;
  }
}

function moveDisk(disk, oriTowerId, aimTowerId) {
  let oriTower = towers[oriTowerId];
  let aimTower = towers[aimTowerId];

  let oriTowerDisks = towerDisks[oriTowerId];
  let oriDiskId = towerDiskIds[oriTowerId][0];
  let aimTowerDisks = towerDisks[aimTowerId];

  disk.remove();
  towerTopPercents[oriTowerId] =
    towerTopPercents[oriTowerId] + eachDiskHeightPercent;
  towerTopPercents[aimTowerId] =
    towerTopPercents[aimTowerId] - eachDiskHeightPercent;
  let newTop = (towerTopPercents[aimTowerId] / 100) * sourceTowerHight;
  disk.style.top = newTop + "px";
  aimTower.appendChild(disk);

  oriTowerDisks.shift();
  towerDiskIds[oriTowerId].shift();
  aimTowerDisks.splice(0, 0, disk);
  towerDiskIds[aimTowerId].splice(0, 0, oriDiskId);
  moves++;
  movesEle.innerText = moves;
  // alert("1");
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

function moveDishHandle() {
  let oriTowerId = parseInt($(this).attr("oriId"));
  let aimTowerId = parseInt($(this).attr("aimId"));
  let oriTowerDisks = towerDisks[oriTowerId];
  let aimTowerDisks = towerDisks[aimTowerId];
  if (oriTowerDisks.length > 0) {
    let oriDisk = oriTowerDisks[0];
    let oriDiskId = towerDiskIds[oriTowerId][0];
    if (aimTowerDisks.length == 0) {
      moveDisk(oriDisk, oriTowerId, aimTowerId);
    } else {
      let aimTowerTopDiskId = towerDiskIds[aimTowerId][0];
      if (aimTowerTopDiskId != null && aimTowerTopDiskId != "") {
        if (oriDiskId < aimTowerTopDiskId) {
          moveDisk(oriDisk, oriTowerId, aimTowerId);
        } else {
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

function startGame() {
  isFinish = false;
  isAuto = false;
  logsInfos = [];
  moveButtons.forEach(button => (button.disabled = false));
  diskNumberSetting.disabled = true;
  quitButton.disabled = false;
  this.disabled = true;
  timeEle.innerText = "";
  movesEle.innerText = "";
  startTime = new Date().getTime();
  interval = setInterval(showRunTime, 1000);
  let logInfo = "Start the Game.";
  logsInfos.push(logInfo);
  console.log(logInfo);
}

function quitGame() {
  moveButtons.forEach(button => (button.disabled = true));
  diskNumberSetting.disabled = false;
  startButton.disabled = false;
  this.innerText = "Quit";
  this.disabled = true;
  solveButton.disabled = false;
  solveSpeedEle.disabled = false;

  clearInterval(interval);
  resetTowerDisks();

  if (isAuto) {
    for (let i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
    }
    timeouts = [];
  }
  if (!isFinish) {
    logInfo =
      "Quit the Game! total steps:" +
      moves +
      ".  total times:" +
      timeEle.innerText;
    logsInfos.push(logInfo);
    console.log(logInfo);
  }
  moves = 0;
}

function resetTowerDisks() {
  if (!isFinish) {
    if (towerDisks[0].length < diskNumber) {
      for (let i = 0; i < towerDisks.length; i++) {
        for (let j = 0; j < towerDisks[i].length; j++) {
          towerDisks[i][j].remove();
        }
        towerDisks[i] = [];
        towerDiskIds[i] = [];
        towerTopPercents[i] = 100 - horizontalBarHeightPercent;
      }

      for (let i = 1; i <= diskNumber; i++) {
        let disk = document.createElement("div");
        disk.setAttribute("id", i);
        disk.classList.add("disk");
        disk.innerText = i;

        let newWidth =
          ((smallestDiskWidthPercent +
            diskWidthDiffPercent * (parseInt(i) - 1)) /
            100) *
          sourceTowerWidth;
        disk.style.width = newWidth + "px";
        let topPercent =
          100 -
          horizontalBarHeightPercent -
          (parseInt(diskNumber) + 1 - parseInt(i)) * eachDiskHeightPercent;
        let newTop = (topPercent / 100) * sourceTowerHight;
        disk.style.top = newTop + "px";
        sourceTower.appendChild(disk);
        towerDisks[0].push(disk);
        towerDiskIds[0].push(i);
      }

      towerTopPercents[0] =
        100 - horizontalBarHeightPercent - diskNumber * eachDiskHeightPercent;
    }
  } else {
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
  // autoMoveHandle(diskNumber, 0, 2);
  hanoi(diskNumber, 0, 1, 2);
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

function hanoi(disc, src, aux, dst) {
  if (disc > 0) {
    hanoi(disc - 1, src, dst, aux);
    autoMoveSteps.push([disc, src, dst]);
    hanoi(disc - 1, aux, src, dst);
  }
}

function finishGame() {
  isFinish = true;
  moveButtons.forEach(button => (button.disabled = true));
  diskNumberSetting.disabled = true;
  startButton.disabled = true;
  quitButton.innerText = "Restart";
  quitButton.disabled = false;
  solveSpeedEle.disabled = false;
  clearInterval(interval);
  if (isAuto) {
    timeouts = [];
  }
  let logInfo =
    "Success! total steps:" + moves + ".  total times:" + timeEle.innerText;
  logsInfos.push(logInfo);
  console.log(logInfo);
  resultEle.innerText = "Well Done!";
  setTimeout(function() {
    resultEle.innerText = "";
  }, 1500);
}

function showRunTime() {
  let now = new Date().getTime();
  let runTime = now - startTime;

  timeEle.innerText = convertToShowTime(runTime);
}

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

function showLogs(e) {
  let showorhide = e.target.dataset.showorhide;
  showorhide = showorhide == "" ? 0 : parseInt(showorhide);
  if (showorhide == 1) {
    $(logs).effect("slide", {}, 500, function() {});
    $(logsContent).empty();
    if (logsInfos.length > 0) {
      for (let i = 0; i < logsInfos.length; i++) {
        let p = document.createElement("p");
        p.innerText = logsInfos[i];
        logsContent.appendChild(p);
      }
    }
    e.target.dataset.showorhide = 0;
  } else {
    $(logs).effect("drop", {}, 500);
    e.target.dataset.showorhide = 1;
  }
}

function hideLogs() {
  $(logs).effect("drop", {}, 500);
  logButton.dataset.showorhide = 1;
}

function showSolveSpeed() {
  $(".solve-speed-option").slideToggle("slow");
}

function init() {
  diskNumber = parseInt(diskNumberSetting.value);
  let initTopPercents = 100 - horizontalBarHeightPercent;
  towerTopPercents = [initTopPercents, initTopPercents, initTopPercents];
  for (let i = 1; i <= maxDiskNumber; i++) {
    let disk = document.createElement("div");
    disk.setAttribute("id", i);
    disk.classList.add("disk");
    disk.innerText = i;

    let newWidth =
      ((smallestDiskWidthPercent + diskWidthDiffPercent * (i - 1)) / 100) *
      sourceTowerWidth;

    disk.style.width = newWidth + "px";
    if (i <= diskNumber) {
      let topPercent =
        100 -
        horizontalBarHeightPercent -
        (diskNumber + 1 - i) * eachDiskHeightPercent;
      let newTop = (topPercent / 100) * sourceTowerHight;
      disk.style.top = newTop + "px";
      sourceTower.appendChild(disk);
      towerDisks[0].push(disk);
      towerDiskIds[0].push(i);
      towerTopPercents[0] -= eachDiskHeightPercent;
    } else {
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
  quitButton.disabled = true;
  logs.style.display = "none";
}

window.onload = init;
