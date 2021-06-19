import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";

class JoinVoiceAFKCommand extends AbstractCommand {
  private getMessageOwnerVoiceChannel() {
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

    return this.message.guild.ownerID === this.message.member.id;
  }

  public async execute() {
    if (!this.isServerOwner()) {
      return;
    }

    const voiceChannel = this.getMessageOwnerVoiceChannel();

    if (!voiceChannel) {
      return;
    }

    try {
      voiceChannel.join();
    } catch (e) {}
  }
}

export const joinVoiceCommand: Command = {
  emoji: "🔊",
  name: validateFormatMessageKey("commandJoinVoiceAFKMetaName"),
  description: validateFormatMessageKey("commandJoinVoiceAFKMetaDescription"),
  command: "joinVoiceAFK",
  aliases: [""],
  syntax: "",
  examples: [],
  isAdmin: true,

  getCommand(payload) {
    return new JoinVoiceAFKCommand(payload);
  },
};
