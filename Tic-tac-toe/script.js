// Инициализация на променлива за влаченето и индекс на текущия играч
let dragged = null;
let currentPlayerIndex = 0;

// Масиви за фигури на играч 1 и играч 2, които могат да се влачат
let imagePlayer1Array = [
    { image: document.getElementById('draggable-large')},
    { image: document.getElementById('draggable-medium')},
    { image: document.getElementById('draggable-small')},
    { image: document.getElementById('draggable-large3')},
    { image: document.getElementById('draggable-medium3')},
    { image: document.getElementById('draggable-small3')},
    { image: document.getElementById('draggable-medium4')},
    { image: document.getElementById('draggable-small4')}
];

let imagePlayer2Array = [
    { image: document.getElementById('draggable-large2')},
    { image: document.getElementById('draggable-medium2')},
    { image: document.getElementById('draggable-small2')},
    { image: document.getElementById('draggable-large5')},
    { image: document.getElementById('draggable-medium5')},
    { image: document.getElementById('draggable-small5')},
    { image: document.getElementById('draggable-medium6')},
    { image: document.getElementById('draggable-small6')}
];

// Инициализация на състоянието на играта (активен играч и състояние на игралното поле)
let gameActive = true;
let currentPlayer = imagePlayer1Array; // Началният играч е играч 1
let gameState =["","","","","","","","",""]; // Състоянието на игралното поле (празно)

// Събитие за рестартиране на играта
document.querySelector('.game-restart').addEventListener('click', handleRestartGame);

// Функция за рестартиране на играта
function handleRestartGame(){
    gameActive = true; // Играта е активна
    currentPlayer = imagePlayer1Array; // Връща играча 1 като текущ играч
    gameState =["","","","","","","","",""]; // Изчистване на състоянието на полето
    document.querySelectorAll('.tile') // Изчистване на всички клетки на игралното поле
        .forEach(tile => tile.innerHTML = "");
    location.reload(); // Презареждане на страницата
}

// Променлива за влачените елементи
const source = document.querySelectorAll(".draggable");

// Събитие за започване на влачене на елемент
source.forEach((element) => { 
    element.addEventListener("dragstart", (event) => {
        dragged = event.target; // Записва се елементът, който се влачи
    });
}); 

// Променлива за целите области за пускане на елементите
const target = document.querySelectorAll(".droptarget");

// Добавяне на събития за целите области
target.forEach((element) => { 
    // Разрешава влаченето в целевата област
    element.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    // Събитие за пускане на влачен елемент
    element.addEventListener("drop", (event) => {
        event.preventDefault();
        
        if (!gameActive) return; // Ако играта не е активна, не правим нищо

        // Проверява дали целевият елемент е клетка
        if (event.target.className === "tile") {
            // Проверка дали е ред на другия играч и дали не може да постави избраната фигура
            if (currentPlayerIndex === 1 && (dragged.id === 'draggable-large' || dragged.id === 'draggable-medium' || dragged.id === 'draggable-small' ||
                                            dragged.id === 'draggable-large3' || dragged.id === 'draggable-medium3' || dragged.id === 'draggable-small3'  ||
                                            dragged.id === 'draggable-medium4' || dragged.id === 'draggable-small4'  )) {
                console.log("Сега е ред на другия играч. Не можеш да поставиш фигура.");
                return false;
            } else if (currentPlayerIndex === 0 && (dragged.id === 'draggable-large2' || dragged.id === 'draggable-medium2' || dragged.id === 'draggable-small2'   ||
                                            dragged.id === 'draggable-large5' || dragged.id === 'draggable-medium5' || dragged.id === 'draggable-small5' ||
                                            dragged.id === 'draggable-medium6' || dragged.id === 'draggable-small6' )) {
                console.log("Сега е ред на другия играч. Не можеш да поставиш фигура.");
                return false;
            }
        
            const cell = event.target; // Целевата клетка
            const cellIndex = parseInt(cell.getAttribute("data-cell-index")); // Индекс на клетката
            const currentPlayerFigures = currentPlayerIndex === 0 ? imagePlayer1Array : imagePlayer2Array; // Фигури на текущия играч
            
            // Проверка дали е възможно да се постави фигура в клетката
            if (currentPlayer === (currentPlayerIndex === 0 ? imagePlayer1Array : imagePlayer2Array)) {
                if (canPlaceOn(cell, dragged, currentPlayerFigures)) {
                    if (gameState[cellIndex] !== "") {
                        const oldFigure = document.getElementById(gameState[cellIndex]);
                        cell.removeChild(oldFigure); // Премахва старата фигура, ако има такава
                    }
                    const draggedImageId = dragged.id; // ID на влачения елемент
                    const draggedImage = document.getElementById(draggedImageId); // Получава се самия елемент
                    cell.innerHTML = ""; // Изчиства съдържанието на клетката
                    cell.appendChild(draggedImage); // Поставя новия елемент в клетката
                    gameState[cellIndex] = draggedImageId; // Обновява състоянието на играта

                    endTurn(); // Завършване на хода
                }
            }
        }
    });
});

