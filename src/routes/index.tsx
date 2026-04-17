import { createFileRoute } from '@tanstack/react-router'
import Task from '../components/Task';
import { useEffect, useState } from 'react';
import { createDirectory, createTask, fetchTasks } from '../utils/sqlFs';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {


  const [tasks,setTasks] = useState<any>([])
  const [refresh, setRefresh] = useState(1)
  const [searchDone,setSearchDone] = useState(`Both`)
  const [dropDown, setDropDown] = useState(false)
  const [toggleSearch, setToggleSearch] = useState(false)
  const [task,setTask] = useState(``)
  const [errorMessage,setErrorMessage] = useState(``)
  const [search, setSearch] = useState(``)
  const [control, setControl] = useState(true)

  useEffect(() => {

    createDirectory()

    const fetch = async () => {
      const tasks = await fetchTasks(search, searchDone)

      setTasks(tasks)

    }

    fetch()
    


  },[refresh, search, searchDone])


  
  
  

  return <div className='bg-black w-full p-[5%] min-h-svh h-fit flex justify-center items-between overflow-y-scroll'>

    <div className='flex flex-col space-y-[1vw] fixed top-0 left-0 m-[1.5vw]'>
      <div className=' bg-white/10 rounded-[1vw] text-white  p-[2vw] py-[1vw] text-[1.4vw] font-medium tracking-wider cursor-pointer hover:bg-white/20 hover:scale-105 transition-all ' onClick={() => {setToggleSearch(!toggleSearch); setDropDown(false); setSearch(``)}}>Search</div>
      <div className=' bg-white/10 rounded-[1vw] text-white p-[2vw] py-[1vw] text-[1.4vw] font-medium tracking-wider cursor-pointer hover:bg-white/20 hover:scale-105 transition-all ' onClick={() => {setControl(!control);}}>Control</div>

    </div>


    <form onSubmit={ (e) => {e.preventDefault() ;}} >

      <div className='flex h-[5vw] w-[50vw] justify-center'>
        <input type="text"  placeholder='task' className='bg-white/10 outline-0 p-[5%] rounded-l-[1vw] w-[30vw] text-[1.5vw] font-[Outfit] text-white' value={task} onChange={e => setTask(e.target.value)} />
        <button onClick={ async () => {
            await setTimeout(async () => {
              createTask(new Date(), task, false)
              setErrorMessage(``)
              setRefresh(refresh + 1);
              if(task.length < 3){
                setErrorMessage(`the task should be longer than 3 letters`)
              } else{
                setTask("")
              }
            }, 200);
          } } type='submit' className='text-white font-[Outfit] font-bold text-[1.5vw] bg-blue-600 px-[5%] rounded-r-[1vw] cursor-pointer hover:bg-blue-700 transition-all duration-200 group'>Add</button>
      </div>

      <div className='text-[1.8vw] text-red-500 font-[Outfit] font-bold text-center mt-[2%]'>{errorMessage}</div>

      <ul className=' mt-[3%] flex flex-col justify-center items-center space-y-[2%] w-[50vw]'>
        <div className='flex bg-white/10 rounded-[1vw] p-[3vw] py-[1vw]' hidden={toggleSearch}>
          <input type="text" placeholder='Search' className=' outline-0 w-[30vw] text-[1.5vw] font-[Outfit] text-white' value={search} onChange={e => setSearch(e.target.value)} />
          <div className='relative  transition-all '>
            <p className='text-white text-[1.5vw] font-medium flex text-center items-center translate-y-[-5%] cursor-pointer hover:bg-white/20 bg-white/10   p-[2vw] py-[1vw] rounded-[1vw]' onClick={() => setDropDown(!dropDown)}>{searchDone}</p>
            <div className='absolute bg-black border-white/20 border-[0.1vw] h-fit rounded-[1vw] p-[2vw] py-[1.5vw] space-y-[0.8vw] z-60' onClick={() => setDropDown(!dropDown)} hidden={!dropDown}>
              <button className='text-white bg-white/10 rounded-[1vw] p-[2vw] py-[1vw] cursor-pointer hover:bg-white/20 transition-all hover:scale-105 flex justify-start items-center w-full' onClick={() => setSearchDone(`Both`)}>Both</button>
              <button className='text-white bg-white/10 rounded-[1vw] p-[2vw] py-[1vw] cursor-pointer hover:bg-white/20 transition-all hover:scale-105 flex justify-start items-center w-full' onClick={() => setSearchDone(`Done`)}>Done</button>
              <button className='text-white bg-white/10 rounded-[1vw] p-[2vw] py-[1vw] cursor-pointer hover:bg-white/20 transition-all hover:scale-105 flex justify-start items-center w-full' onClick={() => setSearchDone(`Undone`)}>Undone</button>
            </div>
          </div>
        </div>
          

        {
          tasks && tasks.map(({id,date,task,done}: {id: number, date: string, task: string, done: string})  => <Task id={id} key={id} date={date} done={done} task={task} setRefresh={setRefresh} control={control} />)
        }

        {
          (tasks.length == 0) ? <p className='text-white/60 text-[1.5vw] mt-[20svh]'>No tasks to display</p> : ``
        }
      </ul>

      

    </form>

  </div>
}
