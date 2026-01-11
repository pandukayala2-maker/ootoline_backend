import { body, ValidationChain } from 'express-validator';

export default class BaseValidator {
    static emailField(name?: string): ValidationChain {
        const fieldName = name ?? 'email';
        return body(fieldName)
            .notEmpty()
            .withMessage('Email is required.')
            .isEmail()
            .withMessage('Please provide a valid email address.')
            .trim()
            .normalizeEmail();
    }

    static nameField(name?: string, { minLength = 1, maxLength = 50, isOptional = false } = {}): ValidationChain {
        const fieldName = name ?? 'name';
        let validation = body(fieldName);
        if (isOptional) validation = validation.optional();
        return validation
            .isString()
            .withMessage(`${fieldName} must be a string.`)
            .notEmpty()
            .withMessage(`${fieldName} is required.`)
            .trim()
            .withMessage(`${fieldName} must not contain only whitespace.`)
            .isLength({ min: minLength, max: maxLength })
            .withMessage(`${fieldName} must be between ${minLength} and ${maxLength} characters.`);
    }

    static imageField(name?: string, { isOptional = false } = {}): ValidationChain {
        const fieldName = name ?? 'image';
        let validation = body(fieldName);
        if (isOptional) validation = validation.optional();
        return validation
            .isString()
            .withMessage(`${fieldName} must be a string.`)
            .notEmpty()
            .withMessage(`${fieldName} is required.`)
            .trim()
            .withMessage(`${fieldName} must not contain only whitespace.`);
    }

    static dateRangeValidation(): ValidationChain[] {
        return [
            body('from_date')
                .isISO8601()
                .withMessage('fromDate must be a valid date in ISO 8601 format.')
                .custom((fromDate, { req }) => {
                    const toDate = req.body.toDate;
                    if (!toDate) {
                        throw new Error('toDate is required.');
                    }
                    if (new Date(fromDate) >= new Date(toDate)) {
                        throw new Error('fromDate must be before toDate.');
                    }
                    return true;
                }),

            body('to_date')
                .isISO8601()
                .withMessage('toDate must be a valid date in ISO 8601 format.')
                .custom((toDate, { req }) => {
                    const fromDate = req.body.fromDate;
                    if (!fromDate) {
                        throw new Error('fromDate is required.');
                    }
                    if (new Date(toDate) <= new Date(fromDate)) {
                        throw new Error('toDate must be after fromDate.');
                    }
                    return true;
                })
        ];
    }

    static dateField(name: string, { isOptional = false } = {}) {
        let validation = body(name);
        if (isOptional) validation = validation.optional();
        return validation.isISO8601().withMessage(`${name} must be a valid date in ISO 8601 format.`);
    }

    static optinalField(name: string) {
        return body(name).optional().withMessage(`${name} must be a string if provided.`);
    }

    static mongoIdField(name: string, { isOptional = false } = {}) {
        let validation = body(name);
        if (isOptional) validation = validation.optional();
        return validation.isMongoId().withMessage(`${name} must be a valid MongoDB ObjectId.`);
    }

    static numberField(name?: string, { isOptional = false, min = 0, max = 1000000 } = {}) {
        const fieldName = name ?? 'phone';
        let validation = body(fieldName);
        if (isOptional) validation = validation.optional();
        return validation
            .isNumeric()
            .withMessage(`${name} must be a valid number.`)
            .isLength({ min: min, max: max })
            .withMessage(`${fieldName} must be between ${min} and ${max} characters.`);
    }

    static booleanField(name: string, { isOptional = false } = {}) {
        let validation = body(name);
        if (isOptional) validation = validation.optional();
        return validation.isBoolean().withMessage(`${name} must be a boolean.`);
    }

    static enumField(name: string, enumValues: any[], { isOptional = false } = {}) {
        let validation = body(name);
        if (isOptional) validation = validation.optional();
        return validation.isIn(enumValues).withMessage(`${name} must be one of the following values: ${enumValues.join(', ')}`);
    }

    static listOfMongoIdField(name: string) {
        return [
            body(name).isArray({ min: 1 }).withMessage('ids must be a non-empty array'),
            body(`${name}.*`).isMongoId().withMessage('Each id must be a valid MongoDB ObjectId')
        ];
    }

    static objectField(name: string, { isOptional = false, isMap = false } = {}) {
        let validation = body(name);
        if (isOptional) validation = validation.optional();
        validation = validation.isObject().withMessage(`${name} must be a valid object.`);
        if (isMap) {
            validation = validation.custom((value) => {
                if (!Object.values(value).every((v) => typeof v === 'string')) {
                    throw new Error(`${name} must be a key-value pair with string values.`);
                }
                return true;
            });
        }

        return validation;
    }

    static listField(name: string, { isOptional = false } = {}): ValidationChain {
        let validation = body(name);
        if (isOptional) validation = validation.optional();
        return validation.isArray().withMessage(`${name} must be an array.`);
    }

    static anyOneRequired(fields: string[]): ValidationChain {
        return body().custom((_, { req }) => {
            const hasAtLeastOneField = fields.some((field) => req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '');
            if (!hasAtLeastOneField) {
                throw new Error(`At least one of the following fields is required: ${fields.join(', ')}`);
            }
            return true;
        });
    }
    static anyOneRequiredMongoId(fields: string[]): ValidationChain {
        return body().custom((_, { req }) => {
            const hasAtLeastOneField = fields.some((field) => {
                const value = req.body[field];
                return value !== undefined && value !== null && value !== '' && body(field).isMongoId().run(req);
            });
            if (!hasAtLeastOneField) {
                throw new Error(`At least one of the following fields must be a valid MongoDB ObjectId: ${fields.join(', ')}`);
            }
            return true;
        });
    }
}
