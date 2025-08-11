
import { Request, Response } from 'express';
import { init } from './init';
import { Collect } from '../../models/Collect';
import { GameSettings } from '../../models/GameSettings';
import { Loader } from '../../models/Loader';
import { Log } from '../../models/Log';
import { Spin } from '../../models/Spin';
import { DoMysteryScatter } from '../../models/DoMysteryScatter';

interface RequestWithBody extends Request {
    body: {
        userId?: number;
        balance?: number;
        shop_id?: number;
        game_id?: number;
        callbackUrl?: string;
        action?: string;
        c?: number;
        l?: number;
        index?: number;
        counter?: number;
        pur?: string;
        settings?: string;
    }
}

export const handleRequest = (req: RequestWithBody, res: Response) => {
    try {
        if (!req.body.userId) {
            return res.status(400).json({ responseEvent: 'error', responseType: '', serverResponse: 'invalid login' });
        }

        const user = { id: req.body.userId, balance: req.body.balance, shop_id: req.body.shop_id };
        const shop = { id: req.body.shop_id };
        const game = { id: req.body.game_id, name: 'AztecKing', shop_id: req.body.shop_id };
        const bank = { shop_id: req.body.shop_id };
        const jpgs: any[] = [];
        const callbackUrl = req.body.callbackUrl;

        const action = req.body.action;
        const bet = req.body.c;
        const lines = req.body.l;
        const index = req.body.index;
        const counter = req.body.counter;
        const pur = req.body.pur;

        if (action === 'doInit') {
            const log = new Log({ str: '' });
            const loader = new Loader(init, user.balance!, log);
            const response = loader.initStr();
            return res.send(response);
        }

        if (action === 'doSpin') {
            const log = new Log({ str: '' });
            const gameSettings = new GameSettings(init);
            const response = Spin.spinResult(user as any, game as any, bet!, lines!, log, gameSettings, index!, counter!, callbackUrl!, false, pur!, bank, shop, jpgs);
            return res.send(response);
        }

        if (action === 'doCollect') {
            const log = new Log({ str: '' });
            const response = Collect.collect(user as any, index!, counter!, log, callbackUrl!, game as any);
            return res.send(response);
        }

        if (action === 'doMysteryScatter') {
            const response = DoMysteryScatter.doMystery(user, game);
            return res.send(response);
        }

        if (action === 'settings') {
            const response = 'SoundState=true_true_true_false_false;FastPlay=false;Intro=true;StopMsg=0;TurboSpinMsg=0;BetInfo=0_0;BatterySaver=false;ShowCCH=false;ShowFPH=true;CustomGameStoredData=;Coins=false;Volume=1;InitialScreen=1,3,6,6,3_10,4,9,10,8_6,3,8,5,4_10,8,7,7,8_5,4,4,8,1_7,8,5,9,10;SBPLock=true';
            return res.send(req.body.settings);
        }

        if (action === 'update') {
            const time = new Date().getTime();
            const response = `balance_bonus=0.00&balance=${user.balance}&balance_cash=${user.balance}&stime=${time}`;
            return res.send(response);
        }

        res.json({ error: 0, description: 'OK' });

    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: 'Server Error', description: e.message });
    }
};
