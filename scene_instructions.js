var InstructionsScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: IntroSceneInitializer,
    init: init,
    preload: preload,
    create: create,
    update: update
});

function IntroSceneInitializer() {
    Phaser.Scene.call(this, { "key": "InstructionsScene" });
}

function init() {

}

function preload() {

}

function create() {
    // const title = this.add.image(this.game.config.width / 2, this.game.config.height / 2, "titleImage");
    // title.scale = 0.3;

    this.add.text(
        this.game.config.width / 2, 
        this.game.config.height * 4 / 5, 
        "Use your hands to flick the hockey puck towards the opponent's goal", 
        {
            fontSize: 20,
            color: "#000000",
            fontStyle: "normal"
        }
    ).setOrigin(0.5);


    this.input.keyboard.on('keydown-SPACE', (event) => {
        // Switch to Air Hockey (game play) scene once both players are ready
        this.scene.stop('InstrucionsScene');
        this.scene.start('AirHockeyScene');
    }, this);
}

function update() {

}