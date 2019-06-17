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
      table.string("placa_anterior", 7);
      table
        .string("chassi", 17)
        .notNullable()
        .unique();
      table.integer("multas");
      table.integer("autuacoes");
      table.string("municipio");
      table.string("municipio_anterior");
      table.string("marca");
      table.string("ano_fabricacao", 4);
      table.string("ano_modelo", 4);
      table.string("situacao_licenciamento");
      table.date("data_licenciamento");
      table.string("ano_ipva_pago");
      table.string("parcela_ipva");
      table.string("ano_seguro_pago");
      table.string("parcela_seguro");
      table.string("ano_anterior_seguro_pago");
      table.string("parcela_seguro_anterior");
      table.string("ano_taxa_licenciamento");
      table.timestamps();
    });
  }

  down() {
    this.drop("vehicles");
  }
}

module.exports = VehiclesSchema;
