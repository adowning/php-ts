
interface Jackpot {
    id: number;
    name: string;
    percent: number;
    balance: number;
    shop_id: number;
}

export class Jackpots {
    public static toJP(bet: number, jpgs: Jackpot[]) {
        let toJackpots = 0;
        const updatedJackpots: { id: number; name: string; balance: number; shop_id: number }[] = [];

        jpgs.forEach(jpg => {
            const contribution = bet * (jpg.percent / 100);
            updatedJackpots.push({
                id: jpg.id,
                name: jpg.name,
                balance: jpg.balance + contribution,
                shop_id: jpg.shop_id
            });
            toJackpots += contribution;
        });

        return {
            toJackpots,
            updatedJackpots
        };
    }
}
