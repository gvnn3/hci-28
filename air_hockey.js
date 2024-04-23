const RED = 0xed4a4a
const BLUE = 0x1239b0
const NAVY = 0x000080
const YELLOW = 0xFFFF00
const SILVER = 0xd9d9d9
const BLACK = 0x000000
const ICE_WHITE = 0xebeff5
const DARK_GRAY = 0x303030
const TIMEOUT = 60 * 1000 // 60 seconds in milliseconds

const CIRCLE_RAD = 60

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    backgroundColor: ICE_WHITE,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var puck, paddle1, paddle2, cursors, wasdKeys, scoreText;
var player1Score = 0, player2Score = 0;
var scoreMargin = 25;

function preload() {
    this.load.css('my_styles', 'styles.css');
    this.load.svg('paddle', 'paddle.svg', { width: 60, height: 10 });
    this.load.svg('puck', 'puck.svg', { width: 15, height: 15 });
}

function create() {
    const center_line = this.add.line(0, 0, this.game.config.width / 2, 0, this.game.config.width / 2, this.game.config.height * 2, RED)
    center_line.setStrokeStyle(4, RED)
    center_line.setLineWidth(3)

    const neutral_zone1 = this.add.line(0, 0, this.game.config.width / 2 - 90, 0, this.game.config.width / 2 - 90, this.game.config.height * 2, BLUE)
    neutral_zone1.setStrokeStyle(4, BLUE)
    neutral_zone1.setLineWidth(3)

    const neutral_zone2 = this.add.line(0, 0, this.game.config.width / 2 + 90, 0, this.game.config.width / 2 + 90, this.game.config.height * 2, BLUE)
    neutral_zone2.setStrokeStyle(4, BLUE)
    neutral_zone2.setLineWidth(3)

    const goal_line1 = this.add.line(0, 0, 25, 0, 25, this.game.config.height * 2, RED)
    goal_line1.setStrokeStyle(4, RED)
    goal_line1.setLineWidth(3)

    const goal_line2 = this.add.line(0, 0, this.game.config.width - 25, 0, this.game.config.width - 25, this.game.config.height * 2, RED)
    goal_line2.setStrokeStyle(4, RED)
    goal_line2.setLineWidth(3)

    const center_circle = this.add.graphics();
    center_circle.lineStyle(1, BLUE, 1);

    center_circle.beginPath();
    center_circle.arc(this.game.config.width / 2, this.game.config.height / 2, CIRCLE_RAD, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360), false);
    center_circle.strokePath();

    const c1 = this.add.arc(this.game.config.width / 5, this.game.config.height / 4, CIRCLE_RAD, 0, 360, false);
    c1.setStrokeStyle(1, RED);
    const c2 = this.add.arc(this.game.config.width / 5, this.game.config.height * 3 / 4, CIRCLE_RAD, 0, 360, false);
    c2.setStrokeStyle(1, RED);
    const c3 = this.add.arc(this.game.config.width * 4 / 5, this.game.config.height / 4, CIRCLE_RAD, 0, 360, false);
    c3.setStrokeStyle(1, RED);
    const c4 = this.add.arc(this.game.config.width * 4 / 5, this.game.config.height * 3 / 4, CIRCLE_RAD, 0, 360, false);
    c4.setStrokeStyle(1, RED);

    var score_rect = this.add.rectangle(this.game.config.width / 2, 0, 120, 120, SILVER);
    var p1_rect = this.add.rectangle(this.game.config.width / 2 - 40, 0, 40, 25, RED)
    var p2_rect = this.add.rectangle(this.game.config.width / 2 + 40, 0, 40, 25, BLUE)
    var score_label = this.add.text(this.game.config.width / 2, 2, 'SCORE', { fontSize: '10px', fill: '0x000000' }).setOrigin(0.5, 0);

    paddle1 = this.physics.add.sprite(50, this.game.config.height / 2, 'paddle');
    paddle1.setScale(0.3);
    paddle1.body.setCircle(30);
    paddle1.setImmovable(true).setCollideWorldBounds(true);

    paddle2 = this.physics.add.sprite(this.game.config.width - 50, this.game.config.height / 2, 'paddle');
    paddle2.setScale(0.3);
    paddle2.body.setCircle(30);
    paddle2.setImmovable(true).setCollideWorldBounds(true);

    puck = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'puck');
    puck.setScale(0.5);
    puck.body.setCircle(7.5);
    puck.setCollideWorldBounds(true).setBounce(1, 1);

    this.physics.add.collider(puck, paddle1);
    this.physics.add.collider(puck, paddle2);

    cursors = this.input.keyboard.createCursorKeys();
    wasdKeys = this.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W, 
        'down': Phaser.Input.Keyboard.KeyCodes.S, 
        'left': Phaser.Input.Keyboard.KeyCodes.A, 
        'right': Phaser.Input.Keyboard.KeyCodes.D
    });


    scoreText = this.add.text(this.game.config.width / 2, 16, '0 - 0', { fontSize: '32px', fill: '0x000000' }).setOrigin(0.5, 0);
}

function update() {
    paddle1.setVelocity(0);
    paddle2.setVelocity(0);

    if (wasdKeys.up.isDown) paddle1.setVelocityY(-300);
    if (wasdKeys.down.isDown) paddle1.setVelocityY(300);
    if (wasdKeys.left.isDown) paddle1.setVelocityX(-300);
    if (wasdKeys.right.isDown) paddle1.setVelocityX(300);

    if (cursors.up.isDown) paddle2.setVelocityY(-300);
    if (cursors.down.isDown) paddle2.setVelocityY(300);
    if (cursors.left.isDown) paddle2.setVelocityX(-300);
    if (cursors.right.isDown) paddle2.setVelocityX(300);

    if (puck.x <= scoreMargin) {
        player2Score++;
        updateScore();
        resetPuck();
    } else if (puck.x >= config.width - scoreMargin) {
        player1Score++;
        updateScore();
        resetPuck();
    }

}

function updateScore() {
    scoreText.setText(player1Score + ' - ' + player2Score);
    setTimeout(reset_game, TIMEOUT);
}

function resetPuck() {
    puck.setPosition(config.width / 2, config.height / 2);
    puck.setVelocity(0, 0);
}

function reset_game ()
{
    game.destroy(true, false);
    game = new Phaser.Game(config);
}

