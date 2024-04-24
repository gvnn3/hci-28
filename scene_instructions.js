const GAME_COUNTDOWN = 5;
const FONT_SIZE = 32;

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
    this.countdown = 5;
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
            fontSize: FONT_SIZE,
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
    // var score_rect = this.add.rectangle(this.game.config.width / 2, 0, 120, 120, SILVER);
    // var p1_rect = this.add.rectangle(this.game.config.width / 2 - 40, 0, 40, 25, RED);
    // var p2_rect = this.add.rectangle(this.game.config.width / 2 + 40, 0, 40, 25, BLUE);
    // var score_label = this.add.text(this.game.config.width / 2, 2, 'SCORE', { fontSize: '10px', fill: '0x000000' }).setOrigin(0.5, 0);

    paddle1 = this.physics.add.sprite(this.game.config.width / 4, this.game.config.height * 4 / 5, 'paddle');
    paddle1.setScale(0.3);
    //paddle1.body.setCircle(30);
    paddle1.setCircle(paddle1.body.halfWidth);
    paddle1.setImmovable(true).setCollideWorldBounds(true);

    paddle2 = this.physics.add.sprite(this.game.config.width *3 / 4, this.game.config.height * 4 / 5, 'paddle2');
    paddle2.setScale(0.3);
    //paddle2.body.setCircle(30);
    paddle2.setCircle(paddle2.body.halfWidth);
    paddle2.setImmovable(true).setCollideWorldBounds(true);

    // puck = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'puck');
    // puck.setScale(0.3);
    // //puck.body.setCircle(7.5);
    // puck.setCircle(puck.body.halfWidth);
    // puck.setCollideWorldBounds(true).setBounce(1, 1);

    // this.physics.add.collider(puck, paddle1);
    // this.physics.add.collider(puck, paddle2);

    let scene = this;
    this.physics.add.overlap(this.goal_circle1, paddle1, function(b1, b2) {
        scene.goal_circle1.containsHandle = true;
    });
    this.txt1 = this.add.text(
        this.game.config.width / 5, 
        this.game.config.height / 8, 
        'Waiting for Player 1...', 
        { 
            fontSize: FONT_SIZE,
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
            fontSize: FONT_SIZE,
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
    // initialTime = GAME_COUNTDOWN;
    // countdownText = this.add.text(0, this.game.config.height * 7 / 8, '', {color: "#000000"}).setOrigin(0.5);

    // this.countdownText = this.add.text(
    //     this.game.config.width / 2,
    //     this.game.config.height * 4 / 5,
    //     "Starting in: 5",
    //     {
    //         fontSize: '30px',
    //         color: "#2c9456",
    //         fontStyle: "normal"
    //     }
    // ).setOrigin(0.5);


    // Event switcher (for keyboard input testing)
    this.input.keyboard.on('keydown-SPACE', (event) => {
        // Switch to Air Hockey (game play) scene once both players are ready (for 3 seconds)
        this.scene.stop('InstrucionsScene');
        this.scene.start('AirHockeyScene');
    }, this);

    startWebSocket();
}

function update() {

    paddle1.setVelocity(0);
    paddle2.setVelocity(0);

    var speed = 750;

    if (GameState.playerHands[0].x !== null && GameState.playerHands[0].y !== null) {
        hand1X = (GameState.playerHands[0].x + 600) * (this.game.config.width / 1200);
        hand1Y = (-GameState.playerHands[0].y + 500) * (this.game.config.width / 1200);
        var angle = Phaser.Math.Angle.Between(paddle1.x, paddle1.y, hand1X, hand1Y);
        paddle1.setVelocityX(Math.cos(angle) * speed);
        paddle1.setVelocityY(Math.sin(angle) * speed);
    }
    
    if (GameState.playerHands[1].x !== null && GameState.playerHands[1].y !== null) {
        hand2X = (GameState.playerHands[1].x + 600) * (this.game.config.width / 1200);
        hand2Y = (-GameState.playerHands[1].y + 500) * (this.game.config.width / 1200);
        var angle = Phaser.Math.Angle.Between(paddle2.x, paddle2.y, hand2X, hand2Y);
        paddle2.setVelocityX(Math.cos(angle) * speed);
        paddle2.setVelocityY(Math.sin(angle) * speed);
    }

    // Check if paddles are in their goal zones
    this.txt1.setText(this.goal_circle1.containsHandle ? 'Player 1 READY':'Waiting for player 1...');
    // this.goal_circle1.containsHandle = false;

    this.txt2.setText(this.goal_circle2.containsHandle ? 'Player 2 READY':'Waiting for player 2...');
    // this.goal_circle2.containsHandle = false;

    // Once both are ready, start "Game in 3...2...1" Countdown and event switch
    if (this.goal_circle1.containsHandle && this.goal_circle2.containsHandle) {
        this.scene.stop('InstructionsScene');
        this.scene.start('AirHockeyScene');
        // startTimer.call(this);
    }
}

function startTimer() {
    // timedEvent = this.time.addEvent({ delay: 1000, callback: countdown, callbackScope: this, loop: true })
    this.time.addEvent({
        delay: 1000,
        callback: this.updateCountdown,
        callbackScope: this,
        loop: true
    });
}

function updateCountdown() { // TODO: need to fix
    this.countdown -= 1;
    this.countdownText.setText("Starting in: " + this.countdown);

    if (this.countdown <= 0) {
        this.time.delayedCall(1000, () => {
            this.scene.stop('InstructionsScene');
            this.scene.start('AirHockeyScene');
        }, [], this);
    }
    }

function startWebSocket() {
    var url = "ws://cpsc484-04.stdusr.yale.internal:8888/frames";
    this.socket = new WebSocket(url);
    this.socket.onmessage = (event) => {
        var data = JSON.parse(event.data);
        this.processAndIdentifyPlayers(data.people);
    }
}

function processAndIdentifyPlayers(people) {
    people.forEach(person => {
        person.joints.forEach(joint => {
            joint.position.x = (-joint.position.x - 200);
            joint.position.y = (-joint.position.y + 500);
        });
    });

    let sortedPeople = [...people].sort((a, b) => {
        const distanceA = Math.sqrt(
            a.joints[26].position.x ** 2 + 
            a.joints[26].position.y ** 2 + 
            a.joints[26].position.z ** 2
        );
        const distanceB = Math.sqrt(
            b.joints[26].position.x ** 2 + 
            b.joints[26].position.y ** 2 + 
            b.joints[26].position.z ** 2
        );
        return distanceA - distanceB;
    }).slice(0, 2); 

    sortedPeople = sortedPeople.sort((a, b) => {
        return a.joints[26].position.x - b.joints[26].position.x;
    });

    sortedPeople.forEach((person, index) => {
        if (index < 2) {
            const higherHand = person.joints[8].position.y > person.joints[15].position.y ? person.joints[8] : person.joints[15];
            const x = higherHand.position.x;
            const y = higherHand.position.y;
            GameState.updatePlayerHands(index, x, y);
        }
    });
}