"use strict";

/*===============================
              RISK             
===============================*/

//SVG map adapted from https://commons.wikimedia.org/wiki/File:Risk_board.svg
//Built using svg, sass and plain javascript

/* Instructions

Aim: To control all the areas on the map
You control the dark blue areas

Every turn you get additional troops to place on the map. 
The number of troops is increased by:
  * Owning more areas
  * Increases slightly after each turn
  * Controlling all areas on a continent
To place a troop click on an area you control when it's the fortify stage 
  
Once your reserve is 0 the stage changes to the battle stage.

To attack an opponent select an area you control to attack from and a neighbouring opponent to attack
You must have a least one troop to attack an opponent.
If you win the opponents territory will become yours and remaining troops will split between the two areas
If you lose the troops in your area will become 0

Click 'End Turn' to continue the game and pass control to the AI

*/

/* Data */

var continents = [{
    areas: ["indonesia", "new_guinea", "eastern_australia", "western_australia"],
    name: "oceania",
    bonus: 2
}, {
    areas: ["brazil", "peru", "venezuela", "argentina"],
    name: "South America",
    bonus: 2
}, {
    areas: ["egypt", "north_africa", "east_africa", "congo", "south_africa", "madagascar"],
    name: "africa",
    bonus: 3
}, {
    areas: ["iceland", "uk", "scandinavia", "northern_europe", "western_europe", "ukraine", "southern_europe"],
    name: "europe",
    bonus: 5
}, {
    areas: ["central_america", "eastern_us", "western_us", "quebec", "ontario", "alberta", "northwest_territory", "alaska", "greenland"],
    name: "North America",
    bonus: 5
}, {
    areas: ["middle_east", "afghanistan", "ural", "siberia", "irkutsk", "yakutsk", "kamchatka", "mongolia", "japan", "china", "siam", "india"],
    name: "asia",
    bonus: 7
}];

