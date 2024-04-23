# Air Hockey Game for Group 28 of HCI Course Spring 2024

A duplicate version (text file) of this README can be found at README.txt

README requirements (from https://cpsc484-584-hci.gitlab.io/s24/project/):

The code includes a README text file that explains how to install any dependencies and run the project (2 pts), provides a brief description of the project, problem space, and what tasks the installation addresses (1 pts), indicates explicitly if there are any constraints from the deployment environment (1 pts), and includes a collaboration record that specifies what each team member contributed to the prototype (1 pts).

By including constraints from the deployment environment in the README, we mean that the text file should explain any physical constraints that are important to consider when the course staff evaluates the system prototype. For instance, would users need to be able to stand at least a minimum distance away from the Kinect for the application to run as intended?

## Dependencies and running the project
No separate dependencies need to be installed to run Air Hockey. We only utilize Phaser, which is imported via JS.

### Laptop development

Our game runs out of the top level `index.html` file. To load the assets correctly, we have had success running the code locally on our laptops with a Python environment from the top-level of our code:

`python3 -m http.server 8000`

The game is then playable from accessing `http://localhost:8000/`

Alternatively, the game also loads correctly from `index.html` on laptops using VSCode's Live Server Extension (v5.7.9). Note that we have documented image assets failing to load when running the game as a direct path from `index.html`, so please follow the steps above if planning to run the game from a laptop.

### TV display

Throughout testing, the assets have properly loaded on the TV display (TV4) with no additional steps.

## Project Description, Problem Space & Tasks
Our project developed Air Hockey, an interactive multiplayer air hockey game playable via the TV display that intakes Kinect data for the player to control.

When there are 2 players with raised hands ready to play, they will be directed to control each of their respective paddles. The puck will bounce off the edges of the screen, similar to how one behaves in a real-life rink, and the players will use their hands as “paddles” to hit the puck back and forth and score goals. The game will be won by the player first to 3 goals, and they will be asked to high-five each other, which we hope will serve as an introduction to meet someone new.

Problem Space: Students find meeting new people and finding new activities challenging.

Tasks:
1. Play a multiplayer game
2. Meet someone new

## Deployment Environment Constraints
Due to the positioning of the Kinect sensor and its sensitivity, players must be at the closest, 2 feet from the display, and 5 feet at the furthest.

Most importantly, their hands must stay in the sensor range, which extends to the width of the TV display according to the depth constraints above.

(TODO: Kai to update)

## Collaboration Record
Student Name and NetID: George Neville-Neil **gn262**
* x
* y


Student Name and NetID: Kris Qiu **kq43**
Contribution: 



Student Name and NetID: June Sun **js3995**
Contribution: 
* Intro and instruction screen design
* Scene-switching and modification of all Phaser scene (.js) files to support this function
* README documentation


Student Name and NetID: Kai Xu **kx38**
Contribution:





