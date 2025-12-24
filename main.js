////////////////////////
//INITIALIZE VARIABLES//
////////////////////////

//canvas variables
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//player position and speed
let playerX = 400;
let playerY = 700;
let playerRotation = 0;
let playerRotationRad = playerRotation * Math.PI / 180;
let playerSpeed = 0;
let speedMultiplier = 1;

//player dimensions
const hX = 15;
const hY = hX/2;

//player hitbox coordinates
let hitboxAX;
let hitboxAY;
let hitboxBX;
let hitboxBY;
let hitboxCX;
let hitboxCY;
let hitboxDX;
let hitboxDY;

//calculation variables
let newX;
let newY;

//lap variables
let lapsCompleted = 0;
let lapStarted;
let checkpointPassed = 3;

//time variables
let actualTime = Date.now();
let currentTime;
let bestTime = Infinity;
let lastTime;
let currentMin;
let currentSec;
let currentMilli;
let lastMin;
let lastSec;
let lastMilli;
let bestMin;
let bestSec;
let bestMilli;
let timeOffset = 0;
let timePaused = 0;

//other variables
let restarted = true;

//case variables
let phase = 'home';

//time trial variables
let currentX = [];
let currentY = [];
let currentRotation = [];
let bestTimeX = [];
let bestTimeY = [];
let bestTimeRotation = [];
let raceTicks = 0;

//keys pressed set
const pressedKeys = new Set();



////////////////////////////////////////////
//FUNCTIONS CALLED BY OTHER FUNCTIONS ONLY//
////////////////////////////////////////////

//starts the timer
let startTimer = function() {
    lapStarted = actualTime
};

//gets current time for lap
let getCurrentTimer = function() {
    return ((actualTime - lapStarted) - timeOffset);
};

//pauses timer
let pauseTimer = function() {
    timePaused = actualTime;
};

//unpauses timer
let unpauseTimer = function() {
    timeOffset += (actualTime - timePaused);
};

//uses player coordinates to get hitbox coordinates
let getHitboxCorners = function() {
    newX = -hX*Math.cos(playerRotationRad) - hY*Math.sin(playerRotationRad);
    newY = -hX*Math.sin(playerRotationRad) + hY*Math.cos(playerRotationRad);

    hitboxAX = newX + playerX;
    hitboxAY = newY + playerY;

    newX = -hX*Math.cos(playerRotationRad) - -hY*Math.sin(playerRotationRad);
    newY = -hX*Math.sin(playerRotationRad) + -hY*Math.cos(playerRotationRad);

    hitboxBX = newX + playerX;
    hitboxBY = newY + playerY;

    newX = hX*Math.cos(playerRotationRad) - -hY*Math.sin(playerRotationRad);
    newY = hX*Math.sin(playerRotationRad) + -hY*Math.cos(playerRotationRad);

    hitboxCX = newX + playerX;
    hitboxCY = newY + playerY;

    newX = hX*Math.cos(playerRotationRad) - hY*Math.sin(playerRotationRad);
    newY = hX*Math.sin(playerRotationRad) + hY*Math.cos(playerRotationRad);

    hitboxDX = newX + playerX;
    hitboxDY = newY + playerY;
};

//checks for collision with a wall at set coordinates
let checkCoordsForWall = function(x1, x2, y1, y2, directionMin, directionMax) {
    if (((hitboxAX > x1 && hitboxAX < x2 && hitboxAY > y1 && hitboxAY < y2) || (hitboxBX > x1 && hitboxBX < x2 && hitboxBY > y1 && hitboxBY < y2)) && playerSpeed >= 0) {
        if (directionMin != 270) {
            if (playerRotation > directionMin && playerRotation < directionMax) {
                playerSpeed = -1;
            };
        } else {
            if (playerRotation > directionMin || playerRotation << directionMax) {
                playerSpeed = -1;
            };
        };
    } else if (((hitboxCX > x1 && hitboxCX < x2 && hitboxCY > y1 && hitboxCY < y2) || (hitboxDX > x1 && hitboxDX < x2 && hitboxDY > y1 && hitboxDY < y2) && playerSpeed <= 0)) {
        if (directionMin != 90 && directionMin != 270) {
            if ((playerRotation > (360 - directionMax)) && (playerRotation < (360 - directionMin))) {
                playerSpeed = 1;
            };
        } else {
            if (playerRotation > (360 - directionMin) || playerRotation < (360 - directionMax)) {
                playerSpeed = 1;
            };
        };
    };
};

