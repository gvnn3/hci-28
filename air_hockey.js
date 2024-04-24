const RED = 0xed4a4a
const BLUE = 0x1239b0
const NAVY = 0x000080
const YELLOW = 0xFFFF00
const SILVER = 0xd9d9d9
const BLACK = 0x000000
const ICE_WHITE = 0xebeff5
const DARK_GRAY = 0x303030
const TIMEOUT = 60 * 1000

const CIRCLE_RAD = 60
const WIN_SCORE = 3

const GameState = {
    playerHands: [{ x: null, y: null }, { x: null, y: null }],
    updatePlayerHands: function(index, x, y) {
        if (this.playerHands[index]) {
            this.playerHands[index].x = x;
            this.playerHands[index].y = y;
        }
    }
};

var AirHockeyScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: createAirHockeyConstructor,
    init: init,
    preload: preload,
    create: create,
    update: update
});

var puck, paddle1, paddle2, cursors, wasdKeys, scoreText;
var player1Score = 0, player2Score = 0;
var scoreMargin = 100;
var winnerToPass;

function createAirHockeyConstructor() {
    Phaser.Scene.call(this, { "key": "AirHockeyScene" });
}

function init() {
    this.socket = null;
    // this.playerHands = [{ x: null, y: null }, { x: null, y: null }];
}

function preload() {
    // this.load.css('my_styles', 'styles.css');
    this.load.image('paddle', 'assets/handle1.png', { width: 60, height: 10 });
    this.load.image('paddle2', 'assets/handle2.png', { width: 60, height: 10 });
    this.load.image('puck', 'assets/puck.png', { width: 15, height: 15 });
}

function create() {
    const ice_rink_circle_radius = this.game.config.height / 7;

    const center_line = this.add.line(0, 0, this.game.config.width / 2, 0, this.game.config.width / 2, this.game.config.height * 2, RED)
    center_line.setStrokeStyle(4, RED)
    center_line.setLineWidth(3)
    
    const neutral_zone1 = this.add.line(0, 0, this.game.config.width * 2 / 5, 0, this.game.config.width * 2 / 5, this.game.config.height * 2, BLUE)
    neutral_zone1.setStrokeStyle(4, BLUE)
    neutral_zone1.setLineWidth(3)

    const neutral_zone2 = this.add.line(0, 0, this.game.config.width * 3 / 5, 0, this.game.config.width * 3 / 5, this.game.config.height * 2, BLUE)
    neutral_zone2.setStrokeStyle(4, BLUE)
    neutral_zone2.setLineWidth(3)

    const goal_circle1 = this.add.arc(0, this.game.config.height / 2, this.game.config.height / 4, 90, 270, true, RED, 0.25);

    const goal_circle2 = this.add.arc(this.game.config.width, this.game.config.height / 2, this.game.config.height / 4, 90, 270, false, BLUE, 0.25);

    const goal_line1 = this.add.line(0, 0, this.game.config.width / 12, 0, this.game.config.width / 12, this.game.config.height * 2, RED)
    goal_line1.setStrokeStyle(4, RED)
    goal_line1.setLineWidth(3)

    const goal_area1 = this.add.line(0, this.game.config.height / 4, 3, this.game.config.height / 4, 3, this.game.config.height * 3 / 4, RED) 
    goal_area1.setStrokeStyle(4, BLACK)
    goal_area1.setLineWidth(3)
    // this.physics.add.existing(this.goal_area1);
    // this.goal_circle1.containsHandle = false;

    const goal_line2 = this.add.line(0, 0, this.game.config.width * 11/ 12, 0, this.game.config.width * 11 / 12, this.game.config.height * 2, RED)
    goal_line2.setStrokeStyle(4, RED)
    goal_line2.setLineWidth(3)

    const goal_area2 = this.add.line(0, this.game.config.height / 4, this.game.config.width - 3, this.game.config.height / 4, this.game.config.width - 3, this.game.config.height * 3 / 4, RED) 
    goal_area2.setStrokeStyle(4, BLACK)
    goal_area2.setLineWidth(3)
    // this.physics.add.existing(this.goal_area2);

    const center_circle = this.add.graphics();
    center_circle.lineStyle(1, BLUE, 1);

    center_circle.beginPath();
    center_circle.arc(this.game.config.width / 2, this.game.config.height / 2, ice_rink_circle_radius, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360), false);
    center_circle.strokePath();

    const c1 = this.add.arc(this.game.config.width / 5, this.game.config.height / 4, ice_rink_circle_radius, 0, 360, false);
    c1.setStrokeStyle(1, RED);
    const c2 = this.add.arc(this.game.config.width / 5, this.game.config.height * 3 / 4, ice_rink_circle_radius, 0, 360, false);
    c2.setStrokeStyle(1, RED);
    const c3 = this.add.arc(this.game.config.width * 4 / 5, this.game.config.height / 4, ice_rink_circle_radius, 0, 360, false);
    c3.setStrokeStyle(1, RED);
    const c4 = this.add.arc(this.game.config.width * 4 / 5, this.game.config.height * 3 / 4, ice_rink_circle_radius, 0, 360, false);
    c4.setStrokeStyle(1, RED);

    var score_rect = this.add.rectangle(this.game.config.width / 2, 0, 120, 120, SILVER);
    var p1_rect = this.add.rectangle(this.game.config.width / 2 - 40, 0, 40, 25, RED);
    var p2_rect = this.add.rectangle(this.game.config.width / 2 + 40, 0, 40, 25, BLUE);
    var score_label = this.add.text(this.game.config.width / 2, 2, 'SCORE', { fontSize: '10px', fill: '0x000000' }).setOrigin(0.5, 0);

    paddle1 = this.physics.add.sprite(50, this.game.config.height / 2, 'paddle');
    paddle1.setScale(0.25);
    //paddle1.body.setCircle(30);
    paddle1.setCircle(paddle1.body.halfWidth);
    paddle1.setImmovable(true).setCollideWorldBounds(true);

    paddle2 = this.physics.add.sprite(this.game.config.width - 50, this.game.config.height / 2, 'paddle2');
    paddle2.setScale(0.25);
    //paddle2.body.setCircle(30);
    paddle2.setCircle(paddle2.body.halfWidth);
    paddle2.setImmovable(true).setCollideWorldBounds(true);

    puck = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'puck');
    puck.setScale(0.25);
    //puck.body.setCircle(7.5);
    puck.setCircle(puck.body.halfWidth);
    puck.setCollideWorldBounds(true).setBounce(1, 1);

    this.physics.add.collider(puck, paddle1);
    this.physics.add.collider(puck, paddle2);

    //cursors = this.input.keyboard.createCursorKeys();
    cursors = this.input.mousePointer;


    wasdKeys = this.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W, 
        'down': Phaser.Input.Keyboard.KeyCodes.S, 
        'left': Phaser.Input.Keyboard.KeyCodes.A, 
        'right': Phaser.Input.Keyboard.KeyCodes.D
    });


    scoreText = this.add.text(this.game.config.width / 2, 16, '0 - 0', { fontSize: '32px', fill: '0x000000' }).setOrigin(0.5, 0);

    startWebSocket();
}