var countries = [{ name: "indonesia", continent: "oceania", owner: "none", color: "white", "army": 0, neighbours: ["siam", "western_australia", "new_guinea"] }, { name: "new_guinea", continent: "oceania", owner: "none", color: "white", "army": 0, neighbours: ["indonesia", "eastern_australia", "western_australia"] }, { name: "eastern_australia", continent: "oceania", owner: "none", color: "white", "army": 0, neighbours: ["western_australia", "new_guinea"] }, { name: "western_australia", continent: "oceania", owner: "none", color: "white", "army": 0, neighbours: ["eastern_australia", "new_guinea", "indonesia"] }, { name: "ural", continent: "asia", owner: "none", color: "white", "army": 0, neighbours: ["ukraine", "siberia", "afghanistan", "china"] }, { name: "siberia", continent: "asia", owner: "none", color: "white", "army": 0, neighbours: ["ural", "mongolia", "yakutsk", "irkutsk", "china"] }, { name: "afghanistan", continent: "asia", owner: "none", color: "white", "army": 0, neighbours: ["ukraine", "ural", "middle_east", "china", "india"] }, { name: "irkutsk", continent: "asia", owner: "none", color: "white", "army": 0, neighbours: ["yakutsk", "siberia", "kamchatka", "mongolia"] }, { name: "yakutsk", continent: "asia", owner: "none", color: "white", "army": 0, neighbours: ["irkutsk", "siberia", "kamchatka"] }, { name: "kamchatka", continent: "asia", owner: "none", color: "white", "army": 0, neighbours: ["alaska", "yakutsk", "japan", "irkutsk", "mongolia"] }, { name: "middle_east", continent: "asia", owner: "none", color: "white", "army": 0, neighbours: ["ukraine", "afghanistan", "india", "egypt", "east_africa", "southern_europe"] }, { name: "india", continent: "asia", owner: "none", color: "white", "army": 0, neighbours: ["middle_east", "siam", "afghanistan", "china"] }, { name: "siam", continent: "asia", owner: "none", color: "white", "army": 0, neighbours: ["indonesia", "india", "china"] }, { name: "china", continent: "asia", owner: "none", color: "white", "army": 0, neighbours: ["ural", "siberia", "afghanistan", "mongolia", "siam", "india"] }, { name: "mongolia", continent: "asia", owner: "none", color: "white", "army": 0, neighbours: ["irkutsk", "siberia", "kamchatka", "china", "japan"] }, { name: "japan", continent: "asia", owner: "none", color: "white", "army": 0, neighbours: ["kamchatka", "mongolia"] }, { name: "egypt", continent: "africa", owner: "none", color: "white", "army": 0, neighbours: ["middle_east", "southern_europe", "north_africa", "east_africa"] }, { name: "north_africa", continent: "africa", owner: "none", color: "white", "army": 0, neighbours: ["egypt", "southern_europe", "western_europe", "east_africa", "congo", "brazil"] }, { name: "east_africa", continent: "africa", owner: "none", color: "white", "army": 0, neighbours: ["middle_east", "egypt", "north_africa", "congo", "madagascar", "south_africa"] }, { name: "congo", continent: "africa", owner: "none", color: "white", "army": 0, neighbours: ["south_africa", "north_africa", "east_africa"] }, { name: "south_africa", continent: "africa", owner: "none", color: "white", "army": 0, neighbours: ["congo", "madagascar", "east_africa"] }, { name: "madagascar", continent: "africa", owner: "none", color: "white", "army": 0, neighbours: ["south_africa", "east_africa"] }, { name: "brazil", continent: "South America", owner: "none", color: "white", "army": 0, neighbours: ["peru", "argentina", "north_africa", "venezuela"] }, { name: "peru", continent: "South America", owner: "none", color: "white", "army": 0, neighbours: ["brazil", "argentina", "venezuela"] }, { name: "argentina", continent: "South America", owner: "none", color: "white", "army": 0, neighbours: ["brazil", "peru"] }, { name: "venezuela", continent: "South America", owner: "none", color: "white", "army": 0, neighbours: ["brazil", "peru", "central_america"] }, { name: "iceland", continent: "europe", owner: "none", color: "white", "army": 0, neighbours: ["greenland", "uk", "scandinavia"] }, { name: "scandinavia", continent: "europe", owner: "none", color: "white", "army": 0, neighbours: ["iceland", "uk", "ukraine", "northern_europe"] }, { name: "northern_europe", continent: "europe", owner: "none", color: "white", "army": 0, neighbours: ["ukraine", "uk", "scandinavia", "southern_europe", "western_europe"] }, { name: "western_europe", continent: "europe", owner: "none", color: "white", "army": 0, neighbours: ["north_africa", "uk", "northern_europe", "southern_europe"] }, { name: "southern_europe", continent: "europe", owner: "none", color: "white", "army": 0, neighbours: ["north_africa", "egypt", "northern_europe", "western_europe", "middle_east", "ukraine"] }, { name: "uk", continent: "europe", owner: "none", color: "white", "army": 0, neighbours: ["western_europe", "iceland", "northern_europe", "scandinavia"] }, { name: "ukraine", continent: "europe", owner: "none", color: "white", "army": 0, neighbours: ["scandinavia", "ural", "northern_europe", "southern_europe", "afghanistan", "middle_east"] }, { name: "greenland", continent: "North America", owner: "none", color: "white", "army": 0, neighbours: ["iceland", "quebec", "ontario", "northwest_territory"] }, { name: "central_america", continent: "North America", owner: "none", color: "white", "army": 0, neighbours: ["venezuela", "eastern_us", "western_us"] }, { name: "eastern_us", continent: "North America", owner: "none", color: "white", "army": 0, neighbours: ["central_america", "quebec", "ontario", "western_us"] }, { name: "western_us", continent: "North America", owner: "none", color: "white", "army": 0, neighbours: ["eastern_us", "central_america", "ontario", "alberta"] }, { name: "alaska", continent: "North America", owner: "none", color: "white", "army": 0, neighbours: ["kamchatka", "alberta", "northwest_territory"] }, { name: "alberta", continent: "North America", owner: "none", color: "white", "army": 0, neighbours: ["alaska", "western_us", "ontario", "northwest_territory"] }, { name: "ontario", continent: "North America", owner: "none", color: "white", "army": 0, neighbours: ["greenland", "quebec", "alberta", "western_us", "eastern_us", "northwest_territory"] }, { name: "quebec", continent: "North America", owner: "none", color: "white", "army": 0, neighbours: ["greenland", "eastern_us", "ontario"] }, { name: "northwest_territory", continent: "North America", owner: "none", color: "white", "army": 0, neighbours: ["greenland", "alaska", "alberta", "ontario"] }];