//checks for collision with the boundary
let checkBoundaryCollision = function() {
    //left edge
    checkCoordsForWall(-15, 1, -15, 815, 270, 90);

    //right edge
    checkCoordsForWall(799, 815, -15, 815, 90, 270);

    //top edge
    checkCoordsForWall(-15, 815, -15, 1, 0, 180);

    //bottom edge
    checkCoordsForWall(-15, 815, 799, 815, 180, 360);
};

//checks collision for all walls, triggers checkCoordsForWall
let checkWallCollision = function() {
    //Bottom hoorizontal line lower side
    checkCoordsForWall(190, 610, 600, 610, 0, 180);

    // Bottom horizontal line top side
    checkCoordsForWall(200, 610, 590, 600, 180, 360);

    //Bottom horizontal line right side
    checkCoordsForWall(600, 610, 590, 610, 270, 90);
    
    //Vertical line left side
    checkCoordsForWall(190, 200, 190, 610, 90, 270);

    //Vertical line right side
    checkCoordsForWall(200, 210, 210, 590, 270, 90);

    //Top horizontal line top side
    checkCoordsForWall(190, 610, 190, 200, 180, 360);

    //Top horizontal line bottom side
    checkCoordsForWall(200, 610, 200, 210, 0, 180);

    //Top horizontal line right side
    checkCoordsForWall(600, 610, 190, 210, 270, 90);

    //Right horizontal line top side
    checkCoordsForWall(390, 800, 390, 400, 180, 360);

    //Right horizontal line bottom side
    checkCoordsForWall(390, 800, 400, 410, 0, 180);

    //Right horizontal line left side
    checkCoordsForWall(390, 400, 390, 410, 90, 270);
};

//checks for collision with a section of grass
let checkCoordsForGrass = function(x1, x2, y1, y2) {
    if (hitboxAX > x1 && hitboxAX < x2 && hitboxAY > y1 && hitboxAY < y2) {
        speedMultiplier *= 2
    };

    if (hitboxBX > x1 && hitboxBX < x2 && hitboxBY > y1 && hitboxBY < y2) {
        speedMultiplier *= 2
    };

    if (hitboxCX > x1 && hitboxCX < x2 && hitboxCY > y1 && hitboxCY < y2) {
        speedMultiplier *= 2
    };

    if (hitboxDX > x1 && hitboxDX < x2 && hitboxDY > y1 && hitboxDY < y2) {
        speedMultiplier *= 2
    };
};

//checks for collision with all grass, triggers checkCoordsForGrass
let checkGrassCollision = function() {
    speedMultiplier = 1;

    //grass at bottom edge
    checkCoordsForGrass(0, 800, 750, 800);

    //grass at top edge
    checkCoordsForGrass(0, 800, 0, 50);

    //grass on left edge
    checkCoordsForGrass(0, 50, 50, 750);

    //grass on right edge top
    checkCoordsForGrass(750, 800, 50, 390);

    //grass on right edge bottom
    checkCoordsForGrass(750, 800, 410, 800);

    //grass above right horizontal wall
    checkCoordsForGrass(350, 750, 350, 390);

    //grass below right horizontal wall
    checkCoordsForGrass(350, 750, 410, 450);

    //grass to the left of to right horizontal wall
    checkCoordsForGrass(350, 390, 390, 410);

    //grass below bottom horizontal wall
    checkCoordsForGrass(150, 650, 610, 650);

    //grass above bottom horizontal wall
    checkCoordsForGrass(210, 650, 550, 590);

    //grass to the right of to bottom horizontal wall
    checkCoordsForGrass(610, 650, 590, 610);

    //grass to the left of vertical wall
    checkCoordsForGrass(150, 190, 190, 610);

    //grass to the right of vertical wall
    checkCoordsForGrass(210, 250, 250, 550);

    //grass above top horizontal wall
    checkCoordsForGrass(150, 650, 150, 190);

    //grass below top horizontal wall
    checkCoordsForGrass(210, 650, 210, 250);

    //grass to the right of top horizontal wall
    checkCoordsForGrass(610, 650, 190, 210);
};

