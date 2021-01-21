const grid = document.querySelector('.grid')
const startButton = document.querySelector('.button-start')
const titleCard = document.querySelector('.title-card')
const gameOverCard = document.querySelector('.game-over')
const playAgain = document.querySelector('.play-again')
const gameOverPoints = document.querySelector('.game-over-points')
const endMessage = document.querySelector('.end-message')
const levelTwo = document.querySelector('.level-2')
const scoresList = document.querySelector('ol')
const width = 15
const cells = []
let spaceship = 217
const laserTimers = {}
let laserTimer
let reset = false
let gameOverCheck = false
const bombTimers = {}
let aliensStart = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]
let currentAlienPositions = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]
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
let alienSpeed = 800
let bombFrequencySpeed = 2000

function startGame() {
  lives = 3
  pointsTotal.innerHTML = '0'
  reset = false
  titleCard.classList.add('animate__fadeOut')
  //* Call the function to create the grid:
  createGrid()
  //* Call the function to add the spaceship
  addSpaceship()
  //* Call the function to load the dangerZone:
  loadDangerZone()
  //* Call the function to add aliens to the grid:
  addAliens()
  //* Call the function to generate a bomb
  bombDropInterval = setInterval(() => bombAppear(), bombFrequencySpeed)
}

function startLevelTwo() {
  lives = 3
  pointsTotal.innerHTML = '0'
  reset = false
  titleCard.classList.add('hidden')
  aliensStart = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]
  currentAlienPositions = aliensStart
  alienSpeed = 500
  bombFrequencySpeed = 1000
  createGrid()
  addSpaceship()
  loadDangerZone()
  addAliens()
  bombDropInterval = setInterval(() => bombAppear(), bombFrequencySpeed)
}

startButton.addEventListener('click', () => {
  startGame()
  startButton.disabled = true
})

playAgain.addEventListener('click', () => {
  levelTwo.classList.remove('hidden')
  cells.forEach((cell) => {
    cell.classList.remove('laser')
  })
  gameOverCheck = false
  gameOverCard.classList.add('hidden')
  hearts.forEach((heart) => {
    heart.classList.remove('broken')
  })
  startButton.disabled = true
  points = 0
  startGame()
})

levelTwo.addEventListener('click', () => {
  gameOverCheck = false
  cells.forEach((cell) => {
    cell.classList.remove('laser')
  })
  gameOverCard.classList.add('hidden')
  hearts.forEach((heart) => {
    heart.classList.remove('broken')
  })
  startButton.disabled = true
  points = 0
  startLevelTwo()
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
document.addEventListener('keydown', (event) => {
  if (event.keyCode === 32) {
    if (gameOverCheck === false) {
      event.preventDefault()
      shootLaser()
    } else {
      event.preventDefault()
    }

  }
})

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
  // const laserTimer = laserTimers[laserId].timerId
  cells[laserCurrentPosition].classList.add('laser')
  laserFly(laserTimer, laserCurrentPosition)
}

function laserFly(laserTimer, laser) {
  laserTimer = setInterval(() => {
    if (lives === 0 || aliensReachGround() || currentAlienPositions.length === 0) {
      clearInterval(laserTimer)
      cells[laser].classList.remove('laser')
      cells.forEach((cell) => {
        cell.classList.remove('laser')
      })

    } else if (cells[laser].classList.contains('alien')) {
      clearInterval(laserTimer)
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
    } else if (!(laser < width)) {
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
    if (currentAlienPositions.length === 0) {
      return gameOver('You Won!')
    }
    const alienOnRightEdge = currentAlienPositions.some(position => position % width === width - 1)
    if (aliensReachGround()) {
      clearInterval(aliensMovingInterval)
      return gameOver('Game Over!')
    } else if (!alienOnRightEdge) {
      moveAliensRight()
    } else if (alienOnRightEdge) {
      moveAliensDown()
      clearInterval(aliensMovingInterval)
      aliensMovingLeftInterval()
    }
  }, alienSpeed)
}
//* This interval ensures that the functions for moving the alien left occurs every 1 second. It detects if any of the aliens hit the left boundary, in which case it tells the aliens to move down 1 cell (by calling the moveAliensDown function), and calls the moveAliensRight function 

function aliensMovingLeftInterval() {
  aliensMovingInterval = setInterval(() => {
    if (currentAlienPositions.length === 0) {
      return gameOver('You Won!')

    }
    const alienOnLeftEdge = currentAlienPositions.some(position => position % width === 0)
    if (aliensReachGround()) {
      clearInterval(aliensMovingInterval)
      return gameOver('Game Over!')
    } else if (!alienOnLeftEdge) {
      moveAliensLeft()
    } else if (alienOnLeftEdge) {
      moveAliensDown()
      clearInterval(aliensMovingInterval)
      aliensMovingRightInterval()
    }
  }, alienSpeed)
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
    return gameOver('Game Over!')
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
  }, 150)
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
function gameOver(winMessage) {
  gameOverCheck = true
  if (winMessage === 'Game Over!') {
    levelTwo.classList.add('hidden')
  }
  gameOverCard.classList.add('animate__fadeIn')
  gameOverCard.classList.remove('hidden')
  reset = true
  endMessage.innerHTML = `${winMessage}`
  gameOverPoints.innerHTML = points
  clearInterval(aliensMovingInterval)
  const bombArray = Object.values(bombTimers)
  clearInterval(bombDropInterval)
  bombArray.forEach((bomb) => {
    clearInterval(bomb.timerId)
  })
  const laserArray = Object.values(laserTimers)
  laserArray.forEach((laser) => {
    clearInterval(laser.timerId)
  })
  currentAlienPositions = aliensStart
  cells.forEach((cell) => {
    cell.classList.remove('bomb', 'explosion', 'alien', 'laser')
  })
  startButton.disabled = false
}

function collisionCheck(bombTimer) {
  setInterval(() => {
    cells.forEach((cell) => {
      if (cell.classList.contains('laser') && cell.classList.contains('bomb')) {
        console.log('COLLISION')
        clearInterval(bombTimer)
        console.log(bombTimer)
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

function loseLife() {
  if (lives === 0) {
    return gameOver('Game Over!')

  }
  hearts[lives - 1].classList.add('broken')
}
