import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import Upload from '../../assets/Upload'
import { onUpload, readSoundFiles } from '../../utils/soundBoard'
import Sound from '../../components/Sound'
import { getHardwareID, signLicense, verifyLicense } from '../../utils/Licensing'

export const Route = createFileRoute('/soundboard/')({
  component: RouteComponent,
})

function RouteComponent() {

  const [search, setSearch] = useState(``)
  const [add, setAdd] = useState(true)
  const [files, setFiles] = useState([]) as [{ name: string, isDirectory: boolean, isFile: boolean, isSymlink: boolean, audio: HTMLAudioElement }[], Function]
  const [vol, setVol] = useState(false)
  const [volume, setVolume] = useState(50) as [any, Function]

  const volRef = useRef<HTMLInputElement>(null)


  useEffect(() => {

    const read = async () => {
      const data = await readSoundFiles(search)

      setFiles(data)
    }
    read()


  }, [search])

  return <div className='h-svh w-full bg-black flex flex-col items-center p-[2vw] space-y-[5vw] overflow-y-scroll overflow-x-hidden'>

    <div className='flex flex-col space-y-[1vw] fixed top-0 left-0 m-[1.5vw]'>
      <button onClick={() => setVol(!vol)} className='bg-white/10 rounded-[1vw] text-white  p-[2vw] py-[1vw] text-[1.4vw] font-medium tracking-wider cursor-pointer hover:bg-white/20 hover:scale-105 transition-all '>Volume</button>
      {/* <button onClick={() => setSch(!sch)} className='bg-white/10 rounded-[1vw] text-white  p-[2vw] py-[1vw] text-[1.4vw] font-medium tracking-wider cursor-pointer hover:bg-white/20 hover:scale-105 transition-all' >Search</button> */}
    </div>

    <div className='flex flex-col space-y-[1vw]'>
      <div className='flex'>
        <input type="text" placeholder='Search' className=' bg-white/10 rounded-l-[1vw] p-[3vw] py-[1vw] outline-0 w-[30vw] text-[1.5vw] font-[Outfit] text-white' value={search} onChange={e => setSearch(e.target.value)} />
        <button className='text-white font-[Outfit] font-bold text-[1.5vw] bg-blue-600 px-[5%] rounded-r-[1vw] cursor-pointer hover:bg-blue-700 transition-all duration-200 group' onClick={() => { setAdd(!add) }}>Add</button>

      </div>

      <div className='text-white bg-white/10 p-[1vw] px-[3vw] rounded-[1vw] flex space-x-[1vw]' hidden={!vol}>
        <input type="range" min={0} max={100} className=' accent-blue-500 hover:accent-blue-500 w-full' ref={volRef} onChange={e => {
          setVolume((e.target.value))
        }} />
        <p className='flex text-[1.2vw] text-white/70'>{volume}%</p>
      </div>

    </div>

    <div className='grid grid-cols-3 gap-[1vw] '>
      {files && files.map((file) =>
        <Sound key={file.name} file={file} volume={volume} />
      )}
    </div>

    <div onClick={() => { onUpload() }} className='bg-white/10 rounded-[1vw] mt-[5vw] p-[3vw] hover:bg-white/15 hover:scale-103 transition-all duration-300 cursor-pointer' hidden={add}>
      <Upload />
    </div>
  </div>
}