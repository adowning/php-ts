
import { Request, Response } from 'express';
import { init } from './init';
import { Collect } from '../../models/Collect';
import { GameSettings } from '../../models/GameSettings';
import { Loader } from '../../models/Loader';
import { Log } from '../../models/Log';
import { Spin } from '../../models/Spin';

interface GameStateData {
    userId: number;
    balance: number;
    shop_id: number;
    game_id: number;
    callbackUrl?: string;
    action?: string;
    c?: number;
    l?: number;
    index?: number;
    counter?: number;
    pur?: string;
}

export const handleRequest = (req: Request, res: Response) => {
    try {
        const gameStateData: GameStateData = req.body; // Assuming gameStateData is sent in the request body
        const game_name = 'AncientEgyptClassic';

        const user = { id: gameStateData.userId, balance: gameStateData.balance, shop_id: gameStateData.shop_id, count_balance: gameStateData.balance };
        const shop = { id: gameStateData.shop_id, percent: 100 };
        const game = { id: gameStateData.game_id, name: game_name, shop_id: gameStateData.shop_id, stat_in: 0, stat_out: 0, denomination: 1 };
        const bank = { shop_id: gameStateData.shop_id, slots: 0, bonus: 0, fish_bank: 0, table_bank: 0, little: 0 };
        const jpgs: any[] = [];
        const callbackUrl = gameStateData.callbackUrl;

        const action = gameStateData.action;
        const bet = gameStateData.c;
        const lines = gameStateData.l;
        const index = gameStateData.index;
        const counter = gameStateData.counter;
        const pur = gameStateData.pur;

        let response: string | null = null;

        if (action === 'doInit') {
            const log = new Log({ str: '' });
            const loader = new Loader(init, user.balance, log);
            response = loader.initStr();
        } else if (action === 'doSpin') {
            const log = new Log({ str: '' });
            const gameSettings = new GameSettings(init);
            response = Spin.spinResult(user, game, bet!, lines!, log, gameSettings, index!, counter!, callbackUrl!, false, pur!, bank, shop, jpgs);
        } else if (action === 'doCollect') {
            const log = new Log({ str: '' });
            response = Collect.collect(user, index!, counter!, log, callbackUrl!, game);
        } else {
            response = JSON.stringify({ error: 1, description: "Invalid action specified." });
        }

        res.send(response);
    } catch (e: any) {
        res.status(500).json({
            error: 'SCRIPT_EXCEPTION',
            message: e.message,
            file: e.file,
            line: e.line
        });
    }
};
