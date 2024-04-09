var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
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
var puck, paddle1, paddle2, cursors, wasdKeys;
var player1Score = 0, player2Score = 0;
var scoreMargin = 100; // Margin for scoring

function preload() {
    this.load.css('my_styles', 'styles.css');
    this.load.svg('paddle', 'paddle.svg', { width: 60, height: 10 });
    this.load.svg('puck', 'puck.svg', { width: 15, height: 15 });
}

function create() {
    paddle1 = this.physics.add.sprite(50, this.game.config.height / 2, 'paddle');
    paddle1.setScale(0.3); // Scale down to fit the circular boundary
    paddle1.body.setCircle(30); // Set circular collision boundary
    paddle1.setImmovable(true).setCollideWorldBounds(true);

    paddle2 = this.physics.add.sprite(this.game.config.width - 50, this.game.config.height / 2, 'paddle');
    paddle2.setScale(0.3); // Scale down to fit the circular boundary
    paddle2.body.setCircle(30); // Set circular collision boundary
    paddle2.setImmovable(true).setCollideWorldBounds(true);

    puck = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'puck');
    puck.setScale(0.5); // Scale down to fit the circular boundary
    puck.body.setCircle(7.5); // Set circular collision boundary
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

    var scoreText = this.add.text(this.game.config.width / 2, 16, '0 - 0', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5, 0);
    // scoreText.setClassName('score-text'); // TODO: debug why this 1. doesn't override CSS styles and 2. why this prevents the WASD keys from moving the game play
}

function update() {
    paddle1.setVelocity(0);
    paddle2.setVelocity(0);

    // Paddle controls
    if (wasdKeys.up.isDown) paddle1.setVelocityY(-300);
    if (wasdKeys.down.isDown) paddle1.setVelocityY(300);
    if (wasdKeys.left.isDown) paddle1.setVelocityX(-300);
    if (wasdKeys.right.isDown) paddle1.setVelocityX(300);

    if (cursors.up.isDown) paddle2.setVelocityY(-300);
    if (cursors.down.isDown) paddle2.setVelocityY(300);
    if (cursors.left.isDown) paddle2.setVelocityX(-300);
    if (cursors.right.isDown) paddle2.setVelocityX(300);

    // Check for score
    if (puck.x <= scoreMargin) {
        // Puck is within the left scoring margin
        player2Score++;
        updateScore();
        resetPuck();
    } else if (puck.x >= config.width - scoreMargin) {
        // Puck is within the right scoring margin
        player1Score++;
        updateScore();
        resetPuck();
    }
}

function updateScore() {
    scoreText.setText(player1Score + ' - ' + player2Score);
}

function resetPuck() {
    // Reset puck position and velocity
    puck.setPosition(config.width / 2, config.height / 2);
    puck.setVelocity(0, 0); // Optionally, you can set a starting velocity here
}