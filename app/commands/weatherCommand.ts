import { DateTime } from "luxon";

import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

class WeatherCommand extends AbstractCommand {
  async execute() {
    const query = this.args.join(" ");

    const weather = await this.services.stats.getWeather({ query });

    const sunrise = DateTime.fromSeconds(weather.sys.sunrise).toLocaleString(
      DateTime.TIME_24_SIMPLE,
    );
    const sunset = DateTime.fromSeconds(weather.sys.sunset).toLocaleString(
      DateTime.TIME_24_SIMPLE,
    );

    const currentC = mathUtils.kelvinToCelsius({ kelvin: weather.main.temp });
    const currentF = mathUtils.kelvinToFahrenheit({
      kelvin: weather.main.temp,
    });

    const maxC = mathUtils.kelvinToCelsius({ kelvin: weather.main.temp_max });
    const maxF = mathUtils.kelvinToFahrenheit({
      kelvin: weather.main.temp_max,
    });

    const minC = mathUtils.kelvinToCelsius({ kelvin: weather.main.temp_min });
    const minF = mathUtils.kelvinToFahrenheit({
      kelvin: weather.main.temp_min,
    });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(`${weather.name}, ${weather.sys.country}`)
      .setDescription(
        weather.weather
          .map((weat) => `${weat.main}, ${weat.description}`)
          .join("\n"),
      )
      .addField(
        this.formatMessage("commandWeatherCurrentTemp"),
        `${currentC} °C / ${currentF} °F`,
        true,
      )
      .addField(
        this.formatMessage("commandWeatherMaxTemp"),
        `${maxC} °C / ${maxF} °F`,
        true,
      )
      .addField(
        this.formatMessage("commandWeatherMinTemp"),
        `${minC} °C / ${minF} °F`,
        true,
      )
      .addField(
        this.formatMessage("commandWeatherWindSpeed"),
        `${weather.wind.speed} m/s`,
        true,
      )
      .addField(
        this.formatMessage("commandWeatherHumidity"),
        `${weather.main.humidity} %`,
        true,
      )
      .addField(
        this.formatMessage("commandWeatherPressure"),
        `${weather.main.pressure} hPa`,
        true,
      )
      .addField(this.formatMessage("commandWeatherSunrise"), sunrise, true)
      .addField(this.formatMessage("commandWeatherSunset"), sunset, true)
      .addField(
        this.formatMessage("commandWeatherLongLat"),
        `${weather.coord.lon} / ${weather.coord.lat}`,
        true,
      );

    await this.message.channel.send(embed);
  }
}

export const weatherCommand: Command = {
  emoji: "☁️",
  name: "Weather",
  command: "weather",
  aliases: [],
  syntax: "<query>",
  examples: ["UK", "US"],
  isAdmin: false,
  description: "Search places for weather",

  getCommand(payload) {
    return new WeatherCommand(payload);
  },
};
