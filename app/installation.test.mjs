import {test} from 'node:test';
import assert from 'node:assert/strict';
import {getInstallation} from './installation.ts';

const source='https://github.com/artwist-polyakov/polyakov-claude-skills/tree/main/plugins/yandex-search-api/skills/yandex-search-api';
const entry={name:'yandex-search-api',type:'skill',github:source,installation:`CODEX — вставьте этот запрос в чат\n\nУстанови из:\n${source}\n\nСОВМЕСТИМОСТЬ И ЗАВИСИМОСТИ\nНужен Python.\n\nCLAUDE CODE — команды в чате Claude Code\n/plugin install yandex-search-api\n\nПОСЛЕ УСТАНОВКИ И ПРИМЕР ЗАДАЧИ\nУкажите API key локально.`};
test('shared prompt, correct source and separate setup survive conversion',()=>{
 const value=getInstallation(entry);
 assert.ok(value.prompt.includes(source));
 assert.ok(value.prompt.includes('SKILL.md'));
 assert.ok(value.command.includes('--skill yandex-search-api'));
 assert.ok(value.notes.includes('Нужен Python.'));
 assert.ok(value.notes.includes('Укажите API key локально.'));
 assert.equal(value.claude,'/plugin install yandex-search-api');
});
test('unknown instructions are preserved; MCP receives no invented skill command',()=>{
 const text='docker run example\nНастройте порт 8080.';
 const value=getInstallation({name:'server',type:'mcp',github:source,installation:text});
 assert.equal(value.notes,text);assert.equal(value.command,'');
});
test('unsafe names and non-GitHub sources never produce commands',()=>{
 assert.equal(getInstallation({...entry,name:'x; calc.exe'}).command,'');
 assert.equal(getInstallation({...entry,github:'https://example.com',installation:'Инструкция'}).command,'');
});
