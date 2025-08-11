export class DoMysteryScatter {
    public static doMystery(user: any, game: any): string {
        const ms = this.selectMysterySymbol();
        const res = [
            'fsmul=1',
            'fsmax=10',
            `ms=${ms}`,
            'purtr=1',
            'reel_set=14',
            'na=s',
            'fswin=0',
            'puri=0',
            'fs=1',
            'fsres=0'
        ];
        Log.changeLog(game.id, user.id, ms);

        return '&' + res.join('&');
    }

    private static selectMysterySymbol(): number {
        return 3 + Math.floor(Math.random() * 8);
    }
}