//checks a checkpoint for car passed through
let checkCheckpoint = function(x1, x2, y1, y2, checkpointNumber, previousCheckpoint) {
    if ((hitboxAX > x1 && hitboxAX < x2 && hitboxAY > y1 && hitboxAY < y2) || (hitboxBX > x1 && hitboxBX < x2 && hitboxBY > y1 && hitboxBY < y2) || (hitboxCX > x1 && hitboxCX < x2 && hitboxCY > y1 && hitboxCY < y2) || (hitboxDX > x1 && hitboxDX < x2 && hitboxDY > y1 && hitboxDY < y2)) {
        if (checkpointPassed == (previousCheckpoint)) {
            checkpointPassed = checkpointNumber;
            if (checkpointNumber == 4) {
                timeOffset = 0;
                if (restarted == true) {
                    restarted = false;
                    startTimer();
                } else {
                    lapsCompleted++

                    if (lapsCompleted == 3) {
                        lapsCompleted = 0;

                        lastTime = currentTime;
                        lastMin = currentMin;
                        lastSec = currentSec;
                        lastMilli = currentMilli;

                        if (lastTime < bestTime) {
                            bestTime = lastTime;
                            bestMin = lastMin;
                            bestSec = lastSec;
                            bestMilli = lastMilli

                            bestTimeX = currentX;
                            bestTimeY = currentY;
                            bestTimeRotation = currentRotation;
                        };

                        currentX = [];
                        currentY = [];
                        currentRotation = [];
                        raceTicks = 0;

                        startTimer();

                        lapsCompleted == 0;
                    };
                };
            };
        };
    };
};

//reset variables for time trial
let timeTrialVariables = function() {
    playerX = 400;
    playerY = 700;
    playerRotation = 0;
    playerRotationRad = playerRotation * Math.PI / 180;
    playerSpeed = 0;

    currentX = [];
    currentY = [];
    currentRotation = [];

    speedMultiplier = 1;
    
    checkpointPassed = 3;
    raceTicks = 0;
    lapsCompleted = 0;
    restarted = true;
};

let raceVariables = function() {
    playerX = 400;
    playerY = 700;
    playerRotation = 0;
    playerRotationRad = playerRotation * Math.PI / 180;
    playerSpeed = 0;

    currentX = [];
    currentY = [];
    currentRotation = [];

    speedMultiplier = 1;

    checkpointPassed = 3;
    raceTicks = 0;
    lapsCompleted = 0;
    restarted = true;
};



//////////////////////
//MOVEMENT FUNCTIONS//
//////////////////////

//rotates the car
let steerCar = function() {
    if (pressedKeys.has('ArrowLeft')) {
        playerRotation -= 4;
    };

    if (pressedKeys.has('ArrowRight')) {
        playerRotation += 4;
    };

    if (playerRotation > 359) {
        playerRotation %= 360;
    } else if (playerRotation < 0) {
        playerRotation += 360;
    };

    playerRotationRad = playerRotation * Math.PI / 180;
};

