const enum statusCodeEnum {
    serverIssue = 500,
    serverUnavailavle = 503,
    notFound = 404,
    noContent = 204,
    success = 200,
    badRequest = 400,
    forbiden = 403,
    unauthorized = 401
}

export const enum statusMsgEnum {
    serverIssue = 'Server Issue',
    serverUnavailavle = 'Server Unavailavle',
    notFound = 'Not Found',
    noContent = 'Empty Payload',
    success = 'Success',
    badRequest = 'Bad Request',
    forbiden = 'Forbiden',
    unauthorized = 'Unauthorized',
    invalidEndPoint = 'Invalid EndPoint',
    updateErrMsg = 'Please re-check the provided ID and Data',
    validationError = 'Validation Failed, Please re-check the provided Data',
    ForeignKeyError = `Re-check the provided ID's for foreign-key relations`,
    UniqueContraintError = 'Some data of provided fields are already present in Database',
    AssociationError = 'Relation between tables are not correctly managed'
}

export default abstract class BaseError extends Error {
    abstract code: number;
    constructor(message: string) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends BaseError {
    code: number = statusCodeEnum.notFound;
    constructor(message?: string) {
        super(message ?? statusMsgEnum.notFound);
    }
}

export class NoContentError extends BaseError {
    code: number = statusCodeEnum.badRequest;
    constructor(message?: string) {
        super(message ?? statusMsgEnum.noContent);
    }
}

export class ServerIssueError extends BaseError {
    code: number = statusCodeEnum.serverIssue;
    constructor(message?: string) {
        super(message ?? statusMsgEnum.serverIssue);
    }
}

export class ServerUnavailableError extends BaseError {
    code: number = statusCodeEnum.serverUnavailavle;
    constructor(message?: string) {
        super(message ?? statusMsgEnum.serverUnavailavle);
    }
}

export class BadRequestError extends BaseError {
    code: number = statusCodeEnum.badRequest;
    constructor(message?: string) {
        super(message ?? statusMsgEnum.badRequest);
    }
}

export class InvalidEndPointError extends BaseError {
    code: number = statusCodeEnum.badRequest;
    constructor(message?: string) {
        super(message ?? 'Invalid EndPoint');
    }
}

export class ForbidenError extends BaseError {
    code: number = statusCodeEnum.forbiden;
    constructor(message?: string) {
        super(message ?? statusMsgEnum.forbiden);
    }
}

export class UnauthorizedError extends BaseError {
    code: number = statusCodeEnum.unauthorized;
    constructor(message?: string) {
        super(message ?? statusMsgEnum.unauthorized);
    }
}

export class MongoError extends Error {
    public code: number;

    private static errorMessages: { [code: number]: string } = {
        11000: 'Data already exist.',
        121: 'Document failed validation.',
        50: 'Network timeout.'
    };

    constructor(code: number) {
        const message = MongoError.errorMessages[code] || 'Server Issues Code -M';
        super(message);
        this.code = code;
        this.name = 'MongoError';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MongoError);
        }
    }
}
