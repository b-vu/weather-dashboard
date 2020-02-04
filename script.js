$(document).ready(function(){
    var cities = JSON.parse(localStorage.getItem("cities"));
    if(cities === null){
        var cities = [];
    };

    $("#city-search").on("click", function(event){
        event.preventDefault();
        if($("#user-search").val().trim() !== "" && $("#user-search").val().trim().length !== 1){
            var city = $("#user-search").val().trim();

            getWeather(city);
        }
        else{
            return;
        }
    })

    $(document).on("click", ".list-group-item", function(){
        $("#weather-display").empty();
        getWeather($(this).attr("data-name"));
    })

    function storeSearch(city){
        if(cities.indexOf(city) === -1){
            cities.push(city);
            let cityLI = $("<li>").text(city);
            cityLI.addClass("list-group-item");
            cityLI.attr("data-name", city);
            $("#city-list").append(cityLI);

            localStorage.setItem("cities", JSON.stringify(cities));
        }
        else{
            return;
        }
    }

    function getWeather(city){
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=7203f3bd5c20ecf74e1a5452bc95d10f&q=" + city;

        $("#weather-display").empty();

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            var imgURL = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
            var UVindexLon = response.coord.lon.toString();
            var UVindexLat = response.coord.lat.toString();
            $("#weather-display").append($("<h1>").text(moment().format("dddd, MMMM Do, YYYY")));
            $("#weather-display").append($("<h1>").text(response.name));
            $("#weather-display").append($("<img>").attr("src", imgURL));
            $("#weather-display").append($("<p>").text(response.weather[0].description));
            $("#weather-display").append($("<p>").text("Temperature: " + Math.round((response.main.temp - 273.15) * 1.80 + 32) + "°F"));
            $("#weather-display").append($("<p>").text("Humidity: " + response.main.humidity + "%"));
            $("#weather-display").append($("<p>").text("Wind Speed: " + (response.wind.speed * 2.237).toFixed(2) + " mph"));

            storeSearch(response.name);
            getUVindex(UVindexLat, UVindexLon, response.name);
        })
    }

    function displayPastCities(){
        if(cities.length){
            for(i = 0; i < cities.length; i++){
                let city = $("<li>").text(cities[i]);
                city.addClass("list-group-item");
                city.attr("data-name", cities[i]);
                $("#city-list").append(city);
            }
            getWeather(cities[0]);
        }
        else{
            $("#weather-display").append($("<p>").text("Search for the weather in your city"));
            return;
        }
    }

    function getUVindex(lat, lon, city){
        var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=7203f3bd5c20ecf74e1a5452bc95d10f&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            let UVindex = response.value;
            if(UVindex <= 2){
                var backgroundColor = "background-color:green; width:180px; margin:auto";
            }
            else if(UVindex <= 5){
                var backgroundColor = "background-color:yellow; color:black; width:180px; margin:auto";
            }
            else{
                var backgroundColor = "background-color:red; width:180px; margin:auto";
            }
            let UVindexDiv = $("<div>").text("UV Index: " + UVindex);
            UVindexDiv.attr("style", backgroundColor);
            $("#weather-display").append(UVindexDiv);
            $("#weather-display").append($("<br>"));
            getForecast(city);
        })
    }

    function getForecast(city){
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?appid=7203f3bd5c20ecf74e1a5452bc95d10f&q=" + city;
        var icons = ["☀️", "☁️", "🌧️", "❄️"];
        var forecastArray = [7, 15, 23, 31, 39];
        var calendarMonths = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
        var calendarDays = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
        var month = moment().format("M");
        var day = moment().format("D");
        var year = parseInt(moment().format("YYYY"));
        var dayCounter = calendarDays.indexOf(day);
        var monthCounter = calendarMonths.indexOf(month);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            let forecastDiv = $("<div>");
            forecastDiv.addClass("row justify-content-around text-center");
            forecastDiv.attr("style", "font-size:20px");
            $("#weather-display").append(forecastDiv);
            
            for(i = 0; i < 5; i++){
                if(Number.isInteger(year / 4) && month === "2"){
                    calendarDays.splice(29, 2);
                }
                else if(month === "2"){
                    calendarDays.splice(28, 3);
                }
                if(month === "4" || month === "6" || month === "9" || month === "11"){
                    calendarDays.splice(30, 1)
                }

                dayCounter++;

                if(dayCounter === calendarDays.length){
                    dayCounter = 0;
                    monthCounter++;
                    if(monthCounter === 12){
                        monthCounter = 0;
                        month = calendarMonths[monthCounter];
                        year++;
                    }
                    else{
                        month = calendarMonths[monthCounter];
                    }
                    if(Number.isInteger(year / 4) && month === "3"){
                        calendarDays.push("30", "31");
                    }
                    else if(month === "3"){
                        calendarDays.push("29", "30", "31");
                    }
                    if(month === "5" || month === "7" || month === "10" || month === "12"){
                        calendarDays.push("31");
                    }
                }

                let newDiv = $("<div>");
                newDiv.attr("style", "height:200px; width:150px; background-color:blue; margin-bottom:5px; border: solid 1px white; border-radius:10px")

                let date = $("<p>").text(month + "/" + calendarDays[dayCounter] + "/" + year);

                let icon = $("<p>");
                icon.attr("style", "font-size:34px")
                
                if(response.list[forecastArray[i]].weather[0].main === "Clear"){
                    icon.text(icons[0]);
                }
                else if(response.list[forecastArray[i]].weather[0].main === "Clouds"){
                    icon.text(icons[1]);
                }
                else if(response.list[forecastArray[i]].weather[0].main === "Rain"){
                    icon.text(icons[2]);
                }
                else if(response.list[forecastArray[i]].weather[0].main === "Snow"){
                    icon.text(icons[3]);
                }

                let temp = $("<p>").text("Temp: " + Math.round((response.list[forecastArray[i]].main.temp - 273.15) * 1.80 + 32) + "°F");

                let humidity = $("<p>").text("Humidity: " + response.list[forecastArray[i]].main.humidity + "%");

                newDiv.append(date);
                newDiv.append(icon);
                newDiv.append(temp);
                newDiv.append(humidity);
                $(forecastDiv).append(newDiv);
            }
        })
    }

    displayPastCities();
});