// Функция за проверка дали може да се постави фигура в дадена клетка
function canPlaceOn(target, draggable, currentPlayerFigures) {
    const currentCellFigureId = target.firstChild ? target.firstChild.id : ''; // ID на фигурата в клетката
    if (target.innerHTML !== "") { // Ако клетката не е празна
        const draggedId = draggable.id; // ID на влачения елемент
        if (currentPlayerFigures.some(figure => figure.image.id === draggedId)) { // Проверка дали влаченият елемент е валиден за играча
            // Проверки за правилата за поставяне на фигури в зависимост от техния размер
            if (draggedId === 'draggable-large' || draggedId === 'draggable-large2' || draggedId === 'draggable-large3' || draggedId === 'draggable-large5') {
                if (currentCellFigureId === 'draggable-large' || currentCellFigureId === 'draggable-large2' || currentCellFigureId === 'draggable-large3' || currentCellFigureId === 'draggable-large5') {
                    return false;
                }
                return currentCellFigureId === 'draggable-small' || currentCellFigureId === 'draggable-small2' || currentCellFigureId === 'draggable-small3' || currentCellFigureId === 'draggable-small4' ||
                    currentCellFigureId === 'draggable-small5' || currentCellFigureId === 'draggable-small6' || 
                    currentCellFigureId === 'draggable-medium' || currentCellFigureId === 'draggable-medium2' || 
                    currentCellFigureId === 'draggable-medium3' || currentCellFigureId === 'draggable-medium4' || 
                    currentCellFigureId === 'draggable-medium5' || currentCellFigureId === 'draggable-medium6';
            } else if (draggedId === 'draggable-medium' || draggedId === 'draggable-medium2' || 
                        draggedId === 'draggable-medium3' || draggedId === 'draggable-medium4' || 
                        draggedId === 'draggable-medium5' || draggedId === 'draggable-medium6') {
                if (currentCellFigureId === 'draggable-large' || currentCellFigureId === 'draggable-large2' ||
                    currentCellFigureId === 'draggable-large3' || currentCellFigureId === 'draggable-large5') {
                    return false; 
                }
                else if (currentCellFigureId === 'draggable-small' || currentCellFigureId === 'draggable-small2' || 
                        currentCellFigureId === 'draggable-small3' || currentCellFigureId === 'draggable-small4' || 
                        currentCellFigureId === 'draggable-small5' || currentCellFigureId === 'draggable-small6'  ) {
                    return true;
                }
                return false;
            }
        }
        return false;
    }
    return true;
}

// Функция за смяна на играча
function switchPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % 2; // Превключва между 0 и 1 за реда на играчите
    currentPlayer = currentPlayerIndex === 0 ? imagePlayer1Array : imagePlayer2Array;
}
  
// Функция за завършване на хода
function endTurn() {
    switchPlayer(); // Превключва играча
    console.log(`Сега е ред на ${currentPlayerIndex === 0 ? 'играч 1' : 'играч 2'}.`);
    const winner = checkWinner(); // Проверява дали има победител
    if (winner) {
        console.log(`Победител е играч ${winner}.`);
        gameActive = false; // Играта е приключила
        alert(`Победител е играч ${winner}!`); // Показва съобщение за победата
    }
}
  
// Функция за проверка на победител
function checkWinner() {
    const winningLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]              
    ];

    let player1Figures = [];
    let player2Figures = [];

    // Разпределя фигурите на играчите по индекси
    gameState.forEach((figureId, index) => {
        if (figureId === 'draggable-large' || figureId === 'draggable-medium' || figureId === 'draggable-small' ||
            figureId === 'draggable-large3' || figureId === 'draggable-medium3' || figureId === 'draggable-small3' || 
            figureId === 'draggable-medium4' || figureId === 'draggable-small4') {
            player1Figures.push(index);
        } else if (figureId === 'draggable-large2' || figureId === 'draggable-medium2' || figureId === 'draggable-small2' ||
            figureId === 'draggable-large5' || figureId === 'draggable-medium5' || figureId === 'draggable-small5' || 
            figureId === 'draggable-medium6' || figureId === 'draggable-small6') {
            player2Figures.push(index);
        }
    });

    // Проверява дали някой играч е спечелил
    for (let line of winningLines) {
        const [a, b, c] = line;
        if (player1Figures.includes(a) && player1Figures.includes(b) && player1Figures.includes(c)) {
            return 1; // Играч 1 печели
        }
        if (player2Figures.includes(a) && player2Figures.includes(b) && player2Figures.includes(c)) {
            return 2; // Играч 2 печели
        }
    }
  
    return null; // Няма победител
}

// Добавяне на събитие за зареждане на аудио и бутон за възпроизвеждане
document.addEventListener("DOMContentLoaded", function() {
    var audio = document.getElementById("bgAudio");
    var playButton = document.getElementById("playButton");

    // Възпроизвеждане на аудио при натискане на бутон
    playButton.addEventListener("click", function() {
        audio.play();
        playButton.style.display = "none"; // Скрива бутона след натискане
    });
});
