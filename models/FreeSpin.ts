
interface GameSettings {
    scatters: string;
    settings_needaddfs: number;
    settings_addfs: number;
    settings_fs: number;
}

interface Log {
    FreeSpinNumber?: number;
    FreeState?: string;
}

export class FreeSpin {
    public static check(slotArea: number[], log: Log, gameSettings: GameSettings, bet: number) {
        let freeSpins = false;
        let addFreeSpins = false;

        const scatterTmp = gameSettings.scatters.split('~');
        const scatter = parseInt(scatterTmp[0]);
        const scatterPayTable = scatterTmp[1].split(',').map(Number).reverse();
        const scatterPositions = slotArea.reduce((acc: number[], val, i) => (val === scatter ? [...acc, i] : acc), []);
        const symbols = slotArea.reduce((acc: { [key: number]: number }, val) => ({ ...acc, [val]: (acc[val] || 0) + 1 }), {});

        if (symbols[scatter]) {
            if (log && log.FreeSpinNumber && log.FreeState !== 'LastFreeSpin') {
                if (symbols[scatter] >= gameSettings.settings_needaddfs) {
                    addFreeSpins = !!gameSettings.settings_addfs;
                }
            } else {
                const pay = scatterPayTable[symbols[scatter] - 1];
                const win = Math.round(pay * bet * 100) / 100;
                if (win > 0) {
                    freeSpins = !!gameSettings.settings_fs;
                }
            }
        }

        if (freeSpins) {
            return { FreeSpins: gameSettings.settings_fs, Pay: win, ScatterPositions: scatterPositions, Scatter: scatter };
        }
        if (addFreeSpins) {
            return { AddFreeSpins: gameSettings.settings_addfs };
        }
        return false;
    }
}
