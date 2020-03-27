# Tower of Hanoi

## What is it?

The Tower of Hanoi (also called the Tower of Brahma or Lucas' Tower and sometimes pluralized as Towers) is a mathematical game or puzzle. It consists of three rods and a number of disks of different sizes, which can slide onto any rod. The puzzle starts with the disks in a neat stack in ascending order of size on one rod, the smallest at the top, thus making a conical shape.-[Wiki](https://en.wikipedia.org/wiki/Tower_of_Hanoi)

The objective of the puzzle is to move the entire stack to another rod, obeying the following simple rules:

1. Only one disk can be moved at a time.
2. Each move consists of taking the upper disk from one of the stacks and placing it on top of another stack or on an empty rod.
3. No larger disk may be placed on top of a smaller disk.

## What Technical used

HTML, CSS, and JavaScript (with some jQuery).

## Feature

-[hanio](https://github.com/life2free/Hanoi/blob/master/img/hanio.jpg)

### Moving method

There are two methods to move:

1. Manual
   User uses the arrow buttons under the towers to move the disks follows the game rules.

   - ">" : Move the disk to the adjacent tower on right side
   - ">>" : Move the disk to farthest tower on right side
   - "<": Move the disk to the adjacent tower on left side
   - "<<": Move the disk to farthest tower on left side

2. Automatic
   The game provide the solve for user. The game move disks step by step automatically to shows user how to move disks. There are there speed for solve.
   - Quickly: The game solves the game quickly
   - Normally: The game solves the puzzle at normal speed
   - Slowly: The game solves the puzzle slowly

### Disk number

Before playing, user can choice how many disk to play which the number range from 3 to 9.

### Information

The game provides additional informations on page for user.

1. Instructions
   It refers to the instructions of game. The Instructions will be show on the page after user clicking the "Instructions".

2. Time
   It refers to how long did the user play on current round.

3. Moves
   It refers to how many steps the user moved on current round.

4. Score
   It refers to the score the user got after finish the game. User can get score only moving all the disks to target tower. The calculation formulas is simple, base on the time and steps user spent

5. Minimum Moves
   It refers to the minimum moves of disks we can get the solution. The formula is (2^n - 1) where n is the number of the disks. If the n=3, then the minimum Moves is 7.

6. Log
   It refers to the detail information of each move step. The log will be show on the page after user clicking the "Log" button.

## Recursive Function

A recursive function is a function which either calls itself or is in a potential cycle of function calls. The core idea of Tower of Hanoi is recursion.
There is a recursive function which will be excuted when playing in automatic method.