var players = [{
    "name": "Napoleon",
    "country": "France",
    "color": "#030f63",
    "army": 10,
    "reserve": 10,
    "areas": [],
    "bonus": 2,
    "alive": true
}, {
    "name": "Elizabeth I",
    "country": "England",
    "color": "#d6040e",
    "army": 20,
    "reserve": 20,
    "areas": [],
    "bonus": 2,
    "alive": true
}, {
    "name": "Washington",
    "country": "USA",
    "color": "#d86b04",
    "army": 20,
    "reserve": 20,
    "areas": [],
    "bonus": 2,
    "alive": true
}, { "name": "Genghis Khan",
    "country": "Mongolia",
    "color": "#0eb7ae",
    "army": 20,
    "reserve": 20,
    "areas": [],
    "bonus": 2,
    "alive": true
}, { "name": "Catherine",
    "country": "Russia",
    "color": "#104704",
    "army": 20,
    "reserve": 20,
    "areas": [],
    "bonus": 2,
    "alive": true
}, { "name": "Isabella",
    "country": "Spain",
    "color": "#c6c617",
    "army": 20,
    "reserve": 20,
    "areas": [],
    "bonus": 2,
    "alive": true
}];

//Helper Functions

Array.prototype.containsArray = function (array) {
    if (arguments[1]) {
        var index = arguments[1],
            last = arguments[2];
    } else {
        var index = 0,
            last = 0;this.sort();array.sort();
    };
    return index == array.length || (last = this.indexOf(array[index], last)) > -1 && this.containsArray(array, ++index, ++last);
};

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//DOM Elements

var infoName = Array.from(document.getElementsByClassName('country'));
var infoLeader = Array.from(document.getElementsByClassName('leader'));
var infoIncome = Array.from(document.getElementsByClassName('income'));
var areas = Array.from(document.getElementsByClassName('area'));
var bar = Array.from(document.getElementsByClassName('bar'));

var map = document.querySelector('svg');
//Modals
var modal = document.querySelector('#start-modal');
var reserveDisplay = document.querySelector('#reserve');
var chosenLeader = document.querySelector('#chosen-leader');
var chosenCountry = document.querySelector('#chosen-country');
var submitName = document.querySelector('#submit-name');
var bonusModal = document.querySelector('.bonus-modal');
var bonusModalAmount = document.querySelector('.bonus-modal-amount');
var bonusModalText = document.querySelector('.bonus-modal-text');
var bonusModalPlayer = document.querySelector('.bonus-modal-player');
var winModal = document.querySelector('#win-modal');
var winMessage = document.querySelector('.win-message');
var playAgain = document.querySelector('#play-again');
//Info Panels
var playerName = document.querySelector('.player-name');
var playerCountry = document.querySelector('.player-country');
var restart = document.querySelector('#restart');
var playerPanel = document.querySelector('.player-panel');
var infoPanel = document.querySelector('.info');
var turnInfo = document.querySelector('.turn-info');
var turnInfoMessage = document.querySelector('.turn-info-message');
var end = document.querySelector('#end');

//Create Game Object

var Gamestate = {};

Gamestate.countries = JSON.parse(JSON.stringify(countries)); //Array of Countries on Map
Gamestate.players = JSON.parse(JSON.stringify(players)); //Array of all players
Gamestate.player = JSON.parse(JSON.stringify(players))[0]; //Human Player
Gamestate.stage = "Fortify"; // Fortify, Battle or AI Turn
Gamestate.turn = 1;
Gamestate.aiTurn = false;
Gamestate.timeInterval = 1000; //Time between AI Turns
Gamestate.gameOver = false;
Gamestate.prevCountry = null; //Store previously selected country
Gamestate.prevTarget = null; //Store previously selected target;

//Game Setup

Gamestate.init = function () {
    modal.style.display = "block";
    winModal.style.display = "none";
    submitName.addEventListener('click', this.start.bind(this));
    restart.addEventListener('click', this.restart.bind(this));
    map.addEventListener('mousedown', this.handleClick.bind(this));
    end.addEventListener('click', this.handleEndTurn.bind(this));
    playAgain.addEventListener('click', this.restart.bind(this));
};

