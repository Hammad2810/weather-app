import React, { useState, useEffect } from "react";
import axios from "axios";
import { WiHumidity, WiThermometer, WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi";
import bgImage from "../assets/bg-weather.jpg";

const API_KEY = "bd5e378503939ddaee76f12ad7a97608";

const getConditionIcon = (condition: string) => {
  if (condition.includes("clear")) return <WiDaySunny className="text-yellow-500 text-4xl mr-2" />;
  if (condition.includes("cloud")) return <WiCloud className="text-gray-500 text-4xl mr-2" />;
  if (condition.includes("rain")) return <WiRain className="text-blue-500 text-4xl mr-2" />;
  if (condition.includes("snow")) return <WiSnow className="text-blue-300 text-4xl mr-2" />;
  if (condition.includes("thunder")) return <WiThunderstorm className="text-purple-500 text-4xl mr-2" />;
  return null;
};

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<{ temp: number; humidity: number; condition: string; icon: string; name: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${API_KEY}&units=metric`
      );
      const data = response.data;
      setWeather({
        temp: data.main.temp,
        humidity: data.main.humidity,
        condition: data.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        name: data.name,
      });
      setCity(data.name);
    } catch (err) {
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
    setCity("")
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`lat=${latitude}&lon=${longitude}`);
        },
        () => {
          setError("Location access denied. Please enter a city manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 text-white" style={{ backgroundImage: `url(${bgImage})` }}> 
      <div> MindStack Solutions : Assessment 1 </div>     
      <div className="bg-transparent bg-opacity-90 shadow-2xl rounded-3xl p-8 w-full max-w-md text-center text-gray-900">
        <h1 className="text-4xl text-white font-bold mb-4">🌎 Weather App</h1>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-4 p-3 border rounded-xl bg-transparent w-full text-center text-white shadow-lg"
          placeholder="Enter city name"
        />
        <button
          onClick={() => fetchWeather(`q=${city}`)}
          className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
        >
          🔍 Search 🌎
        </button>
        {loading ? (
          <p className="text-gray-500 mt-4 text-lg animate-pulse">Loading...</p>
        ) : error ? (
          <p className="text-red-500 mt-4 text-lg">{error}</p>
        ) : weather ? (
          <div className="mt-6">
            <h2 className="text-2xl text-white font-semibold">{weather.name}</h2>
            <img src={weather.icon} alt="Weather Icon" className="mx-auto w-28 h-28" />
            <p className="text-5xl font-semibold flex items-center justify-center mt-2">
              <WiThermometer className="text-red-500 text-5xl mr-2" />
              {weather.temp}°C
            </p>
            <p className="text-lg flex items-center justify-center mt-2">
              <WiHumidity className="text-blue-500 text-4xl mr-2" />
              Humidity: {weather.humidity}%
            </p>
            <p className="text-xl flex items-center justify-center capitalize mt-2 font-medium">
              {getConditionIcon(weather.condition)}
              {weather.condition}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WeatherApp;