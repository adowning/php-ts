
import { GameSettings } from './GameSettings';
import { Log } from './Log';
import { SlotArea } from './SlotArea';
import { WinChecker } from './WinChecker';
import { FreeSpin } from './FreeSpin';
import { Multiple } from './Multiple';
import { LogAndServer } from './LogAndServer';
import { WinPermission } from './WinPermission';
import { SwitchMoney } from './SwitchMoney';
import { BuyFreeSpins } from './BuyFreeSpins';

interface User {
    id: number;
    balance: number;
    shop_id: number;
}

interface Game {
    id: number;
    name: string;
    rtp_stat_in: number;
}

interface Shop {
    // Define shop properties here
}

interface Jpgs {
    // Define jpgs properties here
}

interface Bank {
    // Define bank properties here
}

export class Spin {
    public static spinResult(
        user: User,
        game: Game,
        bet: number,
        lines: number,
        log: Log,
        gameSettings: GameSettings,
        index: number,
        counter: number,
        callbackUrl: string,
        doubleChance: number,
        buyFS: string,
        bank: Bank,
        shop: Shop,
        jpgs: Jpgs
    ): string | false {
        const pur1 = buyFS;
        const gameSettingsAll = gameSettings.all;
        const currentLog = log.getLog();
        const adjustedLines = doubleChance === 0 ? lines : lines * 1.25;

        let changeBalance = 0;
        if (currentLog &&
            (currentLog.State !== 'Spin' && currentLog.State !== 'LastRespin' ||
                (currentLog.FreeState && currentLog.FreeState !== 'LastFreeSpin'))) {
            changeBalance = 0;
        } else {
            changeBalance = (bet * adjustedLines * -1);
            if (buyFS === '0') {
                changeBalance *= 100;
            }
        }

        if (user.balance < -1 * changeBalance) {
            return false;
        }

        let response: string | false = false;
        let winPermission = false;

        do {
            const reelSet = doubleChance === 0 ? 0 : 2;
            if (currentLog && currentLog.FreeState && currentLog.FreeState !== 'LastFreeSpin' && currentLog.FreeSpinNumber > 1) {
                // reelSet = 1; // if free spins - then the set of reels is 4th
            }
            const slotArea = SlotArea.getSlotArea(gameSettingsAll, reelSet, currentLog);

            if (buyFS === '0') {
                BuyFreeSpins.getFreeSpin(slotArea.SlotArea, gameSettingsAll);
            }

            const winChecker = new WinChecker(gameSettingsAll);
            const win = winChecker.getWin(pur1, currentLog, bet, slotArea);

            let freeSpins: any = false;
            if (win.TotalWin === 0) {
                freeSpins = FreeSpin.check(slotArea.SlotArea, currentLog, gameSettingsAll, bet);
            }

            const multipliers = (currentLog && currentLog.FreeSpins && currentLog.FreeState !== 'LastFreeSpin')
                ? Multiple.getBonanzaMultiple(slotArea.SlotArea, gameSettingsAll, currentLog)
                : false;

            const logAndServer = LogAndServer.getResult(
                slotArea,
                index,
                counter,
                bet,
                adjustedLines,
                doubleChance,
                reelSet,
                win,
                currentLog,
                user,
                freeSpins,
                multipliers,
                changeBalance,
                bank,
                game
            );

            if (win.TotalWin > 0 || logAndServer.Log.tmb_win) {
                winPermission = WinPermission.winCheck(freeSpins, buyFS, bank, logAndServer.Log, win.TotalWin, multipliers, currentLog);
            } else {
                winPermission = true;
            }

            if (winPermission) {
                SwitchMoney.set(changeBalance, shop, bank, jpgs, user, game, callbackUrl, win.TotalWin, slotArea, freeSpins, logAndServer.Log, winPermission);
                Log.setLog(logAndServer.Log, game.id, user.id, user.shop_id);
                response = logAndServer.Server.join('&');
            }
        } while (!winPermission);

        return response;
    }
}
