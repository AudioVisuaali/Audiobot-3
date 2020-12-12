import { MessageEmbed } from "discord.js";

export class ResponseUtils {
  private colors = {
    error: "#ff0000",
    warning: "#ff9100",
    success: "#00e676",
  };

  invalidCurrency() {
    return new MessageEmbed()
      .setColor(this.colors.error)
      .setTitle("Invalid value")
      .setDescription("The amount you gave is not valid")
      .setTimestamp();
  }

  insufficientFunds() {
    return new MessageEmbed()
      .setColor(this.colors.error)
      .setTitle("Insufficient funds")
      .setTimestamp();
  }

  negativeResponse() {
    return new MessageEmbed().setColor(this.colors.warning).setTimestamp();
  }

  positiveResponse() {
    return new MessageEmbed().setColor(this.colors.success).setTimestamp();
  }
}
