
interface GameSettings {
    prm: string;
    sh: number;
}

interface Log {
    Multipliers?: Multiplier[];
}

interface Multiplier {
    Symbol: number;
    Position: number;
    Multiplier: number;
    Reel: number;
}

export class Multiple {
    public static getBonanzaMultiple(slotArea: number[], gameSettings: GameSettings, currentLog: Log): Multiplier[] | false {
        const tmp = gameSettings.prm.split(';');
        const tmp2 = tmp[0].split('~');
        const prm = parseInt(tmp2[0]); // символ множителя
        const prmMultipliers = tmp2[1].split(',').map(Number); // массив возможных значений множителя

        // перестроить игровое поле на катушки
        const reels = 6;
        const tmpSlotArea = [];
        for (let i = 0; i < slotArea.length; i += reels) {
            tmpSlotArea.push(slotArea.slice(i, i + reels));
        }

        const currentSlotArea: number[][] = [];
        for (let k = 0; k < reels; k++) {
            currentSlotArea[k] = [];
            for (let i = 0; i < gameSettings.sh; i++) {
                currentSlotArea[k][i] = tmpSlotArea[i][k];
            }
        }

        const prmReady: Multiplier[] = [];
        // пройти по всем катушкам с конца, и присвоить множители, в лог писать какой множитель от какой катушки
        currentSlotArea.forEach((reel, reelKey) => {
            reel.reverse().forEach((symbol, symbolKey) => {
                if (symbol === prm) {
                    const symbolsCount = gameSettings.sh - 1; // массивы с 0 начинаются. Чтобы узнать сколько должно быть в катушке символов
                    const prmSymbol = reelKey + (reels * (symbolsCount - symbolKey)); // вычисляем поозицию. Номер катушки, прибавляем к позиции  катушке с начала
                    prmReady.push({
                        Symbol: prm,
                        Position: prmSymbol,
                        Multiplier: this.getMultiplier(currentLog, prmMultipliers, reelKey),
                        Reel: reelKey
                    });
                }
            });
        });

        if (prmReady.length > 0) {
            return prmReady;
        } else {
            return false;
        }
    }

    private static getMultiplier(currentLog: Log, prmMultipliers: number[], reelKey: number): number {
        let multiplier: number | undefined;

        if (currentLog && currentLog.Multipliers) {
            for (const logMultiplier of currentLog.Multipliers) {
                if (logMultiplier.Reel === reelKey) {
                    multiplier = logMultiplier.Multiplier;
                    break;
                }
            }
        }

        if (multiplier !== undefined) {
            return multiplier;
        } else {
            multiplier = prmMultipliers[Math.floor(Math.random() * prmMultipliers.length)];
        }

        return multiplier;
    }
}
