var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImg;

var cloudsGroup, cloudImg;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;
var gameover;
var gameoverImg;
var restart;

localStorage["highSc"] = 0;
var canvasX, canvasY;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImg = loadImage("ground2.png");
  gameoverImg = loadImage("Go.png");
  cloudImg = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");

  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  
  restartImg = loadImage("restart.png");
}

function setup() {
  canvasX = displayWidth - 100;
  canvasY = displayHeight - 100;

  createCanvas(canvasX, canvasY);

  trex = createSprite(canvasX / 2 - 600, canvasY / 2 - 100, 20, 50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(canvasX / 2, canvasY / 2 - 100, canvasX, 20);
  ground.addImage("ground", groundImg);
  ground.x = ground.width / 5;
  ground.scale = displayWidth / 150;
  ground.velocityX = -(6 + 3 * score / 100);
  camera.position.x = ground.x;

  gameover = createSprite(displayWidth / 2, displayHeight / 10)
  gameover.addImage(gameoverImg);
  gameover.scale = 0.5;
  gameover.visible = false;
  
  restart = createSprite(displayWidth / 2, 40 + displayHeight / 10);
  restart.addImage(restartImg);


  restart.scale = 0.5;


  restart.visible = false;


  invisibleGround = createSprite(canvasX / 2, canvasY / 2 - 80, displayWidth, 10);

  invisibleGround.visible = false;
  invisibleGround.scale = displayWidth / 150;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {

  background(180);
  textSize(30)
  text("score: " + score, camera.position.x + 400, 50);

  restart.x = camera.position.x;
  gameover.x = camera.position.x;
  
  trex.velocityX = 1;
  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(6 + 3 * score / 100);
    camera.position.x = trex.x;

    if (keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 5;
    }
    spawnClouds();



    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
    }
  }
  else if (gameState === END) {

    restart.visible = true;
    gameover.visible = true;

    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    trex.changeAnimation("collided", trex_collided);

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }
  trex.collide(invisibleGround);
  drawSprites();
}

function spawnClouds() {
  if (camera.position.x % 60 === 0) {
    var cloud = createSprite(displayWidth, displayHeight / 2 - 200, 40, 10);
    cloud.y = Math.round(random(80, displayHeight / 2 - 400));
    cloud.addImage(cloudImg);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    cloud.lifetime = Math.round(displayWidth / 3);

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (camera.position.x % 60 === 0) {
    var obstacle = createSprite(displayWidth, displayHeight / 4 + 140, 10, 40);
    obstacle.velocityX = -(6 + 3 * score / 100);

    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }

    obstacle.scale = 0.8;
    obstacle.lifetime = (displayWidth / (-1 * obstacle.velocityX));
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;


  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  if (localStorage["highSc"] < score) {
    localStorage["highSc"] = score;
  }
  console.log(localStorage["highSc"]);

  score = 0;
}