//moves the car forward or backwards
let accelerateCar = function() {
    if (pressedKeys.has('ArrowUp')) {
        playerSpeed += 0.3
    };

    if (pressedKeys.has('ArrowDown')) {
        if (playerSpeed > 0) {
            playerSpeed -= 0.6
        } else {
            playerSpeed -= 0.3;
        };
    };

    if (!pressedKeys.has('ArrowUp') && !pressedKeys.has('ArrowDown')) {
        if (playerSpeed < 0.3 && playerSpeed > -0.3) {
            playerSpeed = 0;
        } else if (playerSpeed > 0) {
            playerSpeed -= .15;
        } else if (playerSpeed < 0) {
            playerSpeed += .15;
        };
    };

    playerSpeed = Math.max((-4.5 / speedMultiplier), Math.min((7 / speedMultiplier), playerSpeed));

    playerY += -(playerSpeed * Math.sin(playerRotationRad));
    playerX += -(playerSpeed * Math.cos(playerRotationRad));
};

//updates the player's position array
let playerPositionArray = function() {
    if (restarted == false) {
        currentX.push(playerX);
        currentY.push(playerY);
        currentRotation.push(playerRotation);
    };
};



/////////////////////
//DRAWING FUNCTIONS//
/////////////////////

//draws home screen
let drawHomeScreen = function() {
    ctx.fillStyle = "#1111AA";
    ctx.fillRect(0, 0, 800, 800);
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(100, 100, 600, 100);
    ctx.fillRect(100, 300, 600, 100);

    ctx.fillStyle = "#000000";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText('Time Trial', 400, 165);
    ctx.fillText('Race', 400, 365)
};

//draws time trial select menu
let drawTimeTrialSelect = function() {
    ctx.fillStyle = "#1111AA";
    ctx.fillRect(0, 0, 800, 800);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(100, 50, 600, 200);
    ctx.fillRect(100, 300, 600, 200);
    ctx.fillRect(100, 550, 600, 200);

    ctx.fillStyle = "#000000";
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Race solo', 400, 165);
    ctx.fillText('Race ghost', 400, 415);
    ctx.fillText('View ghost time', 400, 665);
};

//draws road
let drawRoad = function(transparancy) {
    ctx.fillStyle = '#00A225' + transparancy;
    ctx.fillRect(0, 0, 800, 800);

    ctx.fillStyle = '#2e2e2e' + transparancy;
    ctx.fillRect(50, 650, 700, 100);
    ctx.fillRect(50, 150, 100, 500);
    ctx.fillRect(50, 50, 700, 100);
    ctx.fillRect(650, 150, 100, 200);
    ctx.fillRect(250, 250, 400, 100);
    ctx.fillRect(250, 350, 100, 200);
    ctx.fillRect(350, 450, 400, 100);
    ctx.fillRect(650, 550, 100, 100);

    ctx.fillStyle = '#FFFFFF' + transparancy;

    for (let j = 0; j < 3; j++){
        for (let i = 0; i < 5; i++) {
            ctx.fillRect((300 + (10 * j)), (650 + (20 * i) + ((j % 2) * 10)), 10, 10);
        };

    };

    ctx.fillStyle = '#FFFF00' + transparancy;
    ctx.fillRect(190, 190, 420, 20);
    ctx.fillRect(190, 210, 20, 400);
    ctx.fillRect(210, 590, 400, 20);
    ctx.fillRect(390, 390, 410, 20);
};

//draws home button
let drawHomeButton = function() {
    ctx.fillStyle = '#9E9E9E';
    ctx.fillRect(5, 5, 40, 40);

    ctx.fillStyle = '#000000';

    ctx.beginPath();

    ctx.moveTo(15, 40);
    ctx.lineTo(35, 40);
    ctx.lineTo(35, 25);
    ctx.lineTo(43, 25);
    ctx.lineTo(25, 5);
    ctx.lineTo(7, 25);
    ctx.lineTo(15, 25);
    ctx.lineTo(15, 40);

    ctx.fill();
};

