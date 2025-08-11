
export interface TestAttributes {
    id: number;
}

export class Test {
    protected table = 'test';
    protected primaryKey = 'id';
    public timestamps = false;

    // You would typically have methods here to interact with the database.
    // For example:
    // static async find(id: number): Promise<Test | null> { ... }
    // async save(): Promise<void> { ... }
}
