export enum EnvEnum {
    development = 'development',
    staging = 'staging',
    production = 'production'
}

export enum GeneralStatusEnum {
    active = 'active',
    inactive = 'inactive',
    ongoing = 'ongoing',
    done = 'done'
}

export enum ApprovalStatusEnum {
    accepted = 'accepted',
    rejected = 'rejected',
    pending = 'pending'
}

export enum OrderStatusEnum {
    pending = 'pending',
    accepted = 'accepted',
    completed = 'completed',
    cancelled = 'cancelled'
}

export enum UserTypeEnum {
    user = 'user',
    admin = 'admin',
    vendor = 'vendor'
}

export enum PaymentChargeType {
    fixed = 'fixed',
    percentage = 'percentage'
}

export enum PaintReworkEnum {
    fullyPainted = 'Fully Painted',
    partiallyPainted = 'Partially painted'
}