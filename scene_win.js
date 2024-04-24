var WinScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: WinSceneInitializer,
    init: init,
    preload: preload,
    create: create,
    update: update
});

function WinSceneInitializer() {
    Phaser.Scene.call(this, { "key": "WinScene" });
}

function init(data) {
    this.dataFromHockeyScene = data.data;
    this.countdown = 5;
}

function preload() {
    // this.load.image('titleImage', 'assets/air hockey assets-6-Title.png');
}

function create() {
    // const title = this.add.image(this.game.config.width / 2, this.game.config.height / 2, "titleImage");
    // title.scale = 0.3;

    this.input.keyboard.on('keydown-SPACE', (event) => {
        // Switch to Instructions scene once there are 2 players
        this.scene.stop('IntroScene');
        this.scene.start('InstructionsScene');
    }, this);

    this.add.text(
        this.game.config.width / 2, 
        this.game.config.height / 2, 
        "Congrats! Player " + this.dataFromHockeyScene + " wins!", 
        {
            fontSize: 20,
            color: "#000000",
            fontStyle: "normal"
        }
    ).setOrigin(0.5);

    this.countdownText = this.add.text(
        this.game.config.width / 2,
        this.game.config.height / 10,
        "Starting in: 5",
        {
            fontSize: '30px',
            color: "#FF0000",
            fontStyle: "normal"
        }
    ).setOrigin(0.5);

    this.time.addEvent({
        delay: 1000,
        callback: this.updateCountdown,
        callbackScope: this,
        loop: true
    });
}

function update() {

}

function updateCountdown() {
    this.countdown -= 1;
    this.countdownText.setText("Starting in: " + this.countdown);

    if (this.countdown <= 0) {
        this.time.delayedCall(1000, () => {
            this.scene.stop('WinScene');
            this.scene.start('HighFiveScene');
        }, [], this);
}
}