//draws pause button
let drawPauseButton = function() {
    ctx.fillStyle = '#9E9E9E';
    ctx.fillRect(755, 5, 40, 40);

    ctx.fillStyle = '#000000';
    ctx.fillRect(762, 10, 10, 30);
    ctx.fillRect(778, 10, 10, 30);
};

//draws player
let drawPlayer = function(transparancy, x, y, rotation) {
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.fillStyle = '#000000' + transparancy;
    ctx.fillRect((hX*-0.9), (hY*-1.4), (hX*0.4), (hY*0.4));
    ctx.fillRect((hX*-0.9), (hY*1.1), (hX*0.4), (hY*0.4));
    ctx.fillRect((hX*0.5), (hY*-1.4), (hX*0.4), (hY*0.4));
    ctx.fillRect((hX*0.5), (hY*1.1), (hX*0.4), (hY*0.4));

    ctx.fillStyle = '#FF0000' + transparancy;
    ctx.fillRect((hX*-1), (hY*-1), (hX*2), (hY*2));

    ctx.fillStyle = '#ff9900' + transparancy;
    ctx.fillRect((hX*-0.75), (hY*-0.5), (hX*0.5), hY);

    ctx.restore();
};

let drawGhost = function(transparancy, x, y, rotation, increaseTick, loopGhost) {
    if (restarted == false) {
        if (bestTimeX[raceTicks] != undefined) {
            drawPlayer(transparancy, x, y, rotation);
        } else if (loopGhost) {
            raceTicks = 0;
        }

        raceTicks += increaseTick;
    };
};



///////////////////////
//COLLISION FUNCTIONS//
///////////////////////

//does all collision, runs getHitboxCorners, checkBoundaryCollision, checkWallCollision, and checkGrassCollision
let checkCollision = function() {
    getHitboxCorners();
    checkBoundaryCollision();
    checkWallCollision();
    checkGrassCollision();
};



////////////////////////////
//LAP COMPLETION FUNCTIONS//
////////////////////////////

//count laps and time, triggers checkCheckpoint
let countLaps = function() {
    currentTime = getCurrentTimer();
    currentMin = Math.floor(currentTime/60000);
    currentSec = Math.floor((currentTime%60000) / 1000);

    if (currentSec < 10) {
        currentSec = "0" + currentSec;
    };

    currentMilli = currentTime%1000

    if (currentMilli < 10) {
        currentMilli = "00" + currentMilli;
    } else if (currentMilli < 100) {
        currentMilli = "0" + currentMilli;
    };
    
    //first checkpoint at middle of left vertical track
    checkCheckpoint(0, 190, 390, 400, 1, 4);

    //second checkpoint at middle of top horizontal track
    checkCheckpoint(390, 400, 0, 190, 2, 1);

    //third checkpoint next to right horizontal line
    checkCheckpoint(210, 390, 390, 400, 3, 2);

    //fourth checkpoint at finish line
    checkCheckpoint(320, 330, 610, 800, 4, 3)
};



/////////////////////
//WRITING FUNCTIONS//
/////////////////////

//writes current, last, and best times
let writeTimes = function() {
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    ctx.textAlign = 'left';

    ctx.fillText("Laps finished: " + lapsCompleted + '/3', 580, 30);

    if (currentTime != NaN) {
        if (restarted == false) {
            ctx.fillText("Current Time: " + currentMin+ ":" + currentSec + "." + currentMilli, 10, 30);
        } else {
            ctx.fillText("Current Time: ", 10, 30);
        };

        if (lastTime != NaN && lastTime != undefined) {
            ctx.fillText("Last time: " + lastMin + ":" + lastSec + "." + lastMilli, 10, 780);
            ctx.fillText("Best time: " + bestMin + ":" + bestSec + "." + bestMilli, 600, 780);
        } else {
            ctx.fillText('Last time: ', 10, 780);
            ctx.fillText('Best time: ', 600, 780);

        };
    };
};

//writes only best time
let writeBestTime = function() {
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';

    ctx.fillText('Best time: ' + bestMin + ':' + bestSec + '.' + bestMilli, 10, 30);
};

