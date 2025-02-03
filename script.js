let currentsong = new Audio();

async function getSongs() {
    let a = await fetch("https://spotify-clone-git-main-rajanya01s-projects.vercel.app//songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split("/songs/")[1]));
        }
    }

    return songs;
}

async function main() {
    let songs = await getSongs();
    console.log(songs);

    let songUL = document.querySelector(".song-lists ul");
    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img width="18" src="/images/music.svg" alt="music">
                <div class="song-info">
                    <div style="font-weight: 600; font-size: 11px;">${song}</div>
                    <div style="font-size: 10px; font-weight: 600;">Artist</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img width="30" src="/images/play.svg" alt="">
                </div>
            </li>`;
    }

    let playButtons = document.querySelectorAll(".playnow img");
    let mainPlayButton = document.querySelector(".pausebtn");

    function playMusic(songName) {
        let songSrc = "/songs/" + encodeURIComponent(songName);
        if (currentsong.src.includes(songSrc)) {
            if (currentsong.paused) {
                currentsong.play();
                updateIcons(true);
            } else {
                currentsong.pause();
                updateIcons(false);
            }
        } else {
            currentsong.src = songSrc;
            currentsong.play();
            updateIcons(true);
        }
        updateSongInfo(songName);
    }

    function updateIcons(isPlaying) {
        playButtons.forEach(button => {
            let songElement = button.closest("li");
            let songName = songElement.querySelector(".song-info div").innerText.trim();
            if (currentsong.src.includes(encodeURIComponent(songName))) {
                button.src = isPlaying ? "/images/pause.svg" : "/images/play.svg";
            } else {
                button.src = "/images/play.svg";
            }
        });
        mainPlayButton.src = isPlaying ? "/images/pause.svg" : "/images/play.svg";
    }

    playButtons.forEach(playButton => {
        playButton.addEventListener("click", (event) => {
            let songElement = event.target.closest("li");
            let songName = songElement.querySelector(".song-info div").innerText.trim();
            playMusic(songName);
        });
    });

    mainPlayButton.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            updateIcons(true);
        } else {
            currentsong.pause();
            updateIcons(false);
        }
    });

    function updateSongInfo(songName) {
        document.querySelector(".songinfo").innerText = songName;
    }

    function seekbar() {
        const seekbarElement = document.querySelector(".seekbar");
        const circleElement = document.querySelector(".circle");

        currentsong.addEventListener("timeupdate", () => {
            let currentTime = currentsong.currentTime;
            let duration = currentsong.duration;
            let percentage = (currentTime / duration) * 100;
            circleElement.style.left = percentage + "%";
            document.querySelector(".songtime").innerText = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        });

        seekbarElement.addEventListener("click", (event) => {
            let seekbarWidth = seekbarElement.offsetWidth;
            let clickPosition = event.offsetX;
            let newTime = (clickPosition / seekbarWidth) * currentsong.duration;
            currentsong.currentTime = newTime;
        });
    }

    function formatTime(time) {
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }

    seekbar();

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%";
    });

    document.querySelector(".leftclose").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    });
}

main();
