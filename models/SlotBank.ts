
interface Bank {
    bonus: number;
    slots: number;
}

export class SlotBank {
    public static addBank(totalBet: number, bank: Bank, toJackpot: number, toProfit: number, toBonus: boolean): number {
        const toBank = totalBet - toJackpot - toProfit;
        if (toBonus) {
            bank.bonus += toBank;
        } else {
            bank.slots += toBank * 0.5;
            bank.bonus += toBank * 0.5;
        }
        return toBank;
    }
}
