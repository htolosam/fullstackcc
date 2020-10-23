import { Result } from './result'
import { DomainError } from './domain.error'

export namespace GenericAppError {
    export class UnexpectedError extends Result<DomainError> {
        public constructor(err: any){
            super(false, err.message)
        }

        public static create(err: any): UnexpectedError {
            return new UnexpectedError(err);
        }
    }        

    export class NotFoundError extends Result<DomainError> {
        public constructor(err: any){
            super(false, err.message)
        }

        public static create(err: any): UnexpectedError {
            return new NotFoundError(err);
        }
    }
}