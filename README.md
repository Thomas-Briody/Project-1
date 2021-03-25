# Project-1 - Space Invaders <img src='https://i.imgur.com/qk6fbSh.png' width="60"/>

<h1>Overview</h1>

The Brief for this project was to create a grid-based game utilising vanilla Javascript, HTML and CSS within the 1 week timescale. Working individually, I chose Space Invaders from a predetermined list of grid-based games. Throughout this project, my knowledge and understanding of javascript was solidified, and I am happy with the final game that I was able to create. 

-----
<h2>Brief</h2>

* **Render a game in the browser**
* **Design logic for winning** & **visually display which player won**
* **Include separate HTML / CSS / JavaScript files**
* Use **Javascript** for **DOM manipulation**
* **Deploy the game online**
* Use **semantic markup** for HTML and CSS

-----
<h2>Approach</h2>

<h4>Creating the Grid</h4>
I used a for loop to dynamically create the grid, which allowed me to avoid hard coding this. Width was set to 15, which in turn created a 15x15 grid. This was initally 10x10, however using a loop allowed me to easily change the scale. 

```
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
```

<h4>Movement</h4>
For my project, the main moving elements are:

* A Spaceship that can move left and right at the bottom of the grid and shoot lasers up
* A group of aliens that feed in from the top, moving from left to right, and then down when they hit the end of the grid, and then right to left etc

<h5>Aliens</h5>
The aliens are assigned their starting positions as index's on the grid

```let aliensStart = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]```

The aliens are then added via the following function:
```
function addAliens() {
  aliensStart.forEach(alien => {
    cells[alien].classList.add('alien')
  })
  aliensMovingRightInterval()
}
```

As you can see above, the aliensMovingRightInterval is called. This interval ensures that the functions for moving the alien right occurs every 1 second. It detects if any of the aliens hit the right boundary, in which case it tells the aliens to move down 1 cell (by calling the moveAliensDown function), and calls the moveAliensLeft function. This cycle continues until the aliens reach the ground. 

<h5>Spaceship & Lazer</h5>

3 functions control the movement of the spaceship. addSpaceship is called when the game starts, with the starting position being defined as cell 217, at the centre of the bottom of the grid. functions to move the spaceship left or right based on which arrow keys are pressed are simple, and remove the spaceship, move it 1 cell either left or right, and then add the spaceship back onto the corresponding cell. 

```
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
```

I split the laser mechanics into 2 functions, the first of which generates the laser in the cell above the spaceship, whenever the spacebar is pressed. The second function tells the laser to move 1 cell above it at a set interval, with further collision detection built in should it hit an alien. 

<h5>Bombs</h5>

The bombs are controlled in a similar fashion to the laser, with 1 function in order to generate a bomb below an alien, and another function to ensure the bomb drops at a set interval, with collision detection should the bomb hit the spaceship. 
```
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
```

The startGame function triggers all of the required events in order for the game to begin:

```
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
```
