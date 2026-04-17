import { convertFileSrc } from '@tauri-apps/api/core';
import { BaseDirectory, localDataDir } from '@tauri-apps/api/path';
import { exists, mkdir, readDir } from '@tauri-apps/plugin-fs';
import { openPath } from '@tauri-apps/plugin-opener';

const Dir_name = "Todo-app-data";
const SoundDir = `SoundEffects`

export const onUpload = async () => {
    const isDir = await exists(Dir_name, {baseDir: BaseDirectory.LocalData})
    if (!isDir){
        await mkdir(Dir_name, {baseDir: BaseDirectory.LocalData})
    }
    
    const isSoundDir = await exists(Dir_name + `/` + SoundDir, {baseDir: BaseDirectory.LocalData})

    if (!isSoundDir) {
        console.log(`hey`)
        await mkdir(Dir_name + `/` + SoundDir, {baseDir: BaseDirectory.LocalData})
    }

    const local = await localDataDir()

    await openPath(`${local}\\${Dir_name}\\${SoundDir}`)

    
}

export const readSoundFiles = async (search: string) => {

    const local = await localDataDir()
   

    const entries = await readDir(Dir_name + `/` + SoundDir, {baseDir: BaseDirectory.LocalData})
    const filtered = await entries.filter((entry) =>  (entry.isFile === true) && (entry.name.split(`.`)[1] === `mp3`) && (entry.name.includes(search)))
    let finished = []

    for (let entry in filtered){
         const path = `${local}\\${Dir_name}\\${SoundDir}\\${filtered[entry].name}`

        const assetUrl = await convertFileSrc(path);
  
        const audio = await new Audio(assetUrl);

        await audio.play()
        await audio.pause()

        finished.push({... filtered[entry], audio : audio})
    }

    return finished
}

export const roundDuration = (duration: number) => {
    const rounded = Math.round(duration)
    let seconds : number | string = rounded % 60
    let minutes : number | string = Math.trunc(rounded / 60) % 60
    let hours = Math.trunc(rounded / 3600)

    if (seconds < 10){
        seconds = `0${seconds}`
    }

    if (minutes < 10){
        minutes = `0${minutes}`
    }

    const finished = `${hours}:${minutes}:${seconds}`

    return finished
}