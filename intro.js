var IntroScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function IntroSceneInitializer() {
        Phaser.Scene.call(this, { "key": "IntroScene" });
    },
    init: function init() {
        this.handsRaisedStartTime = null;
        this.requiredTimeToSwitch = 500;
        this.lastTextUpdate = 0;
        this.textUpdateInterval = 500;
        this.latestFrame = null;
    },
    preload: function preload() {
        this.load.image('titleImage', 'assets/title.png');
    },
    create: function create() {
        const title = this.add.image(this.game.config.width / 2, this.game.config.height / 2, "titleImage");
        title.setDisplaySize(this.game.config.width, this.game.config.height * 0.3);

        this.promptText = this.add.text(
            this.game.config.width / 2, 
            this.game.config.height * 0.8, 
            "Raise your hand to play! Two players required", 
            {
                fontSize: '20px',
                color: "#000000",
                fontStyle: "normal",
                align: "center"
            }
        ).setOrigin(0.5);

        this.outputText1 = this.add.text(this.game.config.width * 0.25, this.game.config.height / 4, '', {
            fill: 'red',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5);

        this.outputText2 = this.add.text(this.game.config.width * 0.75, this.game.config.height / 4, '', {
            fill: 'blue',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-SPACE', (event) => {
            this.scene.stop('IntroScene');
            this.scene.start('InstructionsScene');
        }, this);

        this.startWebSocket();
    },
    update: function update(time) {
        if (this.latestFrame && this.latestFrame.people) {
            this.adjustCoordinates(this.latestFrame.people);
            const peopleData = this.checkHandPositions(this.latestFrame.people);
            if (time - this.lastTextUpdate > this.textUpdateInterval) {
                this.updateTextDisplays(peopleData);
                this.lastTextUpdate = time;
            }
        }
    },
    startWebSocket: function() {
        var url = "ws://cpsc484-04.stdusr.yale.internal:8888/frames";
        var socket = new WebSocket(url);
        socket.onmessage = (event) => {
            this.latestFrame = JSON.parse(event.data);
        };
    },
    adjustCoordinates: function(people) {
        people.forEach(person => {
            person.joints.forEach(joint => {
                joint.position.x = -joint.position.x - 200;
                joint.position.y = -joint.position.y + 500;
            });
        });
    },
    checkHandPositions: function(people) {
        if (people.length >= 2) {
            const sortedByX = people.sort((a, b) => a.joints[26].position.x - b.joints[26].position.x);
            const handRaised1 = this.checkPlayer(sortedByX[0]);
            const handRaised2 = this.checkPlayer(sortedByX[1]);

            if (handRaised1 && handRaised2) {
                if (this.handsRaisedStartTime === null) {
                    this.handsRaisedStartTime = Date.now();
                } else if (Date.now() - this.handsRaisedStartTime > this.requiredTimeToSwitch) {
                    this.scene.stop('IntroScene');
                    this.scene.start('InstructionsScene');
                }
            } else {
                this.handsRaisedStartTime = null;
            }
            return [sortedByX[0], sortedByX[1], handRaised1, handRaised2];
        } else {
            this.handsRaisedStartTime = null;
            return [];
        }
    },
    updateTextDisplays: function(peopleData) {
        if (peopleData.length > 0) {
            const [person1, person2, handRaised1, handRaised2] = peopleData;
            this.setTextOutput(this.outputText1, 'Player 1', handRaised1);
            this.setTextOutput(this.outputText2, 'Player 2', handRaised2);
        } else {
            this.outputText1.setText('');
            this.outputText2.setText('');
        }
    },
    checkPlayer: function(person) {
        const hand = person.joints[8].position.y > person.joints[15].position.y ? person.joints[8] : person.joints[15];
        const head = person.joints[26];
        return hand.position.y > head.position.y;
    },
    setTextOutput: function(textElement, playerLabel, isRaised) {
        if (isRaised) {
            textElement.setText(`${playerLabel} has raised their hand`);
        } else {
            textElement.setText(`${playerLabel}, raise your hand to join`);
        }
    }
});