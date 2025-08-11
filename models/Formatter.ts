
interface SlotArea {
    SymbolsAfter: number[];
    SymbolsBelow: number[];
    SlotArea: number[];
}

interface User {
    balance: number;
}

interface Win {
    TotalWin: number;
    WinLines: WinLine[];
}

interface WinLine {
    Pay: number;
    Positions: number[];
    WinSymbol: number;
}

interface Log {
    State?: string;
    Respin?: number;
    RespinWin?: number;
    TotalWin?: number;
    WinLines?: WinLine[];
    Scatter?: number;
    FSPay?: number;
    ScatterPositions?: number[];
    FreeSpinNumber?: number;
    FreeSpins?: number;
    FreeState?: string;
}

interface FreeSpins {
    FreeSpins: number;
    Pay: number;
    Scatter: number;
    ScatterPositions: number[];
}

export class Formatter {
    public static toLog(slotArea: SlotArea, index: number, counter: number, bet: number, lines: number, doubleChance: number, reelSet: number, win: Win, log: Log, user: User, freeSpins: FreeSpins) {
        const toLog: any = {
            'SymbolsAfter': slotArea.SymbolsAfter,
            'SymbolsBelow': slotArea.SymbolsBelow,
            'SlotArea': slotArea.SlotArea,
            'Balance': user.balance,
            'Index': index,
            'Counter': counter,
            'Bet': bet,
            'Lines': lines,
            'DoubleChance': doubleChance,
            'ReelSet': reelSet,
            'TotalWin': win.TotalWin,
            'Win': win.TotalWin,
        };
        const addLog = this.situationToLog(log, win, freeSpins, toLog); // обычные ситуации с играми
        return { ...toLog, ...addLog };
    }

    public static toServer(logData: any) {
        let response: string[] = [
            `tw=${logData.TotalWin}`,
            'prg_m=wm',
            `balance=${logData.Balance}`,
            'prg=1',
            `index=${logData.Index}`,
            `balance_cash=${logData.Balance}`,
            `reel_set=${logData.ReelSet}`,
            'balance_bonus=0.00',
            'na=s',
            `bl=${logData.DoubleChance}`,
            `stime=${new Date().getTime()}`,
            `sa=${logData.SymbolsAfter.join(',')}`,
            `sb=${logData.SymbolsBelow.join(',')}`,
            'sh=5',
            `c=${logData.Bet}`,
            'sver=5',
            `counter=${logData.Counter}`,
            `l=${logData.Lines}`,
            `s=${logData.SlotArea.join(',')}`,
            `w=${logData.Win}`,
        ];

        // Если не было респина и появился первый выигрыш
        if (logData.State === 'FirstRespin' && logData.Win > 0) {
            const positions = this.positionsToServer(logData.WinLines);
            const addResponse = [
                'rs=t',
                `rs_p=${logData.Respin}`,
                'rs_c=1',
                'rs_m=1',
                `tmb_win=${logData.TotalWin}`,
            ];
            response = [...response, ...positions, ...addResponse];
        }
        // Если был респин и появился еще выигрыш
        if (logData.State === 'Respin' && logData.Win > 0) {
            const positions = this.positionsToServer(logData.WinLines);
            const addResponse = [
                `rs_p=${logData.Respin}`,
                'rs_c=1',
                'rs_m=1',
                `tmb_win=${logData.TotalWin}`,
                `rs_win=${logData.RespinWin}`,
            ];
            response = [...response, ...positions, ...addResponse];
        }
        // если это последний респин
        if (logData.State === 'LastRespin') {
            const repl = response.indexOf('na=s');
            if (repl !== -1) {
                response[repl] = 'na=c'; // заменить значение
            }
            const addResponse = [
                `rs_t=${logData.Respin}`,
                `rs_win=${logData.RespinWin}`,
                `tmb_res=${logData.TotalWin}`,
                `tmb_win=${logData.TotalWin}`,
            ];
            response = [...response, ...addResponse];
        }

        if (logData.FSPay) { // при выигрыше фриспина показать где скаттеры и сколько оплата
            const responseFs: string[] = [`psym=${logData.Scatter}~${logData.FSPay}~${logData.ScatterPositions.join(',')}`];
            response = [...response, ...responseFs];
        }
        if (logData.FreeSpinNumber && logData.FreeSpinNumber < logData.FreeSpins) {
            const responseFs = [
                'fsmul=1',
                'fsmax=10',
                'fswin=0.00',
                `fs=${logData.FreeSpinNumber}`,
                'fsres=0.00',
            ];
            response = [...response, ...responseFs];
        }
        if (logData.FreeState && logData.FreeState === 'LastFreeSpin') {
            const responseFs = [
                'fsmul_total=1',
                'fswin_total=0.00',
                `fs_total=${logData.FreeSpinNumber}`,
                'fsres_total=0.00',
                'fs_bought=10'
            ];
            response = [...response, ...responseFs];
        }

        return response.join('&');
    }

