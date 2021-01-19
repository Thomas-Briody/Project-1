const grid = document.querySelector('.grid')
const startButton = document.querySelector('.button-start')
const titleCard = document.querySelector('.title-card')
const gameOverCard = document.querySelector('.game-over')
const playAgain = document.querySelector('.play-again')
const gameOverPoints = document.querySelector('.game-over-points')
const width = 15
const cells = []
let spaceship = 217
const laserTimers = {}
let reset = false
const bombTimers = {}
const aliensStart = [2, 4, 6, 7, 13, 15, 16, 18, 21, 24, 27]
let currentAlienPositions = [2, 4, 6, 7, 13, 15, 16, 18, 21, 24, 27]
const hearts = document.querySelectorAll('.heart')
let aliensMovingInterval
let bombDropInterval
const pointsTotal = document.querySelector('.points-total')
const dangerZone = [
  { letter: '-', index: 195 },
  { letter: '-', index: 196 },
  { letter: 'd', index: 197 },
  { letter: 'a', index: 198 },
  { letter: 'n', index: 199 },
  { letter: 'g', index: 200 },
  { letter: 'e', index: 201 },
  { letter: 'r', index: 202 },
  { letter: '-', index: 203 },
  { letter: 'z', index: 204 },
  { letter: 'o', index: 205 },
  { letter: 'n', index: 206 },
  { letter: 'e', index: 207 },
  { letter: '-', index: 208 },
  { letter: '-', index: 209 }
]
let points = 0
let lives = 3

function startGame() {
  reset = false
  titleCard.classList.add('hidden')
  //* Call the function to create the grid:
  createGrid()
  //* Call the function to add the spaceship
  addSpaceship()
  //* Call the function to load the dangerZone:
  loadDangerZone()
  //* Call the function to add aliens to the grid:
  addAliens()
  //* Call the function to generate a bomb
  bombDropInterval = setInterval(() => bombAppear(), 2000)
}

startButton.addEventListener('click', () => {
  startGame()
  startButton.disabled = true
})

playAgain.addEventListener('click', () => {
  gameOverCard.classList.add('hidden')
  hearts.forEach((heart) => {
    heart.classList.remove('broken')
  })
  startButton.disabled = true
  points = 0
  startGame()
})

//* Getting the aliens to move. This function starts the aliens moving

//* Event listener to listen for left and right keys
document.addEventListener('keyup', (event) => {
  const key = event.key
  if (key === 'ArrowRight' && !(spaceship % width === width - 1)) {
    moveSpaceshipRight()
  } else if (key === 'ArrowLeft' && !(spaceship % width === 0)) {
    moveSpaceshipLeft()
  }
})

//* Event listener to listen for space bar, and trigger the laser functions
document.body.onkeyup = function (e) {
  if (e.keyCode === 32) {
    e.preventDefault()
    shootLaser()
  }
}

//! ---------- FUNCTIONS ----------

//* -- Spaceship Functions --

function addSpaceship() {
  cells[spaceship].classList.remove('spaceship')
  cells[spaceship].classList.add('spaceship')
}
function moveSpaceshipLeft() {
  cells[spaceship].classList.remove('spaceship')
  spaceship -= 1
  cells[spaceship].classList.add('spaceship')
}
function moveSpaceshipRight() {
  cells[spaceship].classList.remove('spaceship')
  spaceship += 1
  cells[spaceship].classList.add('spaceship')
}

//* -- Laser Functions --

function shootLaser() {
  const laserStartPosition = spaceship - width
  const laserId = Math.random() * Math.random() * 100
  laserTimers[laserId] = { timerId: laserId, position: laserStartPosition }
  const laserCurrentPosition = laserTimers[laserId].position
  const laserTimer = laserTimers[laserId].timerId
  cells[laserCurrentPosition].classList.add('laser')
  laserFly(laserTimer, laserCurrentPosition)
}

