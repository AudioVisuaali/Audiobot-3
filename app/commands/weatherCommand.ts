import { Command } from "discord.js";
import { DateTime } from "luxon";

import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

export const weatherCommand: Command = {
  name: "Weather",
  command: "weather",
  aliases: [],
  syntax: "<query>",
  examples: ["UK", "US"],
  isAdmin: false,
  description: "Search places for weather",

  async execute(message, args, { services }) {
    const query = args.join(" ");

    const weather = await services.stats.getWeather({ query });

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
      .positive({ discordUser: message.author })
      .setTitle(`${weather.name}, ${weather.sys.country}`)
      .setDescription(
        weather.weather
          .map((weat) => `${weat.main}, ${weat.description}`)
          .join("\n"),
      )
      .addField("Current Temp", `${currentC} °C / ${currentF} °F`, true)
      .addField("Max Temp", `${maxC} °C / ${maxF} °F`, true)
      .addField("Min Temp", `${minC} °C / ${minF} °F`, true)
      .addField("Wind speed", `${weather.wind.speed} m/s`, true)
      .addField("Humidity", `${weather.main.humidity} %`, true)
      .addField("Pressure", `${weather.main.pressure} hPa`, true)
      .addField("Sunrise", sunrise, true)
      .addField("Sunset", sunset, true)
      .addField(
        "Long / Lat",
        `${weather.coord.lon} / ${weather.coord.lat}`,
        true,
      );

    message.channel.send(embed);
  },
};
