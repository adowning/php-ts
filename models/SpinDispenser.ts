
export class SpinDispenser {
    public static getSpin(slotArea: any, index: any, counter: any, bet: any, lines: any, doubleChance: any, reelSet: any, win: any, currentLog: any, user: any, freeSpins: any) {
✦         // if there is no log, then a normal spin, state Spin
        // if there is no win and no respin in the previous spin, then a normal spin, state Spin
        // if there is no win, but there is a respin in the previous spin, then LastRespin
        // if there is a win, but no respin in the previous spin, then FirstRespin
        // if there is a win, and there is a respin or FirstRespin, then Respin
        // if free games have fallen out, then FirstFreeSpin
        // if free games have been added, then AddFreeSpin
        // if there are free games in progress, then FreeSpin

    }
}
