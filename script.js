let currentsong = new Audio();

async function getSongs() {
    // Base URL of your GitHub repository's raw content
    let baseURL = "https://raw.githubusercontent.com/Rajanya01/spotify-clone/main/songs/";

    // List of song files manually added (since GitHub doesn't provide directory listings)
    let songs = [
        "APT.mp3",
        "aura.mp3",
        "bye bye bye.mp3",
        "die with a smile.mp3",
        "glory.mp3",
        "I LUV IT.mp3",
        "Metamorphosis.mp3",
        "perfect.mp3",
        "setar.mp3",
        "shape of you.mp3"
    ];

    // Construct full URLs for the songs
    return songs.map(song => baseURL + song);
}


async function main() {
    let songs = await getSongs();
    console.log(songs);

    let songUL = document.querySelector(".song-lists").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
                    <li><img width="18" src="/images/music.svg" alt="music">
                            <div class="song-info">
                                <div style="font-weight: 600; font-size: 11px;">${song.replaceAll("%20", " ")}</div>
                                <div style="font-size: 10px; font-weight: 600;">holabubi</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img width="30" src="images/play.svg" alt="">
                            </div>
                     </li>`;
    }

    Array.from(document.querySelector(".song-lists").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".song-info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".song-info").firstElementChild.innerHTML.trim());
        });
    });

    function togglePlay() {
        let playButtons = document.querySelectorAll(".playnow img");
        let mainPlayButton = document.querySelector(".pausebtn");

        playButtons.forEach(playButton => {
            playButton.addEventListener("click", (event) => {
                let songElement = event.target.closest("li");
                let songName = songElement.querySelector(".song-info div").innerText.trim();
                let songSrc = "/songs/" + encodeURIComponent(songName);

                if (currentsong.src.includes(songSrc)) {
                    if (currentsong.paused) {
                        currentsong.play();
                        playButton.src = "images/pause.svg";
                        mainPlayButton.src = "images/pause.svg";
                    } else {
                        currentsong.pause();
                        playButton.src = "images/play.svg";
                        mainPlayButton.src = "images/play.svg";
                    }
                } else {
                    currentsong.src = songSrc;
                    currentsong.play();
                    playButton.src = "images/pause.svg";
                    mainPlayButton.src = "images/pause.svg";

                    document.querySelectorAll(".playnow img").forEach(button => {
                        if (button !== playButton) {
                            button.src = "images/play.svg";
                        }
                    });
                }
            });
        });
    }

    function togglePause() {
        let mainPlayButton = document.querySelector(".pausebtn");
        mainPlayButton.addEventListener("click", () => {
            let songListButtons = document.querySelectorAll(".playnow img"); 

            if (currentsong.paused) {
                currentsong.play();
                mainPlayButton.src = "images/pause.svg"; 

                songListButtons.forEach(button => {
                    let songElement = button.closest("li");
                    let songName = songElement.querySelector(".song-info div").innerText.trim();
                    let songSrc = "/songs/" + encodeURIComponent(songName);

                    if (currentsong.src.includes(songSrc)) {
                        button.src = "images/pause.svg"; 
                    }
                });

            } else {
                currentsong.pause();
                mainPlayButton.src = "images/play.svg"; 

                songListButtons.forEach(button => {
                    let songElement = button.closest("li");
                    let songName = songElement.querySelector(".song-info div").innerText.trim();
                    let songSrc = "/songs/" + encodeURIComponent(songName);

                    if (currentsong.src.includes(songSrc)) {
                        button.src = "images/play.svg"; 
                    }
                });
            }
        });
    }

    togglePlay();
    togglePause();

    function songInfo() {
        const songInfoElement = document.querySelector(".songinfo");
        const songTimeElement = document.querySelector(".songtime");

        currentsong.addEventListener("play", () => {
            songInfoElement.innerHTML = `${currentsong.src.split("/songs/")[1].replaceAll("%20", " ")}`;
            updateSongTime(songTimeElement);
        });

        currentsong.addEventListener("timeupdate", () => {
            updateSongTime(songTimeElement);
        });

        function updateSongTime(element) {
            const currentTime = formatTime(currentsong.currentTime);
            const duration = formatTime(currentsong.duration);
            element.innerHTML = `${currentTime} / ${duration}`;
        }

        function formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        }
    }

    songInfo();

    function seekbar() {
        const seekbarElement = document.querySelector(".seekbar");
        const circleElement = document.querySelector(".circle");

        currentsong.addEventListener("timeupdate", () => {
            const currentTime = currentsong.currentTime;
            const duration = currentsong.duration;

            const percentage = (currentTime / duration) * 100;
            circleElement.style.left = percentage + "%";
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSecond(currentTime)}/${secondsToMinutesSecond(duration)}`;
        });

        seekbarElement.addEventListener("click", (event) => {
            const seekbarWidth = seekbarElement.offsetWidth;
            const clickPosition = event.offsetX;

            const newTime = (clickPosition / seekbarWidth) * currentsong.duration;

            currentsong.currentTime = newTime;
        });
    }

    function secondsToMinutesSecond(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secondsLeft = Math.floor(seconds % 60);
        return `${minutes}:${secondsLeft < 10 ? "0" + secondsLeft : secondsLeft}`;
    }

    seekbar();
    secondsToMinutesSecond();

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0%"
    })
    document.querySelector(".leftclose").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%"
    })

}

main();
