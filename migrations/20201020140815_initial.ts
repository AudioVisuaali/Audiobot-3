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
      table.integer("addedBy").notNullable().references("users.id");
      table.integer("guildId").notNullable().references("guilds.id");
      table.integer("discordGuildId").notNullable();
      table.integer("discordUserId").notNullable();
      table.text("command").notNullable();
      table.text("response").notNullable();
      table.integer("timesUsed").notNullable().defaultTo(0);
      table.boolean("deleted").notNullable().defaultTo(false);
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updatedAt").nullable();
    })
    .createTable("currencyHistory", (table) => {
      table.increments("id").primary().notNullable();
      table.uuid("uuid").notNullable();
      table.integer("guildId").notNullable().references("guilds.id");
      table.integer("userId").notNullable().references("users.id");
      table.text("discordGuildId").notNullable();
      table.text("discordUserId").notNullable();
      table.text("actionType").notNullable();
      table.text("currencyType").notNullable();
      table.integer("bet").nullable();
      table.integer("outcome").nullable();
      table.text("metadata").nullable();
      table.boolean("hasProfited").notNullable().defaultTo(false);
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updatedAt").nullable();
    })
    .createTable("botInfo", (table) => {
      table.increments("id").primary().notNullable();
      table.uuid("uuid").notNullable();
      table.text("discordBotId").notNullable().unique();
      table.integer("restarts").notNullable().defaultTo(0);
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updatedAt").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("currencyHistory")
    .dropTableIfExists("commands")
    .dropTableIfExists("users")
    .dropTableIfExists("guilds")
    .dropTableIfExists("botInfo")
    .raw("DROP EXTENSION IF EXISTS btree_gist;");
}
