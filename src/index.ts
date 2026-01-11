import cors from 'cors';
import express, { Express } from 'express';
import path from 'path';
import router from './common/base_routes';
import ServerAppConfig from './config/server_config';
import CustomErrorHandler from './middleware/error_handler';
import { payloadHandler } from './middleware/payload_handler';
import corsMiddleware from './utils/cors';
import { apiRequestInfo } from './utils/logger';

const app: Express = express();

app.use(cors({ origin: true }));
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'assets/')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('/mnt/autoline/public/'));

app.use(apiRequestInfo);
app.use(payloadHandler);

app.use('/v1', router);
app.use(CustomErrorHandler.invalidEndPointHandler);
app.use(CustomErrorHandler.errorHandler);

ServerAppConfig.createSever(app);
