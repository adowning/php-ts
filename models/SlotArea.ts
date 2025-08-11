
interface GameSettings {
    [key: string]: any;
}

interface Log {
    State?: string;
    SlotArea?: number[];
    WinLines?: WinLine[];
}

interface WinLine {
    WinSymbol: number;
}

export class SlotArea {
    public static getSlotArea(gameSettings: GameSettings, reelset: number, log: Log | null): { SlotArea: number[], SymbolsAfter: number[], SymbolsBelow: number[] } {
        let reelsetSettings = gameSettings[`reel_set${reelset}`].split('~').map((reel: string) => reel.split(',').map(Number));

        const positions: number[] = [];
        reelsetSettings.forEach((reel: number[]) => {
            positions.push(Math.floor(Math.random() * reel.length));
        });

        let reels: number[][] = [];
        let symbolsAfter: number[] = [];
        let symbolsBelow: number[] = [];

        positions.forEach((value, key) => {
            const reelsetCycled = [...reelsetSettings[key], ...reelsetSettings[key].slice(0, 10)];
            reels[key] = reelsetCycled.slice(value, value + gameSettings.sh);
            symbolsAfter[key] = reelsetCycled.slice(value - 1, value)[0];
            symbolsBelow[key] = reels[key][reels[key].length - 1];
        });

        if (log && (log.State === 'Respin' || log.State === 'FirstRespin')) {
            const currentSymbolsAfter = symbolsAfter;
            reels.forEach((reel, key) => {
                reel.push(currentSymbolsAfter[key]);
            });

            const tmpSlotArea: number[][] = [];
            if (log.SlotArea) {
                for (let i = 0; i < log.SlotArea.length; i += reels.length) {
                    tmpSlotArea.push(log.SlotArea.slice(i, i + reels.length));
                }
            }

            const currentSlotArea: number[][] = [];
            for (let k = 0; k < reels.length; k++) {
                currentSlotArea[k] = [];
                for (let i = 0; i < gameSettings.sh; i++) {
                    currentSlotArea[k][i] = tmpSlotArea[i][k];
                }
            }

            const winSymbols: number[] = [];
            if (log.WinLines) {
                log.WinLines.forEach(winLine => {
                    winSymbols.push(winLine.WinSymbol);
                });
            }

            const sortSlotArea: number[][] = [];
            currentSlotArea.forEach((sortReel, sortReelKey) => {
                sortSlotArea[sortReelKey] = [];
                sortReel.forEach(value => {
                    if (!winSymbols.includes(value)) {
                        sortSlotArea[sortReelKey].push(value);
                    }
                });
            });

            sortSlotArea.forEach((currentReel, reelKey) => {
                const reelCount = currentReel.length;
                if (reelCount < gameSettings.sh) {
                    currentReel.unshift(...reels[reelKey].slice(reelCount - gameSettings.sh));
                }
            });

            symbolsBelow = [];
            sortSlotArea.forEach(item => {
                symbolsBelow.push(item[item.length - 1]);
            });

            symbolsAfter = [];
            reels.forEach(reelAndSymbolsAfter => {
                symbolsAfter.push(reelAndSymbolsAfter[0]);
            });

            reels = sortSlotArea;
        }

        const slotArea: number[] = [];
        for (let i = 0; i < gameSettings.sh; i++) {
            for (let k = 0; k < reels.length; k++) {
                slotArea.push(reels[k][i]);
            }
        }

        return {
            SlotArea: slotArea,
            SymbolsAfter: symbolsAfter,
            SymbolsBelow: symbolsBelow
        };
    }
}
