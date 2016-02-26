//***** AUTCOMPLETE *****//
$(document).ready(function () {
    var slider1Value;
    var slider2Value;
    var slider3Value;
    var finalimdb = 0.25; // if the person skips the coefficient, the ratings are 25%
    var finalrotten = 0.25;
    var finalmeta = 0.25;
    var finaltmdb = 0.25;
    var ratingDisplay;
    var changeIntro = function () {
    $('.search-box').css('top', '1em');
    $('header').css('height', '10vh');
    $('.row').css('display', 'block');
    };  
    $(document).one('click', '.skip', function(){ 
        $('.crateCoeficient').css('display', 'none');
        // display the ratings as %
        $('.coefA').html((finalimdb * 100) + '%');
        $('.coefB').html((finalrotten * 100) + '%');
        $('.coefC').html((finalmeta * 100) + '%');
        $('.coefD').html((finaltmdb * 100) + '%');
    });
    $(document).on('click', '#searchclear', function(){
        $("#txtSearch").val('');
    });
    $(document).on('click', '.moreInfoMovie', function(){ 
        $('#container').toggle();
    });
    // Close the box if the user clicks ouside of it
    $(document).mouseup(function (e)
    {
        var container = $("#container");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
        }
    });
    $('header').css('height', '100vh');
    $('.search-box').css('top', '30vh');
    // Create the sliders using jQuery UI
    $( "#slider-vertical1" ).slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 10,
        step: 0.1,
        value: 5,
        slide: function( event, ui ) {
            $( "#amount1" ).val( ui.value );
            slider1Value = ui.value;
        }
    });
    $( "#slider-vertical2" ).slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 10,
        step: 0.1,
        value: 5,
        slide: function( event, ui ) {
            $( "#amount2" ).val( ui.value );
            slider2Value = ui.value;
        }
    });
    $( "#slider-vertical3" ).slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 10,
        step: 0.1,
        value: 5,
        slide: function( event, ui ) {
            $( "#amount3" ).val( ui.value );
            slider3Value = ui.value;
        }
    });
    // Save the ratings (amounts) selected in each slider
    $( "#amount1" ).val( $( "#slider-vertical1" ).slider( "value" ) );
    $( "#amount2" ).val( $( "#slider-vertical2" ).slider( "value" ) );
    $( "#amount3" ).val( $( "#slider-vertical3" ).slider( "value" ) );
    // Here the coefficient box process with button clicking and changing through each page
    $(document).on('click', '#personRating0', function(){  
        $('.moviesRating0').css('display', 'none');
        $('.moviesRating1').css('display', 'block');
    });
    $(document).on('click', '#personRating1', function(){  
        movie01Choice = $('input[name=rating01pick]:checked').val();
        if (!movie01Choice || !slider1Value) {
            $('.repick').text("Please pick a movie and choose a reating!");
        } else {
            $('.repick').text("");
            $('.moviesRating1').css('display', 'none');
            $('.moviesRating2').css('display', 'block');
        };
    });
    $(document).on('click', '#personRating2', function(){  
        movie02Choice = $('input[name=rating02pick]:checked').val();
        if (!movie02Choice || !slider2Value) {
            $('.repick').text("Please pick a movie and choose a reating!");
        } else {
            $('.repick').text("");
            $('.moviesRating2').css('display', 'none');
            $('.moviesRating3').css('display', 'block');
            $('.skip').css('display', 'none');
        };
    });
    $(document).on('click', '#personRating3', function(){  
        movie03Choice = $('input[name=rating03pick]:checked').val();
        if (!movie03Choice || !slider3Value) {
            $('.repick').text("Please pick a movie and choose a reating!");
        } else {
            // When the person closes the last box the code compares his choices with the website ratings
            $('.crateCoeficient').css('display', 'none');
            res1 = JSON.search( jsonMovies, '//movies[code="' + movie01Choice + '"]' );
            res2 = JSON.search( jsonMovies, '//movies[code="' + movie02Choice + '"]' );
            res3 = JSON.search( jsonMovies, '//movies[code="' + movie03Choice + '"]' );
            // Based on the json search above it is possible to pick the equivalent ratings on each website
            var c01imdb = res1[0].IMDB;
            var c02imdb = res2[0].IMDB;
            var c03imdb = res3[0].IMDB;
            var c01rotten = res1[0].Tomatoes;
            var c02rotten = res2[0].Tomatoes;
            var c03rotten = res3[0].Tomatoes;
            var c01meta = res1[0].Metacritic;
            var c02meta = res2[0].Metacritic;
            var c03meta = res3[0].Metacritic;
            var c01tmdb = res1[0].TMDB;
            var c02tmdb = res2[0].TMDB;
            var c03tmdb = res3[0].TMDB;
            // Calculations to find the % difference between the user's choice and each website rating on the same movie
            var avgDiffimdb = (Math.abs((slider1Value - c01imdb)/slider1Value) + Math.abs((slider2Value - c02imdb)/slider2Value) + Math.abs((slider3Value - c03imdb)/slider3Value))/3;
            var avgDiffrotten = (Math.abs((slider1Value - c01rotten)/slider1Value) + Math.abs((slider2Value - c02rotten)/slider2Value) + Math.abs((slider3Value - c03rotten)/slider3Value))/3;
            var avgDiffmeta = (Math.abs((slider1Value - c01meta)/slider1Value) + Math.abs((slider2Value - c02meta)/slider2Value) + Math.abs((slider3Value - c03meta)/slider3Value))/3;
            var avgDifftmdb = (Math.abs((slider1Value - c01tmdb)/slider1Value) + Math.abs((slider2Value - c02tmdb)/slider2Value) + Math.abs((slider3Value - c03tmdb)/slider3Value))/3;
            var sumAvgs = avgDiffimdb + avgDiffrotten + avgDiffmeta + avgDifftmdb;
            finalimdb = (1 - (avgDiffimdb/sumAvgs))/3;
            finalrotten = (1 - (avgDiffrotten/sumAvgs))/3;
            finalmeta = (1 - (avgDiffmeta/sumAvgs))/3;
            finaltmdb = (1 - (avgDifftmdb/sumAvgs))/3;
            // With all calculations done the user can have a coefficient that will stay the same throughout all his movie picks
            $('.coefA').html(Math.round((finalimdb * 100)) + '%');
            $('.coefB').html(Math.round((finalrotten * 100)) + '%');
            $('.coefC').html(Math.round((finalmeta * 100)) + '%');
            $('.coefD').html(Math.round((finaltmdb * 100)) + '%');
        };
    });
    var movieID;
    var ratingIMDB;
    var ratingTomato;
    var ratingRoundMeta;
    var ratingTMDB;
    var $Container = $('#container');
    $("#txtSearch").focus();

    // Instantiate the autocomplete for the search box
    $("#txtSearch").autocomplete({
        minChars: 2,
        preventBadQueries: false,
        lookup: function (query, done) {
            $("#divSearch").addClass("loading");
            $.ajax({
                url: "http://www.omdbapi.com/",
                dataType: "jsonp",
                data: {
                    s: query.trim(),
                    type: "movie"
                },
                success: function (data, name) {
                    var completeArray = $.map(data.Search, function (item) {
                        return {
                            // The value return will be the one displayed for the user to pick
                            value: item.Title + " (" + item.Year + ")",
                            // The data return will have the IMDB code for the first ajax call
                            data: item.imdbID,
                            // The data return will have the TMDB code for the second ajax call
                            name: item.Title
                        }
                    });

                    var suggestions = [];
                    $.each(completeArray, function (index, item) {
                        suggestions.push(item);
                    });

                    var result = {};
                    result.suggestions = suggestions;
                    done(result);
                }
            }).fail(function () {
                $("#divSearch").removeClass("loading");
            })
        },
        onSelect: function (suggestion) {
            // Call the change intro function to send the search box to the top
            changeIntro();
            movieID = suggestion.data;
            movieName = encodeURI(suggestion.name);
            $("#txtSearch").focus();
            // First ajax call to the OMDB API
            var sUrl, oData, mUrl, oData2;
            sUrl = 'http://www.omdbapi.com/?i=' + movieID + '&y=&type=movie&tomatoes=true';
            mUrl = 'http://api.themoviedb.org/3/search/movie?query=' + movieName + '&api_key=0b56c7e05825db6e3182d1aa00d47307';
            $.ajax(sUrl, {
                complete: function(p_oXHR, p_sStatus){
                    oData = $.parseJSON(p_oXHR.responseText);
                    if (oData.Metascore >= 0 ) {
                        ratingRoundMeta = Math.round(oData.Metascore) / 10;
                    } else {
                        ratingRoundMeta = "N/A";
                    }
                    if (oData.tomatoRating >= 0 ) {
                        ratingTomato = oData.tomatoRating;
                    } else {
                        ratingTomato = "N/A";
                    }
                    if (oData.Poster === "N/A") {
                        $('.poster').html('<h1 style="text-align: center;width: 50%;display: block;margin: 5em auto;">No poster available for this movie!</h1>');
                    } else {
                        $('.poster').html('<img src="' + oData.Poster + '"/>');
                    }
                    ratingIMDB = Number(oData.imdbRating);
                    $('.imdbRating').html("Rating<br /><span class='rating'>" + ratingIMDB + "</span>");
                    $('.rottenRating').html("Rating<br /><span class='rating'>" + ratingTomato + "</span>");
                    $('.metasRating').html("Rating<br /><span class='rating'>" + ratingRoundMeta + "</span>");
                    $('.topTitleYear').html(oData.Title + ' - ' + oData.Year);
                    $('.topDirector').html('Director: ' + oData.Director);
                    $('.topActors').html('Starring: ' + oData.Actors);
                    $('.topPlot').html('Plot: ' + oData.Plot);
                    $('.topObservation').html('Observation: ' + oData.tomatoConsensus);
                }
            });
            // Second ajax call, now to the TMDB API
            $.wait().then(function() {
                $.ajax(mUrl, {
                    complete: function(p_oXHR, p_sStatus){
                        oData2 = $.parseJSON(p_oXHR.responseText);
                        var ratingTMDBpre = Math.round(oData2.results[0].vote_average * 10) / 10;
                        if (ratingTMDBpre > 0 ) {
                            ratingTMDB = ratingTMDBpre;
                            $('.tmdbRating').html("Rating<br /><span class='rating'>" + ratingTMDB + "</span>");
                        } else {
                            ratingTMDB = "N/A";
                            $('.tmdbRating').html("Rating<br /><span class='rating'>" + ratingTMDB + "</span>");
                        }
                    }
                }); 
            });
            // Wait a bit to have the response from both calls before attempting to do the last calculations
            $.wait(1800).then(function() {
                // Create two arrays one with the ratings and one with the coefficients
                var ratingArray = [ratingIMDB, ratingTomato, ratingRoundMeta, ratingTMDB];
                var coefArray = [finalimdb, finalrotten, finalmeta, finaltmdb];
                var nanCount = 0;
                // It is necessary to check how many websites don't have a rating for that movie so that the score is still valid
                for (var i = 0; i < 4; i++) {
                    if (isNaN(ratingArray[i])) {
                        nanCount++;
                    }; 
                };
                // If all websites have a score for this movie, just get the average
                if (nanCount === 0) {
                    console.log("ratingArray: " + ratingArray);
                    console.log("coefArray: " + coefArray);
                    console.log("nanCount: " + nanCount);
                    ratingDisplay = ((ratingArray[0] * coefArray[0]) + (ratingArray[1] * coefArray[1]) + (ratingArray[2] * coefArray[2]) + (ratingArray[3] * coefArray[3]));
                    $('#finalRating').html(Math.round(ratingDisplay * 10) / 10);
                // If one site doen't have the movie, the other coefficients have to account for 33% of the score
                } else if (nanCount === 1) {
                    for (var i = 0; i < 4; i++) {
                        if (!isNaN(ratingArray[i])) {
                            coefArray[i] = coefArray[i] * 1.33;
                        } else {
                            ratingArray[i] = 0;
                            coefArray[i] = 0;
                        }
                    };
                    console.log("ratingArray: " + ratingArray);
                    console.log("coefArray: " + coefArray);
                    console.log("nanCount: " + nanCount);
                    ratingDisplay = ((ratingArray[0] * coefArray[0]) + (ratingArray[1] * coefArray[1]) + (ratingArray[2] * coefArray[2]) + (ratingArray[3] * coefArray[3]));
                    $('#finalRating').html(Math.round(ratingDisplay * 10) / 10);
                // If two sites doen't have the movie, the other coefficients have to account for 50% of the score
                } else if (nanCount === 2) {
                    for (var i = 0; i < 4; i++) {
                        if (!isNaN(ratingArray[i])) {
                            coefArray[i] = coefArray[i] * 2;
                        } else {
                            ratingArray[i] = 0;
                            coefArray[i] = 0;
                        }
                    };
                    console.log("ratingArray: " + ratingArray);
                    console.log("coefArray: " + coefArray);
                    console.log("nanCount: " + nanCount);
                    ratingDisplay = ((ratingArray[0] * coefArray[0]) + (ratingArray[1] * coefArray[1]) + (ratingArray[2] * coefArray[2]) + (ratingArray[3] * coefArray[3]));
                    $('#finalRating').html(Math.round(ratingDisplay * 10) / 10);
                // If only one website has the movie, his coefficient will have to account for 100% of the score, so the score won't be changed
                } else if (nanCount === 3) {
                    for (var i = 0; i < 4; i++) {
                        if (!isNaN(ratingArray[i])) {
                            coefArray[i] = coefArray[i] * 4;
                        } else {
                            ratingArray[i] = 0;
                            coefArray[i] = 0;
                        }
                    };
                    console.log("ratingArray: " + ratingArray);
                    console.log("coefArray: " + coefArray);
                    console.log("nanCount: " + nanCount);
                    ratingDisplay = ((ratingArray[0] * coefArray[0]) + (ratingArray[1] * coefArray[1]) + (ratingArray[2] * coefArray[2]) + (ratingArray[3] * coefArray[3]));
                    $('#finalRating').html(Math.round(ratingDisplay * 10) / 10);
                };
            }); 
        }
    });
});
$.wait = function(ms) {
    var defer = $.Deferred();
    setTimeout(function() { defer.resolve(); }, ms);
    return defer;
};
