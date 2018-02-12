/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const Wit = require('node-wit').Wit
const token = "4QB2QB6Z4UNH2UON5RCI7MTTRMVT3BIA"
const requestCountry = require('request-country');

const noCityMessage = `I couldn't fetch your city please enter your city.`;

const noGetWeatherMessage = `I am a bot who can get the weather in any city for a specific date, are you asking for the weather in your city?`;

const wrongCityMessage = `We couldn't fetch the weather for the city you specified, please enter a correct city :)`;

module.exports = {

    async newMessage(req, res) {
        if (!req.body || !req.body.messageTxt || !req.body.userName) {
            res.send("invalid message");
            return;
        }

        let messageTxt = req.body.messageTxt;
        let user = (await User.find({ name: req.body.userName }));
        let messageDate = _actions.getFormmatedDate(new Date());

        if (user.length === 0) {
            res.send("Invalid user");
            return;
        }


        user = user[0];

        await Message.saveMessage(messageTxt, "-", messageDate, user.id, true);

        let respMessage = '';

        let userLastMsg = await Message.getUserLastMsg(user.id);
        if (userLastMsg && Array.isArray(userLastMsg) && userLastMsg.length > 0) {
            userLastMsg = userLastMsg[0];
        }
        let last_city = userLastMsg.entity.city;
        let last_weather_get = userLastMsg.entity.weather_get;
        let waiting_confirmation = userLastMsg.entity.waiting_confirmation;

        const client = new Wit({ accessToken: token });

        client.message(messageTxt, {})
            .then(async (data) => {
                let { datetime, city, weather_get, greetings, yes } = _actions.getEntities(data.entities);

                if (greetings) respMessage += "Hi, ";

                weather_get = _actions.getWeather(weather_get);
                city = _actions.getCity(city, req);
                datetime = _actions.getDate(datetime);

                if (weather_get === false) {
                    if (last_weather_get || (waiting_confirmation && yes && yes.length > 0)) {
                        weather_get = true;
                    } else {
                        respMessage += noGetWeatherMessage;
                        await Message.saveMessage(respMessage, { weather_get: false, city, datetime, waiting_confirmation: true }, messageDate, user.id, false);
                        res.send(respMessage);
                        return;
                    }

                }

                if (!city) {
                    if (last_city) {
                        city = last_city;
                    }
                    else {
                        respMessage += noCityMessage;
                        await Message.saveMessage(respMessage, { weather_get, city: false, datetime, waiting_confirmation: false }, messageDate, user.id, false);
                        res.send(respMessage);
                        return;
                    }
                }

                WeatherService.getCurrentWeather(city).then(async temp => {
                    if (temp === 404) {
                        respMessage += wrongCityMessage;
                        await Message.saveMessage(respMessage, { weather_get, city: false, datetime, waiting_confirmation: false }, messageDate, user.id, false);
                        res.send(respMessage);
                        return;
                    }

                    respMessage += _actions.getWeatherMessage(city, datetime, Number(temp.main.temp) - 273.15);
                    await Message.saveMessage(respMessage, { weather_get: false, city: false, datetime, waiting_confirmation: false }, messageDate, user.id, false);
                    res.send(respMessage);
                });
            })
            .catch(err => {
                console.log("Request error");
                console.log(err);
                res.send("Couldn't connect to wit.ai, please trye again");
            });
    },

    async getDayMessages(req, res) {
        let dif = 0;
        let name;
        if (req.params.dif !== undefined) {
            dif = req.params.dif;
        }

        if (req.params.name) {
            name = req.params.name;
        } else {
            res.send("No user specified");
            return;
        }

        const user = await User.find({ name });

        if (!Array.isArray(user) || user.length === 0) {
            res.send("Wrong user");
            return;
        }

        const userID = user[0].id;

        let date = new Date();
        date = new Date(date.getTime() - dif * 24 * 60 * 60 * 1000);

        date = _actions.getFormmatedDate(date);

        res.send((await Message.find({ userID, messageDate: date })));
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

        if (city === undefined) city = false;

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
            weather_get = true;
        } else {
            weather_get = false;
        }
        return weather_get;
    },

    getWeatherMessage(city, datetime, currentCTemp) {
        return `The temprature in ${city} for the day ${datetime} is ${currentCTemp} C`
    },

    getFormmatedDate(date) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        date = new Date(date);

        var dd = date.getDate();
        var mm = monthNames[date.getMonth()]; //January is 0!
        var yyyy = date.getFullYear();

        dd < 10 && (dd = '0' + dd);

        return `${dd}-${mm}-${yyyy}`;
    }

}

