import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [suggestions, setSuggestions] = useState([]); // To store city suggestions
  const [backgroundImage, setBackgroundImage] = useState('');

  const unsplashAccessKey = 'KKVmpCeFKtdWlubpjZTEupB2_oJLSgO6e0wSLCzqweQ'; // Unsplash Access Key
  const unsplashUrl = 'https://api.unsplash.com/search/photos';

  function getWeather() {
    const apiKey = '85ba5d70f34d6db65fb09fa64f96acbe';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        return response.json();
      })
      .then((data) => {
        let MT = Math.round(data.main.temp);
        let FL = Math.round(data.main.feels_like);

        const weather = {
          location: `Weather in ${data.name}`,
          temperature: `Temperature: ${MT}°C`,
          feelsLike: `Feels Like: ${FL}°C`,
          humidity: `Humidity: ${data.main.humidity}%`,
          wind: `Wind: ${data.wind.speed} Km/h`,
          condition: `Weather condition: ${data.weather[0].description}`,
          weatherCondition: data.weather[0].main, // Get the main condition (rain, clear, clouds, etc.)
        };

        // Fetch background image based on the weather condition
        fetchUnsplashBackground(weather.weatherCondition);

        setWeatherInfo(weather);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setWeatherInfo({
          location: 'Error',
          temperature: 'Enter the City',
        });
      });
  }

  function fetchUnsplashBackground(condition) {
    let query = '';
    if (condition === 'Rain') {
      query = 'rain';
    } else if (condition === 'Clouds') {
      query = 'cloudy';
    } else if (condition === 'Clear') {
      query = 'sunny';
    } else {
      query = 'weather';
    }

    // Fetch from Unsplash API based on the weather condition
    fetch(`${unsplashUrl}?query=${query}&client_id=${unsplashAccessKey}&per_page=1`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length > 0) {
          const imageUrl = data.results[0].urls.full; // Get the full-size image
          // Update the background image of the entire body
          document.body.style.backgroundImage = `url(${imageUrl})`;
        } else {
          document.body.style.backgroundImage = 'url("/images/default.jpg")'; // Default image if no result
        }
      })
      .catch((error) => {
        console.error('Error fetching background image:', error);
        document.body.style.backgroundImage = 'url("/images/default.jpg")';
      });
  }

  function handleCityInputChange(e) {
    const input = e.target.value;
    setCity(input);

    if (input.length > 2) {
      fetchCitySuggestions(input);
    } else {
      setSuggestions([]); // Clear suggestions when input is too short
    }
  }

  function fetchCitySuggestions(query) {
    const apiKey = '85ba5d70f34d6db65fb09fa64f96acbe'; // OpenWeather API key
    const url = `http://api.openweathermap.org/data/2.5/find?q=${query}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const cities = data.list || [];
        setSuggestions(cities);
      })
      .catch((error) => {
        console.error('Error fetching city suggestions:', error);
        setSuggestions([]);
      });
  }

  function handleCitySelection(city) {
    setCity(city.name); // Set the selected city as input
    setSuggestions([]); // Clear suggestions
    getWeather(); // Fetch weather for the selected city
  }

  return (
    <div className="weathercontainer">
      <h1 className="sr-only">Welcome to WeatherApp</h1>
      <input
        type="text"
        placeholder="Enter City Name"
        value={city}
        onChange={handleCityInputChange}
      />
      <button onClick={getWeather}>Get Weather</button>

      {suggestions.length > 0 && (
        <div className="suggestions-container">
          <ul className="suggestions-list">
            {suggestions.map((city, index) => (
              <li key={index} onClick={() => handleCitySelection(city)}>
                {city.name}, {city.sys.country}
              </li>
            ))}
          </ul>
        </div>
      )}

      {weatherInfo && (
        <div className="weather-info">
          <h3>{weatherInfo.location}</h3>
          <p>{weatherInfo.temperature}</p>
          <p>{weatherInfo.feelsLike}</p>
          <p>{weatherInfo.humidity}</p>
          <p>{weatherInfo.wind}</p>
          <p>{weatherInfo.condition}</p>
        </div>
      )}
    </div>
  );
}

export default App;
