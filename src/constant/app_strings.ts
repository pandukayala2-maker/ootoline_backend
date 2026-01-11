import Config from '../config/dot_config';
import { EnvEnum } from './enum';

export default class AppStrings {
    static app_name = 'Autoline';

    static appUrl(): string {
        const preFix = Config._APP_ENV === EnvEnum.production ? 'https' : 'http';
        return `${preFix}://${Config._APP_URL}:${Config._PORT}`;
    }

    static otpExpireTime = '5';

    static defaultPassword = 'password';
}
