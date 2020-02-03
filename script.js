$(document).ready(function(){
    var cities = JSON.parse(localStorage.getItem("cities"));
    if(cities === null){
        var cities = [];
    };

    $("#city-search").on("click", function(event){
        event.preventDefault();
        $("#weather-display").empty();
        cities.push($("#user-search").val().trim());
        var city = $("<li>").text($("#user-search").val().trim());
        city.addClass("list-group-item");
        city.attr("data-name", $("#user-search").val().trim());
        $("#city-list").append(city);

        localStorage.setItem("cities", JSON.stringify(cities));

        getWeather($("#user-search").val().trim());

        console.log($("#user-search").val().trim());
        console.log(cities);
    })

    $(document).on("click", ".list-group-item", function(){
        $("#weather-display").empty();
        getWeather($(this).attr("data-name"));
    })

    function getWeather(city){
        console.log(city);
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=7203f3bd5c20ecf74e1a5452bc95d10f&q=" + city;
        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            var imgURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
            var UVindexLon = response.coord.lon.toString();
            var UVindexLat = response.coord.lat.toString();
            
            $("#weather-display").append($("<h1>").text(moment().format("dddd, MMMM Do, YYYY")));
            $("#weather-display").append($("<h1>").text(response.name));
            $("#weather-display").append($("<img>").attr("src", imgURL));
            $("#weather-display").append($("<p>").text(response.main.temp));
            $("#weather-display").append($("<p>").text(response.main.humidity));
            $("#weather-display").append($("<p>").text(response.wind.speed));
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
            $("#weather-display").text("Search for the weather in your city");
            return;
        }
    }

    displayPastCities();
});