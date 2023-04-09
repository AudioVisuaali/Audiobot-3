import { DateTime } from "luxon";

import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { WeatherResponse } from "~/services/statsService";
import { validateFormatMessageKey } from "~/translations/formatter";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

class WeatherCommand extends AbstractCommand {
  public async execute() {
    const query = this.args.join(" ");

    const weather = await this.services.stats.getWeather({ query });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(`${weather.name}, ${weather.sys.country}`)
      .setDescription(
        weather.weather
          .map((weat) => `${weat.main}, ${weat.description}`)
          .join("\n"),
      )
      .addFields(...this.generatePrivateFields({ weather }));

    await this.message.channel.send({ embeds: [embed] });
  }

  private generatePrivateFields(params: { weather: WeatherResponse }) {
    const sunrise = DateTime.fromSeconds(
      params.weather.sys.sunrise,
    ).toLocaleString(DateTime.TIME_24_SIMPLE);
    const sunset = DateTime.fromSeconds(
      params.weather.sys.sunset,
    ).toLocaleString(DateTime.TIME_24_SIMPLE);

    const currentC = mathUtils.kelvinToCelsius({
      kelvin: params.weather.main.temp,
    });
    const currentF = mathUtils.kelvinToFahrenheit({
      kelvin: params.weather.main.temp,
    });

    const maxC = mathUtils.kelvinToCelsius({
      kelvin: params.weather.main.temp_max,
    });
    const maxF = mathUtils.kelvinToFahrenheit({
      kelvin: params.weather.main.temp_max,
    });

    const minC = mathUtils.kelvinToCelsius({
      kelvin: params.weather.main.temp_min,
    });
    const minF = mathUtils.kelvinToFahrenheit({
      kelvin: params.weather.main.temp_min,
    });

    return [
      {
        name: this.formatMessage("commandWeatherCurrentTemp"),
        value: `${currentC} °C / ${currentF} °F`,
        inline: true,
      },
      {
        name: this.formatMessage("commandWeatherMaxTemp"),
        value: `${maxC} °C / ${maxF} °F`,
        inline: true,
      },
      {
        name: this.formatMessage("commandWeatherMinTemp"),
        value: `${minC} °C / ${minF} °F`,
        inline: true,
      },
      {
        name: this.formatMessage("commandWeatherWindSpeed"),
        value: `${params.weather.wind.speed} m/s`,
        inline: true,
      },
      {
        name: this.formatMessage("commandWeatherHumidity"),
        value: `${params.weather.main.humidity} %`,
        inline: true,
      },
      {
        name: this.formatMessage("commandWeatherPressure"),
        value: `${params.weather.main.pressure} hPa`,
        inline: true,
      },
      {
        name: this.formatMessage("commandWeatherSunrise"),
        value: sunrise,
        inline: true,
      },
      {
        name: this.formatMessage("commandWeatherSunset"),
        value: sunset,
        inline: true,
      },
      {
        name: this.formatMessage("commandWeatherLongLat"),
        value: `${params.weather.coord.lon} / ${params.weather.coord.lat}`,
        inline: true,
      },
    ];
  }
}

export const weatherCommand: Command = {
  emoji: "☁️",
  name: validateFormatMessageKey("commandWeatherMetaName"),
  description: validateFormatMessageKey("commandWeatherMetaDescription"),
  command: "weather",
  aliases: [],
  syntax: "<query>",
  examples: ["UK", "US"],
  isAdmin: false,

  getCommand(payload) {
    return new WeatherCommand(payload);
  },
};
