export class AppError extends Error {
    location: string;
    constructor(location: string, original: Error) {
        super(original.message);
        this.name = original.name;
        this.stack = original.stack;
        this.location = location;
    }

    toJSON() {
        return {
            location: this.location,
            name: this.name,
            message: this.message
        };
    }
}
