import Knex from 'knex';

// UP: cria a table
export async function up(knex: Knex) {
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary().notNullable(),
        
        //Setando uma chave estrangeira com KNEX;
        table.integer('point_id').notNullable()
        .references('id').inTable('points')

        table.integer('item_id').notNullable()        
        .references('id').inTable('items')
    })
}

// DOWN: deleta a table
export async function down(knex: Knex) {
    return knex.schema.dropTable("point_items");
}