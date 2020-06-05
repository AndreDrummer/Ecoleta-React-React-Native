import express from 'express';
import PointController from './controller/PointController';
import ItemsController from './controller/ItemsController';
import { celebrate, Joi } from 'celebrate';
import multer from 'multer';
import multerConfig from './config/multer';

const routes = express.Router();
const upload = multer(multerConfig);

const pointController = new PointController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.get('/points', pointController.all);
routes.get('/points', pointController.index);
routes.get('/points/:id', pointController.show);

routes.post('/points',
    upload.single("image"),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required().max(2),
            uf: Joi.string().required(),
            items: Joi.string().required(),
        })
    }, {
        abortEarly: false
    }),
    pointController.create
); // O segundo parametro serve para fazer um upload de arquivos;

export default routes;