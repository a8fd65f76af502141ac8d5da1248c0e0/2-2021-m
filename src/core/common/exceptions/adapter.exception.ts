export class AdapterException extends Error {
    public constructor(message: string) {
        super(message);
        this.name = AdapterException.name;
    }
}
