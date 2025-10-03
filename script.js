//Variables

//The snake
let snake = [{x: 150, y: 150}, {x: 140, y: 150}, {x: 130, y: 150}, {x: 120, y: 150}];
//Snake food coordinates
let xcoord; 
let ycoord;
//Snake movement parameters
let advancex = 10;
let advancey = 0;
let isChangingDirection = false;
//Score
let score = 0;

//Constants

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const black = 'rgb(0, 0, 0)'

//Events

main(); //Starts the game
foodCoords(); //Initiallizes the food in a random place
document.addEventListener("keydown", changeDirection); //Checks if a key is pressed and calls the function for changing movement

//Functions

function main(){
    if (gameOver()){
        deathScreen();
        return true;
    }
    setTimeout(function onTick(){
        isChangingDirection = false;
        blankGameBox();
        foodBody();
        movement();
        drawSnake();
        main()
    }, 100)
}

function blankGameBox(){
    context.fillStyle = 'white'; //Sets the color to fill the canvas as white
    context.strokeStyle = black; //Sets the color of the canvas outline as black
    context.fillRect(0, 0, canvas.width, canvas.height); //Fills the canvas with the designated color, same principle
    context.strokeRect(0, 0, canvas.width, canvas.height); //Draws the outline with the designated color from the starting x/y coordinates to the total height and width of the square
}

function gameOver(){
    //Checks if the snake ate itself
    for (let i = 3; i < snake.length; i++){
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    //Checks if the snake hit any of the walls
    const hitleftwall = snake[0].x < 0;
    const hitrightwall = snake[0].x > canvas.width - 10;
    const hittopwall = snake[0].y < 0;
    const hitbottomwall = snake[0].y > canvas.height - 10;

    return hitleftwall || hitrightwall || hittopwall || hitbottomwall
}
function deathScreen(){
    context.textAlign = 'center';
    context.font = '20px monospace';
    context.fillStyle = black;
    context.fillText("Game over! Press any key to restart", (canvas.width / 2), (canvas.height / 2))
    document.addEventListener("keydown", function restart(){
         document.location.reload();
    })
}

//Makes the actual body of the snake
function snakeSection(section){
    context.fillStyle = 'rgb(246, 66, 127)';
    context.strokestyle = black;
    context.fillRect(section.x, section.y, 10, 10);
    context.strokeRect(section.x, section.y, 10, 10);
}

function drawSnake(){
    snake.forEach(snakeSection)
}
//Generates the snake's food
function randomCoords(min, max){
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}
function foodCoords(){
    xcoord = randomCoords(0, canvas.width - 10);
    ycoord = randomCoords(0, canvas.height - 10);

    //Checks if the food was generated in the snake's body
    snake.forEach(function isFoodOnSnake(section){
        const foodOnSnake = section.x == xcoord && section.y == ycoord;
        if (foodOnSnake){
            foodCoords();
        }
    })
}
function foodBody(){
    context.fillStyle = 'rgb(63, 246, 250)';
    context.strokestyle = black;
    context.fillRect(xcoord, ycoord, 10, 10);
    context.strokeRect(xcoord, ycoord, 10, 10);
}

//Snake movement functions
function movement(){
    const snakehead = {x: snake[0].x + advancex, y: snake[0].y + advancey}
    snake.unshift(snakehead); //Adds the new element (the 'head') to the top of the snake array

    const ateFood = snake[0].x === xcoord && snake[0].y === ycoord;
    if (ateFood){
        score += 10;
        document.getElementById("score").innerHTML = score;

        foodCoords();
    } else {
        snake.pop();
    }
}
function changeDirection(event){
    const leftkey = 37;
    const rightkey = 39;
    const upkey = 38;
    const downkey = 40;

    const keypress = event.keyCode;
    const up = advancey === -10;
    const down = advancey === 10;
    const right = advancex === 10;
    const left = advancex === -10;

    //checks if the snake has changed direction, preventing reversing by fast direction changes
    if (isChangingDirection){
        return true;
    }
    isChangingDirection = true;

    //performs the changes on the snake's direction, with the part after the '&&' added to prevent reversing
    if (keypress === leftkey && !right){
        advancex = -10;
        advancey = 0;
    }
    if (keypress === rightkey && !left){
        advancex = 10;
        advancey = 0;
    }
    if (keypress === upkey && !down){
        advancex = 0;
        advancey = -10;
    }
    if (keypress === downkey && !up){
        advancex = 0;
        advancey = 10;
    }
}
