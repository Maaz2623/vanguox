"use client"
import { useEffect } from 'react';
import { useSettingsModalStore } from './_store/use-settings-modal-store';
import { usePathname, useRouter } from 'next/navigation';

const SettingsPage = () => {

    const pathname = usePathname()
  
    const [, setOpen] = useSettingsModalStore();

    const router = useRouter()

   useEffect(() => {
    if(pathname === "/settings") {
        setOpen(true)
    } else {
        setOpen(false)
    }
   }, [pathname])


}

export default SettingsPage