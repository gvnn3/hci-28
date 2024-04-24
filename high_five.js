var HighFiveScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function HighFiveScene() {
        Phaser.Scene.call(this, { key: 'HighFiveScene' });
    },

    init: function(data) {
        this.dataFromHockeyScene = data.data;
    },

    preload: function() {
        this.load.setBaseURL('http://labs.phaser.io');
    },

    create: function() {
        this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 8,
            "Congrats! Player " + this.dataFromHockeyScene + " wins!",
            {
                fontSize: 20,
                color: "#000000",
                fontStyle: "normal"
            }
                ).setOrigin(0.5);

        var fontSize = this.scale.height * 0.06;
        this.outputText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Good game!\nHi-five each other!\n🙂', {
            fill: '#000000',
            fontSize: fontSize + 'px',
            align: 'center'
        }).setOrigin(0.5);

        this.hasHighFived = false;
        this.initialMessageTimeout = setTimeout(() => {
            if (!this.hasHighFived) {
                this.outputText.setText("Looks like you haven't hi-fived yet...\n☹️");
            }
        }, 7000);

        this.startWebSocket();
    },

    update: function(time) {
        if (this.latestFrame && this.latestFrame.people && time - this.lastUpdate > this.updateInterval) {
            this.checkHighFive(this.latestFrame.people);
            this.lastUpdate = time;
        }
    },

    startWebSocket: function() {
        var url = "ws://cpsc484-04.stdusr.yale.internal:8888/frames";
        this.socket = new WebSocket(url);
        this.socket.onmessage = (event) => {
            this.latestFrame = JSON.parse(event.data);
        };
    },

    checkHighFive: function(people) {
        people.forEach(person => {
            person.joints.forEach(joint => {
                joint.position.x = -joint.position.x - 200;
                joint.position.y = -joint.position.y + 500;
            });
        });

        if (people.length >= 2) {
            const sortedByX = people.sort((a, b) => a.joints[26].position.x - b.joints[26].position.x).slice(0, 2);
            this.identifyPlayers(sortedByX);
        } else if (people.length === 1) {
            const playerPosition = people[0].joints[26].position.x < 0 ? 'Left Player' : 'Right Player';
            this.identifySinglePlayer(people[0], playerPosition);
        }
    },

    identifyPlayers: function(sortedPeople) {
        const hands = sortedPeople.map(person => {
            const hand1 = person.joints[8];
            const hand2 = person.joints[15];
            return hand1.position.y > hand2.position.y ? hand1 : hand2;
        });

        const distance = Math.sqrt(
            Math.pow(hands[0].position.x - hands[1].position.x, 2) +
            Math.pow(hands[0].position.y - hands[1].position.y, 2)
        );

        if (distance <= 10000 && !this.hasHighFived) {
            this.hasHighFived = true;
            clearTimeout(this.initialMessageTimeout);
            this.outputText.setText("Great! Thank you for playing!\nEnjoy your conversation with your new friend!\n🤩");
        }
    },

    identifySinglePlayer: function(person, positionLabel) {
        const hand1 = person.joints[8];
        const hand2 = person.joints[15];
        const higherHand = hand1.position.y > hand2.position.y ? hand1 : hand2;
    }
});