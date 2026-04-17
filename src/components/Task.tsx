import Trash from "../assets/Trash"
import { changeDone, deleteTask } from "../utils/sqlFs"
import Complete from "../assets/Complete"


const Task = ({task,id,setRefresh,date, done, control} : {task: string,id: number, setRefresh: Function,date: string, done: string, control: boolean}) => {

  let check: boolean

  if(done === `true`){
    check = true
  } else { check = false}


    

  return (
    <div className="bg-white/10 outline-0 p-[5%] py-[4%] rounded-[1vw] w-[50vw] text-[1.5vw] font-[Outfit] text-white flex justify-between items-center">
       <p className={`bg-white/10 p-[2%] rounded-[0.5vw] `}>{(task.length > (control ? 20 : 63)) ? task.slice(0,(control ? 20 : 63)) + `...` : task}</p>
       <p className="text-white/60" hidden={!control}>{date.split(`T`).join(`  |  `).split(`-`).join(`/`).slice(0, 20)}</p>

       <div className="flex space-x-[1vw] items-center" hidden={!control}>
        <div className=" size-[2vw] relative outline-0 bg-white/10 p-[2vw] cursor-pointer hover:scale-105 transition-all hover:bg-white/15 rounded-[1vw]" onClick={async () => {await changeDone(id, !check); setRefresh((refresh: number) => refresh + 1)}}>
          <Complete hidden={!check} />
        </div>
        <div onClick={async () => {
        await deleteTask(id)
        setRefresh((refresh: number) => refresh + 1)

       }} className="p-[0.7vw] px-[1.5vw] bg-red-600 hover:bg-red-700 rounded-[.5vw] cursor-pointer transition-all duration-300 group"><Trash /></div>
       </div>
       
       
    </div>
  )
}

export default Task