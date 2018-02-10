/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const Wit = require('node-wit').Wit
const token = "4QB2QB6Z4UNH2UON5RCI7MTTRMVT3BIA"
const requestCountry = require('request-country');

const noCityMessage = `I am a bot who can get the weather in any city for a specific date, i couldn't fetch your city please specifiy the city you want its weather.`;

const noGetWeatherMessage = `I am a bot who can get the weather in any city for a specific date, are you asking for the weather ? (answer with yes or no)`;

const wrongCityMessage = `We couldn't fetch the weather for the city you specified, please enter a correct city :)`;

module.exports = {

    async newMessage(req, res) {
        if (!req.body || !req.body.messageTxt || !req.body.userName) {
            res.send("invalid message");
            return;
        }

        let messageTxt = req.body.messageTxt;
        let user = (await User.find({ name: req.body.userName }));

        if (user.length === 0) {
            res.send("Invalid user");
            return;
        }

        user = user[0];

        const client = new Wit({ accessToken: token });
        client.message(messageTxt, {})
            .then((data) => {

                let { datetime, city, weather_get } = _actions.getEntities(data.entities);

                weather_get = _actions.getWeather(weather_get);
                city = _actions.getCity(city, req);
                datetime = _actions.getDate(datetime);

                if (city === undefined) {
                    res.send(noCityMessage);
                    return;
                }
                if (weather_get === undefined) {
                    res.send(noGetWeatherMessage);
                    return;
                }

                WeatherService.getCurrentWeather(city).then(temp => {
                    if (temp === 404) {
                        res.send(wrongCityMessage);
                        return;
                    }
                    res.send(_actions.getWeatherMessage(city, datetime, Number(temp.main.temp) - 273.15));
                });
            })
            .catch(err => {
                console.log("Request error");
                console.log(err);
            });
    }

};

const _actions = {

    getEntities(entities) {

        const fetchedEntities = {};
        for (let entity in entities) {
            if (entity === "intent") {
                entities[entity].forEach(intent => {
                    if (fetchedEntities[intent.value] === undefined) {
                        fetchedEntities[intent.value] = [];
                    }
                    fetchedEntities[intent.value].push({
                        confidence: intent.confidence
                    })
                })
            } else {
                fetchedEntities[entity] = [];
                entities[entity].forEach(subEntity => {
                    fetchedEntities[entity].push({
                        confidence: subEntity.confidence,
                        value: subEntity.value
                    })
                })
            }
        }

        return fetchedEntities;
    },

    getCity(cityEntites, req) {
        let city;

        if (cityEntites === undefined) {
            city = requestCountry(req);
        }

        if (Array.isArray(cityEntites) && cityEntites.length > 0) {
            city = cityEntites[0].value;
        }

        return city;

    },

    getDate(datetime) {
        if (Array.isArray(datetime) && datetime.length > 0) {
            datetime = this.getFormmatedDate(datetime[0].value);
        }
        else {
            const today = new Date();
            datetime = this.getFormmatedDate(today);
        }

        return datetime
    },

    getWeather(weather_get) {
        if (Array.isArray(weather_get) && weather_get.length > 0 && weather_get[0].confidence >= .6) {
            weather_get = 2;
        } else if (Array.isArray(weather_get) && weather_get.length > 0 && weather_get[0].confidence < .6) {
            weather_get = 1;
        } else {
            weather_get = 0;
        }
        return weather_get;
    },

    getWeatherMessage(city, datetime, currentCTemp) {
        return `The temprature in ${city} for the day ${datetime} is ${currentCTemp} C`
    },

    getFormmatedDate(date) {
        date = new Date(date);

        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!
        var yyyy = date.getFullYear();

        dd < 10 && (dd = '0' + dd);
        mm < 10 && (mm = '0' + mm);

        return `${dd} ${mm} ${yyyy}`;
    }

}

