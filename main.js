////////////////////////
//INITIALIZE VARIABLES//
////////////////////////

//phase variable
//can be home, courseSelect, characterSelect, ghostSelect, drive, paused
//only switches with it are in tick() and detectClick()
let phase = 'home';

//options selected variables
let raceMode;//race or timeTrial
let courseChosen;//course 1, 2, 3, 4, tournament A1, A2, A3, A4
let characterChosen;//car 1, 2, 3
let ghostChosen;//defaultOne, player, none

//const variables for drawing
const halfLength = 15;
const halfHeight = halfLength/2;
const tileSize = 50;

//higher number is weaker grass
const grassStrength = 0.95;

//control sensitivity and speed limit variables
const rotationSpeed = 4;
const accelerationSpeed = 0.3;
const maxSpeed = 7;

//car variables
let playerX;
let playerY;
let playerRotation;
let playerRotationRad;
let playerSpeed;
let playerSpeedMultiplier;

//player hitbox variables
let playerHitboxX = [];
let playerHitboxY = [];
let playerHitboxQuadrantX = [];
let playerHitboxQuadrantY = [];
let playerHitboxOffsetX = [];
let playerHitboxOffsetY = [];

//lap detection variables
let raceSection = 0;
let lapsCompleted = 0;

//const lap variables
const lapsInRace = 3;

//time trial variables
let playerXArray = [];
let playerYArray = [];
let playerRotationArray = [];
let playerGhostXArray = [];
let playerGhostYArray = [];
let playerGhostRotationArray = [];
let courseOneGhostOneXArray = [];
let courseOneGhostOneYArray = [];
let courseOneGhostOneRotationArray = [];
let frameNumber;
let bestTime = null;

//canvas variable
let ctx = document.getElementById('canvas').getContext('2d');