    private static positionsToServer(winLines: WinLine[]) {
        // вернуть позиции в подходящем виде
        const result: string[] = [];
        const tmb: string[] = [];
        winLines.forEach((winLine, key) => {
            const l = `l${key}=0~${winLine.Pay}~${winLine.Positions.join('~')}`;
            tmb.push(winLine.Positions.join(`,${winLine.WinSymbol}~`));
            result.push(l);
        });
        result.push(`tmb=${tmb.join('~')}`);
        return result;
    }

    private static situationToLog(log: Log, win: Win, freeSpins: FreeSpins, toLog: any) {
        //если нет лога то по умолчанию состояние Spin
        let state = 'Spin';
        if (log && log.State) {
            state = log.State;
        }

        let addLog: any = {};

        //если нет выигрыша, и нет предыдущего респина - то состояние Spin
        if (win.TotalWin === 0 && state !== 'Respin') {
            addLog = { 'State': 'Spin' };
        }
        //если есть выигрыш, но нет фриспинов, и нет предыдущего респина - то FirstRespin
        if (win.TotalWin > 0 && state !== 'Respin') {
            addLog = {
                'Respin': 0,
                'RespinWin': 0,
                'WinLines': win.WinLines,
                'State': 'FirstRespin'
            };
        }
        //если есть выигрыш, и есть предыдущий респин - то Respin
        if (win.TotalWin > 0 && (state === 'Respin' || state === 'FirstRespin')) {
            addLog = {
                'Respin': log.Respin! + 1,
                'RespinWin': log.RespinWin! + win.TotalWin,
                'WinLines': win.WinLines,
                'TotalWin': log.TotalWin! + win.TotalWin,
                'State': 'Respin'
            };
        }
        //если нет выигрыша, и есть предыдущий респин - то LastRespin
        if (win.TotalWin === 0 && (state === 'Respin' || state === 'FirstRespin')) {
            addLog = {
                'Respin': log.Respin,
                'RespinWin': log.RespinWin,
                'TotalWin': log.TotalWin,
                'State': 'LastRespin'
            };
        }

        //если нет выигрыша, и это фриспины, и предыдущий спин или ласт респин - то состояние Spin
        if (log && freeSpins && !log.FreeSpinNumber) {
            const addFSLog = {
                'FreeState': 'FirstFreeSpin',
                'FreeSpins': freeSpins.FreeSpins,
                'FreeSpinNumber': 1,
                'FSPay': freeSpins.Pay,
                'Scatter': freeSpins.Scatter,
                'ScatterPositions': freeSpins.ScatterPositions,
                'TotalWin': toLog.TotalWin + freeSpins.Pay,
                'Win': toLog.TotalWin + freeSpins.Pay
            };
            addLog = { ...addLog, ...addFSLog };
        }
        if (log && log.FreeSpinNumber && log.FreeSpinNumber < log.FreeSpins!) {
            let addFS = 0;
            if (addLog.State === 'Spin' || addLog.State === 'FirstRespin') {
                addFS = 1;
            }
            const addFSLog = {
                'FreeState': 'FreeSpin',
                'FreeSpins': log.FreeSpins,
                'FreeSpinNumber': log.FreeSpinNumber + addFS
            };
            addLog = { ...addLog, ...addFSLog };
        }
        if (log && log.FreeSpinNumber && log.FreeSpinNumber === log.FreeSpins) {
            const addFSLog = {
                'FreeSpins': freeSpins.FreeSpins,
                'FreeState': 'LastFreeSpin',
            };
            addLog = { ...addLog, ...addFSLog };
        }

        return addLog;
    }
}
