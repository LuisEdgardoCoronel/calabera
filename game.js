const canvas = document.querySelector('#game');
const game = canvas.getContext('2d'); //en contexto para el canvas
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const spanLives = document.querySelector('#lives');
const spanRecord = document.querySelector('#record');
const spanTime = document.querySelector('#time');
const pResult = document.querySelector('#result');
//ventanas de mensajes
const winner = document.querySelector('#winner');
const reiniciarWinner = document.querySelector('#reiniciarWinner');
const returnWinner = document.querySelector('#returnWinner');
const gameOver = document.querySelector('#game-over');
const reiniciarGameOver = document.querySelector('#reiniciarGameOver');
const returnGameOver = document.querySelector('#returnGameOver');

//variables para el tamaño del canva
let canvasSize;
let iconSize;

//icono del jugador
const playerPosition = {
    x: undefined,
    y: undefined,
}

//icono del regalo
const giftPosition = {
    x: undefined,
    y: undefined,
}

//bombas
let enemyPositions = [];

//contador de niveles
let level = 0;

//contador de vidas
let lives = 3;

//contador de tiempo
let timeStart;
let timePlayer;
let timeInterval;


//comandos para mover la calabera
window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click', moveUp);
btnDown.addEventListener('click', moveDown);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);


//iniciar el juego y actualiza el tamaño del canvas
window.addEventListener('load', startGame);
window.addEventListener('resize', setGameSize);







function setGameSize(){
    //tamaño del canvas
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7
    }else{
        canvasSize = window.innerHeight * 0.7
    }
    canvasSize = Number(canvasSize.toFixed(0))
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    iconSize = canvasSize/10;
}







function startGame() {
    setGameSize();
    //tamaño de iconos en canvas
    game.font = iconSize-3+ 'px Verdana';
    game.textAlign = 'end';

    //correr tiempo y mostrar record
    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    renderMap();
    
    //ubicar el player
    if (level<=maps.length-1) {
        movePlayer()
    }
}






function renderMap(){
    //mostrar el mapa
    const map = maps[level];
    const mapRow = map.trim().split('\n')
    const mapCol = mapRow.map(row => row.trim().split(''))

    //mostramos las vidas
    showLives();

    //limpiamos el array de posiciones enemigas
    enemyPositions = []

    //limpiamos la pantalla
    game.clearRect(0,0,canvasSize, canvasSize)
    mapCol.forEach((row, rowIndex) =>{
        row.forEach( (col, colIndex) =>{
            const emoji = emojis[col];
            const positionX = iconSize*(colIndex+1.2);
            const positionY = iconSize*(rowIndex+0.8);

            // ubicamos el jugador con la puerta
            if(col == 'O' & playerPosition.x ==undefined & playerPosition.y == undefined){
                playerPosition.x = positionX;
                playerPosition.y = positionY;
            }
            //Guardamos position del regalito
            if(col == 'I'){
                giftPosition.x = positionX;
                giftPosition.y = positionY;
            }
            //guardamos las bombas
            if(col == 'X'){
                enemyPositions.push({
                    x: positionX,
                    y: positionY,
                })
            }
            //dibujamos el icono
            game.fillText(emoji,positionX,positionY)
        })
    })
}











function movePlayer(){
    //buscamos colision con el regalito
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const winCollision = giftCollisionX && giftCollisionY

    if (winCollision) {
        levelWin()
    }

    //buscamos si existe una colision contra una bomba
    const enemyCollision = enemyPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY
    })

    if (enemyCollision) {
        levelFail();
    }


    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y)
}













function levelWin(){
    if ((level+1)<maps.length) {
        level++;
        startGame();
    }else{
        gameWin()
    }
}



function levelFail(){
    lives--;
    if (lives<=0) {
        emojis['X'] = '☠️'
        gameOver.classList.remove('disenabled');
    }
    playerPosition.x= undefined;
    playerPosition.y=undefined;
    startGame();
}
















function gameWin(){
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = ((Date.now() - timeStart)/1000).toFixed(0);

    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML='Superaste el record 🏆';
        }else{
            pResult.innerHTML='No superaste el record';
        }
    }else{
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML='Nuevo tiempo registrado';
    }
    emojis['X'] = '🏆';
    renderMap();
    winner.classList.remove('disenabled');
}












function showLives(){
    spanLives.innerHTML= emojis['HEART'].repeat(lives)
}



function showTime(){
    spanTime.innerHTML = ((Date.now() - timeStart)/1000).toFixed(0);
}


function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time')
}









function moveByKeys(event) {
    switch (event.code) {
        case 'ArrowUp':
            moveUp()
            break;
        case 'ArrowDown':
            moveDown()
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        default:
            break;
    }
}





function moveUp(){
    if ((playerPosition.y - iconSize)>0) {
        playerPosition.y-= iconSize;
        startGame();
    }
}

function moveDown(){
    if ((playerPosition.y+ iconSize)<canvasSize) {
        playerPosition.y+= iconSize;
        startGame();
    }
}

function moveLeft(){
    if ((playerPosition.x-iconSize)>iconSize) {
        playerPosition.x-= iconSize;
        startGame();
    }
}

function moveRight(){
    if((playerPosition.x+ iconSize)<=(canvasSize+15)){
        playerPosition.x+= iconSize;
        startGame();
    }
}







//funciones del dialog
reiniciarWinner.addEventListener('click', reiniciarGame);
returnWinner.addEventListener('click', returnHomeWeb);
reiniciarGameOver.addEventListener('click', reiniciarGame);
returnGameOver.addEventListener('click', returnHomeWeb);



function reiniciarGame(){
    level = 0
    lives = 3
    timeStart = undefined;
    playerPosition.x= undefined;
    playerPosition.y=undefined;
    if (!winner.classList.contains('disenabled')) {
        winner.classList.add('disenabled');
    }
    if (!gameOver.classList.contains('disenabled')) {
        gameOver.classList.add('disenabled');
    }
    emojis['X'] = '💣';
    startGame();
}


function returnHomeWeb() {
    window.location.href = 'index.html'
}