Gamestate.start = function () {
    var _this = this;

    //Reset Variables on Start/Restart
    end.style.pointerEvents = "auto";
    map.style.pointerEvents = "auto";
    modal.style.display = "none";
    playerPanel.style.display = "flex";
    infoPanel.style.display = "block";
    this.aiTurn = false;
    this.timeInterval = 1000;
    this.gameOver = false;
    this.prevCountry = null;
    this.prevTarget = null;
    this.turn = 1;
    this.stage = "Fortify";
    turnInfoMessage.textContent = "Click on your own areas to place reserve armies";
    this.countries = JSON.parse(JSON.stringify(countries));
    this.players = JSON.parse(JSON.stringify(players));
    this.player = this.players[0];
    this.players[0].name = chosenLeader.value;
    this.players[0].country = chosenCountry.value;
    reserveDisplay.innerHTML = 12;
    playerName.textContent = chosenLeader.value;
    playerCountry.textContent = chosenCountry.value;

    if (this.prevTarget) {
        this.prevTarget.classList.remove('flash');
    }

    //Add Players details to Info Panel
    for (var j = 0; j < this.players.length; j++) {
        infoName[j].innerHTML = this.players[j].country;
        infoLeader[j].innerHTML = this.players[j].name;
        infoName[j].parentElement.classList.remove('defeated');
        bar[j].style.background = this.players[j].color;
    }

    //Add Initial Armies to Game
    shuffle(areas).forEach(function (area, i) {
        _this.countries.forEach(function (country) {
            if (country.name === area.id) {
                //Using module as i = 42 areas 
                country.army = _this.placeInitialArmy(i);
                country.owner = _this.players[i % 6].name;
                country.color = _this.players[i % 6].color;
                _this.players[i % 6].areas.push(area.id);
                setTimeout(function () {
                    area.style.fill = country.color;
                    area.nextElementSibling.textContent = country.army;
                }, 25 * i);
            }
        });
    });
    this.player.army += 10;
    this.player.reserve += 10;
    this.updateInfo();
};

//Handle Initial Army Placement at Random
Gamestate.placeInitialArmy = function (i) {
    var reserve = this.players[i % 6].reserve;
    if (i > 35) {
        //dump remaining army on last area
        this.players[i % 6].reserve = this.players[i % 6].bonus;
        this.players[i % 6].army += this.players[i % 6].reserve;
        return reserve;
    }
    if (this.players[i % 6].reserve > 2) {
        var rand = Math.floor(Math.random() * 4);
        this.players[i % 6].reserve -= rand;
        return rand;
    } else {
        return 0;
    }
};

//Win/Lose Handlers

Gamestate.win = function (player) {
    winMessage.textContent = player.name;
    winMessage.style.color = player.color;
    winModal.style.display = "block";
};

Gamestate.restart = function () {
    modal.style.display = "block";
    winModal.style.display = "none";
};

//Update Display and Strength Bar
Gamestate.updateInfo = function () {
    turnInfo.textContent = this.stage;
    var totalArmy = 0;
    this.players.forEach(function (player) {
        totalArmy += player.army;
    });
    this.players.forEach(function (player, i) {
        infoIncome[i].innerHTML = player.bonus;
        bar[i].style.width = player.army / totalArmy * 600 + 'px';
    });
};

/*Gameplay*/

Gamestate.handleEndTurn = function () {
    if (this.aiTurn) {
        return;
    }
    this.aiTurn = true;
    end.style.pointerEvents = "none";
    map.style.pointerEvents = "none";
    this.aiMove();
};

//Bonus Handlers

Gamestate.unitBonus = function (player, i) {
    player.bonus = 0;
    player.bonus += Math.ceil(player.areas.length / 3);
    player.bonus += this.continentBonus(player);
    player.bonus = Math.ceil(player.bonus * (this.turn / 5));
    if (player.bonus < 2) {
        player.bonus = 2;
    }
    infoIncome[i].innerHTML = player.bonus;
    return player.bonus;
};

Gamestate.continentBonus = function (player) {
    var bonus = 0;
    continents.forEach(function (continent) {
        if (player.areas.containsArray(continent.areas)) {
            bonus += continent.bonus;
        }
    });
    return bonus;
};

//Player

Gamestate.handleClick = function (e) {
    if (this.stage === "Fortify") {
        this.addArmy(e);
    } else if (this.stage === "Battle") {
        this.attack(e);
    }
};

