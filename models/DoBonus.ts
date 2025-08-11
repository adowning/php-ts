export class DoBonus {
    public static doBonus(
        user: any,
        game: any,
        bet: number,
        lines: number,
        log: any,
        index: number,
        counter: number,
        bank: any,
        shop: any,
        jpgs: any,
        gameSettings: any
    ): string {
        reDoBonus:
        console.log('doBonus_1_');
        const rsb_c = log.rsb_c + 1;
        const rsb_m = log.rsb_m;
        const bpw = log.bpw;
        const betAmount = log.Bet;
        const linesCount = log.l;
        const slotArea: any = {};
        slotArea.SlotArea = Array.isArray(log.s) ? log.s : log.s.split(',');
        const mo = log.mo;
        const mo_t = log.mo_t;
        const mo_v = gameSettings.mo_v.split(',');

        // Set all un-rhino symbols to blank
        let i = 0;
        // while(i < 19){
        //   slotArea.SlotArea[i] = slotArea.SlotArea[i] == 3 ? 3 : 13;
        //   i ++;
        // }

        // Add new Rhinos
        const isAdding = Math.random() > 0.5;
        let add = 0;
        if (isAdding) {
            const newCnt = Math.floor(Math.random() * 3);
            add = newCnt;
            console.log(`doBonus_2_addCnt=${newCnt}`);
            let addCnt = 0;
            while (newCnt) {
                const idx = Math.floor(Math.random() * 15);
                if (slotArea.SlotArea[idx] !== 11) {
                    // set the price of the money symbol
                    let moInd = 0; //40
                    const random = Math.floor(Math.random() * 1000);
                    if (random > 310) moInd++;  //80
                    if (random > 640) moInd++;  //120
                    if (random > 790) moInd++;  //160
                    if (random > 880) moInd++;  //200
                    if (random > 930) moInd++;  //240
                    if (random > 945) moInd++;  //280
                    if (random > 960) moInd++;  //320
                    if (random > 970) moInd++;  //400
                    if (random > 975) moInd++;  //560
                    if (random > 980) moInd++;  //640
                    if (random > 985) moInd++;  //720
                    if (random > 990) moInd++;  //800
                    if (random > 995) moInd++;  //800
                    if (random > 998) moInd++;  //800
                    if (random > 999) moInd++;  //800
                    mo[idx] = mo_v[moInd];
                    if (moInd === 14) {
                        mo_t[idx] = 'jp3';
                    } else if (moInd === 15) {
                        mo_t[idx] = 'jp2';
                    } else {
                        mo_t[idx] = 'v';
                    }
                    bpw += parseFloat(mo_v[moInd]) * bet;
                    slotArea.SlotArea[idx] = 11;
                    newCnt--;
                    addCnt++;
                }
                if ((slotArea.SlotArea.filter((symbol: number) => symbol === 11)).length === 14) {
                    newCnt = 0;
                }
            }
            if (addCnt) {
                rsb_c = 0;
            }
            if (rsb_c < 0) {
                rsb_c = 0;
            }
        }

        // Check if there is enough money for payment
        console.log(`doBonus_3_slotArea=${slotArea.SlotArea.join(',')}`);
        if (bpw > bank.slots) {
            return DoBonus.doBonus(user, game, bet, lines, log, index, counter, bank, shop, jpgs, gameSettings);
        }

        const cnts = this.arrayCountValues(slotArea.SlotArea);
        if (cnts[11] >= 15) {
            const mo_jp = gameSettings.mo_jp.split(';');
            const jpgWin = parseFloat(mo_jp[cnts[11] - 13]) * bet;
            const isEnough = Jackpots.isEnough(jpgWin, jpgs);
            console.log(`$jpgwin=${jpgWin} isEnough=${isEnough}`);
            if (!isEnough) {
                return DoBonus.doBonus(user, game, bet, lines, log, index, counter, bank, shop, jpgs, gameSettings);
            }
        }

        // according to specified rate increase respin max value by one
        let bgid = 0;
        const na = 'b';
        const time = Math.round(Date.now());
        let end = 0;
        const sver = 5;
        const addToLog: any = {};
        const addToServer: string[] = [];

        // If this is the last bonus turn handle the winning
        console.log(`doBonus_4_TotalWin=${bpw}`);
        let isTakenOut = 0;
        if (rsb_c === rsb_m) {
            console.log('!!!');
            const cnts = this.arrayCountValues(slotArea.SlotArea);
            console.log('!!!');
            if (cnts[11] >= 15) {
                const mo_jp = gameSettings.mo_jp.split(';');
                const jpgWin = parseFloat(mo_jp[cnts[11] - 13]) * bet;
                bgid = 1 - (cnts[11] - 13);
                isTakenOut = Jackpots.fromJP(jpgWin, jpgs);

                if (isTakenOut) {
                    bpw = jpgWin;
                }
            }
            console.log('!!!');
            Object.assign(addToLog, {
                tw: bpw,
                coef: bet * lines,
                rw: bpw,
            });
            console.log('!!!');
            addToServer.push(
                `tw=${bpw}`,
                `coef=${bet * lines}`,
                `rw=${bpw}`
            );
            console.log('!!!');
            if (isTakenOut) {
                Object.assign(addToLog, {
                    rsb_wt: 'sw',
                    mo_jp: bpw,
                    mo_tw: bpw,
                });
                addToServer.push(
                    'rsb_wt=sw',
                    `mo_jp=${bpw}`,
                    `mo_tw=${bpw}`
                );
            }
            console.log('!!!');

            bpw = 0;
            na = 'cb';
            end = 1;
        }
        console.log('doBonus_5');

        // make toLog and toServer
        const toLog: any = {
            Bet: bet,
            bgid: bgid,
            rsb_m: rsb_m,
            Balance: log.Balance,
            rsb_c: rsb_c,
            Index: index,
            Balance_cash: log.Balance,
            Balance_bonus: 0,
            na: na,
            stime: time,
            end: end,
            sver: sver,
            bpw: bpw,
            Counter: counter,
            s: slotArea.SlotArea.join(','),
            l: log.l,
            rsb_s: log.rsb_s,
            mo: mo,
            mo_t: mo_t
        };

        const toServer: string[] = [
            `bgid=${bgid}`,
            `rsb_m=${rsb_m}`,
            `balance=${log.Balance}`,
            `rsb_c=${rsb_c}`,
            `index=${index}`,
            `balance_cash=${log.Balance}`,
            'balance_bonus=0',
            `na=${na}`,
            `stime=${time}`,
            `end=${end}`,
            'sver=5',
            `bpw=${bpw}`,
            `counter=${counter}`,
            `s=${slotArea.SlotArea.join(',')}`,
            'e_aw=0',
            `rsb_s=${log.rsb_s.join(',')}`,
            `mo=${mo.join(',')}`,
            `mo_t=${mo_t.join(',')}`
        ];

        toLog.ServerState = toServer;

        Object.assign(toLog, addToLog);
        toServer.push(...addToServer);
        console.log('doBonus_6');

        // take out or add cash from or to bank
        SwitchMoney.set(8, 0, shop, bank, jpgs, user, game, 0, toLog.tw ? toLog.tw : 0, slotArea, 0, toLog, 0, isTakenOut);
        console.log('doBonus_7');

        //write a log
        Log.setLog(toLog, game.id, user.id, user.shop_id);
        console.log('doBonus_8');

        return '&' + toServer.join('&');
    }

    private static arrayCountValues(array: any[]): Record<number, number> {
        const counts: Record<number, number> = {};
        for (const item of array) {
            counts[item] = (counts[item] || 0) + 1;
        }
        return counts;
    }
}