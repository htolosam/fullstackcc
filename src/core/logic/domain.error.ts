interface ICommandError {
    message: string
}

export abstract class  DomainError implements ICommandError {
    public readonly message: string
    constructor(message: string) {
        this.message = message
    }
}