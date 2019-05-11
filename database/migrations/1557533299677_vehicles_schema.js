"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class VehiclesSchema extends Schema {
  up() {
    this.create("vehicles", table => {
      table.increments();
      table.string("descricao");
      table
        .string("placa", 7)
        .notNullable()
        .unique();
      table
        .string("chassi", 17)
        .notNullable()
        .unique();
      table.string("ano_fabricacao", 4);
      table.string("ano_modelo", 4);
      table.string("municipio");
      table.integer("multas");
      table.integer("autuacoes");
      table.string("situacao_licenciamento");
      table.date("data_licenciamento");
      table.timestamps();
    });
  }

  down() {
    this.drop("vehicles");
  }
}

module.exports = VehiclesSchema;
