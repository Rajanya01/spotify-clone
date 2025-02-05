let currentsong = new Audio();
let currentPlayingButton = null; 

const songs = [
    { file: "APT.mp3", artist: "Rose" },
    { file: "aura.mp3", artist: "Ogryzek" },
    { file: "bye bye bye.mp3", artist: "N'Sync" },
    { file: "die with a smile.mp3", artist: "Bruno Mars" },
    { file: "glory.mp3", artist: "Ogryzek" },
    { file: "I LUV IT.mp3", artist: "Frontman" },
    { file: "Metamorphosis.mp3", artist: "Unknown" },
    { file: "perfect.mp3", artist: "Ed Sheeran" },
    { file: "setar.mp3", artist: "Chub1na Ge" },
    { file: "shape of you.mp3", artist: "Ed Sheeran" }
];

function main() {
    let songUL = document.querySelector(".song-lists ul");
    songUL.innerHTML = ""; 

    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img width="18" src="/images/music.svg" alt="music">
                <div class="song-info">
                    <div style="font-weight: 600; font-size: 11px;">${song.file.replaceAll("%20", " ")}</div>
                    <div style="font-size: 10px; font-weight: 600;">${song.artist}</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img width="30" src="images/play.svg" alt="">
                </div>
            </li>`;
    }

    document.querySelectorAll(".song-lists li").forEach(item => {
        item.addEventListener("click", () => {
            let songName = item.querySelector(".song-info div").innerText.trim();
            let playButton = item.querySelector(".playnow img");
            playMusic(songName, playButton);
        });
    });

    function playMusic(songName, clickedButton) {
        let songSrc = `/songs/${encodeURIComponent(songName)}`;

        if (currentsong.src.includes(songSrc)) {
            if (currentsong.paused) {
                currentsong.play();
                updateIcons(clickedButton, "pause");
            } else {
                currentsong.pause();
                updateIcons(clickedButton, "play");
            }
        } else {
            currentsong.src = songSrc;
            currentsong.play();
            updateIcons(clickedButton, "pause");
        }
    }

    function updateIcons(clickedButton, state) {
        let mainPlayButton = document.querySelector(".pausebtn");

        if (currentPlayingButton && currentPlayingButton !== clickedButton) {
            currentPlayingButton.src = "images/play.svg"; 
        }

        clickedButton.src = state === "pause" ? "images/pause.svg" : "images/play.svg";
        mainPlayButton.src = state === "pause" ? "images/pause.svg" : "images/play.svg";

        currentPlayingButton = state === "pause" ? clickedButton : null;
    }

    function togglePause() {
        let mainPlayButton = document.querySelector(".pausebtn");
    
        mainPlayButton.addEventListener("click", () => {
            if (!currentPlayingButton) return; 
    
            if (currentsong.paused) {
                currentsong.play();
                mainPlayButton.src = "images/pause.svg"; 
                currentPlayingButton.src = "images/pause.svg"; 
            } else {
                currentsong.pause();
                mainPlayButton.src = "images/play.svg"; 
                currentPlayingButton.src = "images/play.svg"; 
            }
        });
    }
    
    

    togglePause();

    function songInfo() {
        const songInfoElement = document.querySelector(".songinfo");
        const songTimeElement = document.querySelector(".songtime");

        currentsong.addEventListener("play", () => {
            songInfoElement.innerHTML = `${decodeURIComponent(currentsong.src.split("/songs/")[1])}`;
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
    
        let isDragging = false;
        let wasPlaying = false; 
    
        currentsong.addEventListener("timeupdate", () => {
            if (!isDragging && currentsong.duration) {
                const percentage = (currentsong.currentTime / currentsong.duration) * 100;
                circleElement.style.left = `${percentage}%`;
                document.querySelector(".songtime").innerHTML = `${secondsToMinutesSecond(currentsong.currentTime)}/${secondsToMinutesSecond(currentsong.duration)}`;
            }
        });
    
        seekbarElement.addEventListener("click", (event) => {
            const seekbarWidth = seekbarElement.offsetWidth;
            const clickPosition = event.offsetX;
            const newTime = (clickPosition / seekbarWidth) * currentsong.duration;
            currentsong.currentTime = newTime;
        });
    
        circleElement.addEventListener("mousedown", (event) => {
            isDragging = true;
            wasPlaying = !currentsong.paused; 
            currentsong.pause(); 
    
            document.addEventListener("mousemove", onDrag);
            document.addEventListener("mouseup", () => {
                isDragging = false;
                document.removeEventListener("mousemove", onDrag);
                if (wasPlaying) currentsong.play(); // Resume only if it was playing before
            });
        });
    
        function onDrag(event) {
            if (!isDragging) return;
    
            const seekbarRect = seekbarElement.getBoundingClientRect();
            let newLeft = event.clientX - seekbarRect.left;
            if (newLeft < 0) newLeft = 0;
            if (newLeft > seekbarRect.width) newLeft = seekbarRect.width;
    
            const newTime = (newLeft / seekbarRect.width) * currentsong.duration;
            currentsong.currentTime = newTime;
    
            circleElement.style.left = `${(newLeft / seekbarRect.width) * 100}%`;
        }
    }    

    function secondsToMinutesSecond(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secondsLeft = Math.floor(seconds % 60);
        return `${minutes}:${secondsLeft < 10 ? "0" + secondsLeft : secondsLeft}`;
    }

    seekbar();
    secondsToMinutesSecond();

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%";
    });
    document.querySelector(".leftclose").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    });
}

main();
