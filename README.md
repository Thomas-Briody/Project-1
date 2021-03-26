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
I used a for loop to dynamically create the grid, which allowed me to avoid hard coding this. Width was set to 15, which in turn created a 15x15 grid. This was initially 10x10, however using a loop allowed me to easily change the scale. 

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

<h5>Spaceship & Laser</h5>

3 functions control the movement of the spaceship. addSpaceship is called when the game starts, with the starting position being defined as cell 217, at the centre of the bottom of the grid. Functions to move the spaceship left or right based on which arrow keys are pressed are called when event listeners for the corresponding keys are triggered, and remove the spaceship, move it 1 cell either left or right, and then add the spaceship back onto the corresponding cell. 

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

<h5>Collision Detection</h5>

Below is the function that detects any collisions between the laser and the bomb. This proved to be one of the most tricky elements to implement, due to the nature of the number of intervals required throughout the project. 

```
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

<img src='https://i.imgur.com/9CcWvVY.png' width="500"/>


<h4>Level Two</h2>

As a stretch goal, I decided to implement a level two. The option to move on to level two is only available to players who clear all of the aliens in level 1. An event listener on the 'Level Two' button triggers a function that resets the grid, adding additional aliens and increasing both the speed and frequency of the bombs being dropped, to increase difficulty. 

```
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
```
Below you can see the game over screens depending on if the player did or did not clear all of the aliens, with the option to progress only available to players who did clear the grid of aliens. 

<img src='https://i.imgur.com/Tr0YANR.png' width="400"/> <img src='https://i.imgur.com/k0e6Xr0.png' width="400"/>

-----
<h2>Challenges</h2>

* As this was my first project, I had to utilise the information we had been taught in the weeks previously in relation to functions, intervals, arrays and event listeners, and amalgamate these skills. 
* Initially, the alien movement, and specifically the ability to remove any 'killed' aliens while maintaining the movement and wall detection proved to be challenging. I also found that collision detection was temperamental, with lasers not always recognising when they have hit falling bombs for no clear reason. I believe that this is due to the number of set intervals running within the program, with this resulting in occasional overlaps. 

----

<h2>Successes</h2>

* Prior to starting to code for this project, I ensured that I wrote out detailed plans outlining how I was going to approach the project. This proved to be very beneficial, as I referenced these plans a number of times throughout the project, and was able to get the core fundamentals of the game mechanics working fairly quickly and smoothly. 
* This process solidified my understanding of 'Vanilla' Javascript, HTML and CSS, and I am happy with what I was able to build within the timescale
* The addition of stretch goals such as a scoreboard and a level two allowed me to challenge myself further throughout the project


<img src='https://i.imgur.com/xkLmfzL.png' width="650"/>

