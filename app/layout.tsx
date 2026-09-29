import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Полка — Skills & MCP',description:'Личная библиотека скиллов и MCP-серверов',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>;}