//Fortify area on player click
Gamestate.addArmy = function (e) {
    var _this2 = this;

    this.countries.forEach(function (country) {
        //Check if Target is in country array and player has enough in reserve and player owns territory
        if (e.target.id === country.name && _this2.player.reserve > 0 && country.owner === _this2.player.name) {
            if (e.shiftKey) {
                country.army += _this2.player.reserve;
                _this2.player.reserve = 0;
            } else {
                country.army += 1;
                _this2.player.reserve -= 1;
            }
            reserveDisplay.innerHTML = _this2.player.reserve;
            e.target.nextElementSibling.textContent = country.army;
            //Once reserve is empty, battle stage can start
            if (_this2.player.reserve === 0) {
                _this2.stage = "Battle";
                turnInfo.textContent = _this2.stage;
                turnInfoMessage.textContent = "Choose a country to attack from then a target";
            }
        }
    });
};

//Attack handler finds Attacking and defending countries and passes to the battle function
Gamestate.attack = function (e) {
    var _this3 = this;

    //Remove flash animation from previous area 
    if (this.prevTarget) {
        this.prevTarget.classList.remove('flash');
    }
    this.countries.forEach(function (country) {
        if (e.target.id === country.name) {
            e.target.classList.add('flash');
            _this3.prevTarget = e.target;
            if (_this3.prevCountry) {
                if (_this3.prevCountry.name !== country.name && _this3.prevCountry.owner !== country.owner && _this3.prevCountry.owner === _this3.player.name) {
                    _this3.prevCountry.neighbours.forEach(function (neighbour) {
                        if (neighbour === country.name && neighbour.owner !== country.name && _this3.prevCountry.army > 0) {
                            return _this3.battle(_this3.prevCountry, country, _this3.player, 0);
                        }
                    });
                }
            }
            _this3.prevCountry = country;
        }
    });
};

//Computer

//Handles AI Moves
Gamestate.aiMove = function () {
    var _this4 = this;

    if (this.gameOver) {
        return;
    }
    if (this.prevTarget) {
        this.prevTarget.classList.remove('flash');
    }
    this.stage = "AI Turn";
    turnInfoMessage.textContent = "";

    var _loop = function _loop(i) {
        setTimeout(function () {
            //Handle after last player finished turn
            if (i === _this4.players.length) {
                //Handle if human player defeated
                if (_this4.player.areas.length === 0) {
                    _this4.timeInterval = 10;
                    _this4.player.alive = false;
                    return _this4.aiMove();
                }
                _this4.turn += 1;
                _this4.aiTurn = false;
                _this4.stage = "Fortify";
                turnInfoMessage.textContent = "Click on your own areas to place reserve armies";
                var bonus = _this4.unitBonus(_this4.player, 0);
                _this4.player.reserve += bonus;
                _this4.player.army += bonus;
                end.style.pointerEvents = "auto";
                map.style.pointerEvents = "auto";
                infoName[i - 1].parentElement.classList.remove('highlight');
                infoName[0].parentElement.classList.add('highlight');
                reserveDisplay.innerHTML = _this4.player.reserve;
                return _this4.updateInfo();
            }

            //Handle turn
            infoName[i - 1].parentElement.classList.remove('highlight');
            if (_this4.players[i].alive) {
                infoName[i].parentElement.classList.add('highlight');
                _this4.players[i].reserve = _this4.unitBonus(_this4.players[i], i);
                _this4.players[i].army += _this4.players[i].reserve;

                //Fortify
                var areaToFortify = ["", 0];
                _this4.players[i].areas.forEach(function (area) {
                    _this4.countries.forEach(function (country) {
                        if (country.name === area && _this4.players[i].reserve > 0) {
                            country.neighbours.forEach(function (neighbour) {
                                _this4.countries.forEach(function (c) {
                                    if (c.name === neighbour && c.owner !== _this4.players[i].name) {
                                        var continent = void 0;
                                        continents.forEach(function (x) {
                                            if (x.name === country.continent) {
                                                continent = x;
                                            }
                                        });
                                        var count = 0;
                                        continent.areas.forEach(function (x) {
                                            _this4.players[i].areas.forEach(function (y) {
                                                if (y === x) {
                                                    count++;
                                                }
                                            });
                                        });
                                        var ratio = count / continent.areas.length;
                                        if (ratio >= areaToFortify[1]) {
                                            areaToFortify = [country, ratio];
                                        }
                                    }
                                });
                            });
                        }
                    });
                });

                areaToFortify[0].army += _this4.players[i].reserve;
                _this4.players[i].reserve = 0;
                var areaOnMap = document.getElementById("" + areaToFortify[0].name);
                areaOnMap.nextElementSibling.textContent = areaToFortify[0].army;

                //Attack

                _this4.players[i].areas.forEach(function (area) {
                    _this4.countries.forEach(function (country) {
                        if (country.name === area && country.army > 1) {
                            _this4.aiAttack(country, i);
                        }
                    });
                });
                _this4.updateInfo();
            }
        }, _this4.timeInterval * i);
    };

    for (var i = 1; i <= this.players.length; i++) {
        _loop(i);
    }
};

