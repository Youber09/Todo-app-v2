import * as React from 'react'
import { Link, Outlet, createRootRoute, useLocation, useParams } from '@tanstack/react-router'
import { enable, isEnabled } from '@tauri-apps/plugin-autostart';
// import { TrayIcon } from '@tauri-apps/api/tray';
// import { Menu } from '@tauri-apps/api/menu';


// const addTray = async () =>{


//   const menu = await Menu.new({
//     items: [
//       { id: 'quit', text: 'Quit' },
//     ],
//   });


//   const tray = await TrayIcon.new({
//     tooltip: 'Your App Tooltip',
//     icon: '../src-tauri/icons/icon.ico',
//   });

//   await tray.setMenu(menu)

// }


(async () => {
  const active = await isEnabled();
  if (!active) await enable();
})();

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {

  const location = useLocation()



  return (
    <React.Fragment>
      <Link to={`${location.href === `/` ? `/soundboard` : `/`}`} className='fixed top-0 right-0 text-white font-medium p-[2vw] py-[1vw] bg-white/10 text-[1.5vw] rounded-[1vw] m-[2vw] cursor-pointer hover:bg-white/20 hover:scale-105 transition-all'>{location.href === `/` ? `Soundboard` : `TodoList`}</Link>
      <Outlet />
    </React.Fragment>
  )
}