//2d arrays with blocks for each racetrack
//a = grass, b = road, c-j = wall from top left clockwise, k-n inside corners from top left clockwise, o and p are finish line
let courseOne = [
    ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'],
    ['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'a'],
    ['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'a'],
    ['a', 'b', 'b', 'g', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'i', 'b', 'b', 'a'],
    ['a', 'b', 'b', 'f', 'k', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'c', 'b', 'b', 'a'],
    ['a', 'b', 'b', 'f', 'j', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'a'],
    ['a', 'b', 'b', 'f', 'j', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'a'],
    ['a', 'b', 'b', 'f', 'j', 'b', 'b', 'g', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h'],
    ['a', 'b', 'b', 'f', 'j', 'b', 'b', 'e', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
    ['a', 'b', 'b', 'f', 'j', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'a'],
    ['a', 'b', 'b', 'f', 'j', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'a'],
    ['a', 'b', 'b', 'f', 'n', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'i', 'b', 'b', 'a'],
    ['a', 'b', 'b', 'e', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'c', 'b', 'b', 'a'],
    ['a', 'b', 'b', 'b', 'b', 'b', 'o', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'a'],
    ['a', 'b', 'b', 'b', 'b', 'b', 'p', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'a'],
    ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'],
];

//course 1's checkpoints, with each one being x1, y1, x2, y2
let courseOneCheckpoints = [
    [0, 375, 200, 425],
    [375, 0, 425, 200],
    [200, 375, 400, 425],
    [300, 600, 350, 800]
];

//variable with current course
let currentCourse = courseOne;
let currentCourseCheckpoints = courseOneCheckpoints;

//event listeners
const pressedKeys = new Set();

////////////////////////////
//VARIABLE RESET FUNCTIONS//
////////////////////////////

//set variables to default for home menu
let returnToHomeVariables = function() {
    raceMode = null;
    courseChosen = null;
    characterChosen = null;
    ghostChosen = null;
};

//sets variables to default for races
let raceVariables = function() {
    playerX;
    playerY;
    playerRotation;
    playerRotationRad;
    playerSpeed;
    playerSpeedMultiplier;
    raceSection;
    lapsCompleted;
};

//sets variables to default for time trials
let timeTrialVariables = function() {
    playerX = 400;
    playerY = 700;
    playerRotation = 0;
    playerRotationRad = playerRotation * Math.PI / 180;
    playerSpeed = 0;
    playerSpeedMultiplier = 1;
    raceSection = 0;
    lapsCompleted = 0;
    playerXArray = [];
    playerYArray = [];
    playerRotationArray = [];
    frameNumber = 0;
};

////////////////////////////
//EVENT LISTENER FUNCTIONS//
////////////////////////////

//creates event listeners
let eventListeners = function() {
    //key pressed events to add to set
    window.addEventListener('keydown', e => {
        pressedKeys.add(e.code);
    });

    //key released event to remove from set
    window.addEventListener('keyup', e => {
        pressedKeys.delete(e.code);
    });

    //click event
    canvas.addEventListener('click', detectClick);
};

//detects clicks
let detectClick = function(event) {
    //get x and y of click
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    //switch for each phase's different button locations and changes after clicked
    switch (phase) {
        case 'home':
            if (100 < clickX && clickX < 700 && 200 < clickY && clickY < 300) {
                phase = 'courseSelect';
                raceMode = 'timeTrial';
                timeTrialVariables();
            } else if (100 < clickX && clickX < 700 && 500 < clickY && clickY < 600) {
                phase = 'courseSelect';
                raceMode = 'race';
                raceVariables();
            };

            break;
        
        case 'courseSelect':
            if (100 < clickX && clickX < 700 && 50 < clickY && clickY < 150) {
                phase = 'characterSelect';
                courseChosen = '1';
            } else if (100 < clickX && clickX < 700 && 250 < clickY && clickY < 350) {
                phase = 'characterSelect';
                courseChosen = '2';
            } else if (100 < clickX && clickX < 700 && 450 < clickY && clickY < 550) {
                phase = 'characterSelect';
                courseChosen = '3';
            } else if (100 < clickX && clickX < 700 && 650 < clickY && clickY < 750) {
                phase = 'characterSelect';
                courseChosen = '4';
            };
            
            break;

        case 'characterSelect':
            if (100 < clickX && clickX < 700 && 100 < clickY && clickY < 200) {
                if (raceMode = 'timeTrial') {
                    phase = 'ghostSelect';
                } else {
                    phase = 'drive';
                };
                characterChosen = '1';
            } else if (100 < clickX && clickX < 700 && 350 < clickY && clickY < 450) {
                if (raceMode = 'timeTrial') {
                    phase = 'ghostSelect';
                } else {
                    phase = 'drive';
                };
                characterChosen = '2';
            } else if (100 < clickX && clickX < 700 && 600 < clickY && clickY < 700) {
                if (raceMode = 'timeTrial') {
                    phase = 'ghostSelect';
                } else {
                    phase = 'drive';
                };
                characterChosen = '3';
            };

            break;
        
        case 'ghostSelect':
            if (100 < clickX && clickX < 700 && 100 < clickY && clickY < 200) {
                ghostChosen = 'defaultOne';
                phase = 'drive';
            } else if (100 < clickX && clickX < 700 && 350 < clickY && clickY < 450) {
                ghostChosen = 'player';
                phase = 'drive';
            } else if (100 < clickX && clickX < 700 && 600 < clickY && clickY < 700) {
                ghostChosen = 'none';
                phase = 'drive';
            };

            break;

        case 'drive':
            if (755 < clickX && clickX < 795 && 5 < clickY && clickY < 45) {
                phase = 'paused';
            };

            break;

        case 'paused':
            if (755 < clickX && clickX < 795 && 5 < clickY && clickY < 45) {
                phase = 'drive';
            };

            break;
    };

    //detect home button clicked
    if (5 < clickX && clickX < 45 && 5 < clickY && clickY < 45) {
        phase = 'home';
        returnToHomeVariables();
    };
};

//////////////////////
//MOVEMENT FUNCTIONS//
//////////////////////

//changes the playerRotation
let steerCar = function() {
    //rotate car with keys pressed
    if (pressedKeys.has('ArrowLeft')) {
        playerRotation -= rotationSpeed;
    };

    if (pressedKeys.has('ArrowRight')) {
        playerRotation += rotationSpeed;
    };

    //prevent rotating above 359 or below 0
    if (playerRotation > 359) {
        playerRotation -= 360;
    } else if (playerRotation < 0) {
        playerRotation += 360;
    };

    //convert degrees or radians for future calculations
    playerRotationRad = playerRotation * Math.PI / 180;
};

//moves the car forward or backwards
let accelerateCar = function() {
    //detect forward and backward
    if (pressedKeys.has('ArrowUp')) {
        playerSpeed += accelerationSpeed;
    };

    if (pressedKeys.has('ArrowDown')) {
        playerSpeed -= accelerationSpeed;
    };

    //decelleration when nothing pressed
    if (!pressedKeys.has('ArrowUp') && !pressedKeys.has('ArrowDown')) {
        if (playerSpeed > accelerationSpeed) {
            playerSpeed -= (accelerationSpeed/2);
        } else if (playerSpeed < (-1*accelerationSpeed)) {
            playerSpeed += (accelerationSpeed/2);
        } else {
            playerSpeed = 0;
        };
    };

    //max speed limiting
    if (playerSpeed > maxSpeed) {
        playerSpeed = maxSpeed;
    } else if (playerSpeed < (-1*maxSpeed)) {
        playerSpeed = (-1*maxSpeed);
    };

    //grass slowdown car speed
    playerSpeed *= playerSpeedMultiplier;

    //convert speed and rotation to x and y changes
    playerY += -(playerSpeed * Math.sin(playerRotationRad));
    playerX += -(playerSpeed * Math.cos(playerRotationRad));
};

//records player's position and rotation for time trials
let recordPlayerPosition = function() {
    //put current position at end of arrays
    playerXArray.push(playerX);
    playerYArray.push(playerY);
    playerRotationArray.push(playerRotation);
};

/////////////////////
//DRAWING FUNCTIONS//
/////////////////////

//draws the course
let drawCourse = function(transparancy) {
    //i is y coord, j is x coord

    //gets current quadrant, i = y, j = x
    for (let i = 0; i < currentCourse.length; i++) {
        for (let j = 0; j < currentCourse[i].length; j++) {

            //checks for road sections
            if (currentCourse[i][j] == 'b' || currentCourse[i][j] == 'o' || currentCourse[i][j] == 'p') {
                //fills road
                ctx.fillStyle = '#2e2e2e' + transparancy;
                ctx.fillRect(j*tileSize, i*tileSize, tileSize, tileSize);
                
                //checks for and draws finish line
                if (currentCourse[i][j] == 'o') {
                    ctx.fillStyle = '#ffffff' + transparancy;

                    for (let k = 0; k < 5; k++) {
                        for (let l = 0; l < 5; l++) {
                            if (k%2 + l%2 != 1) {
                                ctx.fillRect(j*tileSize + k*(tileSize/5), i*tileSize + l*(tileSize/5), tileSize/5, tileSize/5);
                            };
                        };
                    };

                } else if (currentCourse[i][j] == 'p') {
                    ctx.fillStyle = '#ffffff' + transparancy;

                    for (let k = 0; k < 5; k++) {
                        for (let l = 0; l < 5; l++) {
                            if (k%2 + l%2 == 1) {
                                ctx.fillRect(j*tileSize + k*(tileSize/5), i*tileSize + l*(tileSize/5), tileSize/5, tileSize/5);
                            };
                        };
                    };
                };
            
            //grass sections only
            } else {
                //draws grass
                ctx.fillStyle = '#00a225' + transparancy;
                ctx.fillRect(j*tileSize, i*tileSize, tileSize, tileSize);
                
                ctx.fillStyle = '#FFFF00' + transparancy;
                
                //switch with all the different wall patterns
                switch (currentCourse[i][j]) {
                    case 'a':
                        break;
                    
                    case 'c':
                        ctx.fillRect(j*tileSize, i*tileSize, tileSize/5, tileSize/5);
                        break;

                    case 'd':
                        ctx.fillRect(j*tileSize, i*tileSize, tileSize, tileSize/5);
                        break;

                    case 'e':
                        ctx.fillRect(j*tileSize + tileSize*0.8, i*tileSize, tileSize/5, tileSize/5);
                        break;

                    case 'f':
                        ctx.fillRect(j*tileSize + tileSize*0.8, i*tileSize, tileSize/5, tileSize);
                        break;

                    case 'g':
                        ctx.fillRect(j*tileSize + tileSize*0.8, i*tileSize + tileSize*0.8, tileSize/5, tileSize/5);
                        break;

                    case 'h':
                        ctx.fillRect(j*tileSize, i*tileSize + tileSize*0.8, tileSize, tileSize/5);
                        break;

                    case 'i':
                        ctx.fillRect(j*tileSize, i*tileSize + tileSize*0.8, tileSize/5, tileSize/5);
                        break;

                    case 'j':
                        ctx.fillRect(j*tileSize, i*tileSize, tileSize/5, tileSize);
                        break;

                    case 'k':
                        ctx.fillRect(j*tileSize, i*tileSize, tileSize, tileSize/5);
                        ctx.fillRect(j*tileSize, i*tileSize+tileSize/5, tileSize/5, tileSize*0.8);
                        break;

                    case 'l':
                        ctx.fillRect(j*tileSize, i*tileSize, tileSize, tileSize/5);
                        ctx.fillRect(j*tileSize + tileSize*0.8, i*tileSize+tileSize/5, tileSize/5, tileSize*0.8);
                        break;
                    
                    case 'm':
                        ctx.fillRect(j*tileSize + tileSize*0.8, i*tileSize, tileSize/5, tileSize*0.8);
                        ctx.fillRect(j*tileSize, i*tileSize + tileSize*0.8, tileSize, tileSize/5);
                        break;
                    
                    case 'n':
                        ctx.fillRect(j*tileSize, i*tileSize + tileSize*0.8, tileSize, tileSize/5);
                        ctx.fillRect(j*tileSize, i*tileSize, tileSize/5, tileSize*0.8);
                        break;
                };
            };
        };
    };
};

//draws car
let drawCar = function(colour, colourTwo, transparancy, x, y, rotation) {
    //save current rotation and translation of canvas
    ctx.save();

    //rotate and move canvas to make at coords facing rotation
    ctx.translate(x, y);
    ctx.rotate(rotation);

    //draw car wheels
    ctx.fillStyle = '#000000' + transparancy;
    ctx.fillRect((halfLength*-0.9), (halfHeight*-1.4), (halfLength*0.4), (halfHeight*0.4));
    ctx.fillRect((halfLength*-0.9), (halfHeight*1.1), (halfLength*0.4), (halfHeight*0.4));
    ctx.fillRect((halfLength*0.5), (halfHeight*-1.4), (halfLength*0.4), (halfHeight*0.4));
    ctx.fillRect((halfLength*0.5), (halfHeight*1.1), (halfLength*0.4), (halfHeight*0.4));

    //draw car body
    ctx.fillStyle = '#FF0000' + transparancy;
    ctx.fillRect((halfLength*-1), (halfHeight*-1), (halfLength*2), (halfHeight*2));

    ctx.fillStyle = '#FFFF00' + transparancy;
    ctx.fillRect((halfLength*-0.75), (halfHeight*-0.5), (halfLength*0.5), halfHeight);

    //restore canvas to normal
    ctx.restore();
};

//draws home menu
let drawHomeMenu = function() {
    //draw background
    ctx.fillStyle = '#1111AA';
    ctx.fillRect(0, 0, 800, 800);
    
    //draw buttons
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(100, 200, 600, 100);
    ctx.fillRect(100, 500, 600, 100);

    //write text on buttons
    ctx.fillStyle = '#000000';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Time Trial', 400, 265);
    ctx.fillText('Race (incomplete)', 400, 565);

    //write version number
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('v0.2.0.6', 20, 780);
};

//draws course menu
let drawCourseMenu = function() {
    //draw background
    ctx.fillStyle = '#1111AA';
    ctx.fillRect(0, 0, 800, 800);

    //draw buttons
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(100, 50, 600, 100);
    ctx.fillRect(100, 250, 600, 100);
    ctx.fillRect(100, 450, 600, 100);
    ctx.fillRect(100, 650, 600, 100);

    //write text on buttons
    ctx.fillStyle = '#000000';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Course 1', 400, 115);
    ctx.fillText('Course 2 (incomplete)', 400, 315);
    ctx.fillText('Course 3 (incomplete)', 400, 515);
    ctx.fillText('Course 4 (incomplete)', 400, 715);
};

//draws character select menu
let drawCharacterMenu = function() {
    //draw background
    ctx.fillStyle = '#1111aa';
    ctx.fillRect(0, 0, 800, 800);

    //draw buttons
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(100, 100, 600, 100);
    ctx.fillRect(100, 350, 600, 100);
    ctx.fillRect(100, 600, 600, 100);

    //write text on buttons
    ctx.fillStyle = '#000000';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Car 1', 400, 165);
    ctx.fillText('Car 2 (incomplete)', 400, 415);
    ctx.fillText('Car 3 (incomplete)', 400, 665);
};

//draws home button
let drawHomeButton = function() {
    //draw button background
    ctx.fillStyle = '#9E9E9E';
    ctx.fillRect(5, 5, 40, 40);

    //draw home symbol
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
    //draw background
    ctx.fillStyle = '#9E9E9E';
    ctx.fillRect(755, 5, 40, 40);

    //draw pause symbol
    ctx.fillStyle = '#000000';
    ctx.fillRect(762, 10, 10, 30);
    ctx.fillRect(778, 10, 10, 30);
};

//draws pause drawPauseMessage
let drawPauseMessage = function() {
    ctx.fillStyle = '#000000FF';
    ctx.font = '75px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Paused', 400, 420);
};

//draws time trial ghost selection screen
let drawTimeTrialMenu = function() {
    //draw background
    ctx.fillStyle = '#111188';
    ctx.fillRect(0, 0, 800, 800);

    //draw buttons
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(100, 100, 600, 100);
    ctx.fillRect(100, 350, 600, 100);
    ctx.fillRect(100, 600, 600, 100);

    //write text on buttons
    ctx.fillStyle = '#000000';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Default ghost', 400, 165);
    ctx.fillText('Player ghost', 400, 415);
    ctx.fillText('No ghost', 400, 665);
};

//draws current time
let drawCurrentTime = function() {
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText((frameNumber/60).toFixed(3), 20, 780);
};

///////////////////////
//COLLISION FUNCTIONS//
///////////////////////

//gets coordinates of the hitbox's corners
let getHitbox = function() {
    //top left corner
    playerHitboxX[0] = (-halfLength*Math.cos(playerRotationRad) - halfHeight*Math.sin(playerRotationRad)) + playerX;
    playerHitboxY[0] = (-halfLength*Math.sin(playerRotationRad) + halfHeight*Math.cos(playerRotationRad)) + playerY;

    //top right corner
    playerHitboxX[1] = (-halfLength*Math.cos(playerRotationRad) - -halfHeight*Math.sin(playerRotationRad)) + playerX;
    playerHitboxY[1] = (-halfLength*Math.sin(playerRotationRad) + -halfHeight*Math.cos(playerRotationRad)) + playerY;

    //bottom right corner
    playerHitboxX[2] = (halfLength*Math.cos(playerRotationRad) - -halfHeight*Math.sin(playerRotationRad)) + playerX;
    playerHitboxY[2] = (halfLength*Math.sin(playerRotationRad) + -halfHeight*Math.cos(playerRotationRad)) + playerY;

    //bottom left corner
    playerHitboxX[3] = (halfLength*Math.cos(playerRotationRad) - halfHeight*Math.sin(playerRotationRad)) + playerX;
    playerHitboxY[3] = (halfLength*Math.sin(playerRotationRad) + halfHeight*Math.cos(playerRotationRad)) + playerY;
};

//gets the quadrant that each hitbox corner is in
let getPlayerQuadrant = function() {
    for (let i = 0; i < 4; i++) {
        //get x and y quadrant for hitbox corners
        playerHitboxQuadrantX[i] = Math.floor(playerHitboxX[i] / 50);
        playerHitboxQuadrantY[i] = Math.floor(playerHitboxY[i] / 50);

        //prevent leaving quadrants
        if (playerHitboxQuadrantX[i] < 0) {playerHitboxQuadrantX[i] = 0};
        if (playerHitboxQuadrantX[i] > 15) {playerHitboxQuadrantX[i] = 15};
        if (playerHitboxQuadrantY[i] < 0) {playerHitboxQuadrantY[i] = 0};
        if (playerHitboxQuadrantY[i] > 15) {playerHitboxQuadrantY[i] = 15};

        //get offset from x and y quadrant
        playerHitboxOffsetX[i] = Math.floor(playerHitboxX[i] % 50);
        playerHitboxOffsetY[i] = Math.floor(playerHitboxY[i] % 50);        
    };
};

//stops driving of the end of the canvas
let checkBoundaryCollision = function() {
    //check left wall
    if (playerHitboxX.some(x => x < 1)) {
        playerSpeed = (playerRotation < 90 || playerRotation > 270) ? -1 : 1;
    };

    //check right wall
    if (playerHitboxX.some(x => x > 799)) {
        playerSpeed = (playerRotation > 90 && playerRotation < 270) ? -1 : 1;
    };

    //check top wall
    if (playerHitboxY.some(x => x < 1)) {
        playerSpeed = (playerRotation < 180 && playerRotation > 0) ? -1 : 1;
    };

    //check bottom wall
    if (playerHitboxY.some(x => x > 799)) {
        playerSpeed = (playerRotation > 180 && playerRotation < 360) ? -1 : 1;
    };
};

//adds wall collision
let checkWallCollision = function() {
    //do with playerHitboxQuadrantX and playerHitboxOffsetX

    for (let i = 0; i < 4; i++) {
        let quadrant = currentCourse[playerHitboxQuadrantY[i]][playerHitboxQuadrantX[i]];

        //top wall, top left inside corner, top right inside corner
        if (['d', 'k', 'l'].some(x => x == quadrant)) {
            if (playerHitboxOffsetY[i] <= 10) {
                playerSpeed = (playerRotation <= 180 && playerRotation >= 0) ? -1 : 1;
            };
        };

        //right wall, top right inside corner, bottom right inside corner
        if (['f', 'l', 'm'].some(x => x == quadrant)) {
            if (playerHitboxOffsetX[i] >= 40) {
                playerSpeed = (playerRotation >= 90 && playerRotation <= 270) ? -1 : 1;
            };
        };

        //bottom wall, bottom right inside corner, bottom left inside corner
        if (['h', 'm', 'n'].some(x => x == quadrant)) {
            if (playerHitboxOffsetY[i] >= 40) {
                playerSpeed = (playerRotation >= 180 && playerRotation <= 360) ? -1 : 1;
            };
        };

        //left wall, bottom left inside corner, top left inside corner
        if (['j', 'n', 'k'].some(x => x == quadrant)) {
            if (playerHitboxOffsetX[i] <= 10) {
                playerSpeed = (playerRotation <= 90 || playerRotation >= 270) ? -1 : 1;
            };
        };

        //top left corner
        if (quadrant == 'c') {
            if (playerHitboxOffsetX[i] <= 10 && playerHitboxOffsetY[i] <= 10) {
                if ((playerRotation >= 90 && playerRotation <= 180) || playerRotation >= 270) {
                    if (i <= 1) {
                        playerSpeed = -1;
                    } else {
                        playerSpeed = 1;
                    };
                } else if (playerRotation <= 90) {
                    playerSpeed = -1;
                } else {
                    playerSpeed = 1;
                };
            };
        };

        //top right corner
        if (quadrant == 'e') {
            if (playerHitboxOffsetX[i] >= 40 && playerHitboxOffsetY[i] <= 10) {
                if (playerRotation <= 90 || (playerRotation >= 180 && playerRotation <= 270)) {
                    if (i <= 1) {
                        playerSpeed = -1;
                    } else {
                        playerSpeed = 1;
                    };
                } else if (playerRotation >= 90 && playerRotation <= 180) {
                    playerSpeed = -1;
                } else {
                    playerSpeed = 1;
                };
            };
        };

        //bottom right corner
        if (quadrant == 'g') {
            if (playerHitboxOffsetX[i] >= 40 && playerHitboxOffsetY[i] >= 40) {
                if ((playerRotation <= 90 && playerRotation <= 180) || playerRotation >= 270) {
                    if (i <= 1) {
                        playerSpeed = -1;
                    } else {
                        playerSpeed = 1;
                    };
                } else if (playerRotation >= 180 && playerRotation <= 270) {
                    playerSpeed = -1;
                } else {
                    playerSpeed = 1;
                };
            };
        };
        
        //bottom left corner
        if (quadrant == 'i') {
            if (playerHitboxOffsetX[i] <= 10 && playerHitboxOffsetY[i] >= 40) {
                if (playerRotation <= 90 || (playerRotation >= 180 && playerRotation <= 270)) {
                    if (i <= 1) {
                        playerSpeed = -1;
                    } else {
                        playerSpeed = 1;
                    };
                } else if (playerRotation >= 270) {
                    playerSpeed = -1;
                } else {
                    playerSpeed = 1;
                };
            };
        };
    };
};

//adds grass collsion
let checkGrassCollision = function() {
    playerSpeedMultiplier = 1;

    for (let i = 0; i < 4; i++) {
        let quadrant = currentCourse[playerHitboxQuadrantY[i]][playerHitboxQuadrantX[i]];

        if (!['b', 'o', 'p'].some(x => x == quadrant)) {
            playerSpeedMultiplier *= grassStrength;
        };
    };
};

///////////////////////////
//LAP DETECTION FUNCTIONS//
///////////////////////////

//checks if a car is inside a checkpoint
let checkCheckpoint = function(x1, y1, x2, y2) {
    if (playerX > x1 && playerX < x2 && playerY > y1 && playerY < y2) {
        raceSection += 1;
        if (raceSection > 3) {
            raceSection = 0;
            countLap();
        };
    };
};

//counts laps
let countLap = function() {
    lapsCompleted++;

    if (lapsCompleted == lapsInRace) {
        lapsCompleted = 0;

        if (raceMode = "timeTrial") {
            if (frameNumber < bestTime || bestTime == null) {
                playerGhostXArray = playerXArray;
                playerGhostYArray = playerYArray;
                playerGhostRotationArray = playerRotationArray;
                bestTime = frameNumber;
            };

            playerXArray = [];
            playerYArray = [];
            playerRotationArray = [];
            frameNumber = 0;
        };
    };
};

let tick = function() {
    //change player coordinates and rotation
    if (phase == 'drive') {
        //move car
        steerCar();
        accelerateCar();

        //wall and boundary collision
        getHitbox();
        getPlayerQuadrant();
        
        checkBoundaryCollision();
        checkWallCollision();
        checkGrassCollision();

        //track player movements for time trial
        if (raceMode = 'timeTrial') {
            recordPlayerPosition();
        };
    };

    //drawing
    switch (phase) {
        case 'home':
            drawHomeMenu();
            break;

        case 'courseSelect':
            drawCourseMenu();
            break;
        
        case 'characterSelect':
            drawCharacterMenu();
            break;

        case 'ghostSelect':
            drawTimeTrialMenu();
            break;

        case 'drive':
            drawCourse('FF');
            drawCar('FF0000', 'FF9900', 'FF', playerX, playerY, playerRotationRad);
            drawCurrentTime();

            if (raceMode == 'timeTrial' && frameNumber < playerGhostXArray.length && ghostChosen != 'none') {
                //draw ghost
                drawCar('FF0000', 'FF9900', '88', playerGhostXArray[frameNumber], playerGhostYArray[frameNumber], playerGhostRotationArray[frameNumber] * (Math.PI/180));
            } else if (raceMode == 'race') {
                //draw opponents
            };

            //update frame number
            frameNumber++

            drawPauseButton();
            break;
        
        case 'paused':
            drawCourse('55');
            drawCar('FF0000', 'FF9900', '99', playerX, playerY, playerRotationRad);
            if (raceMode == 'timeTrial' && frameNumber < playerGhostXArray.length && ghostChosen != 'none') {
                //draw ghost
                drawCar('FF0000', 'FF9900', '33', playerGhostXArray[frameNumber], playerGhostYArray[frameNumber], playerGhostRotationArray[frameNumber] * (Math.PI/180));
            } else if (raceMode == 'race') {
                //draw opponents
            };

            drawPauseButton();
            drawPauseMessage();
            break;
    };

    drawHomeButton();

    //lap detection
    if (phase == 'drive') {
        checkCheckpoint(currentCourseCheckpoints[raceSection][0], currentCourseCheckpoints[raceSection][1], currentCourseCheckpoints[raceSection][2], currentCourseCheckpoints[raceSection][3]);
    };

    //run next tick
    setTimeout(tick, (1000/60));
};

//run the event listeners and the tick for the game
eventListeners();
tick();