function update() {
    paddle1.setVelocity(0);
    paddle2.setVelocity(0);

    var speed = 1000;

    if (GameState.playerHands[0].x !== null && GameState.playerHands[0].y !== null) {
        hand1X = (GameState.playerHands[0].x + 600) * (this.game.config.width / 1200);
        hand1Y = (-GameState.playerHands[0].y + 500) * (this.game.config.width / 1200);
        
        var cursorOnPaddle = paddle1.getBounds().contains(hand1X, hand1Y);
        if (cursorOnPaddle)
        {
            // Paddle stops moving when in the same spot as cursor
            paddle1.setVelocity(0);
        }  
        else
        {
            var angle = Phaser.Math.Angle.Between(paddle1.x, paddle1.y, hand1X, hand1Y);
            paddle1.setVelocityX(Math.cos(angle) * speed);
            paddle1.setVelocityY(Math.sin(angle) * speed);
        }
    }
    
    if (GameState.playerHands[1].x !== null && GameState.playerHands[1].y !== null) {
        hand2X = (GameState.playerHands[1].x + 600) * (this.game.config.width / 1200);
        hand2Y = (-GameState.playerHands[1].y + 500) * (this.game.config.width / 1200);

        var cursorOnPaddle = paddle2.getBounds().contains(hand2X, hand2Y);
        if (cursorOnPaddle)
        {
            // Paddle stops moving when in the same spot as cursor
            paddle2.setVelocity(0);
        }  
        else
        {
            var angle = Phaser.Math.Angle.Between(paddle2.x, paddle2.y, hand2X, hand2Y);
            paddle2.setVelocityX(Math.cos(angle) * speed);
            paddle2.setVelocityY(Math.sin(angle) * speed);
        }
    }

    // New goal score logic
    // let scene = this;
    // this.physics.add.overlap(this.goal_area1, puck, function(b1, b2) {
    //     player2Score++;
    //     updateScore.call(this);
    //     resetPuck.call(this);
    //     });

    // this.physics.add.overlap(this.goal_area2, puck, function(b1, b2) {
    //     player1Score++;
    //     updateScore.call(this);
    //     resetPuck.call(this);
    //     });
       
    // } else if (puck.x >= this.game.config.width - scoreMargin && (puck.y >= this.game.config.height / 4 && puck.y <= this.game.config.height * 3 / 4)) {
    //     player1Score++;
    //     updateScore.call(this);
    //     resetPuck.call(this);
    // }

    // Old goal score logic
    if (puck.x <= scoreMargin && (puck.y >= this.game.config.height / 4 && puck.y <= this.game.config.height * 3 / 4)) {
        player2Score++;
        updateScore.call(this);
        resetPuck.call(this);
    } else if (puck.x >= this.game.config.width - scoreMargin && (puck.y >= this.game.config.height / 4 && puck.y <= this.game.config.height * 3 / 4)) {
        player1Score++;
        updateScore.call(this);
        resetPuck.call(this);
    }

    // Switch to WIN screne if 3 goals are scored ------------
    // if (player1Score == WIN_SCORE || player2Score == WIN_SCORE ) {
    //     this.scene.stop('AirHockeyScene');
    //     if (player1Score == WIN_SCORE) {
    //         winnerToPass = 1;
    //     }
    //     if (player2Score == WIN_SCORE) {
    //         winnerToPass = 2;
    //     }
    //     this.scene.start('HighFiveScene', { data: winnerToPass });
    // }
}

function updateScore() {
    scoreText.setText(player1Score + ' - ' + player2Score);

    if (player1Score === WIN_SCORE) {
        // scoreText.setText('Red Wins!');
        winnerToPass = 1;
        this.scene.start('HighFiveScene', { data: winnerToPass });
    } else if (player2Score === WIN_SCORE) {
        // scoreText.setText('Blue Wins!');
        winnerToPass = 2;
        this.scene.start('HighFiveScene', { data: winnerToPass });
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

function resetPuck() {
    puck.setVelocity(0, 0);
    puck.setPosition(config.width / 2, config.height / 2);
}
