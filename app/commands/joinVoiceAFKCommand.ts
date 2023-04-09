import { joinVoiceChannel } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";

import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

class JoinVoiceAFKCommand extends AbstractCommand {
  private getMessageOwnerVoiceChannel(): VoiceBasedChannel | null {
    if (!this.message.member) {
      return null;
    }
    const userVoiceChannel = this.message.member.voice;

    return userVoiceChannel.channel;
  }

  private isServerOwner() {
    if (!this.message.member) {
      return false;
    }

    return this.message.guild.ownerId === this.message.member.id;
  }

  public async execute() {
    if (!this.isServerOwner()) {
      return;
    }

    const voiceChannel = this.getMessageOwnerVoiceChannel();

    if (!voiceChannel) {
      return;
    }

    if (this.message.channel.type) {
      try {
        joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
      } catch (e) {
        const embed = responseUtils
          .negative({ discordUser: this.message.author })
          .setTitle(
            this.formatMessage("commandJoinVoiceAFKNoPermissionToJoinVoice"),
          );

        await this.message.channel.send({ embeds: [embed] });
      }
    }
  }
}

export const joinVoiceCommand: Command = {
  emoji: "🔊",
  name: validateFormatMessageKey("commandJoinVoiceAFKMetaName"),
  description: validateFormatMessageKey("commandJoinVoiceAFKMetaDescription"),
  command: "joinVoiceAFK",
  aliases: ["joinvoiceafk"],
  syntax: "",
  examples: [],
  isAdmin: true,

  getCommand(payload) {
    return new JoinVoiceAFKCommand(payload);
  },
};
