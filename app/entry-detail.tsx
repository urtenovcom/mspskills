'use client';
import {useId,useState} from 'react';
import {Check,ChevronDown,ChevronUp,Code2,Copy,Download,ExternalLink,Globe,Layers,Server} from 'lucide-react';
import {getInstallation} from './installation';

type Entry={name:string;type:string;description:string;details:string;tags:string;github:string;website:string;installation:string;image:string;created:string;updated:string};
function Switcher({items,value,onChange,label,id}:{items:string[];value:string;onChange:(v:string)=>void;label:string;id:string}){
 return <div className="install-tabs" role="tablist" aria-label={label}>{items.map((item,i)=><button key={item} id={`${id}-tab-${i}`} role="tab" aria-selected={value===item} aria-controls={`${id}-panel`} tabIndex={value===item?0:-1} onClick={()=>onChange(item)} onKeyDown={e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%items.length;else if(e.key==='ArrowLeft')next=(i+items.length-1)%items.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=items.length-1;else return;e.preventDefault();onChange(items[next]);document.getElementById(`${id}-tab-${next}`)?.focus();}}>{item}</button>)}</div>;
}
export default function EntryDetail({entry,category}:{entry:Entry;category:string}){
 const [imageFailed,setImageFailed]=useState(false);
 const [mode,setMode]=useState('Промпт'),[runner,setRunner]=useState('npx'),[expanded,setExpanded]=useState(true),[copied,setCopied]=useState('');
 const id=useId(),install=getInstallation(entry);
 const repoMatch=entry.github.match(/^https:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/);
 const repository=repoMatch?`${repoMatch[1]}/${repoMatch[2].replace(/\.git$/,'')}`:'';
 const repoUrl=repository?`https://github.com/${repository}`:'';
 const command=`${runner==='pnpm'?'pnpm dlx':runner} ${install.command}`;
 async function copy(text:string){try{await navigator.clipboard.writeText(text);setCopied('Скопировано');}catch{setCopied('Не удалось скопировать. Выделите текст вручную.');}}
 const chooseMode=(v:string)=>{setMode(v);setCopied('');};
 const date=(value:string)=>new Date(value).toLocaleDateString('ru-RU');
 return <div className="skill-layout"><main className="skill-main">
  <div className="skill-heading"><span className={'type-badge '+entry.type}>{entry.type==='skill'?<Layers size={14}/>:<Server size={14}/>} {entry.type==='skill'?'Skill':'MCP-сервер'}</span><span className="muted">{category}</span></div>
  <h1 className="skill-title">{entry.name}</h1><p className="detail-lead">{entry.description}</p>
  {entry.tags&&<div className="tags skill-tags">{entry.tags.split(',').map(t=>t.trim()).filter(Boolean).map(t=><span key={t}>#{t}</span>)}</div>}
  <dl className="skill-meta"><div><dt>Репозиторий</dt><dd>{repository||'Не указан'}</dd></div><div><dt>Добавлено</dt><dd>{date(entry.created)}</dd></div><div><dt>Обновлено</dt><dd>{date(entry.updated)}</dd></div></dl>
  {entry.installation&&<section className="skill-install"><h2>Установка</h2><p className="muted">{install.command?'Скопируйте промпт в чат ассистента или установите скилл командой в терминале.':'Инструкция по установке и настройке инструмента.'}</p>
   {install.command?<div className="install-box"><div className="install-top"><Switcher id={id} label="Способ установки" items={['Промпт','Команда']} value={mode} onChange={chooseMode}/>{mode==='Команда'&&<Switcher id={`${id}-runner`} label="Менеджер пакетов" items={['npx','bunx','pnpm']} value={runner} onChange={v=>{setRunner(v);setCopied('');}}/>}</div>
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${mode==='Промпт'?0:1}`} tabIndex={0}>
    {mode==='Промпт'?<><div className="prompt-tools"><p><strong>Для Codex, Claude Code и других ассистентов</strong><br/>Промпт просит изучить файлы и учесть особенности скилла перед установкой.</p><button className="primary" onClick={()=>copy(install.prompt)}><Copy size={15}/>Копировать промпт</button><button className="secondary" aria-expanded={expanded} aria-controls={`${id}-prompt`} onClick={()=>setExpanded(!expanded)}>{expanded?'Свернуть':'Показать промпт'}{expanded?<ChevronUp size={15}/>:<ChevronDown size={15}/>}</button></div><pre id={`${id}-prompt`} hidden={!expanded} className="install-prompt">{install.prompt}</pre></>:<div id={`${id}-runner-panel`} role="tabpanel" aria-labelledby={`${id}-runner-tab-${['npx','bunx','pnpm'].indexOf(runner)}`}><p className="install-hint">Запустите в терминале. Установщик предложит выбрать ассистента и место установки.</p><div className="command-line"><pre tabIndex={0} aria-label="Команда установки">{command}</pre><button className="icon-button" aria-label="Копировать команду" onClick={()=>copy(command)}><Copy size={17}/></button></div><p className="install-hint">Требуется {runner==='bunx'?'Bun':runner==='pnpm'?'Node.js и pnpm':'Node.js с npm'}. Команду можно прокрутить по горизонтали.</p></div>}
    </div><div className="copy-status" role="status">{copied&&<><Check size={14}/>{copied}</>}</div>
    {repoUrl&&<div className="install-download"><p>Нужны файлы? Скачайте репозиторий целиком.</p><a className="secondary" href={`${repoUrl}/archive/HEAD.zip`}><Download size={16}/>ZIP репозитория</a></div>}
   </div>:<pre>{entry.installation}</pre>}
  </section>}
  {install.command&&install.notes&&<section className="skill-section"><h2>Настройка и использование</h2><p className="preserve">{install.notes}</p>{install.claude&&<details className="claude-alternative"><summary>Установка через плагины Claude Code</summary><pre>{install.claude}</pre></details>}</section>}
  {entry.details&&<section className="skill-section"><h2>Описание</h2><p className="preserve">{entry.details}</p></section>}
 </main><aside className="skill-side"><div className="source-box"><div className="source-title"><span className="glyph blue">{entry.image&&!imageFailed?<img className="item-image" src={entry.image} alt="" onError={()=>setImageFailed(true)}/>:<Code2 size={23}/>}</span><div><strong>{repoMatch?.[1]||'Источники'}</strong>{repository&&<p>{repository}</p>}</div></div>{entry.github&&<a className="secondary" href={entry.github} target="_blank" rel="noopener noreferrer"><Code2 size={16}/>Исходные файлы<ExternalLink size={14}/></a>}{repoUrl&&<a className="secondary" href={repoUrl} target="_blank" rel="noopener noreferrer">Репозиторий на GitHub<ExternalLink size={14}/></a>}{entry.website&&<a className="secondary" href={entry.website} target="_blank" rel="noopener noreferrer"><Globe size={16}/>Сайт<ExternalLink size={14}/></a>}</div><div className="source-note"><h3>Категория</h3><p>{category}</p><h3>Тип инструмента</h3><p>{entry.type==='skill'?'Навык для AI-ассистента':'MCP-сервер'}</p></div></aside></div>;
}
