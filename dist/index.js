"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const general = (0, debug_1.default)("War >");
const speed = 100;
let order = 0;
const arrange_rounds = ['none', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'sixth', 'Seventh', 'Eighth', 'Ninth', 'tenth',];
let winner;
class Force {
    constructor(name, ability, health, xp, damage) {
        this.name = "";
        this.ability = "none";
        this.health = 100;
        this.xp = 0;
        this.damage = 0;
        this.teamname = '';
        this.name = name;
        this.ability = ability;
        this.health = health;
        this.xp = xp;
        this.damage = damage;
        this.log = (0, debug_1.default)(`War >${this.name} ${this.teamname}`);
    }
    amIDead() {
        return this.health <= 0;
    }
    attack(enemy) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.amIDead() || enemy.amIDead()) {
                this.log(`I can not :(${enemy.name}`);
                return false;
            }
            this.log(`I'm attacking to ${enemy.name} ...`);
            enemy.health += this.damage;
            if (enemy.amIDead()) {
                this.xp += 100;
                this.log(`I'm kill ${enemy.name} (+100xp)`);
            }
            else {
                this.log(`enemy health: ${enemy.health}`);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, speed);
            });
        });
    }
}
class Sniper extends Force {
    constructor(name) {
        super(name, 'headshot', 125, 0, -75);
    }
}
class Doctor extends Force {
    constructor(name) {
        super(name, 'Help', 25, 0, 25);
        this.bandage = 5;
    }
    attack(enemy) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.amIDead() || enemy.amIDead() || this.bandage <= 0) {
                return false;
            }
            this.log(`I'm Helping to ${enemy.name} ...`);
            this.bandage--;
            enemy.health += this.damage;
            this.xp += 50;
            this.log(`teammate health:(${enemy.health})`);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, speed);
            });
        });
    }
}
class Assassin extends Force {
    constructor(name) {
        super(name, 'thuggee', 50, 0, -100);
    }
}
class Soldier extends Force {
    constructor(name) {
        super(name, 'shooting', 100, 0, -25);
    }
}
class Team {
    constructor(name, heroes, type) {
        this.name = "";
        this.type = '';
        this.name = name;
        this.forces = heroes;
        this.type = type;
        this.log = (0, debug_1.default)(`War >${this.name}`);
    }
    attack(enemy) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log(`Attacking to ${enemy.name}`);
            for (let i = 0; i < this.forces.length; i++) {
                if (this.Defeated()) {
                    this.log("We are losing");
                    general(`The winner is: ${enemy.name}`);
                    return;
                }
                const randomEnemy = Math.floor(Math.random() * enemy.forces.length);
                if (this.forces[i].damage > 0) {
                    yield this.forces[i].attack(this.forces[randomEnemy]);
                }
                else {
                    yield this.forces[i].attack(enemy.forces[randomEnemy]);
                }
            }
            order += 1;
            general(`>>>End of the ${arrange_rounds[order]} round<<<\nRemaining forces:\n${this.name}:${this.aliveForces().length}\n${enemy.name}:${enemy.aliveForces().length}`);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, speed);
            });
        });
    }
    setname() {
        this.forces.forEach((index) => {
            return index.teamname = this.name;
        });
    }
    aliveForces() {
        return this.forces.filter((_force) => !_force.amIDead());
    }
    Defeated() {
        return !this.forces.find((_force) => !_force.amIDead());
    }
}
function startWar(timeout = 5) {
    return __awaiter(this, void 0, void 0, function* () {
        general("The war will start in a few seconds...");
        const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            general(`In ${timeout--}`);
            if (timeout < 0) {
                clearInterval(interval);
                general(">>>War Started!<<<");
                const team1 = new Team("T1", [], 'Militant');
                const team2 = new Team("T2", [], 'peaceful');
                const team3 = new Team("T3", [], 'Militant');
                const team4 = new Team("T4", [], 'peaceful');
                const team5 = new Team("T5", [], 'Militant');
                const teams = [team1, team2, team3, team4, team5];
                for (let index = 0; index < teams.length; index++) {
                    const element = teams[index];
                    element.setname();
                    element.forces.push(new Soldier(`soldier(${element.name})`), new Sniper(`sniper(${element.name})`), new Assassin(`assassin(${element.name})`), new Doctor(`doctor(${element.name})`));
                }
                // while (!team1.Defeated() && !team2.Defeated() && !team3.Defeated() && !team4.Defeated() && !team5.Defeated()) {
                while ((teams.filter(_team => _team.Defeated() == false)).length != 1) {
                    const r = Math.floor(Math.random() * 12);
                    if (r == 1) {
                        yield team1.attack(team2);
                    }
                    else if (r == 2) {
                        yield team3.attack(team1);
                    }
                    else if (r == 3) {
                        yield team5.attack(team1);
                    }
                    else if (r == 4) {
                        yield team1.attack(team3);
                    }
                    else if (r == 5) {
                        yield team3.attack(team2);
                    }
                    else if (r == 6) {
                        yield team5.attack(team2);
                    }
                    else if (r == 7) {
                        yield team1.attack(team4);
                    }
                    else if (r == 8) {
                        yield team3.attack(team4);
                    }
                    else if (r == 9) {
                        yield team5.attack(team3);
                    }
                    else if (r == 10) {
                        yield team1.attack(team5);
                    }
                    else if (r == 11) {
                        yield team3.attack(team5);
                    }
                    else if (r == 12) {
                        yield team5.attack(team4);
                    }
                }
                teams.forEach((index) => {
                    if (index.Defeated() == false) {
                        winner = index.name;
                    }
                });
                const allforces = [];
                const allxp = [];
                for (let index = 0; index < teams.length; index++) {
                    const element = teams[index];
                    element.forces.forEach((inforces) => {
                        allforces.push(inforces);
                        allxp.push(inforces.xp);
                    });
                }
                const maxxp = allforces[allxp.indexOf(Math.max(...allxp))];
                if (team1.Defeated() && team2.Defeated() && team3.Defeated() && team4.Defeated() && team5.Defeated()) {
                    general("All heroes are passed aways from both tribes :(");
                    general(`\n    (War Summary)\n\nNumber of rounds: ${order}\nExperienced hero: ${maxxp.name}(${maxxp.xp}xp)`);
                }
                else
                    general(`X=> ( THE WAR IS END ) <=X\n\n    W . I . N . N . E . R\n      ⊱⊱⊱⊱⊱( ${winner} )⊰⊰⊰⊰⊰\n`);
                general(`\n    (War Summary)\n\nNumber of rounds: ${order}\nExperienced hero: ${maxxp.name}(${maxxp.xp}xp)`);
            }
        }), 1000);
    });
}
startWar();
