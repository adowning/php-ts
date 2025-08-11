
interface GameSettings {
    paytable: string;
    payline: string;
    wilds: string;
    scatters: string;
}

interface SlotArea {
    SlotArea: number[];
}

interface WinSymbol {
    WinSymbol: number;
    CountSymbols: number;
    Pay: string;
    Positions: number[];
    l: number;
}

export class WinChecker {
    private paytable: number[][];
    private paylines: number[][];
    private wild: number;
    private scatter: number;

    constructor(gameSettings: GameSettings) {
        const paytable = gameSettings.paytable.split(';');
        this.paytable = paytable.map(item => item.split(',').map(Number));

        const paylines = gameSettings.payline.split(';');
        this.paylines = paylines.map(payline => payline.split(',').map(Number));

        this.wild = Number(gameSettings.wilds.split('~')[0]);
        this.scatter = Number(gameSettings.scatters.split('~')[0]);
    }

    public getWin(pur: any, log: any, bet: number, slotArea: SlotArea): { TotalWin: string, WinLines: WinSymbol[] } {
        const slotAreaArray = [];
        for (let i = 0; i < slotArea.SlotArea.length; i += 5) {
            slotAreaArray.push(slotArea.SlotArea.slice(i, i + 5));
        }

        let totalWin = 0;
        const winSymbols: WinSymbol[] = [];

        this.paylines.forEach((payline, index) => {
            const line: number[] = [];
            payline.forEach((value, key) => {
                line.push(slotAreaArray[value][key]);
            });

            let cnt = 1;
            let winSymbol = 0;

            line.forEach((lineValue, lineKey) => {
                if (lineKey === 0) {
                    winSymbol = lineValue;
                } else {
                    if (lineValue !== this.wild && winSymbol === this.wild) {
                        winSymbol = lineValue;
                    }
                    if (winSymbol !== this.wild && winSymbol !== lineValue && lineValue !== this.wild) {
                        return;
                    }
                    cnt++;
                }
            });

            let win = 0;
            if (cnt > 1) {
                win = Math.round(this.paytable[winSymbol][this.paytable[winSymbol].length - cnt] * bet * 100) / 100;
            }

            if (win > 0) {
                const winPositions: number[] = [];
                line.forEach((lineValue, col) => {
                    if (col < cnt) {
                        winPositions.push(payline[col] * 5 + col);
                    }
                });

                winSymbols.push({
                    WinSymbol: winSymbol,
                    CountSymbols: cnt,
                    Pay: win.toFixed(2),
                    Positions: winPositions,
                    l: index
                });
                totalWin += win;
            }
        });

        return { TotalWin: totalWin.toFixed(2), WinLines: winSymbols };
    }
}
