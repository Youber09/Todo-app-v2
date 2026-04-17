import { localDataDir } from '@tauri-apps/api/path';
import { BaseDirectory, exists, mkdir, remove } from '@tauri-apps/plugin-fs';
import Database from '@tauri-apps/plugin-sql';

const Dir_name = "Todo-app-data";
const DB_name = `Tasks.db`
const Old_name = `Tasks.json`
const LD = await localDataDir()

let db = null as any
 

export const createDirectory = async() => {
    await mkdir(Dir_name, {baseDir: BaseDirectory.LocalData, recursive: true})

    const existJson = await exists(Dir_name + `/` + Old_name, {baseDir: BaseDirectory.LocalData})

    if (existJson) {
        await remove(Dir_name + `/` + Old_name, { baseDir: BaseDirectory.LocalData });
    }

    createDB()
}

export const createDB = async () => {
    const LD = await localDataDir()
    db = await Database.load(`sqlite:${LD}/Todo-app-data/${DB_name}`)

    const tableCreated = await db.select(`SELECT name FROM sqlite_master WHERE type='table' AND name='Tasks';`) as any

    

    if (!tableCreated[0]){

        const query = `
            CREATE TABLE Tasks (
                id INTEGER PRIMARY KEY,
                date INTEGER NOT NULL,
                task TEXT NOT NULL UNIQUE,
                done BOOLEAN NOT NULL
            )
        `
    
        await db.execute(query)


    }

}

export const createTask = async (date: Date, task: string, done: boolean) => {

    if (task.length < 3) return

    const query = `
        INSERT INTO Tasks (date, task, done) VALUES ($1, $2, $3)
    `

    await db.execute(query, [date, task, done])

}

export const fetchTasks = async (search: string, searchDone: string) => {
    const db = await Database.load(`sqlite:${LD}/Todo-app-data/${DB_name}`)
    const doneFilter = !(searchDone === `Both`)
    const pattern = `%${search}%`
    let result

    if (!doneFilter) {
        result = await db.select(`SELECT * FROM Tasks WHERE task LIKE $1`, [pattern])
    } else {
        const done = (searchDone === `Done`)

        result = await db.select(`SELECT * FROM Tasks WHERE task LIKE $1 AND done = $2`, [pattern, done])
    }
    
    

    

    
    return result
}

export const deleteTask = async (id: number) => {
    const db = await Database.load(`sqlite:${LD}/Todo-app-data/${DB_name}`)

    const query = `DELETE FROM Tasks WHERE id = $1`

    await db.execute(query, [id])

}

export const changeDone = async (id: number, bool: boolean) => {
    const db = await Database.load(`sqlite:${LD}/Todo-app-data/${DB_name}`)

    const query = `
        UPDATE Tasks
        SET done = $1
        WHERE id = $2
    `

    await db.execute(query, [bool, id])

}
