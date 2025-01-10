import { useTheme } from 'next-themes';
import React from 'react'
type Props = {}

function ThemeSwitcher({ }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <div className="flex items-center space-x-2 flex-col ">
          <div className="relative inline-block w-10 select-none align-middle transition duration-200 ease-in">
        <input
          className="absolute block w-6 h-6  border-4 rounded-full appearance-none cursor-pointer focus:outline-none peer"
          id="toggle"
          type="checkbox"
          onChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
 checked={resolvedTheme === 'dark'} />
        <label
          className=" transition  ease-linear w-5  bg-basic-default delay-150 block h-6 overflow-hidden  rounded-full cursor-pointer peer-checked:bg-basic-default"
          htmlFor="toggle"
        />
      </div>
    </div>
  )
}

export default ThemeSwitcher