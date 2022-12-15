$(document).ready(function () {
    generateHistory();
    var lastSearched = JSON.parse(localStorage.getItem("inputCity"));
    if (lastSearched?.length > 0) {
      var lastCity = lastSearched[lastSearched.length - 1];
      createQuery(lastCity);
    }
    $(".handleCitySearch").on("click", function (event) {
      event.preventDefault();
      createQuery();
      var inputCity = $("#citySearch").val();
      var cityArray = JSON.parse(localStorage.getItem("inputCity")) || [];

      cityArray.push(inputCity);
      localStorage.setItem("inputCity", JSON.stringify(cityArray));
      generateHistory();
    });
    function createQuery(city) {
      var inputCity = city ? city : $("#citySearch").val();

      console.log("City passed from city history clicked: " + city);
      var query1URL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        inputCity +
        "&units=imperial&appid=ae091cae15863695a3bd2a2f28f74012";
  
      $.ajax({
        url: query1URL,
        method: "GET",
      }).then(function (data) {
        console.log("I am current data: ");
        console.log(data);
        var query2URL =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          data.coord.lat +
          "&lon=" +
          data.coord.lon +
          "&units=imperial&appid=ae091cae15863695a3bd2a2f28f74012";
  
        $.ajax({
          url: query2URL,
          method: "GET",
        }).then(function (extendedData) {
          console.log("I am extended data: ");
          console.log(extendedData);

          var weatherIcon = extendedData.current.weather[0].icon;
          var iconURL =
            "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
  
          $(".reportColumn").html("");
  
          $(".reportColumn").append(
            '<div class="todaysForecastContainer"></div>'
          );
          $(".todaysForecastContainer").append(
            `<h2 class="currentCity">${
              data.name
            } <span class="currentCityDate">(${moment
              .unix(extendedData?.current?.dt)
              .format(
                "DD/M/YYYY"
              )})</span> <img id="weatherIcon" src="${iconURL}"/></h2>`
          );
  
          $(".todaysForecastContainer").append(
            `<p class="currentCityTemp">Temperature: ${
              extendedData.current.temp + "&#176; F"
            }</p>`
          );
  
          $(".todaysForecastContainer").append(
            `<p class="currentCityHumidity">Humidity: ${
              extendedData.current.humidity + "%"
            }</p>`
          );
  
          $(".todaysForecastContainer").append(
            `<p class="currentCityWindSpeed">Wind Speed: ${
              extendedData.current.wind_speed + " MPH"
            }</p>`
          );
          $(".reportColumn").append('<div class="multiForecastContainer"></div>');
          $(".multiForecastContainer").append("<h2>5-Day Forecast:</h2>");
          $(".multiForecastContainer").append(
            '<div class="forecastCardsContainer"></div>'
          );
          extendedData?.daily?.map((day, index) => {
            if (index > 0 && index < 6) {
              $(".forecastCardsContainer").append(
                `
                  <div class="forecastCard" id="{'card' + index}">
                    <h3>${moment.unix(day.dt).format("DD/M/YYYY")}</h3>
                    <div><img id="weatherIcon" src="https://openweathermap.org/img/wn/${
                      day.weather[0].icon
                    }.png"/></div>
                    <p>Temperature: ${day.temp.day + "&#176; F"}</p>
                    <p>Wind Speed: ${day.wind_speed + "MPH"} </p>
                    <p>Humidity: ${day.humidity + "%"}</p>
                  </div>
                `
              );
            }
          });
        });
      });
    }
    function generateHistory() {
      var cityHistory = JSON.parse(localStorage.getItem("inputCity"));
      if (!$(".searchHistoryContainer")?.length && cityHistory?.length) {
        $(".searchColumn").append('<div class="searchHistoryContainer"></div>');
      }
      $(".searchHistoryContainer").html("");
      for (var i = 0; i < cityHistory?.length; i++) {
        var city = cityHistory[i];
        $(".searchHistoryContainer").append(
          `<button id="CityBtn${i}">${city}</button>`
        );
        $(".searchHistoryContainer").on(
          "click",
          `#CityBtn${i}`,
          function () {
            createQuery(city);
            localStorage.setItem("city", JSON.stringify(city));
          }
        );
      }
    }
  });