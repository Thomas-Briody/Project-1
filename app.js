const grid = document.querySelector('.grid')
const startButton = document.querySelector('button')
const width = 10
const cells = []
let spaceship = 93
const laserTimers = {}
const bombTimers = {}
let bombPosition 
const aliensStart = [2, 4, 6, 7, 13, 15, 16]
let currentAlienPositions = [2, 4, 6, 7, 13, 15, 16]
let aliensMovingInterval 
const pointsTotal = document.querySelector('.points-total')
const dangerZone = [
  { letter: 'd', index: 80 },
  { letter: 'a', index: 81 },
  { letter: 'n', index: 82 },
  { letter: 'g', index: 83 },
  { letter: 'e', index: 84 },
  { letter: 'r', index: 85 },
  { letter: 'z', index: 86 },
  { letter: 'o', index: 87 },
  { letter: 'n', index: 88 },
  { letter: 'e', index: 89 }
]
let points = 0

function startGame() {
  //* Call the function to create the grid:
  createGrid()
  //* Call the function to add the spaceship
  addSpaceship()
  //* Call the function to load the dangerZone:
  loadDangerZone()
  //* Call the function to add aliens to the grid:
  addAliens()
  //* Call the function to generate a bomb
  setInterval(() => bombAppear(), 2000)
}

startButton.addEventListener('click',() => {
  startGame()
  startButton.disabled = true
})

//* Creating the grid: 

function createGrid() {
  for (let index = 0; index < width ** 2; index++) {
  // ? Generate each element
    const cell = document.createElement('div')
    cell.classList.add('cell')
    grid.appendChild(cell)
    cells.push(cell)
    // ? Number each cell by its index.
    cell.innerHTML = index
    // ? Set the width and height of my cells
    cell.style.width = `${100 / width}%`
    cell.style.height = `${100 / width}%`
  }
}

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
document.body.onkeyup = function(e){
  if (e.keyCode === 32){
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
  laserTimers[laserId] = { timerId: laserId , position: laserStartPosition }
  const laserCurrentPosition = laserTimers[laserId].position
  const laserTimer = laserTimers[laserId].timerId
  cells[laserCurrentPosition].classList.add('laser')
  laserFly(laserTimer, laserCurrentPosition)
}

function laserFly(laserTimer, laser) {
  laserTimer = setInterval( () => {
    if (cells[laser].classList.contains('alien') ) {
      cells[laser].classList.add('explosion')
      points += 100
      pointsTotal.innerHTML = points
      currentAlienPositions =  currentAlienPositions.filter((alien) => {
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
function addAliens () { 
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
  aliensMovingInterval = setInterval( () => {
    const alienOnRightEdge = currentAlienPositions.some(position => position % width === width - 1)
    if (aliensReachGround()) {
      console.log('GAME OVER BOOIIII')
      clearInterval(aliensMovingInterval)
    } else if (!alienOnRightEdge) {
      moveAliensRight()
    } else if (alienOnRightEdge) {
      moveAliensDown()
      clearInterval(aliensMovingInterval)
      aliensMovingLeftInterval() 
    }
  }, 1000)
}
//* This interval ensures that the functions for moving the alien left occurs every 1 second. It detects if any of the aliens hit the left boundary, in which case it tells the aliens to move down 1 cell (by calling the moveAliensDown function), and calls the moveAliensRight function 

function aliensMovingLeftInterval() {
  aliensMovingInterval = setInterval( () => {
    const alienOnLeftEdge = currentAlienPositions.some(position => position % width === 0)
    if (aliensReachGround()) {
      clearInterval(aliensMovingInterval)
      console.log('GAME OVER BOOOIIII')
      alert('Game Over!')
    } else if (!alienOnLeftEdge) {
      moveAliensLeft()
    } else if (alienOnLeftEdge) {
      moveAliensDown()
      clearInterval(aliensMovingInterval)
      aliensMovingRightInterval()
    }
  }, 1000)
}

function aliensReachGround() {
  const atTheGround = currentAlienPositions.some(position => position === 79)
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
  bombTimers[bombId] = { timerId: bombId , position: bombStartPosition }
  const bombCurrentPosition = bombTimers[bombId].position
  const bombTimer = bombTimers[bombId].timerId
  cells[bombStartPosition].classList.add('bomb')
  bombDrop(bombTimer, bombCurrentPosition)
}

function bombDrop(bombTimer, bombPosition) {
  bombTimer = setInterval(() => {
    if (cells[bombPosition].classList.contains('spaceship')) {
      cells[bombPosition].classList.add('explosion')
      cells[bombPosition].classList.remove('spaceship', 'bomb')
      setTimeout(() => {
        cells[bombPosition].classList.remove('explosion')
      }, 200)
      clearInterval(bombTimer)
      //* Issue with below, doesnt always register:
    } else if (cells[bombPosition].classList.contains('laser')) {
      console.log('LASER HITS BOMB')
      cells[bombPosition].classList.remove('laser')
      cells[bombPosition].classList.remove('bomb')
      cells[bombPosition].classList.add('explosion')
    } else if (!(bombPosition + width >= width ** 2)) {
      cells[bombPosition].classList.remove('bomb')
      bombPosition = bombPosition += width
      cells[bombPosition].classList.add('bomb')
    } else {
      cells[bombPosition].classList.remove('bomb')
      clearInterval(bombTimer)
    }
  }, 500)
}


//* -- Other Functions --

function loadDangerZone() { 
  dangerZone.forEach(item => {
    cells[item.index].innerText = item.letter.toUpperCase()
    cells[item.index].classList.add(item.letter, 'dangerZone')
  })
}