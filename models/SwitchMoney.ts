
import { Jackpots } from './Jackpots';
import { SlotBank } from './SlotBank';
import { Statistic } from './Statistic';

interface User {
    id: number;
    balance: number;
    count_balance: number;
    shop_id: number;
}

interface Shop {
    percent: number;
}

interface Bank {
    slots: number;
    bonus: number;
}

interface Jpgs {
    // Define jpgs properties here
}

interface Game {
    id: number;
    name: string;
    stat_out: number;
    stat_in: number;
    denomination: number;
}

interface SlotArea {
    // Define slotArea properties here
}

interface CurrentLog {
    FSPay?: number;
    FreeState?: string;
}

export class SwitchMoney {
    public static set(
        bet: number,
        shop: Shop,
        bank: Bank,
        jpgs: Jpgs,
        user: User,
        game: Game,
        callbackUrl: string,
        win: number,
        slotArea: SlotArea,
        freespins: boolean,
        currentLog: CurrentLog,
        win_permission: any
    ) {
        if (bet) {
            bet *= -1;
            user.balance -= bet;
        }

        if (typeof win_permission === 'object' && win_permission !== null && win_permission.CurrentWin) {
            win = win_permission.CurrentWin;
        }

        const toBonus = currentLog.FSPay ? currentLog.FSPay : false;

        let myMoney = 0;
        if (user.count_balance > 0 && user.count_balance > bet) {
            user.count_balance -= bet;
            myMoney = bet;
        } else if (user.count_balance < bet && user.count_balance > 0) {
            myMoney = user.count_balance;
            user.count_balance = 0;
        } else {
            myMoney = 0;
        }

        const jackpotInfo = Jackpots.toJP(myMoney, jpgs as any);
        const toJackpot = jackpotInfo.toJackpots;
        const toProfit = myMoney * ((100 - shop.percent) / 100);

        const toSlotBank = SlotBank.addBank(bet, bank, toJackpot, toProfit, !!toBonus);

        if (currentLog.FSPay) {
            win = currentLog.FSPay;
        }

        game.stat_out += win;
        game.stat_in += toSlotBank;

        Statistic.setStatistic(user, win, game, bank, bet, toSlotBank, toJackpot, toProfit, freespins, slotArea as any);

        if (currentLog.FreeState) {
            bank.bonus -= win;
        } else {
            bank.slots -= win;
        }
    }
}
