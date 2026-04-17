import { useState } from "react"
import Play from "../assets/Play"
import { roundDuration } from "../utils/soundBoard"
import Pause from "../assets/Pause"


const Sound = ({ file, volume }: { file: { name: string, isDirectory: boolean, isFile: boolean, isSymlink: boolean, audio: HTMLAudioElement }, volume: number }) => {

    const [playing, setPlaying] = useState(false)

    return (
        <button key={file.name} onClick={async () => {

            if(playing){
                
                file.audio.currentTime = 0

                return
            }

            setPlaying(true)

            await (() => {
                file.audio.volume = volume / 100
            })()

            file.audio.onended = () => {
                setPlaying(false)
            }

            file.audio.play()
        }} className='text-white bg-white/10 p-[1vw] px-[2vw] rounded-[1vw] transition-all hover:bg-white/20 hover:scale-103 cursor-pointer flex justify-between space-x-[1vw] text-[1.5vw]'>
            <div className='flex flex-col items-start'>
                <p>{file.name}</p> <span className='text-[1.4vw] text-white/70'>{roundDuration(file.audio.duration)}</span>
            </div>
            <div className='bg-white/20 rounded-full aspect-square flex justify-center items-center hover:scale-105 hover:bg-white/30 transition-all' onClick={() => {
                file.audio.pause()
                file.audio.currentTime = 0
                setPlaying(false)
            }}>
                {playing ? <Pause/> : <Play /> }
            </div>
        </button>
    )
}

export default Sound