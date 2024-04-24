const GAME_COUNTDOWN = 5;

var InstructionsScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: IntroSceneInitializer,
    init: init,
    preload: preload,
    create: create,
    update: update
});

var puck, paddle1, paddle2, cursors, wasdKeys, scoreText;
var countdownText;
var timedEvent, initialTime;

function IntroSceneInitializer() {
    Phaser.Scene.call(this, { "key": "InstructionsScene" });
}

function init() {

}

function preload() {
    this.load.css('my_styles', 'styles.css');
    this.load.image('paddle', 'assets/handle1.png', { width: 60, height: 10 });
    this.load.image('paddle2', 'assets/handle2.png', { width: 60, height: 10 });
    // this.load.image('puck', 'assets/puck.png', { width: 15, height: 15 });
}

function create() {
    var instructions = this.add.text(
        this.game.config.width / 2, 
        this.game.config.height / 2, 
        "Use your hands to flick the hockey puck\ntowards the opponent’s goal.\n\nFirst to 3 goals wins!\n\nPut your handle in front of your goal to show\nthat you're ready to play.",
        {
            fontSize: 20,
            color: "#000000",
            fontStyle: "normal",
            align: 'center'
        }
    ).setOrigin(0.5);

    // Bare-bones "ice rink"" to familiarize player with goals -- same as air_hockey.js
    this.goal_circle1 = this.add.arc(0, this.game.config.height / 2, this.game.config.height / 4, 90, 270, true, RED, 0.25);
    this.physics.add.existing(this.goal_circle1);
    this.goal_circle1.containsHandle = false;

    this.goal_circle2 = this.add.arc(this.game.config.width, this.game.config.height / 2, this.game.config.height / 4, 90, 270, false, BLUE, 0.25);
    this.physics.add.existing(this.goal_circle2);
    this.goal_circle2.containsHandle = false;

    const goal_area1 = this.add.line(0, this.game.config.height / 4, 3, this.game.config.height / 4, 3, this.game.config.height * 3 / 4, RED) 
    goal_area1.setStrokeStyle(4, BLACK)
    goal_area1.setLineWidth(3)

    const goal_area2 = this.add.line(0, this.game.config.height / 4, this.game.config.width - 3, this.game.config.height / 4, this.game.config.width - 3, this.game.config.height * 3 / 4, RED) 
    goal_area2.setStrokeStyle(4, BLACK)
    goal_area2.setLineWidth(3)

    // Handles for player to familiarize their hands with the sensor
    paddle1 = this.physics.add.sprite(this.game.config.width / 4, this.game.config.height * 3/ 4, 'paddle');
    paddle1.setScale(0.1);
    //paddle1.body.setCircle(30);
    paddle1.setCircle(paddle1.body.halfWidth);
    paddle1.setImmovable(true).setCollideWorldBounds(true);

    paddle2 = this.physics.add.sprite(this.game.config.width *3 / 4, this.game.config.height * 3/ 4, 'paddle2');
    paddle2.setScale(0.1);
    //paddle2.body.setCircle(30);
    paddle2.setCircle(paddle2.body.halfWidth);
    paddle2.setImmovable(true).setCollideWorldBounds(true);

    let scene = this;
    this.physics.add.overlap(this.goal_circle1, paddle1, function(b1, b2) {
        scene.goal_circle1.containsHandle = true;
    });
    this.txt1 = this.add.text(
        this.game.config.width / 5, 
        this.game.config.height / 8, 
        'Waiting for Player 1...', 
        { 
            color: '#ed4a4a',
            align: 'center'
        }).setOrigin(0.5);

    this.physics.add.overlap(this.goal_circle2, paddle2, function(b1, b2) {
        scene.goal_circle2.containsHandle = true;
    });
    this.txt2 = this.add.text(
        this.game.config.width * 4/5 ,
        this.game.config.height / 8, 
        'Waiting for Player 2...',
        { 
            color: '#1239b0',
            align: 'center' 
        }).setOrigin(0.5) ;

    //cursors = this.input.keyboard.createCursorKeys();
    cursors = this.input.mousePointer;


    wasdKeys = this.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W, 
        'down': Phaser.Input.Keyboard.KeyCodes.S, 
        'left': Phaser.Input.Keyboard.KeyCodes.A, 
        'right': Phaser.Input.Keyboard.KeyCodes.D
    });

    // Timer for game countdown
    initialTime = GAME_COUNTDOWN;
    countdownText = this.add.text(0, this.game.config.height * 7 / 8, '', {color: "#000000"}).setOrigin(0.5);


    // Event switcher (for keyboard input testing)
    this.input.keyboard.on('keydown-SPACE', (event) => {
        // Switch to Air Hockey (game play) scene once both players are ready (for 3 seconds)
        this.scene.stop('InstrucionsScene');
        this.scene.start('AirHockeyScene');
    }, this);
}

function update() {

    // Paddle movement
    paddle1.setVelocity(0);
    paddle2.setVelocity(0);

    var speed = 350;


    // WASD controls paddle 1 (temp)
    if (wasdKeys.up.isDown) paddle1.setVelocityY(speed * -1);
    if (wasdKeys.down.isDown) paddle1.setVelocityY(speed);
    if (wasdKeys.left.isDown) paddle1.setVelocityX(speed * -1);
    if (wasdKeys.right.isDown) paddle1.setVelocityX(speed);

    // Cursor controls paddle 2
    var cursorOnPaddle = paddle2.getBounds().contains(cursors.x, cursors.y);
    if (cursorOnPaddle)
    {
        // Paddle stops moving when in the same spot as cursor
        paddle2.setVelocity(0);
    }  
    else
    {
        // Paddle follows cursor
        var angle = Phaser.Math.Angle.Between(paddle2.x, paddle2.y, cursors.x, cursors.y);
        paddle2.setVelocityX(Math.cos(angle) * speed);
        paddle2.setVelocityY(Math.sin(angle) * speed);
    }
    /*if (cursors.up.isDown) paddle2.setVelocityY(-300);
    if (cursors.down.isDown) paddle2.setVelocityY(300);
    if (cursors.left.isDown) paddle2.setVelocityX(-300);
    if (cursors.right.isDown) paddle2.setVelocityX(300);*/

    // Check if paddles are in their goal zones
    this.txt1.setText(this.goal_circle1.containsHandle ? 'Player 1 READY':'Waiting for player 1...');
    // this.goal_circle1.containsHandle = false;

    this.txt2.setText(this.goal_circle2.containsHandle ? 'Player 2 READY':'Waiting for player 2...');
    // this.goal_circle2.containsHandle = false;

    // Once both are ready, start "Game in 3...2...1" Countdown and event switch
    if (this.goal_circle1.containsHandle && this.goal_circle2.containsHandle) {
        startTimer.call(this);
    }
}

function startTimer() {
    timedEvent = this.time.addEvent({ delay: 1000, callback: countdown, callbackScope: this, loop: true })
}

function countdown() { // TODO: need to fix
    initialTime--;

    countdownText.setText('Game starts in: ' + initialTime + 'seconds');

    // Check if the time has reached zero
    if (initialTime <= 0) {
        timedEvent.remove(false);
        // Switch to game play
        this.scene.stop('InstrucionsScene');
        this.scene.start('AirHockeyScene'); 
    }
}
