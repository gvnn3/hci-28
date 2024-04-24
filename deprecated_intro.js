var IntroScene2 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: IntroScene2Initializer,
    init: init,
    preload: preload,
    create: create,
    update: update
});

function IntroScene2Initializer() {
    Phaser.Scene.call(this, { "key": "IntroScene2" });
}

function init() {

}

function preload() {
    this.load.image('titleImage', 'assets/air hockey assets-6-Title.png');
}

function create() {
    const title = this.add.image(this.game.config.width / 2, this.game.config.height / 2, "titleImage");
    title.displayWith( this.game.config.width / 2)

    this.add.text(
        this.game.config.width / 2, 
        this.game.config.height * 4 / 5, 
        "Raise your hand to play! Two players are needed", 
        {
            fontSize: 20,
            color: "#000000",
            fontStyle: "normal"
        }
    ).setOrigin(0.5);

    this.input.keyboard.on('keydown-SPACE', (event) => {
        // Switch to Instructions scene once there are 2 players
        this.scene.stop('IntroScene2');
        this.scene.start('InstructionsScene');
    }, this);
}

function update() {

}