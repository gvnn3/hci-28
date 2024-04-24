var InstructionsScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function IntroSceneInitializer() {
        Phaser.Scene.call(this, { "key": "InstructionsScene" });
    },
    init: function init() {
        this.countdown = 5;
    },
    preload: function preload() {

    },
    create: function create() {
        const instructionsText = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            "Instructions: use your hand to flick the hockey puck towards the opponent's goal.\nFirst player to 5 points wins!",
            {
                fontSize: '36px',
                color: "#000000",
                fontStyle: "normal"
            }
        ).setOrigin(0.5);

        this.countdownText = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 10,
            "Starting in: 5",
            {
                fontSize: '48px',
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
    },
    update: function update() {

    },
    updateCountdown: function() {
        this.countdown -= 1;
        this.countdownText.setText("Starting in: " + this.countdown);

        if (this.countdown <= 0) {
            this.time.delayedCall(1000, () => {
                this.scene.stop('InstructionsScene');
                this.scene.start('AirHockeyScene');
            }, [], this);
        }
    }
});
