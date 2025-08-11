
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
    tmb_res?: number;
    tmb_win?: number;
    FreeSpinNumber?: number;
    FreeSpins?: number;
    FreeState?: string;
    PrgSum?: number;
}

interface FreeSpins {
    FreeSpins: number;
    AddFreeSpins?: number;
    Pay: number;
    Scatter: number;
    ScatterPositions: number[];
}

interface Multiplier {
    Multiplier: number;
    Reel: number;
}

interface Game {
    rtp_stat_in: number;
    name: string;
}

export class LogAndServer {
    public static getResult(
        slotArea: SlotArea,
        index: number,
        counter: number,
        bet: number,
        lines: number,
        doubleChance: number,
        reelSet: number,
        win: Win,
        log: Log,
        user: User,
        freeSpins: FreeSpins | null,
        multipliers: Multiplier[] | null,
        changeBalance: number,
        bank: any,
        game: Game
    ) {
        let toLog: any = {
            SymbolsAfter: slotArea.SymbolsAfter,
            SymbolsBelow: slotArea.SymbolsBelow,
            SlotArea: slotArea.SlotArea,
            Balance: user.balance + changeBalance,
            Index: index,
            Counter: counter,
            Bet: bet,
            Lines: lines,
            DoubleChance: doubleChance,
            ReelSet: reelSet,
            TotalWin: win.TotalWin,
            Win: win.TotalWin,
            PrgSum: '0'
        };

        const time = new Date().getTime();
        let toServer: any[] = [
            'accm=cp',
            'acci=0',
            'accv=0',
            `balance=${toLog.Balance}`,
            `index=${toLog.Index}`,
            `balance_cash=${toLog.Balance}`,
            `reel_set=${toLog.ReelSet}`,
            'balance_bonus=0.00',
            'na=s',
            `bl=${toLog.DoubleChance}`,
            `stime=${time}`,
            `sa=${toLog.SymbolsAfter.join(',')}`,
            `sb=${toLog.SymbolsBelow.join(',')}`,
            'sh=5',
            `c=${toLog.Bet}`,
            'sver=5',
            `counter=${toLog.Counter}`,
            `l=${toLog.Lines}`,
            `s=${toLog.SlotArea.join(',')}`,
            `w=${toLog.Win}`,
        ];

        if (win.TotalWin === 0) {
            if (log && (log.State === 'Respin' || log.State === 'FirstRespin')) {
                const addLog = {
                    Respin: log.Respin! + 1,
                    RespinWin: log.RespinWin,
                    WinLines: win.WinLines,
                    TotalWin: log.TotalWin,
                    tmb_res: log.tmb_res,
                    tmb_win: log.tmb_win,
                    State: 'LastRespin'
                };
                toLog = { ...toLog, ...addLog };
                const repl = toServer.indexOf('na=s');
                if (repl !== -1) {
                    toServer[repl] = 'na=c';
                }
                const addResponse = [
                    `rs_t=${toLog.Respin}`,
                    `rs_win=${toLog.RespinWin}`,
                    `tmb_res=${toLog.tmb_res}`,
                    `tmb_win=${toLog.tmb_win}`,
                ];
                toServer = [...toServer, ...addResponse];
            } else {
                toLog.State = 'Spin';
            }

            if (freeSpins) {
                let responseFs: string[] = [];
                if (freeSpins.AddFreeSpins) {
                    const addFSLog = {
                        FreeState: 'AddFreeSpin',
                        FreeSpins: log.FreeSpins! + freeSpins.AddFreeSpins,
                        FreeSpinNumber: log.FreeSpinNumber! + 1,
                    };
                    responseFs = [
                        'fsmul=1',
                        `fsmax=${addFSLog.FreeSpins}`,
                        'fswin=0.00',
                        `fs=${addFSLog.FreeSpinNumber}`,
                        'fsres=0.00',
                        'fsmore=5',
                    ];
                    toLog = { ...toLog, ...addFSLog };
                } else {
                    if (log && (log.State === 'Respin' || log.State === 'FirstRespin')) {
                        toLog.TotalWin = log.TotalWin;
                    }
                    const addFSLog = {
                        FreeState: 'FirstFreeSpin',
                        FreeSpins: freeSpins.FreeSpins,
                        FreeSpinNumber: 1,
                        FSPay: freeSpins.Pay,
                        Scatter: freeSpins.Scatter,
                        ScatterPositions: freeSpins.ScatterPositions,
                        TotalWin: toLog.TotalWin + freeSpins.Pay,
                        Win: toLog.TotalWin + freeSpins.Pay
                    };
                    responseFs = [
                        'fsmul=1',
                        `fsmax=${addFSLog.FreeSpins}`,
                        'fswin=0.00',
                        `fs=${addFSLog.FreeSpinNumber}`,
                        'fsres=0.00',
                        'fs_bought=10',
                        'puri=0',
                        'purtr=1',
                        `psym=${addFSLog.Scatter}~${addFSLog.FSPay}~${addFSLog.ScatterPositions.join(',')}`
                    ];
                    toLog = { ...toLog, ...addFSLog };
                }

                if (log && (log.State === 'Respin' || log.State === 'FirstRespin')) {
                    toLog.State = 'LastRespin';
                } else {
                    toLog.State = 'Spin';
                }
                toServer = [...toServer, ...responseFs];
            }
        } else {
            let addLog: any;
            let addToServer: string[];
            if (log && (log.State === 'Respin' || log.State === 'FirstRespin')) {
                addLog = {
                    Respin: log.Respin! + 1,
                    RespinWin: log.RespinWin! + win.TotalWin,
                    WinLines: win.WinLines,
                    TotalWin: log.TotalWin! + win.TotalWin,
                    tmb_res: log.tmb_res! + win.TotalWin,
                    tmb_win: log.tmb_win! + win.TotalWin,
                    State: 'Respin'
                };
                const positions = this.positionsToServer(addLog.WinLines);
                toServer = [...toServer, ...positions];
                addToServer = [
                    `rs_p=${addLog.Respin}`,
                    'rs_c=1',
                    'rs_m=1',
                    `tmb_win=${addLog.tmb_win}`,
                    `tmb_res=${addLog.tmb_res}`,
                    `rs_win=${addLog.RespinWin}`,
                ];
            } else {
                addLog = {
                    Respin: 0,
                    RespinWin: 0,
                    WinLines: win.WinLines,
                    tmb_res: win.TotalWin,
                    tmb_win: win.TotalWin,
                    State: 'FirstRespin'
                };
                const positions = this.positionsToServer(addLog.WinLines);
                toServer = [...toServer, ...positions];
                addToServer = [
                    'rs=mc',
                    `rs_p=${addLog.Respin}`,
                    'rs_c=1',
                    'rs_m=1',
                    `tmb_win=${addLog.tmb_win}`,
                    `tmb_res=${addLog.tmb_res}`,
                ];
            }
            toLog = { ...toLog, ...addLog };
            toServer = [...toServer, ...addToServer];
        }

        if (log && log.FreeSpinNumber && log.FreeState !== 'LastFreeSpin') {
            if (toLog.State === 'Spin' || toLog.State === 'LastRespin') {
                toLog.FreeSpinNumber = log.FreeSpinNumber + 1;
            } else {
                toLog.FreeSpinNumber = log.FreeSpinNumber;
            }
            if (!toLog.FreeSpins) {
                toLog.FreeSpins = log.FreeSpins;
            }
            toLog.TotalWin = toLog.Win + log.TotalWin!;

            let toServerFs: string[];
            if (toLog.FreeSpinNumber <= toLog.FreeSpins) {
                toLog.FreeState = 'FreeSpin';
                toServerFs = [
                    'fsmul=1',
                    `fsmax=${toLog.FreeSpins}`,
                    'fswin=0.00',
                    `fs=${toLog.FreeSpinNumber}`,
                    'fsres=0.00',
                ];
                const repl = toServer.indexOf('na=c');
                if (repl !== -1) {
                    toServer[repl] = 'na=s';
                }
            } else {
                const repl = toServer.indexOf('na=s');
                if (repl !== -1) {
                    toServer[repl] = 'na=c';
                }
                toLog.FreeState = 'LastFreeSpin';
                toServerFs = [
                    'fsmul_total=1',
                    'fswin_total=0.00',
                    `fs_total=${toLog.FreeSpinNumber - 1}`,
                    'fsres_total=0.00',
                    'fs_bought=10',
                    'puri=0'
                ];
            }
            toServer = [...toServer, ...toServerFs];
        }

        let prg = 0;
        if (multipliers) {
            toLog.Multipliers = multipliers;
            let rmul = 'rmul=';
            multipliers.forEach((multiplier, key) => {
                const { Reel, ...rest } = multiplier;
                prg += rest.Multiplier;
                if (key === 0) {
                    rmul += Object.values(rest).join('~');
                } else {
                    rmul += ';' + Object.values(rest).join('~');
                }
            });

            const repl = toServer.indexOf('prg=1');
            if (repl !== -1 && prg !== 0) {
                toServer[repl] = `prg=${prg}`;
            }
            toServer.push(rmul);

            if (prg !== 0 && toLog.State === 'LastRespin') {
                const addMultWin = toLog.tmb_res * (log.PrgSum! + prg);
                toLog.MultWin = prg;
                toLog.tmb_res = addMultWin;
                toLog.TotalWin += addMultWin - toLog.tmb_win;
            }
        }

        if (log && log.FreeSpinNumber && log.FreeSpinNumber > 1) {
            let prgSum = log.PrgSum!;
            if (prg !== 0 && toLog.State === 'LastRespin') {
                prgSum += prg;
            }
            toLog.PrgSum = prgSum;
            const repl = toServer.indexOf('accv=0');
            if (repl !== -1) {
                toServer[repl] = `accv=${prgSum}`;
            }
        }

        toServer.unshift(`tw=${toLog.TotalWin}`);
        toLog.ServerState = toServer;

        return { Log: toLog, Server: toServer };
    }

    private static positionsToServer(winLines: WinLine[]) {
        const result: string[] = [];
        const tmb: string[] = [];
        winLines.forEach((winLine, key) => {
            const l = `l${key}=0~${winLine.Pay}~${winLine.Positions.join('~')}`;
            tmb.push(`${winLine.Positions.join('~')},${winLine.WinSymbol}`);
            result.push(l);
        });
        result.push(`tmb=${tmb.join('~')}`);
        return result;
    }
}
