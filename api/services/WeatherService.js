/**
 * WeatherService.js
 * get the weather using openweathermap
 */

const axios = require("axios");
const apikey = "af83b6215ed1a38b52615bfd94c0f238";

module.exports = {
  async getCurrentWeather(city) {
    try {
      return (await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&apikey=${apikey}`)).data;
    } catch (e) {
      return 404;
    }
  },

  async getWeather(city, date) {
    try {
      const { data } = await axios.get(`http://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=1&apikey=${apikey}`);

      if (data && Array.isArray(data.list)) {
        return data.list[0];
      } else {
        return data;
      }
    } catch (e) {
      return 404;
    }
  }

}