import Knex from 'knex';

// UP: cria a table
export async function up(knex: Knex) {
    return knex.schema.createTable('points', table => {
        table.increments('id').primary(),
        table.string('image').notNullable(),
        table.string('name').notNullable(),
        table.string('email').notNullable(),
        table.string('whatsapp').notNullable(),
        table.decimal('longitude').notNullable(),
        table.decimal('latitude').notNullable(),
        table.string('city').notNullable(),
        table.string('uf', 2).notNullable()
    })
}

// DOWN: deleta a table
export async function down(knex: Knex) {
    return knex.schema.dropTable("points");
}