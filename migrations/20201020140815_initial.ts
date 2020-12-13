import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .raw("CREATE EXTENSION btree_gist;")
    .createTable("users", (table) => {
      table.increments("id").primary().notNullable();
      table.uuid("uuid").notNullable();
      table.text("discordId").notNullable();
      table.integer("points").notNullable().defaultTo(0);
      table.integer("xp").notNullable().defaultTo(0);
      table.integer("tokens").notNullable().defaultTo(0);
      table.integer("stock").notNullable().defaultTo(0);
      table.integer("stockMinCompoundAmount").notNullable().defaultTo(0);
      table.timestamp("dailyRetrieved").nullable();
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updatedAt").nullable();
    })
    .createTable("guilds", (table) => {
      table.increments("id").primary().notNullable();
      table.uuid("uuid").notNullable();
      table.text("prefix").notNullable();
      table.text("discordId").notNullable();
      table.text("casinoChannelId").nullable();
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updatedAt").nullable();
    })
    .createTable("commands", (table) => {
      table.increments("id").primary().notNullable();
      table.uuid("uuid").notNullable();
      table.integer("guildId").notNullable().references("guilds.id");
      table.integer("addedBy").notNullable().references("users.id");
      table.text("command").notNullable();
      table.text("response").notNullable();
      table.integer("timesUsed").notNullable().defaultTo(0);
      table.boolean("deleted").notNullable().defaultTo(false);
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updatedAt").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("commands")
    .dropTableIfExists("users")
    .dropTableIfExists("guilds")
    .raw("DROP EXTENSION IF EXISTS btree_gist;");
}
