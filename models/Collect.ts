import { Log } from './Log';

export class Collect {
    public static collect(user: any, index: number, counter: number, log: Log, callbackUrl: string, game: any): string {
        const currentLog = log.getLog();
        user.balance += currentLog.TotalWin;
        // In a real application, you would save the user and game data to a database.
        // user.save();
        // game.save();

        const time = new Date().getTime();
        const response = [
            `balance=${user.balance}`,
            `index=${index}`,
            `balance_cash=${user.balance}`,
            'balance_bonus=0.00',
            'na=s',
            `stime=${time}`,
            'sver=5',
            `counter=${counter}`
        ];
        return response.join('&');
    }
}