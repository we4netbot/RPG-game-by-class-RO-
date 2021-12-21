import debug from 'debug'
const general = debug("War >")
const speed = 100
let order = 0
const arrange_rounds: any[] = ['none', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'sixth', 'Seventh', 'Eighth', 'Ninth', 'tenth',]
let winner: string;

class Force {
    name: string = "";
    ability: string = "none";
    health: number = 100;
    xp: number = 0;
    damage: number = 0;
    teamname: string = '';
    log: debug.Debugger;

    constructor(name: string, ability: string, health: number, xp: number, damage: number) {
        this.name = name;
        this.ability = ability;
        this.health = health;
        this.xp = xp;
        this.damage = damage;
        this.log = debug(`War >${this.name} ${this.teamname}`);
    }

    amIDead() {
        return this.health <= 0;
    }

    async attack(enemy: Force): Promise<boolean> {
        if (this.amIDead() || enemy.amIDead()) {
            this.log(`I can not :(${enemy.name}`);
            return false;
        }
        this.log(`I'm attacking to ${enemy.name} ...`);
        enemy.health += this.damage
        if (enemy.amIDead()) {
            this.xp += 100
            this.log(`I'm kill ${enemy.name} (+100xp)`);
        } else {
            this.log(`enemy health: ${enemy.health}`);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, speed);
        });
    }
}
class Sniper extends Force {
    constructor(name: string) {
        super(name, 'headshot', 125, 0, -75)
    }
}
class Doctor extends Force {
    bandage: number = 5
    constructor(name: string) {
        super(name, 'Help', 25, 0, 25)
    }

    async attack(enemy: Force): Promise<boolean> {
        if (this.amIDead() || enemy.amIDead() || this.bandage <= 0) {
            return false;
        }
        this.log(`I'm Helping to ${enemy.name} ...`);
        this.bandage--
        enemy.health += this.damage
        this.xp += 50
        this.log(`teammate health:(${enemy.health})`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, speed);
        });
    }
}
class Assassin extends Force {
    constructor(name: string) {
        super(name, 'thuggee', 50, 0, -100)
    }
}
class Soldier extends Force {
    constructor(name: string) {
        super(name, 'shooting', 100, 0, -25)
    }
}


class Team {
    name: string = "";
    forces: Force[];
    type: string = '';
    log: debug.Debugger;

    constructor(name: string, heroes: Force[], type: string) {
        this.name = name;
        this.forces = heroes;
        this.type = type;
        this.log = debug(`War >${this.name}`);
    }


    public async attack(enemy: Team): Promise<void> {
        this.log(`Attacking to ${enemy.name}`);
        for (let i = 0; i < this.forces.length; i++) {
            if (this.Defeated()) {
                this.log("We are losing");
                general(`The winner is: ${enemy.name}`);
                return;
            }
            const randomEnemy: number = Math.floor(
                Math.random() * enemy.forces.length
            );
            if (this.forces[i].damage > 0) {
                await this.forces[i].attack(this.forces[randomEnemy]);
            } else {
                await this.forces[i].attack(enemy.forces[randomEnemy]);
            }
        }
        order += 1
        general(`>>>End of the ${arrange_rounds[order]} round<<<\nRemaining forces:\n${this.name}:${this.aliveForces().length}\n${enemy.name}:${enemy.aliveForces().length}`);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, speed);
        });
    }

    setname() {
        this.forces.forEach((index) => {
            return index.teamname = this.name
        })
    }
    aliveForces(): Force[] {
        return this.forces.filter((_force) => !_force.amIDead());
    }

    Defeated() {
        return !this.forces.find((_force) => !_force.amIDead());
    }
}


async function startWar(timeout = 5) {
    general("The war will start in a few seconds...");
    const interval = setInterval(async () => {
        general(`In ${timeout--}`);
        if (timeout < 0) {
            clearInterval(interval);
            general(">>>War Started!<<<");
            const team1 = new Team("T1", [], 'Militant');
            const team2 = new Team("T2", [], 'peaceful');
            const team3 = new Team("T3", [], 'Militant');
            const team4 = new Team("T4", [], 'peaceful')
            const team5 = new Team("T5", [], 'Militant')
            const teams = [team1, team2, team3, team4, team5]

            for (let index = 0; index < teams.length; index++) {
                const element = teams[index];
                element.setname()
                element.forces.push(new Soldier(`soldier(${element.name})`), new Sniper(`sniper(${element.name})`), new Assassin(`assassin(${element.name})`), new Doctor(`doctor(${element.name})`))
            }

            // while (!team1.Defeated() && !team2.Defeated() && !team3.Defeated() && !team4.Defeated() && !team5.Defeated()) {
            while ((teams.filter(_team => _team.Defeated() == false)).length != 1) {
                const r = Math.floor(Math.random() * 12)
                if (r == 1) {
                    await team1.attack(team2)
                } else if (r == 2) {
                    await team3.attack(team1)
                } else if (r == 3) {
                    await team5.attack(team1)
                } else if (r == 4) {
                    await team1.attack(team3)
                } else if (r == 5) {
                    await team3.attack(team2)
                } else if (r == 6) {
                    await team5.attack(team2)
                } else if (r == 7) {
                    await team1.attack(team4)
                } else if (r == 8) {
                    await team3.attack(team4)
                } else if (r == 9) {
                    await team5.attack(team3)
                } else if (r == 10) {
                    await team1.attack(team5)
                } else if (r == 11) {
                    await team3.attack(team5)
                } else if (r == 12) {
                    await team5.attack(team4)
                }
            }

            teams.forEach((index) => {
                if (index.Defeated() == false) {
                    winner = index.name
                }
            })

            const allforces: Force[] = []
            const allxp: number[] = []
            for (let index = 0; index < teams.length; index++) {
                const element = teams[index];
                element.forces.forEach((inforces) => {
                    allforces.push(inforces)
                    allxp.push(inforces.xp)
                })
            }
            const maxxp = allforces[allxp.indexOf(Math.max(...allxp))]

            if (team1.Defeated() && team2.Defeated() && team3.Defeated() && team4.Defeated() && team5.Defeated()) {
                general("All heroes are passed aways from both tribes :(");
                general(`\n    (War Summary)\n\nNumber of rounds: ${order}\nExperienced hero: ${maxxp.name}(${maxxp.xp}xp)`)
            } else
                general(`X=> ( THE WAR IS END ) <=X\n\n    W . I . N . N . E . R\n      ⊱⊱⊱⊱⊱( ${winner} )⊰⊰⊰⊰⊰\n`);
            general(`\n    (War Summary)\n\nNumber of rounds: ${order}\nExperienced hero: ${maxxp.name}(${maxxp.xp}xp)`)
        }

    }, 1000);
}
startWar();