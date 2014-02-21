/*
 *    Memory Cube
 *    Copyright (C) 2013  Jesús Pérez Paz (@tx2z) - jesus@perezpaz.es
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License as
 *    published by the Free Software Foundation, either version 3 of the
 *    License, or (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function($) {

    // Shuffle an Array
    function shuffle(o) {
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    // Move cube
    function movecube() {

        // Show arrows to move cube
        $('.turnLink').css('visibility', 'visible');

        var onfront  = ['top', 'bottom'];
        var ontop    = ['back', 'front'];
        var onback   = ['bottom', 'top'];
        var onbottom = ['front', 'back'];

        var turnCubeLinks = onfront;
        $bottom=$('.turnLink').Touchable();
        $bottom.on('touchableend', function(){
            $('#cube').attr('class', 'show-' + turnCubeLinks[$(this).attr('data-goto')]);
            turnCubeLinks = eval('on' + turnCubeLinks[$(this).attr('data-goto')] );
        });
    }

    function createCube(page) {
        $('.wrapper').html('<div data-goto="0" class="turnLink inTop icon-arrow-down"></div><div id="container" class="' + page + '"><div id="cube" class="show-front"><div class="cubeFace left"></div><div class="cubeFace right"></div></div></div><div data-goto="1" class="turnLink inBottom icon-arrow-up"></div>');
    }

    // Chronometer
    Zepto.fn.time_from_seconds = function() {
        return this.each(function() {
            var t = parseInt($(this).text(), 10);
            $(this).data('original', t);
            var h = Math.floor(t / 3600);
            t %= 3600;
            var m = Math.floor(t / 60);
            var s = Math.floor(t % 60);
            $(this).text((h > 0 ? h + ' : ': '') + (m > 0 ? (m < 10 ? '0' + m  + ' : ' : m + ' : ') : '00 : ') + (s < 10 ? '0' + s : s ));
        });
    };
    var start = 1;
    var current = 1;
    var timeCounter;
    function startTimer(newCounter) {
        if(newCounter) {
            current = 1;
        }
        timeCounter = setInterval(function() {
            actualSeconds = current - start;
            $('.chrono').attr('data-seconds',actualSeconds);
            $('.chrono').text(actualSeconds);
            $('.chrono').time_from_seconds();
            current++;
        }, 1000);
    }
    function stopTimer() {
        clearInterval(timeCounter);
    }

    // Open / close lateral page (menu, option, finish game)
    var lateralCubeClass;
    function openLateral() {
        if($('#container').hasClass('game')) {
           stopTimer();
        }
        $('#appMenu').addClass('open');
        if(!$('#container').hasClass('index')) {
            lateralCubeClass = $('#cube').attr('class');
            $('#container').addClass('startAnimation');
            $('#cube').attr('class', 'show-back');
        }
    }
    function closeLateral(dontStopTimer) {
        if($('#container').hasClass('game') && dontStopTimer) {
           startTimer(false);
        }
        $('#appMenu').removeClass('open');
        if(!$('#container').hasClass('index')) {
            $('#container').removeClass('startAnimation');
            $('#cube').attr('class', lateralCubeClass);
        }
    }

    // Levels Cube
    function showLevels() {
        // Create cube
        createCube('levels');

        // Checking if there are levels in localstorage and load them
        var levels;
        if(localStorage) {
            if (localStorage.getItem('levelsStored')) {
                // Localstorage detected - Load setings
                levels = JSON.parse(localStorage.getItem('levelsStored'));
            } else {
                // No localstorage detected - Create new levels profile
                newLevelsSet =[
                    ['world-flags'          ,true ,0],
                    ['world-flags2'         ,false,0],
                    ['world-monuments'      ,false,0],
                    ['world-monuments2'     ,false,0],
                    ['cards'                ,false,0],
                    ['cards2'               ,false,0],
                    ['cards3'               ,false,0],
                    ['cards-11'             ,false,0],
                    ['colors'               ,false,0],
                    ['colors-names'         ,false,0],
                    ['colors-double'        ,false,0],
                    ['colors-names2'        ,false,0],
                    ['maths-sums'           ,false,0],
                    ['maths-subtractions'   ,false,0],
                    ['maths-multiplications',false,0],
                    ['maths-equations'      ,false,0]
                ];
                localStorage.setItem('levelsStored', JSON.stringify(newLevelsSet));
                levels = JSON.parse(localStorage.getItem('levelsStored'));
            }
        } else {
            // No localStorage - allow to play to all levels
            levels =[
                ['world-flags'          ,true,0],
                ['world-flags2'         ,true,0],
                ['world-monuments'      ,true,0],
                ['world-monuments2'     ,true,0],
                ['cards'                ,true,0],
                ['cards2'               ,true,0],
                ['cards3'               ,true,0],
                ['cards-11'             ,true,0],
                ['colors'               ,true,0],
                ['colors-names'         ,true,0],
                ['colors-double'        ,true,0],
                ['colors-names2'        ,true,0],
                ['maths-sums'           ,true,0],
                ['maths-subtractions'   ,true,0],
                ['maths-multiplications',true,0],
                ['maths-equations'      ,true,0]
            ];
        }

        // Create cube faces and add levels
        var cubeFaces = ['front','bottom','back','top'];
        var cubeCount = 0;

        for (var i=0;i<levels.length;i++) {
            if (i%4===0) {
                $('#cube').append('<div class="cubeFace ' + cubeFaces[cubeCount] + '"></div>');
                cubeCount ++;
            }

            if (levels[i][1]) {
                if (levels[i][2] !== 0) {
                    var levelStars = '';

                    for (var x=1;x<=3;x++) {
                        if (x <= levels[i][2]) {
                            levelStars = levelStars + '<span class="icon-star-3"></span>';
                        } else {
                            levelStars = levelStars + '<span class="icon-star"></span>';
                        }
                    }

                    var levelIcons = '<div class="levelScore">' + levelStars + '</div>';
                    var faceClass = 'readyToPlay';
                } else {
                    var levelIcons = '';
                    var faceClass = 'newToPlay';
                }

            } else {
                var levelIcons = '<div class="icon-lock"></div>';
                var faceClass = 'levelBlocked';
            }

            var levelNumber = i+1;
            $('.cubeFace').last().append('<div class="flip"><div class="card" id="level' + i + '"><div class="face fontFace ' + faceClass + '" data-level="' + levels[i][0] + '" style="background-image: url(levels/' + levels[i][0] + '/level-icon.png);"><div class="levelNumber">' + levelNumber + '</div>' + levelIcons + '</div></div></div>');
        }


        $t=$('.readyToPlay, .newToPlay').Touchable();

        // One click / tap
        $t.on('touchableend', function(e, touch){
            startGame($(this).attr('data-level'));
        });

        movecube();
    }

    function endGame(level, score) {

        // Show finish game screen
        var finalTime = $('.chrono').html();
        var finalScore = '';

        for (var x=1;x<=3;x++) {
            if (x <= score) {
                finalScore = finalScore + '<span class="icon-star-3"></span>';
            } else {
                finalScore = finalScore + '<span class="icon-star"></span>';
            }
        }

        $('#appMenu').append('<div class="gameFinished"><h1>Well Done</h1><p>You have finished "' + level + '" in ' + finalTime + '</p><p class="finishedLevelScore">' + finalScore + '</p><a href="#" class="repeatGame">Play Again</a><a href="#" class="goToLevels">Next Level</a></div>');
        $('#appMenu .icon-cog, #appMenu .contentAppMenu').css('display','none');
        openLateral();

        // Save state in localStorage
        if(localStorage) {

            var updatedLevels = JSON.parse(localStorage.getItem('levelsStored'));

            for( var i = 0; i < updatedLevels.length; i++ ) {
                if ($.inArray(level, updatedLevels[i]) === 0) {

                    // Update level score
                    if (updatedLevels[i][2] < score){
                        updatedLevels[i][2] = score;
                    }

                    //Unlock next level
                    if (updatedLevels[i+1]) {
                        updatedLevels[i+1][1] = true;
                    }

                    break;
                }
            }

            // Update localstorage
            localStorage.setItem('levelsStored', JSON.stringify(updatedLevels));

        }

        $('.goToLevels').click(function(){
            $('.chrono').html('');
            closeLateral(false);
            showLevels();
            $('.gameFinished').remove();
            $('#appMenu .icon-cog, #appMenu .contentAppMenu').css('display','block');
            return false;
        });

        $('.repeatGame').click(function(){
            $('.chrono').html('');
            closeLateral(false);
            startGame(level);
            $('.gameFinished').remove();
            $('#appMenu .icon-cog, #appMenu .contentAppMenu').css('display','block');
            return false;
        });
    }

    function startGame(level) {
        // Create new cube
        createCube('game');

        // Cards (Always 16 cards)
        var cards = [
            [1,'img-1-1'],
            [1,'img-1-2'],
            [2,'img-2-1'],
            [2,'img-2-2'],
            [3,'img-3-1'],
            [3,'img-3-2'],
            [4,'img-4-1'],
            [4,'img-4-2'],
            [5,'img-5-1'],
            [5,'img-5-2'],
            [6,'img-6-1'],
            [6,'img-6-2'],
            [7,'img-7-1'],
            [7,'img-7-2'],
            [8,'img-8-1'],
            [8,'img-8-2']
        ];

        // Game Variables
        var cubeFaces = ['front','bottom','back','top'];
        var cubeCount = 0;
        var storeCardValue = 'empty';

        shuffle(cards);
        for (var i=0;i<cards.length;i++) {
            if (i%4===0) {
                $('#cube').append('<div class="cubeFace ' + cubeFaces[cubeCount] + '"></div>');
                cubeCount ++;
            }
            $('.cubeFace').last().append('<div class="flip"><div class="card" id="card' + i + '" data-content="' + cards[i][0] + '"><div class="face fontFace"></div><img src="levels/' + level + '/' + cards[i][1] + '.png" alt="card' + cards[i][1] + '" class="face backFace" /></div></div>');
        }

        // Creating message div
        $('.wrapper').append('<div class="message"></div>');

        //Start chrono
        startTimer(true);

        function oneClick(actualCart) {
            if (!actualCart.hasClass('select')) {
                $('.card').removeClass('flipped'); // Flip/hide all other cards
                setTimeout(function() {
                    actualCart.addClass('flipped'); // Fliping/showing actual cart
                }, 300);
                setTimeout(function() {
                    actualCart.removeClass('flipped');  // Fliping/hidding actual cart
                }, 2000);
            }
        }

        function doubleClick(actualCart) {
            $('.card').removeClass('flipped'); // Flip/hide all cards
            if (actualCart.hasClass('select')) {
            // Cart is actually selected ->deselect it
                storeCardValue = 'empty';
                actualCart.removeClass('select');
            } else {
            // Select cart
                var cardValue = actualCart.data('content');
                if (storeCardValue == cardValue ) {
                // Actual cart value is equal to stored cart value -> deselect carts empty stored cart value and flip cards
                    $('.card').removeClass('select');
                    storeCardValue = 'empty';
                    $('div[data-content="' + cardValue +'"]').addClass('solved');
                    // Check if all cards are solved
                    if ($('.solved').size() == $('.card').size() ) {
                        stopTimer();
                        var endGameScore = 0;
                        if ($('.chrono').attr('data-seconds') < 60) {
                            endGameScore = 3;
                        } else if ($('.chrono').attr('data-seconds') < 120) {
                            endGameScore = 2;
                        } else {
                            endGameScore = 1;
                        }
                        endGame(level, endGameScore);
                    }
                } else {
                //Actual card value is not  equal to stored cart value
                    actualCart.addClass('select');
                    if (storeCardValue == 'empty') {
                    // There is no other card selected -> Mark it and store value
                        storeCardValue = cardValue;
                    } else {
                    // There is other card selected -> Fail! -> Remove all selected cards
                        var errorMessages = ['FAIL!','MAL','NO,NO!','NO WAY','TRY AGAIN','WRONG','TIC TOC','ERROR','NOPE' ];
                        shuffle(errorMessages);
                        $('.message').html(errorMessages[0]);
                        $('.message').addClass('showMessage');
                        setTimeout(function() {
                            $('.message').removeClass('showMessage');
                        }, 1500);
                        $('.card').removeClass('select');
                        storeCardValue = 'empty';
                    }

                }
            }
        }

        // Define clicks on cards
        $t=$('.face').Touchable();
        var isDouble = false;

        // Double click / tap
        $t.on('doubleTap', function(e, touch){
            isDouble = true;
            var touchElem = touch.elem.parentElement.id;
            var actualCart = $('#' + touchElem);
            doubleClick(actualCart);
            setTimeout(function() {
                isDouble = false;
            }, 600);
            e.preventDefault();
        });

        // One click / tap
        $t.on('touchableend', function(e, touch){
            setTimeout(function() { // Wait for double tap
                if(isDouble !== true){
                    var touchElem = touch.elem.parentElement.id;
                    var actualCart = $('#' + touchElem);
                    oneClick(actualCart);
                }
            }, 300);

        });

        movecube();

    }

    $('.startGame').click(function(){
        showLevels();
        return false;
    });

    // Click on options button
    $('.icon-cog').click(function(){
        if ($('#appMenu').hasClass('open')) {
            closeLateral(true);
        } else {
            openLateral();
        }
    });

    $('.menuToLevels').click(function(){
        $('.chrono').html('');
        closeLateral(false);
        showLevels();
        return false;
    });

    /*
    $(function() {
        setTimeout(function() {
            $('#cube').attr('class', 'show-front');
        }, 1000);
        setTimeout(function() {
            $('#container').removeClass('startAnimation').addClass('index');
        }, 1500);
        movecube();
    });
    */

    /*
    document.body.addEventListener('touchmove', function (e) {
       e.preventDefault();
    });
    */

})(window.Zepto);