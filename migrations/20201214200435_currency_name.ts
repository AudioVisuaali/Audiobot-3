import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("guilds", (table) => {
    table.text("currencyPointsDisplayName").nullable().defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("guilds", (table) => {
    table.dropColumns("currencyPointsDisplayName");
  });
}