function laserFly(laserTimer, laser) {
  laserTimer = setInterval(() => {
    if (cells[laser].classList.contains('alien')) {
      cells[laser].classList.add('explosion')
      points += 100
      pointsTotal.innerHTML = points
      currentAlienPositions = currentAlienPositions.filter((alien) => {
        return !cells[alien].classList.contains('laser')
      })
      cells[laser].classList.remove('laser')
      cells[laser].classList.remove('alien')
      setTimeout(() => {
        cells[laser].classList.remove('explosion')
      }, 200)
      clearInterval(laserTimer)
      console.log('BOOM')
    } else if (!(laser < width)) {
      console.log('Test')
      cells[laser].classList.remove('laser')
      laser -= width
      cells[laser].classList.add('laser')
    } else {
      cells[laser].classList.remove('laser')
    }
  }, 50)
}

//* -- Alien Functions --

//* This adds aliens to the cells for the start of the game
function addAliens() {
  aliensStart.forEach(alien => {
    cells[alien].classList.add('alien')
  })
  aliensMovingRightInterval()
}

//* This function moves the aliens right 1 cell. It does this by removing the alien from its current position, redefines the position, and then adds the alien to the new position.

function moveAliensRight() {
  //* remove aliens from current positions
  currentAlienPositions.forEach((alien) => {
    cells[alien].classList.remove('alien')
  })
  //* Redefine Positions
  currentAlienPositions = currentAlienPositions.map((alien) => {
    return alien += 1
  })
  //* Add aliens to new positions
  currentAlienPositions.forEach((alien) => {
    cells[alien].classList.add('alien')
  })
}

//* This function is called once the aliens have hit the right boundary and been moved down 1 cell by the previous function. It moves the aliens left 1 cell. If they hit the left boundary, they move down 1 cell and the moveAliensRight function is called
function moveAliensLeft() {
  currentAlienPositions.forEach((alien) => {
    cells[alien].classList.remove('alien')
  })
  currentAlienPositions = currentAlienPositions.map((alien) => {
    return alien -= 1
  })
  currentAlienPositions.forEach((alien) => {
    cells[alien].classList.add('alien')
  })
}

//* This function is called when the aliens hit the right or left boundary
function moveAliensDown() {
  currentAlienPositions.forEach((alien) => {
    cells[alien].classList.remove('alien')
  })
  currentAlienPositions = currentAlienPositions.map((alien) => {
    return alien += width
  })
  currentAlienPositions.forEach((alien) => {
    cells[alien].classList.add('alien')
  })
}
//* This interval ensures that the functions for moving the alien right occurs every 1 second. It detects if any of the aliens hit the right boundary, in which case it tells the aliens to move down 1 cell (by calling the moveAliensDown function), and calls the moveAliensLeft function 
function aliensMovingRightInterval() {
  aliensMovingInterval = setInterval(() => {
    const alienOnRightEdge = currentAlienPositions.some(position => position % width === width - 1)
    if (aliensReachGround()) {
      clearInterval(aliensMovingInterval)
      return gameOver()
    } else if (!alienOnRightEdge) {
      moveAliensRight()
    } else if (alienOnRightEdge) {
      moveAliensDown()
      clearInterval(aliensMovingInterval)
      aliensMovingLeftInterval()
    }
  }, 800)
}
//* This interval ensures that the functions for moving the alien left occurs every 1 second. It detects if any of the aliens hit the left boundary, in which case it tells the aliens to move down 1 cell (by calling the moveAliensDown function), and calls the moveAliensRight function 

function aliensMovingLeftInterval() {
  aliensMovingInterval = setInterval(() => {
    const alienOnLeftEdge = currentAlienPositions.some(position => position % width === 0)
    if (aliensReachGround()) {
      clearInterval(aliensMovingInterval)
      return gameOver()
    } else if (!alienOnLeftEdge) {
      moveAliensLeft()
    } else if (alienOnLeftEdge) {
      moveAliensDown()
      clearInterval(aliensMovingInterval)
      aliensMovingRightInterval()
    }
  }, 800)
}

function aliensReachGround() {
  const atTheGround = currentAlienPositions.some(position => position === 194)
  return atTheGround
}

