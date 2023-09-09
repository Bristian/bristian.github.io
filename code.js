var rows = 39;
var cols = 79;

var playing = false;

var grid = new Array(rows);
var nextGrid = new Array(rows);

var timer;
var reproductionTime = 1000;

function initializeGrids() {
    for (var i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

function resetGrids() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function copyAndResetGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

// Initialize
function initialize() {
    createTable();
    initializeGrids();
    resetGrids();
    //setupControlButtons();

    
    setRandomDots();
    initializeSegments(); 
    updateDigits();

    play();
 
}

// Lay out the board
function createTable() {
    var gridContainer = document.getElementById('gridContainer');
    if (!gridContainer) {
        // Throw error
        console.error("Problem: No div for the drid table!");
    }
    var table = document.createElement("table");
    
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {//
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);

    }

    function cellClickHandler() {
        var rowcol = this.id.split("_");
        var row = rowcol[0];
        var col = rowcol[1];
        
        var classes = this.getAttribute("class");
        if(classes.indexOf("live") > -1) {
            this.setAttribute("class", "dead");
            grid[row][col] = 0;
        } else {
            this.setAttribute("class", "live");
            grid[row][col] = 1;
        }
        
    }

    function updateView() {

        initializeSegments();
        updateDigits();
            
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    var cell = document.getElementById(i + "_" + j);
                    if (cell.getAttribute("class")!="time"){
                        if (grid[i][j] == 0) {
                            cell.setAttribute("class", "dead");
                        } else if (grid[i][j] == 1){
                            cell.setAttribute("class", "live");
                        } 
                    }
                }
            }

    }

function setupControlButtons() {
    // button to start
    var startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;
    
    // button to clear
    var clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;
    
    // button to set random initial state
    var randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;
}

