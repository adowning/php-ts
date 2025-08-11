
export class GameSettings {
    public all: { [key: string]: string } = {};

    constructor(init: string[]) {
        init.forEach(value => {
            const tmp = value.split('=');
            this.all[tmp[0]] = tmp[1];
        });
    }
}
