import { FC, ReactElement, useEffect, useState } from "react";
import classes from "./play.module.scss";
import Image from "next/image";
import LoLIcon from "../../public/images/lol-icon.png";
import { compileFunction } from "vm";
import { IPlayerData } from "../../constants/player.interfaces";
import { useRouter } from "next/router";
import { callbackify } from "util";

export interface PickProps {}

const r1po = [2 / 3, 1 / 3];
const r2po = [1 / 5, 1 / 5, 2 / 5, 1 / 5];
const r3po = [4 / 16, 1 / 16, 3 / 16, 2 / 16, 2 / 16, 4 / 16];
const r4po = [5 / 25, 7 / 25, 4 / 25, 8 / 25, 1 / 25];
const r5po = [44 / 100, 35 / 100, 20 / 100, 1 / 100];

const PlayComponent: FC<PickProps> = ({}): ReactElement => {
  const router = useRouter();
  const [playersSelected, setPlayersSelected] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [roleSelect, setRoleSelect] = useState<number>(0);
  const [teamPlayers, addTeamPlayers] = useState<IPlayerData[]>([]);
  const [enemyPlayers, setEnemyPlayers] = useState<IPlayerData[]>([]);
  const [gameStage, setGameStage] = useState<number>(0);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [enemyPoints, setEnemyPoints] = useState(0);
  const [showButtons, setShowButtons] = useState<string[]>([]);
  const [eventPlayers, setEventPlayers] = useState<IPlayerData[][]>([]);
  const [gameChoice, setGameChoice] = useState<number>(-1);
  const [eventNumber, setEventNumber] = useState<number>(-1);

  useEffect(() => {
    const background = document.querySelector(
      "div[data-roles]"
    ) as unknown as HTMLDivElement;
    if (playersSelected) {
      background.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
    }
  }, [playersSelected]);

  useEffect(() => {
    const background = document.querySelector(
      "div[data-rift]"
    ) as unknown as HTMLDivElement;
    if (gameFinished) {
      background.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
    }
  }, [gameFinished]);

  async function addToTopText(text: string) {
    let i = 0;
    let speed = 100;
    const words = document.querySelector(
      "div[data-top-text]"
    ) as unknown as HTMLDivElement;
    async function callbackFunction() {
      if (i != text.length) {
        words.innerHTML += text[i++];
        setTimeout(callbackFunction, speed);
      }
    }
    callbackFunction();
  }

  async function removeTopText() {
    const words = document.querySelector(
      "div[data-top-text]"
    ) as unknown as HTMLDivElement;

    let speed = 75;
    if (words.innerHTML.length) {
      words.innerHTML = words.innerHTML.slice(0, -1);
      setTimeout(removeTopText, speed);
    }
  }

  const createEnemyTeam = (): void => {
    let ep = [];
    while (ep.length != 1) {
      let newPlayer: IPlayerData = getPlayerFromAPI("JG");
      let dupe = false;

      if (teamPlayers[0].player == newPlayer.player) dupe = true;

      if (!dupe) ep.push(newPlayer);
    }
    //@ts-ignore
    while (ep.length != 2) {
      let newPlayer: IPlayerData = getPlayerFromAPI("TOP");
      let dupe = false;

      if (teamPlayers[1].player == newPlayer.player) dupe = true;

      if (!dupe) ep.push(newPlayer);
    }
    while (ep.length != 3) {
      let newPlayer: IPlayerData = getPlayerFromAPI("MID");
      let dupe = false;

      if (teamPlayers[2].player == newPlayer.player) dupe = true;

      if (!dupe) ep.push(newPlayer);
    }
    while (ep.length != 4) {
      let newPlayer: IPlayerData = getPlayerFromAPI("ADC");
      let dupe = false;

      if (teamPlayers[3].player == newPlayer.player) dupe = true;

      if (!dupe) ep.push(newPlayer);
    }
    while (ep.length != 5) {
      let newPlayer: IPlayerData = getPlayerFromAPI("SUP");
      let dupe = false;

      if (teamPlayers[4].player == newPlayer.player) dupe = true;

      if (!dupe) ep.push(newPlayer);
    }
    setEnemyPlayers(ep);
  };

  const start = (callback: (word: string) => void): void => {
    setTimeout(() => {
      addToTopText("Welcome to League of Legends: Ultimate Team!");
      setTimeout(() => {
        addToTopText(` It's time to build your team.`);
        setTimeout(() => {
          removeTopText();
          setTimeout(() => {
            addToTopText(
              `Choose one player for each role from the following 5 players`
            );
            setTimeout(() => {
              setRoleSelect(roleSelect + 1);
            }, 6500);
          }, 6000);
        }, 6000);
      }, 5500);
    }, 1000);
  };

  async function customMask2(opacity: number) {
    const background = document.querySelector(
      "div[data-mask]"
    ) as unknown as HTMLDivElement;

    if (Math.round((opacity + Number.EPSILON) * 100) / 100 != 0) {
      background.style.background = `linear-gradient(rgba(0, 0, 0, ${
        opacity - 0.05
      }), rgba(0, 0, 0, ${opacity - 0.05}))`;
      setTimeout(() => customMask2(opacity - 0.05), 50);
    }
  }

  async function customMask1(opacity: number) {
    const background = document.querySelector(
      "div[data-mask]"
    ) as unknown as HTMLDivElement;
    if (Math.round((opacity + Number.EPSILON) * 100) / 100 != 1) {
      background.style.background = `linear-gradient(rgba(0, 0, 0, ${
        opacity + 0.05
      }), rgba(0, 0, 0, ${opacity + 0.05}))`;
      setTimeout(() => customMask1(opacity + 0.05), 50);
    } else {
      const oldBackground = document.querySelector(
        "div[data-roles]"
      ) as unknown as HTMLDivElement;
      oldBackground.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
      const teamPlayerCards = document.querySelectorAll(
        "div[data-player-card]"
      );
      //move player cards
      setTimeout(() => customMask2(1), 1000);
    }
  }

  const startGame = (callback: (word: string) => void): void => {
    setTimeout(() => {
      removeTopText();
      setTimeout(() => {
        customMask1(0);
        setTimeout(() => {
          addToTopText(`The A.I. has chosen the following team`);
          setTimeout(() => {
            createEnemyTeam();
            setTimeout(() => {
              addToTopText(` The game will now start. Best of luck!`);
              setTimeout(() => {
                removeTopText();
                setGameStage(1);
              }, 6500);
            }, 6000);
          }, 6000);
        }, 4000);
      }, 8000);
    }, 0);
  };

  const handle1v1 = (stage: number): void => {
    setEventNumber(1);

    const roleTo1v1 = Math.floor(Math.random() * 5);
    const players: IPlayerData[] = [
      teamPlayers[roleTo1v1],
      enemyPlayers[roleTo1v1],
    ];
    setEventPlayers([[players[0]], [players[1]]]);
    setShowButtons(["Back Off", "Engage"]);

    const isEnemyEngage = [Math.floor(Math.random() * 2)];
    if (isEnemyEngage) {
      const startEvent = (callback: (word: string) => void): void => {
        setTimeout(() => {
          addToTopText(`${players[0].player} and ${
            players[1].player
          } come face to face in a 1v1. Both champions are level ${
            Math.floor(Math.random() * 3 + stage * 2 + 1)
          } and trade auto 
          attacks. Then, ${
            players[1].player
          } starts to engage. Do you back off, or stand your ground?`);
          setTimeout(() => {}, 8000);
        }, 0);
      };
    } else {
      const startEvent = (callback: (word: string) => void): void => {
        setTimeout(() => {
          addToTopText(`${players[0].player} and ${
            players[1].player
          } come face to face in a 1v1. Both champions are level ${
            Math.floor(Math.random() * 3 + stage * 2 + 1)
          } and trade auto 
          attacks. Then, ${
            players[0].player
          } starts to engage. Do you continue engaging?`);
          setTimeout(() => {}, 8000);
        }, 0);
      };
    }
    //player1 and player2 come face to face. both are level {5*(stage-1) + 1-5} and trade autos, before {either player} decides
    //to start engaging. {if you are the one engaging, do you continue to engage} {if they engaged, do you take the fight or leave}
    //you win the fight if you roll a higher number, you lose if they roll a higher number, no one wins if you choose to disengage
  };

  const handle2v2 = (stage: number): void => {
    setEventNumber(2);
    const rolesTo2v2 = [Math.floor(Math.random() * 2), Math.floor(Math.random() * 3) + 2];

    const players: IPlayerData[][] = [
      [teamPlayers[rolesTo2v2[0]], teamPlayers[rolesTo2v2[1]]],
      [enemyPlayers[rolesTo2v2[0]], enemyPlayers[rolesTo2v2[1]]],
    ];
    setEventPlayers([[players[0][0]], [players[0][1]], [players[1][1]], [players[1][1]]]);
    setShowButtons(["Back Off", "Engage"]);

    const isEnemyEngage = [Math.floor(Math.random() * 2)];
    if (isEnemyEngage) {
      const startEvent = (callback: (word: string) => void): void => {
        setTimeout(() => {
          addToTopText(
            `${players[0][0].player} and ${players[0][1].player} 
            on your team are teaming up to clear vision when they run into 
            ${players[1][0].player} and ${players[1][1].player}. 
            Both ${players[0][0].player} and ${players[1][0].player} 
            are level ${Math.floor(Math.random() * 3 + stage * 2 + 1)}, 
            while ${players[0][1].player} and ${players[1][1].player} 
            are level ${Math.floor(Math.random() * 3 + stage * 2 + 1)}. 
            After a short trade, ${players[0][0].player} is brought down 
            to 40% HP. However, you know that neither enemy player has any 
            summoner spells off cooldown, while both of your players have all 
            summoner spells available. Should your team play it safe and back off, 
            or try and go for the outplay?`);
          setTimeout(() => {}, 8000);
        }, 0);
      };
    } else {
      const startEvent = (callback: (word: string) => void): void => {
        setTimeout(() => {
          addToTopText(
            `${players[0][0].player} and ${players[0][1].player} 
            on your team are teaming up to clear vision when they run into 
            ${players[1][0].player} and ${players[1][1].player}. 
            Both ${players[0][0].player} and ${players[1][0].player} 
            are level ${Math.floor(Math.random() * 3 + stage * 2 + 1)}, 
            while ${players[0][1].player} and ${players[1][1].player} 
            are level ${Math.floor(Math.random() * 3 + stage * 2 + 1)}. 
            After landing some poke and bringing ${players[1][0].player} down 
            to 40% HP, ${players[0][0].player} sees the angle for a free 
            double kill and calls to engage. Should your team 
            go all in to try and secure these kills?`);
          setTimeout(() => {}, 8000);
        }, 0);
      };
    }

    //player1 and player2 on your team are teaming up when they run into enemy1 and enemy2. player1 and enemy1 are level {5*(stage-1) + 1-5 1-5} and player2 and enemy 2 are leve X.
    // after trading abilities and using a health potion,  {either player} calls out to their teammate that this is the best chance they will get for a double kill
    // should your team go all in to try and get the kills? optional fight
  };

  const handle5v5 = (): void => {
    setEventNumber(3);
    setShowButtons(["Back Off", "Engage"]);

    // {all players meet mid} {one team heads towards baron and gets surrounded} {one team starts drake but then other team appears}.
    // your team calls out that they are ready to fight now, but you have to decide whether its worth the risk. you know that if you lose the teamfight,
    //it will be hard to comeback, but not taking the teamfight means the other team will likely get an objective
    // optional fight
  };

  const handleTopGank = (): void => {
    setEventNumber(4);
    const rolesTo2v2 = [Math.floor(Math.random() * 5)];

    while (rolesTo2v2.length != 2) {
      let temp = Math.floor(Math.random() * 5);
      if (temp != rolesTo2v2[0]) rolesTo2v2.push(temp);
    }
    const isEnemyGank = [Math.floor(Math.random() * 2)];

    const players: IPlayerData[] = isEnemyGank
      ? [teamPlayers[1], enemyPlayers[1], enemyPlayers[0]]
      : [teamPlayers[1], enemyPlayers[1], teamPlayers[0]];
    if (isEnemyGank) setShowButtons(["Back Off", "Stay in your lane"]);
    else setShowButtons(["Go Through River", "Go Around Back"]);

    // {if your gank} you notice your jungler has been warding his way up through the river, and is now close enough for a gank
    // do you tell him to try and pinsir attack the other top laner from behind, or join you up front for a full assault
    // you gain points if you kill, enemy cant get points
    // {if enemy gank} your teammate pings the map, letting you know the enemy jungler is missing. do you continue to push the wave
    // or do you play it safe.
    //enemy can get points if you die,
  };

  const handleRiftHerald = (): void => {
    const isEnemyRift = [Math.floor(Math.random() * 2)];

    setEventNumber(5);
    /* top+mid of either team goes to fight it
    no interaction. just calc and display which team gets it
    */
  };
  const handleBotGank = (): void => {
    setEventNumber(6);
    const isEnemyGank = [Math.floor(Math.random() * 2)];
    if (isEnemyGank) setShowButtons(["Back Off", "Stay in your lane"]);
    else setShowButtons(["Go Through River", "Go Around Back"]);

    // {if your gank} you notice your jungler has been warding his way down through the river, and is now close enough for a gank
    // do you tell him to try and pinsir attack the bottom laner from behind, or do you lure the enemy up towards the river
    // you gain points if you kill, enemy cant get points
    // {if enemy gank} your teammate pings the map, letting you know the enemy jungler is missing. do you continue to push the wave
    // or do you play it safe.
    //enemy can get points if you die,
  };

  const handleDrake = (): void => {
    setEventNumber(7);
    const isEnemyGank = [Math.floor(Math.random() * 2)];

    if (isEnemyGank)
      setShowButtons(["Keep in your lane", "Try to steal drake"]);
    else setShowButtons(["Back for items", "Go for turrets"]);
    /* if enemy team is doing it, you have choice to flash in with jungler to try and steal
    can either steal, fail steal and live, or die, which is win, small loss, or big loss
    if your team is doing it, choice of whether to back for items (small point gain) or look for fights (can trigger any xvx fight)
    */
  };
  const handleSoulDrake = (): void => {
    setEventNumber(8);
    const isEnemyGank = [Math.floor(Math.random() * 2)];

    if (isEnemyGank)
      setShowButtons(["Keep in your lane", "Try to steal drake"]);
    else setShowButtons(["Back for items", "Go for turrets"]);
    /* if enemy team is doing it, you have choice to flash in with jungler to try and steal
    can eitehr steal, fail steal and live, or die, which is win, small loss, or big loss
    if your team is doing it, choice of whether to back for items (small point gain) or look for fights (can trigger any xvx fight)
    */
  };

  const handleElderDrake = (): void => {
    setEventNumber(9);
    const isEnemyElder = [Math.floor(Math.random() * 2)];
    const players: IPlayerData[] = [teamPlayers[0], teamPlayers[1], teamPlayers[2], teamPlayers[3], teamPlayers[4],
                                    enemyPlayers[0], enemyPlayers[1], enemyPlayers[2], enemyPlayers[3], enemyPlayers[4]];
    setEventPlayers([[players[0]], [players[1]], [players[2]], [players[3]], [players[4]],
                     [players[5]], [players[6]], [players[7]], [players[8]], [players[9]]]);
    if (isEnemyElder) {
      const startEvent = (callback: (word: string) => void): void => {
        setTimeout(() => {
          setShowButtons(["Force a fight", "Go for the steal"]);
          addToTopText(
            `The enemy team has secured control of the river, and has begun
            burning down the Elder Dragon. You notice that ${players[5].player}, 
            ${players[7].player}, and ${players[8].player} have Stopwatches,
            so it's going to be pretty hard to win a teamfight, but it'll
            be almost impossible to win if they secure the Elder Buff. Do you force a 
            5v5 teamfight before the Elder Dragon goes down, or send ${players[1].player}
            to attempt a Smite steal?`);
          setTimeout(() => {}, 8000);
        }, 0);
      };
    } else {
      const startEvent = (callback: (word: string) => void): void => {
        setTimeout(() => {
          setShowButtons(["Go for the steal", "Look for a fight"]);
          addToTopText(
            `You've secured vision in the enemy jungle, and cleared all enemy wards 
            within the bottom river and Dragon pit. After spotting ${players[8].player}
            clearing minion waves in the top lane, you decide to start hitting the Elder 
            Dragon. You burn it down to 2500 HP when you spot ${players[6].player} waiting
            over the wall, posturing for a Smite steal. Do you finish off the Elder Dragon, 
            confident in ${players[1].player}'s Smiting abilities? Or do you play it slow
            and look for a teamfight instead?
            `);
          setTimeout(() => {}, 8000);
        }, 0);
      };
    }
    /* if enemy team is doing it, you have choice to flash in with jungler to try and steal
    can either steal, fail steal and live, or die, which is win, small loss, or big loss
    if your team is doing it, choice of whether to go destroy the enemy's turrets or look for fights (can trigger any xvx fight)
    */
  };

  const handleBackdoor = (): void => {
    setEventNumber(10);
    const players: IPlayerData[] = [teamPlayers[0], teamPlayers[2]]; // Always top laner and mid laner
    setEventPlayers([[players[0]], [players[1]]]);
    setShowButtons(["Keep Scaling", "Go for the Backdoor"]);

    const startEvent = (callback: (word: string) => void): void => {
      setTimeout(() => {
        addToTopText(
          `All of the enemy inhibs are down, and the enemy has an open Nexus. 
          However, you lost the last teamfight pretty badly, and the enemy team 
          is poised to take both Baron Nashor and the Elder Dragon. Your team is 
          busy discussing a base defense strategy when 
          ${players[Math.floor(Math.random()*2)].player} notices a hidden ward 
          in the enemy base and calls for a backdoor. Both 
          ${players[0].player} and ${players[1].player} have Teleport available
          and respawn in 5 seconds. Do you play it safe and continue scaling, 
          or go for the backdoor win?`);
        setTimeout(() => {}, 8000);
      }, 0);
    };

    /* one of the players on your team notices the chance for a backdoor play. 
      very risky, but you could win the game off of it, regardless of points difference*/
  };

  const handleBaron = (): void => {
    setEventNumber(11);
    const isEnemyBaron = [Math.floor(Math.random() * 2)];
    const players: IPlayerData[] = [teamPlayers[0], teamPlayers[1], teamPlayers[2], teamPlayers[3], teamPlayers[4],
                                    enemyPlayers[0], enemyPlayers[1], enemyPlayers[2], enemyPlayers[3], enemyPlayers[4]];
    setEventPlayers([[players[0]], [players[1]], [players[2]], [players[3]], [players[4]],
                     [players[5]], [players[6]], [players[7]], [players[8]], [players[9]]]);
    
    if (isEnemyBaron) {
      const startEvent = (callback: (word: string) => void): void => {
        setTimeout(() => {
          setShowButtons(["Play it Safe", "Contest Baron"]);
          addToTopText(
            `You discover that the enemy team is attempting to sneak Baron, 
            and they've already gotten it down to 6000 HP. Luckily, your entire
            team is in mid lane so you can rotate quickly, but you don't see 
            ${players[9].player} anywhere on the map and suspect they might be 
            looking for a flank. Do you contest the baron and force a teamfight,
            or play it safe and shove out mid lane instead?`);
          setTimeout(() => {}, 8000);
        }, 0);
      };
    } else {
      const startEvent = (callback: (word: string) => void): void => {
        setTimeout(() => {
          setShowButtons(["Finish Baron", "Force a Teamfight"]);
          addToTopText(
            `Your team has started doing Baron, and has already gotten it down 
            to 4000 HP. Suddenly, a enemy TP begins to channel on a ward in the pit, 
            and you see the remaining 4 players charge towards you from the mid lane.
            Do you attempt to finish Baron as quickly as you can, or instantly turn on
            the enemy team and force a 5v4?`);
          setTimeout(() => {}, 8000);
        }, 0);
      };
    }
    /*if you are doing baron, do you continue to do it, and then after do you look for fights or try to destroy turrets
      if enemy doing baren, do you try and push them off, steal baron, or leave*/
  };

  const handleEvents = (stage: number, events: number[]): void => {
    if (stage == 1) {
      while (events.length) {
        if (events[0] == 1) {
          events.pop();
          handle1v1(stage);
        } else {
          events.pop();
          handle2v2(stage);
        }
      }
    }
    if (stage == 2) {
      while (events.length) {
        if (events[0] == 1) {
          events.pop();
          handle1v1(stage);
        } else if (events[0] == 2) {
          events.pop();
          handle2v2(stage);
        } else if (events[0] == 3) {
          events.pop();
          handleTopGank();
        } else if (events[0] == 4) {
          events.pop();
          handleRiftHerald();
        }
      }
    }
    if (stage == 3) {
      while (events.length) {
        if (events[0] == 1) {
          events.pop();
          handle2v2(stage);
        } else if (events[0] == 2) {
          events.pop();
          handle5v5();
        } else if (events[0] == 3) {
          events.pop();
          handleTopGank();
        } else if (events[0] == 4) {
          events.pop();
          handleBotGank();
        } else if (events[0] == 5) {
          events.pop();
          handleDrake();
        } else if (events[0] == 6) {
          events.pop();
          handleRiftHerald();
        }
      }
    }
    if (stage == 4) {
      while (events.length) {
        if (events[0] == 1) {
          events.pop();
          handle2v2(stage);
        } else if (events[0] == 2) {
          events.pop();
          handle5v5();
        } else if (events[0] == 3) {
          events.pop();
          handleBaron();
        } else if (events[0] == 4) {
          events.pop();
          handleSoulDrake();
        } else if (events[0] == 5) {
          events.pop();
          handleBotGank();
        }
      }
    }
    if (stage == 5) {
      while (events.length) {
        if (events[0] == 1) {
          events.pop();
          handle5v5();
        } else if (events[0] == 2) {
          events.pop();
          handleBaron();
        } else if (events[0] == 3) {
          events.pop();
          handleElderDrake();
        } else if (events[0] == 4) {
          events.pop();
          handleBackdoor();
        }
      }
      handleEndofGame();
    }
  };

  const handleEndofGame = () => {
    const playerHasWon = playerPoints >= enemyPoints;
    if (playerHasWon) {
      fadeToVictory();
    } else {
      fadeToLoss();
    }
  };

  const fadeToVictory = () => {
    async function customMaskIn(opacity: number) {
      const background = document.querySelector(
        "div[data-mask]"
      ) as unknown as HTMLDivElement;
      if (Math.round((opacity + Number.EPSILON) * 100) / 100 != 1) {
        background.style.background = `linear-gradient(rgba(0, 0, 0, ${
          opacity + 0.05
        }), rgba(0, 0, 0, ${opacity + 0.05}))`;
        setTimeout(() => customMaskIn(opacity + 0.05), 50);
      } else {
        const oldBackground = document.querySelector(
          "div[data-rift]"
        ) as unknown as HTMLDivElement;
        oldBackground.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
        const oldLossScreen = document.querySelector(
          "div[data-loss]"
        ) as unknown as HTMLDivElement;
        oldLossScreen.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
        const teamPlayerCards = document.querySelectorAll(
          "div[data-player-card]"
        );
        //move player cards
        setGameFinished(true);

        setTimeout(() => customMaskOut(1), 1000);
      }
    }
    async function customMaskOut(opacity: number) {
      const background = document.querySelector(
        "div[data-mask]"
      ) as unknown as HTMLDivElement;

      if (Math.round((opacity + Number.EPSILON) * 100) / 100 != 0) {
        background.style.background = `linear-gradient(rgba(0, 0, 0, ${
          opacity - 0.05
        }), rgba(0, 0, 0, ${opacity + 0.05}))`;
        setTimeout(() => customMaskOut(opacity + 0.05), 50);
      } else {
        /*text about game being won*/
      }
    }
    customMaskIn(0);
  };
  const fadeToLoss = () => {
    async function customMaskIn(opacity: number) {
      const background = document.querySelector(
        "div[data-mask]"
      ) as unknown as HTMLDivElement;
      if (Math.round((opacity + Number.EPSILON) * 100) / 100 != 1) {
        background.style.background = `linear-gradient(rgba(0, 0, 0, ${
          opacity + 0.05
        }), rgba(0, 0, 0, ${opacity + 0.05}))`;
        setTimeout(() => customMaskIn(opacity + 0.05), 50);
      } else {
        const oldBackground = document.querySelector(
          "div[data-rift]"
        ) as unknown as HTMLDivElement;
        oldBackground.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
        const teamPlayerCards = document.querySelectorAll(
          "div[data-player-card]"
        );
        //move player cards
        setGameFinished(true);
        setTimeout(() => customMaskOut(1), 1000);
      }
    }
    async function customMaskOut(opacity: number) {
      const background = document.querySelector(
        "div[data-mask]"
      ) as unknown as HTMLDivElement;

      if (Math.round((opacity + Number.EPSILON) * 100) / 100 != 0) {
        background.style.background = `linear-gradient(rgba(0, 0, 0, ${
          opacity - 0.05
        }), rgba(0, 0, 0, ${opacity + 0.05}))`;
        setTimeout(() => customMaskOut(opacity + 0.05), 50);
      } else {
        /* add text about loss*/
      }
    }
    customMaskIn(0);
  };

  useEffect(() => {
    if (gameStage == 1) {
      const numOfEvents = Math.floor(Math.random() * (3 - 0) + 0);
      const eventArray = [];
      for (let i = 0; i < r1po.length; i++) {
        let odd = r1po[i] * 100;
        for (let j = 0; j < odd; j++) {
          eventArray.push(i + 1);
        }
      }
      let events = [];
      while (events.length != numOfEvents) {
        events.push(eventArray[Math.floor(Math.random() * eventArray.length)]);
      }
      handleEvents(1, events);
    } else if (gameStage == 2) {
      const numOfEvents = Math.floor(Math.random() * (3 - 1) + 1);
      const eventArray = [];
      for (let i = 0; i < r2po.length; i++) {
        let odd = r2po[i] * 100;
        for (let j = 0; j < odd; j++) {
          eventArray.push(i + 1);
        }
      }
      let events = [];
      while (events.length != numOfEvents) {
        events.push(eventArray[Math.floor(Math.random() * eventArray.length)]);
      }
      handleEvents(2, events);
    } else if (gameStage == 3) {
      const numOfEvents = Math.floor(Math.random() * (4 - 1) + 1);
      const eventArray = [];
      for (let i = 0; i < r3po.length; i++) {
        let odd = r3po[i] * 100;
        for (let j = 0; j < odd; j++) {
          eventArray.push(i + 1);
        }
      }
      let events = [];
      while (events.length != numOfEvents) {
        events.push(eventArray[Math.floor(Math.random() * eventArray.length)]);
      }
      handleEvents(3, events);
    } else if (gameStage == 4) {
      const numOfEvents = Math.floor(Math.random() * (4 - 2) + 2);
      const eventArray = [];
      for (let i = 0; i < r4po.length; i++) {
        let odd = r4po[i] * 100;
        for (let j = 0; j < odd; j++) {
          eventArray.push(i + 1);
        }
      }
      let events = [];
      while (events.length != numOfEvents) {
        events.push(eventArray[Math.floor(Math.random() * eventArray.length)]);
      }
      handleEvents(4, events);
    } else if (gameStage == 5) {
      const numOfEvents = 3;
      const eventArray = [];
      for (let i = 0; i < r5po.length; i++) {
        let odd = r5po[i] * 100;
        for (let j = 0; j < odd; j++) {
          eventArray.push(i + 1);
        }
      }
      let events = [];
      while (events.length != numOfEvents) {
        events.push(eventArray[Math.floor(Math.random() * eventArray.length)]);
      }
      handleEvents(5, events);
    }
  }, [gameStage]);

  const roleSelector = (role: number): ReactElement => {
    if (!role) return <></>;
    let players: IPlayerData[] = [];

    if (role == 1) {
      while (players.length != 5) {
        let newPlayer: IPlayerData = getPlayerFromAPI("JG");
        let dupe = false;
        for (let i = 0; i < players.length; i++) {
          if (players[i].player == newPlayer.player) dupe = true;
        }
        if (!dupe) players.push(newPlayer);
      }
    } else if (role == 2) {
      while (players.length != 5) {
        let newPlayer: IPlayerData = getPlayerFromAPI("TOP");
        let dupe = false;
        for (let i = 0; i < players.length; i++) {
          if (players[i].player == newPlayer.player) dupe = true;
        }
        if (!dupe) players.push(newPlayer);
      }
    } else if (role == 3) {
      while (players.length != 5) {
        let newPlayer: IPlayerData = getPlayerFromAPI("MID");
        let dupe = false;
        for (let i = 0; i < players.length; i++) {
          if (players[i].player == newPlayer.player) dupe = true;
        }
        if (!dupe) players.push(newPlayer);
      }
    } else if (role == 4) {
      while (players.length != 5) {
        let newPlayer: IPlayerData = getPlayerFromAPI("ADC");
        let dupe = false;
        for (let i = 0; i < players.length; i++) {
          if (players[i].player == newPlayer.player) dupe = true;
        }
        if (!dupe) players.push(newPlayer);
      }
    } else if (role == 5) {
      while (players.length != 5) {
        let newPlayer: IPlayerData = getPlayerFromAPI("SUP");
        let dupe = false;
        for (let i = 0; i < players.length; i++) {
          if (players[i].player == newPlayer.player) dupe = true;
        }
        if (!dupe) players.push(newPlayer);
      }
    } else {
      return <></>;
    }
    return (
      <div className={classes.fivePlayerContainer}>
        {players.map((player: IPlayerData, index: number) => {
          return (
            <div className={classes.playerCard} data-player-card>
              <button
                onClick={() => {
                  let existingPlayers = [...teamPlayers];
                  existingPlayers.push(player);
                  addTeamPlayers(existingPlayers);
                  setRoleSelect(roleSelect + 1);
                }}
                disabled={teamPlayers.length > index}
              >
                <Image
                  src={`../../public/images/playerCards/${player.player}`}
                  width={500}
                  height={300}
                  layout={"fixed"}
                />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const smallRisk = () => {};

  const midRisk = () => {};

  const bigRisk = () => {};

  useEffect(() => {
    if (gameChoice == -1) return;
    if (gameChoice == 5) midRisk();
    if (gameChoice == 0) {
      if (
        (eventNumber > -1 && eventNumber < 3) ||
        eventNumber == 4 ||
        eventNumber == 6 ||
        eventNumber == 10
      ) {
        return;
      } else if (
        eventNumber == 3 ||
        eventNumber == 7 ||
        eventNumber == 8 ||
        eventNumber == 9 ||
        eventNumber == 11
      ) {
        smallRisk();
      }
    }
    if (gameChoice == 1) {
      if (
        eventNumber == 1 ||
        eventNumber == 2 ||
        eventNumber == 4 ||
        eventNumber == 6 ||
        eventNumber == 7 ||
        eventNumber == 8
      ) {
        midRisk();
      } else {
        bigRisk();
      }
    }
  }, [gameChoice]);

  useEffect(() => {
    start((text) => console.log(text));
    //startGame((text) => console.log(text));
  }, []);

  useEffect(() => {
    if (roleSelect == 6) {
      startGame((text) => console.log(text));
    }
  }, [roleSelect]);
  return (
    <div className={classes.container} data-win>
      <div className={classes.container2} data-loss>
        <div className={classes.container3} data-rift>
          <div className={classes.container4} data-roles>
            <div className={classes.mask} data-mask>
              <div className={classes.topText} data-top-text></div>

              <div className={classes.roleSelect}>
                {roleSelector(roleSelect)}
              </div>
              {showButtons && (
                <div className={classes.buttonOptions}>
                  {showButtons.map((text, index) => {
                    <button onClick={() => setGameChoice(index)}>
                      <div>
                        <span>{text}</span>
                      </div>
                    </button>;
                  })}
                </div>
              )}
              {gameFinished && (
                <button onClick={() => router.push("/")}>
                  <div>
                    <span>Home Page</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayComponent;
