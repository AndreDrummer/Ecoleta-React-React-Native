import { Request, Response } from 'express';
import knex from '../database/connection';

class PointController {

    async all(request: Request, response: Response) {
        const points = await knex('points').select("*");

        return response.json(points);
    }

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItem = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItem)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.1.10:3333/uploads/${point.image}`,
            }
        })

        return response.json(serializedPoints);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ Message: "Point not found" });
        }

        /**
         * SELECT * from items
         * JOIN point_items ON items.id = point_items.item_id
         * WHERE point_item.point_item_id = { id };
         */

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.1.10:3333/uploads/${point.image}`,
        }

        return response.json({ serializedPoint, items });
    }


    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body

        // trx denota transaction e serve para truncar a dependencia de uma query knex a outra.
        // No caso deste post que faz duas requisições isso é necessário ser eito.

        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id: point_id
                }
            })

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({
            id: point_id,
            ...point
        })
    }
}

export default PointController;