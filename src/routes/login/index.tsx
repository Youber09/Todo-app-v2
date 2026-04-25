import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { createSignatureFile, getHardwareID, signLicense, verifyLicense } from '../../utils/Licensing'

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
})

function RouteComponent() {

  const [signature, setSignature] = useState(``)
  const [code, setCode] = useState(``)
  const [errorMessage, setErrorMessage] = useState(``)

  const navigate = useNavigate()

  useEffect(() => {

    const putCode = async () => {
      const uuid = await getHardwareID()

      setCode(uuid)
    }

    putCode()

  }, [])

  return <div className='h-svh w-full bg-black flex flex-col items-center justify-center p-[2vw] space-y-[5vw] overflow-y-scroll overflow-x-hidden'>

    <div className='flex flex-col space-y-[2vw] items-center'>
      <h1 className='text-[3vw] text-white font-medium tracking-tight after:absolute relative z-10 bg-blur'>Send this code to the author to get your One-time license</h1>

      <div className='flex'>
        <input className=' bg-white/10 outline-0 p-[1vw] px-[2vw] rounded-l-[1vw] w-[50vw] text-[1.2vw] font-[Outfit] text-white' readOnly value={code} />
        <button onClick={async () => {
          await await navigator.clipboard.writeText(code);
        }} className='text-white font-[Outfit] font-bold text-[1.5vw] bg-white/20 px-[2vw] rounded-r-[1vw] cursor-pointer hover:bg-white/30 transition-all duration-200 group'><p className='group-hover:rotate-360 transition-all duration-500 ease-in-out group-hover:scale-105'>Copy</p></button>
      </div>

    </div>


    <div className='flex flex-col items-center space-y-[2vw]'>
      <div className='flex'>
        <input type="text" placeholder='Signature' className='bg-white/10 outline-0 p-[2vw] px-[3vw] rounded-l-[1vw] w-[60vw] text-[1.5vw] font-[Outfit] text-white' value={signature} onChange={e => setSignature(e.target.value)} />
        <button className='text-white font-[Outfit] font-bold text-[1.5vw] bg-blue-600 px-[5%] rounded-r-[1vw] cursor-pointer hover:bg-blue-700 transition-all duration-200 group' onClick={async () => {

          const regex = /^[A-Za-z0-9+/]{86}==$/

          const validFormat = regex.test(signature)

          if (!validFormat) {
            setErrorMessage(`Wrong format`)
          }

          const check = await verifyLicense(code, signature)

          if (!check) {
            setErrorMessage(`Wrong signature`)
          }

          if (check) {
            setErrorMessage(``)
            createSignatureFile(signature)
            navigate({to: `/`})
          }
        }}>Confirm</button>

      </div>

      <p className='text-red-500 text-[1.8vw]'>{errorMessage}</p>

    </div>


  </div>
}
