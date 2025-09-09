// Game Constants And Variables
let inputDir = {x:0, y:0};
const gameOverSound = new Audio('gameover.mp3');
const musicSound = new Audio('music.mp3');
const moveSound = new Audio('move.mp3');
const foodSound =new Audio('food.mp3');
let scoreBox =document.getElementById('scoreBox');
let speed=14;
let score=0;
let lastPaintTime=0;
let snakeArr = [ randomStart() ];
food = randomFood();

function randomStart() {
    let a = 2, b = 16;   // keep it inside safe bounds (not at 0 or 18)
    return {
        x: Math.floor(a + (b-a) * Math.random()),
        y: Math.floor(a + (b-a) * Math.random())
    };
}

// Game Functions
function main(ctime){
    window.requestAnimationFrame(main);
    if((ctime-lastPaintTime)/1000 < 1/speed){
        return;
    }
    //console.log(ctime);
    lastPaintTime=ctime;
    gameEngine();
}

function isCollide(snake){
    // If you bump into yourself
    for(let i=1; i<snake.length; i++){
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    
    // If you bump into the wall
    if(snake[0].x>=18 || snake[0].x<=1 || snake[0].y>=18 || snake[0].y<=1){
        return true;
    }
    return false;
}

function randomFood() {
    let a = 2, b = 16;
    let newFood;
    do {
        newFood = {
            x: Math.floor(a + (b-a) * Math.random()),
            y: Math.floor(a + (b-a) * Math.random())
        };
    } while (snakeArr.some(seg => seg.x === newFood.x && seg.y === newFood.y)); 
    return newFood;
}

function gameEngine(){
    // Part-1 : Updating the snake variable(array)
    if(isCollide(snakeArr)){
        gameOverSound.play();
        //musicSound.pause();
        inputDir = {x:0, y:0};
        alert("Game Over!! Press any key to play again.");
        snakeArr = [ randomStart() ];

        // musicSound.play();
        score=0;
        scoreBox.innerHTML = "Score : 0";
    }

    // If you have eaten the food, increment the score and regenerate the food
    if(snakeArr[0].x === food.x && snakeArr[0].y === food.y){
        foodSound.play();
        score=score+1;
        if(score>hiscoreval){
            hiscoreval=score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML="High-Score :"+hiscoreval;
        }
        scoreBox.innerHTML = "Score :" + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        food = randomFood();
    }

    //Moving the Snake
    for(let i=snakeArr.length-2; i>=0; i--){
        snakeArr[i+1]={...snakeArr[i]};
    }
    snakeArr[0].x+=inputDir.x;
    snakeArr[0].y+=inputDir.y;

    // Part-2 : Display the snake
    board.innerHTML="";
    snakeArr.forEach((e,index)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if(index===0){
            snakeElement.classList.add('head');
        }else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // Part-3 : Display the Food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main Function Logic
let hiscore = localStorage.getItem("hiscore");
if(hiscore===null){
    hiscoreval=0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
}else{
    hiscoreval=JSON.parse(hiscore);
    hiscoreBox.innerHTML="High-Score :" + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e=>{
    moveSound.play();
    if(e.key==="ArrowUp" && inputDir.y!=1){
        inputDir.x=0;
        inputDir.y=-1;
    }else if(e.key==="ArrowDown" && inputDir.y!=-1){
        inputDir.x=0;
        inputDir.y=1;
    }else if(e.key==="ArrowLeft" && inputDir.x!=1){
        inputDir.x=-1;
        inputDir.y=0;
    }else if(e.key==="ArrowRight" && inputDir.x!=-1){
        inputDir.x=1;
        inputDir.y=0;
    }else{
        gameOverSound.play();
        //musicSound.pause();
        inputDir = {x:0, y:0};
        alert("Game Over!! Press any key to play again.");
        snakeArr = [ randomStart() ];
        // musicSound.play();
        score=0;
        scoreBox.innerHTML = "Score : 0";
    }
});

let speedControl = document.getElementById("speedControl");
let speedValue = document.getElementById("speedValue");

speedControl.addEventListener("input", () => {
    speed = parseInt(speedControl.value);
    speedValue.textContent = speed;
});

