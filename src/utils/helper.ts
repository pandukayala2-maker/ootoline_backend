import { Response } from 'express';
import * as fs from 'fs';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { UserTypeEnum } from '../constant/enum';
import { ProductDocument } from '../modules/product/product_model';

export function generateOTP(): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}

export function generateHtmlTemplate(templatePath: string, fields: Record<string, string>): string {
    const htmlTemplate: string = fs.readFileSync(templatePath, 'utf-8');
    console.log(htmlTemplate);
    const regex = /\{\{([^}]+)\}\}/g;
    const htmlWithReplacedFields: string = htmlTemplate.replace(regex, (match, placeholder) => {
        if (fields.hasOwnProperty(placeholder)) return fields[placeholder];
        return match;
    });
    return htmlWithReplacedFields;
}

export const generateMongoId = () => new ObjectId();

export function combineBookingDateAndSlot(slot: string | Date, date: string | Date): Date {
    const bookingDate = new Date(date);
    const slotTime = new Date(slot);

    return new Date(
        bookingDate.getFullYear(),
        bookingDate.getMonth(),
        bookingDate.getDate(),
        slotTime.getHours(),
        slotTime.getMinutes(),
        slotTime.getSeconds(),
        slotTime.getMilliseconds()
    );
}

export const convertToMongoId = (id: string) => {
    try {
        return new mongoose.Types.ObjectId(id);
    } catch (error) {
        throw error;
    }
};

export const groupByCategory = (products: ProductDocument[]) => {
    return products.reduce((acc: any[], product: ProductDocument) => {
        if (!product.category_id || product.category_id.length === 0) {
            return acc;
        }
        product.category_id.forEach((newcategory: any) => {
            let category: any = acc.find((c) => c.id === newcategory._id);
            if (!category) {
                category = { name: newcategory.name, id: newcategory._id, product_list: [] };
                acc.push(category);
            }
            category.product_list.push(product);
        });

        return acc;
    }, []);
};

export const convertMongoPhonetoE164Format = (number: string) => {
    const cleanedNumber = number.replace(/[-\s]/g, '');
    const countryCodeMatch = cleanedNumber.match(/^\+?\d+/);
    const countryCode = countryCodeMatch ? countryCodeMatch[0].replace('+', '') : '';
    const localNumber = cleanedNumber.replace(/^\+?\d+/, '');
    return `+${countryCode}${localNumber}`;
};

export const addVendorId = (res: Response, query: any) => {
    if (res.locals.usertype === UserTypeEnum.vendor) {
        query.vendor_id = res.locals.id;
    }
};
