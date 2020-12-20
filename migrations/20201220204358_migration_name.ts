import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("users", (table) => {
    table.text("guildDiscordId").alter().defaultTo(null);
  });
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(): Promise<void> {}
