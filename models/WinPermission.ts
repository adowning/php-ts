
interface FreeSpins {
    Pay?: number;
}

interface Bank {
    bonus: number;
    slots: number;
}

interface CurrentState {
    FreeSpinNumber?: number;
    FreeState?: string;
    State?: string;
    BankCredit?: any;
    tmb_win?: number;
    PrgSum?: number;
}

interface Multiplier {
    Multiplier: number;
}

export class WinPermission {
    public static winCheck(
        freespins: FreeSpins | null,
        buyFS: string,
        bank: Bank,
        currentState: CurrentState,
        win: number,
        multipliers: Multiplier[] | null,
        log: any
    ): boolean | { CurrentWin: number } {
        if (freespins) {
            if (buyFS !== '0') {
                if (freespins.Pay) {
                    if (bank.bonus < freespins.Pay) {
                        return false;
                    }
                }
            }
        }

        if (!freespins && !currentState.FreeSpinNumber) {
            if (bank.slots < win) {
                return false;
            }
        }

        if (currentState.FreeSpinNumber && currentState.FreeState !== 'FirstFreeSpin') {
            if (currentState.State === 'LastRespin' && log.BankCredit) {
                delete log.BankCredit;
            }

            if (currentState.tmb_win) {
                win = currentState.tmb_win;
            }

            if (multipliers) {
                let total_mult = 0;
                multipliers.forEach(multiplier => {
                    total_mult += multiplier.Multiplier;
                });

                if (currentState.State === 'LastRespin') {
                    total_mult = currentState.PrgSum || 0;
                } else {
                    total_mult += currentState.PrgSum || 0;
                }

                if (currentState.tmb_win) {
                    win = currentState.tmb_win * total_mult;
                } else {
                    win = win * total_mult;
                }
            }

            if (bank.bonus < win) {
                return false;
            } else {
                if (currentState.State !== 'LastRespin') {
                    win = 0;
                }
                return { CurrentWin: win };
            }
        }

        return true;
    }
}