let writeLaps = function() {
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    ctx.textAlign = 'left';
    ctx.fillText("Laps finished: " + lapsCompleted + '/3', 580, 30);
};

let writeCountDown = function() {
    ctx.fillStyle = '#000000';
    ctx.font = '100px Arial';
    ctx.textAlign = 'center';

    if (getCurrentTimer() < 1000) {
        ctx.fillText('3', 400, 425);
    } else if (getCurrentTimer() < 2000) {
        ctx.fillText('2', 400, 425);
    } else if (getCurrentTimer() < 3000) {
        ctx.fillText('1', 400, 425);
    } else {
        startTimer();
        phase = 'race';
    };
};

//writes pause message
let writePauseMessage = function() {
    ctx.fillStyle = "#000000";
    ctx.font = "100px Arial";
    ctx.textAlign = 'center';
    ctx.fillText("Paused", 400, 425);
};



///////////////////////////////
//START AND RESTART FUNCTIONS//
///////////////////////////////

//checks for restart key pressed
let checkForRestart = function() {
    if (pressedKeys.has('KeyR')) {
        if (phase == 'race') {
            raceVariables()
            phase = 'startRace';
        } else {
            timeTrialVariables();
        };
    };
};



//////////////////////////////////////////
//EVENT LISTENER AND DETECTION FUNCTIONS//
//////////////////////////////////////////

//checks for keys pressed
let eventListeners = function() {
    window.addEventListener('keydown', e => {
        pressedKeys.add(e.code);
    });

    window.addEventListener('keyup', e => {
        pressedKeys.delete(e.code);
    });

    canvas.addEventListener('click', checkForClick);
};

//check for pause/home button clicked
let checkForClick = function(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    switch (phase) {
        case 'home':
            if (100 < clickX && clickX < 700 && 100 < clickY && clickY < 200) {
                phase = 'timeTrialSelect';
            } else if (100 < clickX && clickX < 700 && 300 < clickY && clickY < 400) {
                raceVariables();
                startTimer();
                phase = 'startRace';
            };

            break

        case 'timeTrialSelect':
            if (5 < clickX && clickX < 45 && 5 < clickY && clickY < 45) {
                phase = 'home';
            } else if (100 < clickX && clickX < 700 && 50 < clickY && clickY < 250) {
                timeTrialVariables();
                phase = 'timeTrialSolo';
            } else if (100 < clickX && clickX < 700 && 300 < clickY && clickY < 500) {
                timeTrialVariables();
                phase = 'timeTrialGhost';
            } else if (100 < clickX && clickX < 700 && 550 < clickY && clickY < 750) {
                raceTicks = 0;
                phase = 'timeTrialView';
            };

            break;
        
        case 'timeTrialSolo':
            if (755 < clickX && clickX < 795 && 5 < clickY && clickY < 45) {
                phase = 'pausedTimeTrialSolo';
                pauseTimer();
            };
            
            break;

        case 'pausedTimeTrialSolo':
            if (5 < clickX && clickX < 45 && 5 < clickY && clickY < 45) {
                phase = 'home';
            } else if (755 < clickX && clickX < 795 && 5 < clickY && clickY < 45) {
                phase = 'timeTrialSolo';
                unpauseTimer();
            };

            break;

        case 'timeTrialGhost':
            if (755 < clickX && clickX < 795 && 5 < clickY && clickY < 45) {
                phase = 'pausedTimeTrialGhost';
                pauseTimer();
            };

            break;

        case 'pausedTimeTrialGhost':
            if (5 < clickX && clickX < 45 && 5 < clickY && clickY < 45) {
                phase = 'home';
            } else if (755 < clickX && clickX < 795 && 5 < clickY && clickY < 45) {
                phase = 'timeTrialGhost';
                unpauseTimer();
            };

            break;

        case 'timeTrialView':
            if (755 < clickX && clickX < 795 && 5 < clickY && clickY < 45) {
                phase = 'pausedTimeTrialView';
            };

            break;

        case 'pausedTimeTrialView':
            if (5 < clickX && clickX < 45 && 5 < clickY && clickY < 45) {
                phase = 'home';
            } else if (755 < clickX && clickX < 795 && 5 < clickY && clickY < 45) {
                phase = 'timeTrialView';
            };

            break;

        case 'race':
            if (755 < clickX && clickX < 795 && 5 < clickY && clickY < 45) {
                phase = 'pausedRace';
            };

            break;

        case 'pausedRace':
            if (5 < clickX && clickX < 45 && 5 < clickY && clickY < 45) {
                phase = 'home';
            } else if (755 < clickX && clickX < 795 && 5 < clickY && clickY < 45) {
                phase = 'race';
            };

            break;
    };
};