function setRandomDots(){
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var isLive = Math.round(Math.random());
            if (isLive == 1) {
                var cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}

function randomButtonHandler() {
    if (playing) return;
    clearButtonHandler();
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var isLive = Math.round(Math.random());
            if (isLive == 1) {
                var cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}

// run the life game
function play() {
    computeNextGen();
    playing = true;
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function computeNextGen() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    
    // copy NextGrid to grid, and reset nextGrid
    copyAndResetGrid();
    // copy all 1 values to "live" in the table
    updateView();
}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

function applyRules(row, col) {
    var numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
            if (numNeighbors == 3) {
                nextGrid[row][col] = 1;
            }
        }
    }
    
function countNeighbors(row, col) {
    var count = 0;
    if (row-1 >= 0) {
        if (grid[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < cols) {
        if (grid[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (grid[row][col-1] == 1) count++;
    }
    if (col+1 < cols) {
        if (grid[row][col+1] == 1) count++;
    }
    if (row+1 < rows) {
        if (grid[row+1][col] == 1) count++;
    }
    if (row+1 < rows && col-1 >= 0) {
        if (grid[row+1][col-1] == 1) count++;
    }
    if (row+1 < rows && col+1 < cols) {
        if (grid[row+1][col+1] == 1) count++;
    }
    return count;
}

function updateDigits(){
    var now = new Date();

    var hours_number = now.getHours();
    var hours = "0";
    if (hours_number<10){
        hours = hours + hours_number.toString();
    }else hours = hours_number.toString();

    var minutes_number = now.getMinutes();
    var minutes = "0";
    if (minutes_number<10){
        minutes = minutes + minutes_number.toString();
    }else minutes = minutes_number.toString();

    var seconds_number = now.getSeconds();
    var seconds = "0";
    if (seconds_number<10){
        seconds = seconds + seconds_number.toString();
    }else seconds = seconds_number.toString();
    console.log(`the time is ${hours}:${minutes}.`);

    var hours_digit1 = parseInt(hours[0]);
    var hours_digit2 = parseInt(hours[1]);

    var minutes_digit1 = parseInt(minutes[0]);
    var minutes_digit2 = parseInt(minutes[1]);

    var seconds_digit1 = parseInt(seconds[0]);
    var seconds_digit2 = parseInt(seconds[1]);

    //console.log(`zero: ${minutes_digit1}, one: ${minutes_digit2}.`);

    setDigitOnGrid(hours_digit1, 1);
    setDigitOnGrid(hours_digit2, 2);
    setDigitOnGrid(minutes_digit1, 3);
    setDigitOnGrid(minutes_digit2, 4);
    setDigitOnGrid(seconds_digit1, 5);
    setDigitOnGrid(seconds_digit2, 6);
}

function initializeSegments(){
    // FIRST HOUR
    cell = document.getElementById(19 + "_" + 40);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(20 + "_" + 40);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(21 + "_" + 40);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(22 + "_" + 40);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(24 + "_" + 40);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(25 + "_" + 40);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(26 + "_" + 40);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(27 + "_" + 40);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(18 + "_" + 41);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(23 + "_" + 41);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(28 + "_" + 41);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(18 + "_" + 42);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(23 + "_" + 42);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(28 + "_" + 42);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(19 + "_" + 43);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(20 + "_" + 43);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(21 + "_" + 43);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(22 + "_" + 43);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(24 + "_" + 43);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(25 + "_" + 43);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(26 + "_" + 43);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(27 + "_" + 43);
    cell.setAttribute("class", "dead");

    // SECOND HOUR

    cell = document.getElementById(19 + "_" + 45);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(20 + "_" + 45);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(21 + "_" + 45);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(22 + "_" + 45);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(24 + "_" + 45);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(25 + "_" + 45);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(26 + "_" + 45);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(27 + "_" + 45);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(18 + "_" + 46);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(23 + "_" + 46);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(28 + "_" + 46);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(18 + "_" + 47);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(23 + "_" + 47);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(28 + "_" + 47);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(19 + "_" + 48);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(20 + "_" + 48);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(21 + "_" + 48);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(22 + "_" + 48);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(24 + "_" + 48);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(25 + "_" + 48);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(26 + "_" + 48);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(27 + "_" + 48);
    cell.setAttribute("class", "dead");

    // SEPARATOR

    cell = document.getElementById(22 + "_" + 50);
    cell.setAttribute("class", "time");
    cell = document.getElementById(24 + "_" + 50);
    cell.setAttribute("class", "time");

    // FIRST MINUTE

    cell = document.getElementById(19 + "_" + 52);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(20 + "_" + 52);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(21 + "_" + 52);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(22 + "_" + 52);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(24 + "_" + 52);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(25 + "_" + 52);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(26 + "_" + 52);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(27 + "_" + 52);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(18 + "_" + 53);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(23 + "_" + 53);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(28 + "_" + 53);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(18 + "_" + 54);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(23 + "_" + 54);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(28 + "_" + 54);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(19 + "_" + 55);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(20 + "_" + 55);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(21 + "_" + 55);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(22 + "_" + 55);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(24 + "_" + 55);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(25 + "_" + 55);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(26 + "_" + 55);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(27 + "_" + 55);
    cell.setAttribute("class", "dead");

    // SECOND MINUTE

    cell = document.getElementById(19 + "_" + 57);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(20 + "_" + 57);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(21 + "_" + 57);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(22 + "_" + 57);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(24 + "_" + 57);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(25 + "_" + 57);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(26 + "_" + 57);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(27 + "_" + 57);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(18 + "_" + 58);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(23 + "_" + 58);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(28 + "_" + 58);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(18 + "_" + 59);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(23 + "_" + 59);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(28 + "_" + 59);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(19 + "_" + 60);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(20 + "_" + 60);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(21 + "_" + 60);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(22 + "_" + 60);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(24 + "_" + 60);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(25 + "_" + 60);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(26 + "_" + 60);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(27 + "_" + 60);
    cell.setAttribute("class", "dead");

    // SEPARATOR

    cell = document.getElementById(22 + "_" + 62);
    cell.setAttribute("class", "time");
    cell = document.getElementById(24 + "_" + 62);
    cell.setAttribute("class", "time");

    // FIRST SECOND

    cell = document.getElementById(19 + "_" + 64);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(20 + "_" + 64);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(21 + "_" + 64);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(22 + "_" + 64);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(24 + "_" + 64);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(25 + "_" + 64);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(26 + "_" + 64);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(27 + "_" + 64);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(18 + "_" + 65);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(23 + "_" + 65);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(28 + "_" + 65);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(18 + "_" + 66);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(23 + "_" + 66);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(28 + "_" + 66);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(19 + "_" + 67);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(20 + "_" + 67);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(21 + "_" + 67);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(22 + "_" + 67);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(24 + "_" + 67);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(25 + "_" + 67);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(26 + "_" + 67);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(27 + "_" + 67);
    cell.setAttribute("class", "dead");

    // SECOND SECOND

    cell = document.getElementById(19 + "_" + 69);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(20 + "_" + 69);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(21 + "_" + 69);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(22 + "_" + 69);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(24 + "_" + 69);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(25 + "_" + 69);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(26 + "_" + 69);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(27 + "_" + 69);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(18 + "_" + 70);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(23 + "_" + 70);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(28 + "_" + 70);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(18 + "_" + 71);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(23 + "_" + 71);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(28 + "_" + 71);
    cell.setAttribute("class", "dead");

    cell = document.getElementById(19 + "_" + 72);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(20 + "_" + 72);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(21 + "_" + 72);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(22 + "_" + 72);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(24 + "_" + 72);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(25 + "_" + 72);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(26 + "_" + 72);
    cell.setAttribute("class", "dead");
    cell = document.getElementById(27 + "_" + 72);
    cell.setAttribute("class", "dead");
}

function setDigitOnGrid(digit, position){
    
    y=0;
    if (position==2){
        y = 5;
    }
    if (position==3){
        y = 12;
    }
    if (position==4){
        y = 17;
    }
    if (position==5){
        y = 24;
    }
    if (position==6){
        y = 29;
    }

    if(digit == 0){
        cell = document.getElementById(19 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(20 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(21 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(22 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(24 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(25 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(26 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(27 + "_" + (40+y));
        cell.setAttribute("class", "time");
    
        cell = document.getElementById(18 + "_" + (41+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(28 + "_" + (41+y));
        cell.setAttribute("class", "time");
    
        cell = document.getElementById(18 + "_" + (42+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(28 + "_" + (42+y));
        cell.setAttribute("class", "time");
    
        cell = document.getElementById(19 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(20 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(21 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(22 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(24 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(25 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(26 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(27 + "_" + (43+y));
        cell.setAttribute("class", "time");
    }
    if(digit == 1){
        cell = document.getElementById(19 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(20 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(21 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(22 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(24 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(25 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(26 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(27 + "_" + (43+y));
        cell.setAttribute("class", "time");
    }

    if(digit == 2){
        cell = document.getElementById(24 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(25 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(26 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(27 + "_" + (40+y));
        cell.setAttribute("class", "time");

        cell = document.getElementById(18 + "_" + (41+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(23 + "_" + (41+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(28 + "_" + (41+y));
        cell.setAttribute("class", "time");

        cell = document.getElementById(18 + "_" + (42+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(23 + "_" + (42+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(28 + "_" + (42+y));
        cell.setAttribute("class", "time");

        cell = document.getElementById(19 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(20 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(21 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(22 + "_" + (43+y));
        cell.setAttribute("class", "time");
    }
    if(digit == 3){  
        cell = document.getElementById(18 + "_" + (41+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(23 + "_" + (41+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(28 + "_" + (41+y));
        cell.setAttribute("class", "time");
    
        cell = document.getElementById(18 + "_" + (42+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(23 + "_" + (42+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(28 + "_" + (42+y));
        cell.setAttribute("class", "time");
    
        cell = document.getElementById(19 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(20 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(21 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(22 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(24 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(25 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(26 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(27 + "_" + (43+y));
        cell.setAttribute("class", "time");
    }
    if(digit == 4){
        cell = document.getElementById(19 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(20 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(21 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(22 + "_" + (40+y));
        cell.setAttribute("class", "time");

        cell = document.getElementById(23 + "_" + (41+y));
        cell.setAttribute("class", "time");

        cell = document.getElementById(23 + "_" + (42+y));
        cell.setAttribute("class", "time");

        cell = document.getElementById(19 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(20 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(21 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(22 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(24 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(25 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(26 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(27 + "_" + (43+y));
        cell.setAttribute("class", "time");
    }  

    if(digit == 5){
        cell = document.getElementById(19 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(20 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(21 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(22 + "_" + (40+y));
        cell.setAttribute("class", "time");

        cell = document.getElementById(18 + "_" + (41+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(23 + "_" + (41+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(28 + "_" + (41+y));
        cell.setAttribute("class", "time");

        cell = document.getElementById(18 + "_" + (42+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(23 + "_" + (42+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(28 + "_" + (42+y));
        cell.setAttribute("class", "time");

        cell = document.getElementById(24 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(25 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(26 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(27 + "_" + (43+y));
        cell.setAttribute("class", "time");
    }
    if(digit == 6){
        cell = document.getElementById(19 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(20 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(21 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(22 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(24 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(25 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(26 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(27 + "_" + (40+y));
        cell.setAttribute("class", "time");
    
        cell = document.getElementById(18 + "_" + (41+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(23 + "_" + (41+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(28 + "_" + (41+y));
        cell.setAttribute("class", "time");
    
        cell = document.getElementById(18 + "_" + (42+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(23 + "_" + (42+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(28 + "_" + (42+y));
        cell.setAttribute("class", "time");
    
        cell = document.getElementById(24 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(25 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(26 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(27 + "_" + (43+y));
        cell.setAttribute("class", "time");
    }
    if(digit == 7){
        cell = document.getElementById(18 + "_" + (41+y));
        cell.setAttribute("class", "time");

        cell = document.getElementById(18 + "_" + (42+y));
        cell.setAttribute("class", "time");

        cell = document.getElementById(19 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(20 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(21 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(22 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(24 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(25 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(26 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(27 + "_" + (43+y));
        cell.setAttribute("class", "time");
    }
    if(digit == 8){
        cell = document.getElementById(19 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(20 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(21 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(22 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(24 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(25 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(26 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(27 + "_" + (40+y));
        cell.setAttribute("class", "time");
    
        cell = document.getElementById(18 + "_" + (41+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(23 + "_" + (41+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(28 + "_" + (41+y));
        cell.setAttribute("class", "time");
    
        cell = document.getElementById(18 + "_" + (42+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(23 + "_" + (42+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(28 + "_" + (42+y));
        cell.setAttribute("class", "time");
    
        cell = document.getElementById(19 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(20 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(21 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(22 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(24 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(25 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(26 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(27 + "_" + (43+y));
        cell.setAttribute("class", "time");
    }
    if(digit == 9){
        cell = document.getElementById(19 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(20 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(21 + "_" + (40+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(22 + "_" + (40+y));
        cell.setAttribute("class", "time");
    
        cell = document.getElementById(18 + "_" + (41+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(23 + "_" + (41+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(28 + "_" + (41+y));
        cell.setAttribute("class", "time");
    
        cell = document.getElementById(18 + "_" + (42+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(23 + "_" + (42+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(28 + "_" + (42+y));
        cell.setAttribute("class", "time");
    
        cell = document.getElementById(19 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(20 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(21 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(22 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(24 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(25 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(26 + "_" + (43+y));
        cell.setAttribute("class", "time");
        cell = document.getElementById(27 + "_" + (43+y));
        cell.setAttribute("class", "time");
    }
}

// Start everything
window.onload = initialize;
