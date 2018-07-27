/**
 * Snake game
 */
const WIDTH = 400;
const HEIGHT = 400;
const SCALE = 10;
let scoreDisplay;
let blipSound, dieSound;
class Food{
  static findLoc(){
    let rows = floor(width / SCALE);
    let cols = floor(height / SCALE);
    return {
      x : floor(random(cols)) * SCALE,
      y : floor(random(rows)) * SCALE
    }
  }
  constructor(){
    let loc = Food.findLoc();
    this.x = loc.x;
    this.y = loc.y;
  }

  show(){
    fill(255, 0, 0);
    rect(this.x, this.y, SCALE, SCALE);
  }

  generateNew(){
   let loc = Food.findLoc();
   this.x = loc.x;
   this.y = loc.y; 
  }
}


class Snake{
  constructor(){
    this.x = 0;
    this.y = 0;
    this.xspeed = 1;
    this.yspeed = 0;
    this.count = 1;
    this.tail = [createVector(this.x, this.y)];
  }

  changeDirection(dx, dy){
    this.xspeed = dx;
    this.yspeed = dy;
  }

  update(){

    for(let i = 0; i <= this.tail.length - 2; i++){
      this.tail[i] = this.tail[i + 1]; 
    }

    this.x += SCALE * this.xspeed;
    this.y += SCALE * this.yspeed;
    
    if(this.x > width - SCALE){
      this.x = 0;
    } else if(this.x < 0){
      this.x = width - SCALE;
    }
    if(this.y > height - SCALE){
      this.y = 0;
    } else if(this.y < 0){
      this.y = height - SCALE;
    }

    if(this.count > this.tail.length){
      this.tail.push(createVector(this.x, this.y));
    }else{
      this.tail[this.tail.length - 1] = createVector(this.x, this.y);
    }
     
  }

  checkDeath(){
    if(this.tail.length === 1) return false;
    for(let i = 0; i < this.tail.length - 1; i++){
      if(this.x === this.tail[i].x && this.y === this.tail[i].y){
        return true;
      }
    }
    return false;
  }

  die(){
    this.x = 0;
    this.y = 0;
    this.count = 1;
    scoreDisplay.innerHTML = this.count - 1;
    this.tail = [createVector(this.x, this.y)];
  }

  show(){
    fill(255);
    for(let i = this.tail.length - 1; i >= 0 ; i--){
      rect(this.tail[i].x, this.tail[i].y, SCALE, SCALE);
    }
  }

  eat(food){
    let d = dist(this.x, this.y, food.x, food.y);
    if (d < 1){
      this.count += 1;
      scoreDisplay.innerHTML = this.count - 1;
      return true;
    }
    return false;
  }
}



var snake, food;

function keyPressed(){
  if(keyCode === LEFT_ARROW){
    if(snake.xspeed === 1) return; // Stopping back move
    snake.changeDirection(-1, 0);
  } else if(keyCode === RIGHT_ARROW){
    if(snake.xspeed === -1) return;  
    snake.changeDirection(1, 0);
  } else if(keyCode === UP_ARROW){
    if(snake.yspeed === 1 ) return;
    snake.changeDirection(0, -1);
  } else if(keyCode === DOWN_ARROW){
    if(snake.yspeed === -1 ) return;
    snake.changeDirection(0, 1);
  }
}


function setup(){
  createCanvas(400, 400);
  frameRate(8);
  snake = new Snake();
  food = new Food();
  scoreDisplay = document.getElementById('score');
  blipSound = loadSound('Blip.wav');
  dieSound = loadSound('die.wav');
}

function draw(){
  
  background(0);
  snake.update();
  if(snake.checkDeath()){
    snake.die();
    dieSound.play();
  }
  snake.show();
  if(snake.eat(food)){
    blipSound.play();
    food.generateNew();
  }
  food.show();
}