//////////////////////
//GAME TICK FUNCTION//
//////////////////////

//sets game ticks
let tick = function() {
    actualTime = Date.now();

    switch (phase) {
        case 'home':
            drawHomeScreen();

            break;
        
        case 'timeTrialSelect':
            drawTimeTrialSelect();
            drawHomeButton();

            break;

        case 'timeTrialSolo':
            steerCar();
            accelerateCar();
            playerPositionArray();

            drawRoad('FF');
            drawPauseButton();
            drawPlayer('FF', playerX, playerY, playerRotation);

            checkCollision();
            countLaps();

            writeTimes();

            checkForRestart();

            break;

        case 'pausedTimeTrialSolo':
            drawRoad('44');
            drawHomeButton();
            drawPauseButton();
            drawPlayer('99', playerX, playerY, playerRotation);

            writePauseMessage();

            break;
        
        case 'timeTrialGhost':
            steerCar();
            accelerateCar();
            playerPositionArray();

            drawRoad('FF')
            drawPauseButton();
            drawPlayer('FF', playerX, playerY, playerRotation)
            drawGhost('66', bestTimeX[raceTicks], bestTimeY[raceTicks], bestTimeRotation[raceTicks], 1, false);

            checkCollision();
            countLaps();

            writeTimes();

            checkForRestart();

            break;

        case 'pausedTimeTrialGhost':
            drawRoad('44');
            drawHomeButton();
            drawPauseButton();
            drawPlayer('99', playerX, playerY, playerRotation);
            drawGhost('22', bestTimeX[raceTicks], bestTimeY[raceTicks], bestTimeRotation[raceTicks], 0, false);

            writePauseMessage();

            break;

        case 'timeTrialView':
            drawRoad('FF');
            drawPauseButton();
            drawGhost('FF', bestTimeX[raceTicks], bestTimeY[raceTicks], bestTimeRotation[raceTicks], 1, true)

            writeBestTime();

            break;
        
        case 'pausedTimeTrialView':
            drawRoad('44');
            drawHomeButton();
            drawPauseButton();
            drawGhost('99', bestTimeX[raceTicks], bestTimeY[raceTicks], bestTimeRotation[raceTicks], 0, true);

            writePauseMessage();

            break;

        case 'startRace':
            drawRoad('FF');
            drawPlayer('FF', playerX, playerY, playerRotation);

            writeCountDown();

            break;

        case 'race':
            steerCar();
            accelerateCar();

            drawRoad('FF');
            drawPauseButton();
            drawPlayer('FF', playerX, playerY, playerRotation);

            checkCollision();
            countLaps();

            writeLaps();

            checkForRestart();

            break;

        case 'pausedRace':
            drawRoad('44');
            drawHomeButton();
            drawPauseButton();
            drawPlayer('99', playerX, playerY, playerRotation);

            writePauseMessage();

            break;
    }; 

    setTimeout(tick, (1000/60));
};

//runs functions to start game
eventListeners();
tick();


///////////////////
//NOTES FOR LATER//
///////////////////

//check raceVariables and timeTrialVariables, they are currently the same
//make races count laps properly and end after 3 laps