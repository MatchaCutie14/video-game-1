// All of your game code will go here.
var game = new Phaser.Game(600, 400, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });

function preload() {
    game.load.image("background", "assets/robloxBackground3.png"); 
    game.load.image("squareHero", "assets/robloxHead.png");
    game.load.image("evilCircle", "assets/robloxStuds2.jpg");
    game.load.audio('eat', 'assets/oof.mp3');
    game.load.spritesheet('explosion', 'assets/explosion80x80.png', 80, 80, 20);
    game.load.audio("backgroundMusic", "assets/bensound-epic.mp3"); 
}

// Universal variables for our game //

var player;
var cursors;
var badGuy;
var eat;
var score = 0;
var scoreText;
// Times
var timer;
var time = 5;
var timeText;
var explosion;
var reference = this;    
var speed = 250;
var badSpeed = 25;



function create() {
    // A simple background for our game
    game.add.sprite(0, 0, 'background');
    // This will assign player to be our square sprite
    player = game.add.sprite(300, 200, 'squareHero');
    // Allow us to use the keyboard to control the game
    cursors = game.input.keyboard.createCursorKeys();

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    // Bad guy
    badGuy = game.add.sprite(500, 50, 'evilCircle');
    game.physics.arcade.enable(badGuy);
    badGuy.body.collideWorldBounds = true;
    eat = game.sound.add('eat');
    // Creates the score on the text
    scoreText = game.add.text(10, 10, "Oof: " + score, {
            font: '34px Comic Sans MS',
            fill: '#f4e842'
        });
    //  Create our Timer
    timer = game.time.create(false);
    //  Set a TimerEvent to occur after .1 second (100 milliseconds)
    timer.loop(100, updateTime, this);
    //  Start the timer running - this is important!
    //  It won't start automatically, allowing you to start it when ready.
    timer.start();
    // Write the time on the screen    
    timeText = game.add.text(400, 300, "Oof: " + time, {
            font: '34px Comic Sans MS',
            fill: '#f4e842'
        });
         // Add our explosion
    explosion = game.add.sprite(-1000, -1000, 'explosion');
    explosion.animations.add('boom');
    
}

function update() {
    // game.physics.arcade.overlap(1stObject,2ndObject,callAFunction,extraCheck,Context);
    game.physics.arcade.overlap(player, badGuy, eatCircle, null, this);
    // Calls our movePlayer function
    movePlayer();
    runAway();
}

var runAway = function(){
    if(player.x > badGuy.x){
        badGuy.body.velocity.x = -1.5 * badSpeed;
    } else {
        badGuy.body.velocity.x = badSpeed;
} if (player.y > badGuy.y){
            badGuy.body.velocity.y = -1.5 * badSpeed;
    
} else {
    badGuy.body.velocity.y = badSpeed;

}
// player.x       player.body.velocity.y
};

// All of the game functions
var eatCircle = function() {
    eat.play();
    badGuy.kill();
    spawnCircle();
    score += 15;
    scoreText.text = "Oof: " + score;
    time = 5;
    speed -= 5;
    badSpeed += 1;
    
};

var spawnCircle = function() {
    // Determine a random x and y
    var xStart = Math.random() * 550;
    var yStart = Math.random() * 350;
    // Add our sprite, since we killed the last one.
    badGuy = game.add.sprite(xStart, yStart, 'evilCircle');
    game.physics.arcade.enable(badGuy);
        badGuy.body.collideWorldBounds = true;

};



var movePlayer = function() {
    // Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown) {
        // Move to the left
        player.body.velocity.x = speed * -1;
        
    } else if (cursors.right.isDown) {
        // Move to the right
        player.body.velocity.x = speed;

    }
    if (cursors.up.isDown) {
        player.body.velocity.y = -1 * speed;
    } else if (cursors.down.isDown) {
        player.body.velocity.y = speed;
    }
};

var updateTime = function(){
    if(player.alive){
        time -= 0.1;    
        if (time < 0){
            killSquare();
            eat.play();
        } else {
            timeText.text = "Oof: " + time.toFixed(1);        
        }
    }
    
};


var killSquare = function(){
    player.kill();
    explosion.x = player.x;
    explosion.y = player.y;
    
    explosion.animations.play('boom', 16.5, false, true);
    game.time.events.add(4000, youLost, reference );
};

var youLost = function(){
    var again = confirm("Oof oof oof! Oof oof?");
   if (again){
    time = 5;
    score = 0;
    player.x = 300;
    player.y = 200;
    player.revive();  
    badGuy.revive();
    explosion.revive();
    explosion.animations.add('boom');
    explosion.x = -1000;
    explosion.y = -1000;
   }
};