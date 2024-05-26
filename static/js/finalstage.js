// Test mode

testMode = true

// Global variables
let typingDelay = 30;
let playerName = sessionStorage.getItem('playerName');
let finalstageUnlocked = sessionStorage.getItem('finalStageUnlocked') === 'True';
let currentCharacterName = sessionStorage.getItem('currentCharacterName');
let finalScore = parseInt(sessionStorage.getItem('runningScore'));
let userLives = parseInt(sessionStorage.getItem('wonChapters')) + 1; // Minimum 1 life
let bossLives = 1; // TBD
let userChoice;
let bossChoice;

// Functions

/** 
*  Function for playing musical background - function take number of track as parameter
*  #m1 - intro background track
*/
function playAudio(track, loopBool = true) {
    let soundToPlay = new Audio(track);
    soundToPlay.loop = loopBool;
    soundToPlay.play();
    return soundToPlay;
}

// Function displays starting message in container
function finalStageMessage() {
    currentAudio = playAudio(m1);
    $('#screen-container').css('background',`url('${backFinal}') no-repeat fixed top right / cover`);
    $('#game-container').css('opacity','1');
    $('#game-container').append('<div id="message-container" class="text-center"></div>')
    const    message = `${playerName}, after a hard-fought battle to conquer the mind, Darth Sidious stands between you and saving the galaxy. Through your acquired artefacts, you have gained ${userLives} extra lives.`;
    let messageContainer = $('#message-container');
    let index = 0;

    function type() {
        if (index < message.length) {
            messageContainer.append(message.charAt(index));
            index++;
            setTimeout(type, typingDelay);
        } else {
            messageContainer.html(message);
            messageContainer.append('<button class="btn btn-warning" id="messageButtonOK">ok</button>');
            $('#messageButtonOK').click(function(){
                messageContainer.hide();
                prepareFinalGameView();
            });
        }
    }
    type();
}

// Function prepares game view and character perks
function prepareFinalGameView(){
$('#game-container').empty()
currentAudio = playAudio(mFinal);

    const characterData = {
        'Han Solo': { image: characterImage4},
        'Darth Vader': { image: characterImage3},
        'Luke Skywalker': { image: characterImage2},
        'Princess Leia': { image: characterImage1},
        'Yoda': { image: characterImage0}
    };

    const selectedCharacter = characterData[currentCharacterName];

$('#game-container').append(`
                    <div id="final-game-container" class="text-center">
                        <h2 id="final-stage-title">Final Stage: Lightsaber, Force Shield, Blaster!</h2>
                        <div id="current-player-image-container">
                            <img src="${selectedCharacter.image}" alt="Current player image" class="current-player-image">
                        </div>
                        <div id="artefact-image-container">
                            <span class="w-100 text-center inline-block">
                                artefact
                            </span>
                        </div>
                        <div id="answers-container">
                            <p>Choose your method of attack:</p>
                            <button class="rps-button" data-choice="force-shield">Force Shield</button>
                            <button class="rps-button" data-choice="lightsaber">Lightsaber</button>
                            <button class="rps-button" data-choice="blaster">Blaster</button>
                        </div>
                        <div id="score-container" class="d-flex align-items-center justify-content-center text-center">
                            score
                            <br>
                            <span id="running-score" class="w-100 text-center inline-block">
                                ${finalScore}
                            </span>
                        </div>
                        <div id="lives-container" class="d-flex align-items-center justify-content-center text-center">
                            lives
                            <br>
                            <span id="user-lives" class="w-100 text-center inline-block">
                                ${userLives}
                            </span>
                        </div>
                        <div id="boss-container">
                            <img src="${bossImage}" alt="Boss image" class="boss-image">
                        </div>
                    </div>
                    `);

    currentAudio.pause();

    setTimeout(function() {
        $('#current-player-image-container').css('opacity','1');
        $('#artefact-image-container').css('opacity','1');
        $('#question-container').css('opacity','1');
        $('#answers-container').css('opacity','1');
        $('#score-container').css('opacity','1');
    }, 1000);

    $(document).on('click', '.rps-button', function(){
        userChoice = $(this).data('choice');
        playFinalGame();
    });
}

// Function for RPS/final stage mechanics
function playFinalGame() {
    $('#game-container').empty()
    $('#game-container').css('opacity','1');
    $('#game-container').append(`
        <div id="message-container" class="text-center">
            <p id="boss-choice"></p>
            <p id="rps-result"></p>
        </div>
        `);
    const choices = ['lightsaber', 'force-shield', 'blaster'];
    const bossChoice = choices[Math.floor(Math.random() * choices.length)];
    $('#rps-result').text(`You used: ${userChoice}`);

    // Countdown
    let countdown = 3;
    let countdownInterval = setInterval(() => {
        if (countdown > 0) {
            $('#boss-choice').text(`Darth Sidious attacks in ${countdown}...`);
            countdown--;
        } else {
            clearInterval(countdownInterval);
            revealBossChoice(bossChoice);
        }
    }, 1000);
}

function revealBossChoice(bossChoice) {
    $('#boss-choice').text(`Darth Sidious used: ${bossChoice}`);

    if (userChoice === bossChoice) {
        $('#rps-result').text('Your attacks cancel eachother out! Try again.');
        setTimeout(prepareFinalGameView, 5000);
    }

    if ((userChoice === 'force-shield' && bossChoice === 'blaster') ||
        (userChoice === 'blaster' && bossChoice === 'lightsaber') ||
        (userChoice === 'lightsaber' && bossChoice === 'force-shield')) {
        // User won
        bossLives--;
        if (bossLives === 0) {
            $('#rps-result').text('The strategy was effective!');
            setTimeout(winGame, 5000);
        } else if (bossLives > 0) {
            $('#rps-result').text('The strategy was effective! What will you do next?');
            setTimeout(prepareFinalGameView, 5000);
        }
    } else {
        // Boss won
        userLives--;
        $('#lives-count').text(userLives);

        if (userLives === 0) {
            setTimeout(gameOver, 5000);
        } else {
            $('#rps-result').text('Your strategy was ineffective and thus, you\'ve lost an artefact! What will you do next?');
            setTimeout(prepareFinalGameView, 5000);
        }
    }
}

// Function for handling rps/final stage game win
function winGame() {
    $('#final-game-container').hide();
    $('#game-container').show().append(`
        <div class="text-center">
            <h2>Congratulations! You've conquered the mind, and saved the galaxy!</h2>
            <p>Your final score: ${finalScore}</p>
            <button class="btn btn-primary" id="back-to-menu">Back to Menu</button>
        </div>
    `);
    // Menu button event listener
    $('#back-to-menu').click(function() {
        // Record score to leaderboard and redirect to home
        addScoreToLeaderboard(finalScore, playerName);
        window.location.href = afterChaptersLink;
    });
}

// Function for handling rps/final stage game lose
function gameOver() {
    $('#final-game-container').hide();
    $('#game-container').show().append(`
        <div class="text-center">
            <h2>Game Over</h2>
            <p>You've exhausted all your artefacts. Better luck next time!</p>
            <button class="btn btn-primary" id="back-to-menu">Back to Menu</button>
        </div>
    `);
    $('#back-to-menu').click(function() {
        window.location.href = afterChaptersLink;
    });
}

// Event listeners for RPS buttons
$(document).on('click', '.rps-button', function() {
    const userChoice = $(this).data('choice');
    playFinalGame(userChoice);
});

// Starting point of final game
$(document).ready(function () {
    $('header').hide();
    $('footer').hide();
    $('#game-container').empty();
    finalStageMessage();
});