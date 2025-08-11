export class CheckRtp {
    private rtp: number;
    private game: any;

    constructor(rtp: number, game: any) {
        // load rtp from config
        this.rtp = rtp;
        this.game = game;
    }

    checkRtp(bet: number, win: number): boolean {
        // calculate current rtp with in and out of money and save to games table
        this.formatRtp(this.game);
        const currentRTP = this.game.rtp_stat_out > 0 && this.game.rtp_stat_in > 0
            ? this.game.rtp_stat_out / this.game.rtp_stat_in * 100
            : 0;
        this.game.current_rtp = currentRTP;
        this.game.save();
        console.log(`currentRtp=${currentRTP} rtp=${this.rtp} bet=${bet} win=${win}`);

        // when the rtp must go down and the win is greater than bet/2
        // and when the rtp must go up and the win is less than bet*2
        // we don't allow to pass through
        if (this.rtp > currentRTP && bet * 0.5 > win || this.rtp < currentRTP && bet * 2 < win) {
            return false;
        }
        return true;
    }

    private formatRtp(game: any): void {
        if (game.rtp_stat_in > 8500) {
            game.rtp_stat_in = 500;
            game.rtp_stat_out = 370;
        }
    }
}
