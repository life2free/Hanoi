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

// $(".disk1").mousedown(function(e) {
//   var isMove = true;
//   let moveDiv = ".disk1";
//   console.log(e);
//   console.log(e.pageX);
//   var div_x = e.pageX - $(moveDiv).offset().left;
//   console.log(div_x);
//   console.log("offset:" + $(moveDiv).offset().left);
//   var div_y = e.pageY - $(moveDiv).offset().top;
//   $(document)
//     .mousemove(function(e) {
//       if (isMove) {
//         var obj = $(moveDiv);
//         obj.css({ left: e.pageX - div_x, top: e.pageY - div_y });
//       }
//     })
//     .mouseup(function() {
//       isMove = false;
//     });
// });

// $(function() {
//   dragPanelMove("#1", "#1");
//   function dragPanelMove(downDiv, moveDiv) {
//     $(downDiv).mousedown(function(e) {
//       var isMove = true;
//       console.log(e);
//       console.log(e.pageX);
//       let firstMouseX = e.pageX;
//       let firstMouseY = e.pageY;

//       let firstDivX = $(moveDiv).offset().left;
//       let firstDivY = $(moveDiv).offset().top;
//       let relativeX = $(moveDiv).position().left;
//       let relativeY = $(moveDiv).position().top;
//       console.log("relative X:" + $(moveDiv).position().left);
//       console.log(
//         firstMouseX + " " + firstMouseY + " " + firstDivX + " " + firstDivY
//       );
//       var div_x = e.pageX - $(moveDiv).offset().left;
//       console.log("div_x: " + div_x);
//       console.log("offset:" + $(moveDiv).offset().left);
//       var div_y = e.pageY - $(moveDiv).offset().top;
//       $(document)
//         .mousemove(function(e) {
//           console.log("move");
//           if (isMove) {
//             var obj = $(moveDiv);
//             console.log($(moveDiv).offset().left);
//             // obj.css({ left: e.pageX, top: e.pageY });
//             console.log(e.pageX);
//             obj.css({
//               left: e.pageX - firstMouseX + relativeX,
//               top: e.pageY - firstMouseY + relativeY
//             });
//           }
//         })
//         .mouseup(function() {
//           isMove = false;
//         });
//     });
//   }
// });
// const disks = $(".disk");

// function test() {
//   alert($(this).attr("id") + "Handler for .click() called.");
// }
// $(document).ready(function() {
//   $(".disk").click(test);
// });

// disks.each(element => {
//   console.log(disks[element]);
// });
let diskNumber = 3;
// $(".spinner").spinner();
const towerDisks = [[], [], []];
$(function() {
  $("#1").draggable({ revert: true });
});

$(".tower").droppable({
  drop: function(event, ui) {
    alert($(this).attr("id"));
    let towerId = $(this).attr("id");
    if (towerId == "1") {
      alert("ok");
      ui.draggable({ revert: "invalid" });
    }
    alert("dropped");
    //  ui.draggable({ revert: true });
  }
});
