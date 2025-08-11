import { Loader } from '../../models/Loader';
import { Spin } from '../../models/Spin';
import { Collect } from '../../models/Collect';
import { DoMysteryScatter } from '../../models/DoMysteryScatter';
import { GameSettings } from '../../models/GameSettings';
import { Log } from '../../models/Log';
import { init } from './init';

interface Request {
    userId: number;
    balance: number;
    shop_id: number;
    game_id: number;
    callbackUrl: string;
    action: string;
    c: number;
    l: number;
    index: number;
    counter: number;
    pur: string;
    bl: number;
    settings?: string;
}

interface User {
    id: number;
    balance: number;
    shop_id: number;
}

interface Game {
    id: number;
    name: string;
    shop_id: number;
}

interface Shop {
    id: number;
}

interface Bank {
    shop_id: number;
}

interface Jpgs {
    // Define jpgs properties here
}

export class Server {
    public get(request: Request): string | false {
        try {
            if (!request.userId) {
                return '{"responseEvent":"error","responseType":"","serverResponse":"invalid login"}';
            }

            const user: User = { id: request.userId, balance: request.balance, shop_id: request.shop_id };
            const shop: Shop = { id: request.shop_id };
            const game: Game = { id: request.game_id, name: 'GreatReef', shop_id: request.shop_id };
            const bank: Bank = { shop_id: request.shop_id };
            const jpgs: Jpgs = {};
            // In a real application, you would fetch the game history from a database.
            // For now, we'll create a new log for each request.
            const log = new Log({str: ''});
            const callbackUrl = request.callbackUrl;

            switch (request.action) {
                case 'doInit': {
                    const loader = new Loader(init, user.balance, log);
                    return loader.initStr();
                }
                case 'doSpin': {
                    const gameSettings = new GameSettings(init);
                    const response = Spin.spinResult(
                        user,
                        game,
                        request.c,
                        request.l,
                        log,
                        gameSettings,
                        request.index,
                        request.counter,
                        callbackUrl,
                        request.bl || 0,
                        request.pur,
                        bank,
                        shop,
                        jpgs
                    );
                    return response;
                }
                case 'doCollect': {
                    return Collect.collect(user, request.index, request.counter, log, callbackUrl, game);
                }
                case 'doMysteryScatter': {
                    return DoMysteryScatter.doMystery(user, game);
                }
                case 'settings': {
                    return 'SoundState=true_true_true_false_false;FastPlay=false;Intro=true;StopMsg=0;TurboSpinMsg=0;BetInfo=0_0;BatterySaver=false;ShowCCH=false;ShowFPH=true;CustomGameStoredData=;Coins=false;Volume=1;InitialScreen=1,3,6,6,3_10,4,9,10,8_6,3,8,5,4_10,8,7,7,8_5,4,4,8,1_7,8,5,9,10;SBPLock=true';
                }
                case 'update': {
                    const time = new Date().getTime();
                    return `balance_bonus=0.00&balance=${user.balance}&balance_cash=${user.balance}&stime=${time}`;
                }
                default: {
                    return JSON.stringify({ "error": 0, "description": "OK" });
                }
            }
        } catch (e) {
            console.error(e);
            return '{"responseEvent":"error","responseType":"","serverResponse":"Internal Server Error"}';
        }
    }
}
