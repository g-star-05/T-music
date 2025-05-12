console.log("Gaurav Tare"); 
let currentSong = new Audio; 
let songs;
let currFolder;

function secondsToMinutesSeconds (seconds) { 
    if (isNaN(seconds) || seconds < 0) { 
    return "00:00"; 
    } 
    const minutes = Math.floor(seconds / 60); 
    const remainingSeconds = Math.floor(seconds % 60); 
    const formattedMinutes = String (minutes).padStart(2, '0'); 
    const formattedSeconds = String(remainingSeconds).padStart(2, '0'); 
    return `${formattedMinutes}:${formattedSeconds}`; 
    }


async function getsongs(folder){
    currFolder=folder;
    let a= await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response= await a.text();
    console.log(response)
    let div =document.createElement("div")
    div.innerHTML = response;
    let as=div.getElementsByTagName("a") 
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    //show all the songs in playlist//
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""  
    for (const song of songs) { 
        songUL.innerHTML = songUL.innerHTML + `<li> 
        
                      <i class="fa-solid fa-music"></i>
                      <div class="info">
                        <div>${song.replaceAll("%20"," ")}</div>
                        <div>T-music</div>
                      </div>
                      <div class="playnow">
                        <span>Play Now</span>
                      <i class="fa-solid fa-circle-play"></i>
                    </div> </li>`;
        
    }   
    // Attach an evnet listner to each song//
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)     
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim()) 
        })       
          
    })
    return songs
}

const playMusic = (track)=>{
    currentSong.src = `/${currFolder}/` + track 
    currentSong.play()
    play.src ="pause.svg"
    document.querySelector(".songinfo").innerHTML=track.replaceAll("%20"," ")   
    document.querySelector(".songtime").innerHTML="00:00/00:00" 
    
    
}
    // ______________________________________________________________________________________________// 

async function main(){
    
    //Get list of all_songs//
    songs = await getsongs("folder/Glory")
    
    
    //Attach an event listner to play,next and prev//
     
    play.addEventListener("click", ()=>{
        if(currentSong.paused){ 
            currentSong.play()  
            play.src ="pause.svg"
        }
        else{
            currentSong.pause()
            play.src ="play.svg"            
        }                       
    })

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currrentTime,currentSong.duration)
        document.querySelector(".songtime").innerHTML =`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 +"%";
    })
    
    // Add an event listener to seekbar 
document.querySelector(".seekbar").addEventListener("click", e=>{ 
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100; 
    document.querySelector(".circle").style.left * percent + "%"; 
    currentSong.currentTime = ((currentSong.duration) * percent)/100; 
    })

    // Add an event listener to previous 
    prevs.addEventListener("click", () => { 
    console.log("Previous clicked") 
    console.log(currentSong) 
    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]) 
    if((index-1) >= 0) { 
    playMusic(songs [index-1]) 
    } 
    }) 
    
    // Add an event listener to next 
    nexts.addEventListener("click", ()=>{ 
    console.log("Next clicked") 
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]) 
    if((index+1) >length) { 
    playMusic(songs [index+1])  
    } 
    })

    // Add an event to volume 
document.querySelector(".ranges").getElementsByTagName("input")[0].addEventListener("change", 
    (e)=>{ 
    console.log("Setting volume to", e.target.value, "/100") 
    currentSong.volume= parseInt(e.target.value)/100 
    })

    // load the playlist whenever the card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e=> {
        e.addEventListener("click",async item=>{
            console.log(item.target,item.target.dataset)    
            songs = await getsongs(`folder/${item.currentTarget.dataset.folder}`)
            
        })
    })
    
    // Add Event listner to mute the track 
    document.querySelector(".vol>img").addEventListener("click",e=>{ 
        if(e.target.src == "volume.svg"){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")  
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;  

        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")    
            currentSong.volume = .00;
            document.querySelector(".range").getElementsByTagName("input")[0].value=.00;
        }
    })

}
main()

//___________________________________________________________________________________________________//
    
