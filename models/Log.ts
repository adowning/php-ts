
interface History {
    str?: string;
}

export class Log {
    private log: any;

    constructor(history: History) {
        if (history.str) {
            this.log = JSON.parse(history.str);
        } else {
            this.log = { 'State': 'Spin' };
        }
    }

    public getLog() {
        return this.log;
    }

    public static setLog(log: any, gameId: number, userId: number, shopId: number) {
        return {
            game_id: gameId,
            user_id: userId,
            ip: '127.0.0.1', // In a real-world scenario, you would get the IP from the request.
            str: JSON.stringify(log),
            shop_id: shopId
        };
    }
}