//* ALIENS DROPPING BOMBS FUNCTIION: 

function bombAppear() {
  const randomNum = Math.floor(Math.random() * currentAlienPositions.length)
  const alienToDropBomb = currentAlienPositions[randomNum]
  const bombStartPosition = alienToDropBomb + width
  if (cells[bombStartPosition].classList.contains('alien')) {
    return bombAppear()
  }
  const bombId = Math.random() * Math.random() * 100
  bombTimers[bombId] = { timerId: bombId, position: bombStartPosition }
  const bombCurrentPosition = bombTimers[bombId].position
  const bombTimer = bombTimers[bombId].timerId
  cells[bombStartPosition].classList.add('bomb')
  bombDrop(bombTimer, bombCurrentPosition)
}

function bombDrop(bombTimer, bombPosition) {
  if (lives === 0) {
    return gameOver()
  }
  bombTimer = setInterval(() => {
    collisionCheck(bombTimer)
    if (reset === true) {
      clearInterval(bombTimer)
    } else {
      if (cells[bombPosition].classList.contains('spaceship')) {
        lives--
        cells[bombPosition].classList.add('explosion')
        cells[bombPosition].classList.remove('bomb')
        setTimeout(() => {
          cells[bombPosition].classList.remove('explosion')
        }, 300)
        clearInterval(bombTimer)
        loseLife()
        console.log(lives)
      } else if (!(bombPosition + width >= width ** 2)) {
        cells[bombPosition].classList.remove('bomb')
        bombPosition = bombPosition += width
        cells[bombPosition].classList.add('bomb')
      } else {
        cells[bombPosition].classList.remove('bomb')
        clearInterval(bombTimer)
      }
    }
  }, 200)
}

//* -- Other Functions --

function loadDangerZone() {
  dangerZone.forEach(item => {
    cells[item.index].innerText = item.letter.toUpperCase()
    cells[item.index].classList.add(item.letter, 'dangerZone')
  })
}

//* Creating the grid: 

function createGrid() {
  for (let index = 0; index < width ** 2; index++) {
    // ? Generate each element
    const cell = document.createElement('div')
    cell.classList.add('cell')
    grid.appendChild(cell)
    cells.push(cell)
    // ? Number each cell by its index.
    // cell.innerHTML = index
    // ? Set the width and height of my cells
    cell.style.width = `${100 / width}%`
    cell.style.height = `${100 / width}%`
  }
}
function gameOver() {
  gameOverCard.classList.remove('hidden')
  reset = true
  lives = 3
  gameOverPoints.innerHTML = points
  clearInterval(aliensMovingInterval)
  currentAlienPositions.forEach((alien) => {
    cells[alien].classList.remove('alien')
  })
  const bombArray = Object.values(bombTimers)
  clearInterval(bombDropInterval)
  bombArray.forEach((bomb) => {
    clearInterval(bomb.timerId)
  })
  const aliensStart = [2, 4, 6, 7, 13, 15, 16, 18, 21, 24, 27]
  currentAlienPositions = aliensStart
  cells.forEach((cell) => {
    cell.classList.remove('bomb')
  })
  startButton.disabled = false
  // startGame()
}

function collisionCheck(bombTimer) {
  setInterval(() => {
    cells.forEach((cell) => {
      if (cell.classList.contains('laser') && cell.classList.contains('bomb')) {
        clearInterval(bombTimer)
        cell.classList.remove('laser')
        cell.classList.remove('bomb')
        cell.classList.add('explosion')
        setTimeout(() => {
          cell.classList.remove('explosion')
        }, 100)
      }
    })
  }, 10)
}
collisionCheck()


function loseLife() {
  if (lives === 0) {
    return gameOver()
  }
  hearts[lives - 1].classList.add('broken')
}

//* BUGS:
  //* when you click start game, the button is selected so space bar presses the button
  //* lasers are not interacting with bombs when they hit eachother
  //* title card isnt working
  //* resett


//* for a start title card, z index css and display none 