//Find Attacking and defending countries on AI Attack
Gamestate.aiAttack = function (country, i) {
    var _this5 = this;

    //Add possible targets to array
    var possibleTargets = [];
    country.neighbours.forEach(function (neighbour) {
        _this5.countries.forEach(function (opponent) {
            if (neighbour === opponent.name && opponent.army + 1 < country.army && country.owner !== opponent.owner) {
                possibleTargets.push(opponent);
            }
        });
    });

    //Check which is best target by checking if taking area will control continent
    var target = [possibleTargets[0], 0];
    var continent = void 0;
    possibleTargets.forEach(function (poss) {
        continents.forEach(function (x) {
            if (x.name === poss.continent) {
                continent = x;
            }
        });
        var count = 0;
        continent.areas.forEach(function (x) {
            _this5.players[i].areas.forEach(function (y) {
                if (y === x) {
                    count++;
                }
            });
        });
        var ratio = count / continent.areas.length;
        if (ratio >= target[1]) {
            target = [poss, ratio];
        }
    });
    if (!target[0]) {
        return;
    }
    this.battle(country, target[0], this.players[i], i);
};

//Battle function for Player and AI

Gamestate.battle = function (country, opponent, player, i) {

    var defender = document.getElementById("" + opponent.name);
    var attacker = document.getElementById("" + country.name);
    var opp = void 0;
    this.players.forEach(function (p) {
        if (p.name === opponent.owner) {
            opp = p;
        }
    });

    //Battle Logic
    while (opponent.army >= 0) {
        if (country.army === 0) {
            attacker.nextElementSibling.textContent = 0;
            defender.nextElementSibling.textContent = opponent.army;
            return;
        }
        if (Math.random() > Math.random()) {
            country.army -= 1;
        } else {
            opponent.army -= 1;
        }
    }

    //Handle if Attacker Wins
    if (opponent.army <= 0) {
        //Remove area from defenders areas array
        this.players.forEach(function (player) {
            if (player.name === opponent.owner) {
                var index = player.areas.indexOf(opponent.name);
                if (index > -1) {
                    player.areas.splice(index, 1);
                }
            }
        });

        //Swap defender area to attacker and distribute army evenly between areas
        opponent.owner = player.name;
        opponent.color = player.color;
        player.areas.push(opponent.name);
        defender.style.fill = opponent.color;
        defender.nextElementSibling.textContent = Math.floor(country.army / 2);
        opponent.army = Math.floor(country.army / 2);
        attacker.nextElementSibling.textContent = Math.ceil(country.army / 2);
        country.army = Math.ceil(country.army / 2);

        //If Defender has no areas left they are eliminated
        if (opp.areas.length === 0) {
            opp.alive = false;
            var index = this.players.indexOf(opp);
            infoName[index].parentElement.classList.add('defeated');
        }
    }

    //Calcualting total army for each player
    player.army = 0;
    opp.army = 0;
    this.countries.forEach(function (c) {
        player.areas.forEach(function (area) {
            if (area === c.name) {
                player.army += c.army;
            }
        });
        opp.areas.forEach(function (area) {
            if (area === c.name) {
                opp.army += c.army;
            }
        });
    });

    //Display Bonus modal if player controls continent
    if (this.player.alive) {
        continents.forEach(function (continent) {
            if (player.areas.containsArray(continent.areas)) {
                var matchedCountry = continent.areas.some(function (a) {
                    return a === opponent.name;
                });
                if (matchedCountry) {
                    bonusModal.style.display = "block";
                    bonusModalPlayer.textContent = player.name + " controls";
                    bonusModalText.textContent = continent.name;
                    bonusModalText.style.color = player.color;
                    bonusModalAmount.textContent = continent.bonus;
                    setTimeout(function () {
                        bonusModal.style.display = "none";
                    }, 2000);
                }
            }
        });
    }

    //Win Condition
    if (player.areas.length === 42) {
        this.gameOver = true;
        this.win(player);
    }
};

//Initialize Game
Gamestate.init();