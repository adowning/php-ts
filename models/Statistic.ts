
interface User {
    id: number;
    balance: number;
    shop_id: number;
}

interface Game {
    name: string;
    denomination: number;
}

interface Bank {
    slots: number;
    bonus: number;
    fish_bank: number;
    table_bank: number;
    little: number;
}

interface SlotArea {
    [key: number]: number[];
}

export class Statistic {
    public static setStatistic(user: User, win: number, game: Game, bank: Bank, bet: number, toSlotBank: number, toJackpot: number, toProfit: number, fs: boolean, slotArea: SlotArea) {
        const addName = fs ? ' FS' : '';

        return {
            user_id: user.id,
            balance: user.balance,
            bet: bet,
            win: win,
            game: game.name + addName,
            in_game: toSlotBank,
            in_jpg: toJackpot,
            in_profit: toProfit,
            denomination: game.denomination,
            shop_id: user.shop_id,
            slots_bank: bank.slots,
            bonus_bank: bank.bonus,
            fish_bank: bank.fish_bank,
            table_bank: bank.table_bank,
            little_bank: bank.little,
            total_bank: bank.slots + bank.bonus + bank.fish_bank + bank.table_bank + bank.little,
            symbols: this.getSymbols(slotArea)
        };
    }

    public static getSymbols(slotArea: SlotArea): string {
        const symbols: { [key: number]: string } = {};
        Object.values(slotArea).forEach(reel => {
            reel.forEach((symbol, key) => {
                symbols[key] = symbols[key] ? `${symbols[key]}${symbol}_` : `${symbol}_`;
            });
        });
        return Object.values(symbols).join(',');
    }
}
