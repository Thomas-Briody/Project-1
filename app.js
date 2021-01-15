const grid = document.querySelector('.grid')
const width = 10
const cells = []
let spaceship = 93
let laser = 0
const aliensStart = [2, 4, 6, 7, 13, 15, 16]
let currentAlienPositions = [2, 4, 6, 7, 13, 15, 16]
let aliensMovingInterval 
let laserTimer 

//* Creating the grid: 

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

//* Calling the function to add aliens to the grid:
addAliens()

//* laserFly functioon runs from start but is only visible when shootLaser is called

//* The below ensures a spaceship is generated at the start
cells[spaceship].classList.remove('spaceship')
cells[spaceship].classList.add('spaceship')


//* Getting the aliens to move. This function starts the aliens moving
aliensMovingRightInterval() 

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
  let laserStart = spaceship
  cells[laser].classList.remove('laser')
  laser = laserStart -= width
  cells[laser].classList.add('laser')
  laserFly()
}

function laserFly() {
  laserTimer = setInterval( () => {
    if (cells[laser].classList.contains('alien') ) {
      cells[laser].classList.add('explosion')
      currentAlienPositions =  currentAlienPositions.filter((alien) => {
        return !cells[alien].classList.contains('laser') 
      })
      cells[laser].classList.remove('laser')
      cells[laser].classList.remove('alien')
      console.log('CURRENT ALIEN POSITIONS >', currentAlienPositions)
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

//* -- BUGS --
  //* cant shoot more than 1 laser
  //* explosion class not removing when multiple explosions
  //* 