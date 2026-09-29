type InstallEntry={name:string;type:string;github:string;installation:string};
export function getInstallation(entry:InstallEntry){
 const raw=entry.installation.trim();
 const match=raw.match(/https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/tree\/[A-Za-z0-9_./-]+/);
 const candidate=match?.[0]||entry.github;
 const valid=/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/tree\/[A-Za-z0-9_./-]+$/.test(candidate)&&candidate.includes('/skills/');
 const source=valid?candidate:'';
 const command=entry.type==='skill'&&source&&/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(entry.name)?`skills add ${source} --skill ${entry.name}`:'';
 const compat='СОВМЕСТИМОСТЬ И ЗАВИСИМОСТИ',claudeHeading='CLAUDE CODE — команды в чате Claude Code',setup='ПОСЛЕ УСТАНОВКИ И ПРИМЕР ЗАДАЧИ';
 const structured=raw.startsWith('CODEX —')&&raw.includes(compat)&&raw.includes(claudeHeading)&&raw.includes(setup);
 const claude=structured?raw.split(claudeHeading)[1].split(setup)[0].trim():'';
 const notes=structured?[raw.split(compat)[1].split(claudeHeading)[0].trim(),raw.split(setup)[1].trim()].join('\n\n'):raw;
 const prompt=command?`Установи скилл «${entry.name}» в текущего ассистента (Codex, Claude Code или другого совместимого агента).

Исходные файлы: ${source}
Команда установки: npx ${command}

Сначала изучи SKILL.md и все вспомогательные файлы. Проверь зависимости, совместимость с моей ОС и текущим ассистентом. Объясни существенные риски до установки. Если есть пути или инструменты, специфичные для Claude Code, адаптируй их для текущего ассистента и перечисли изменения.

Если доступен терминал, используй команду выше и выбери текущего ассистента при установке. При ручной установке скопируй всю папку скилла вместе со scripts, references, assets и другими файлами, сохранив структуру. Не копируй только SKILL.md. Проверь наличие всех файлов после установки.

Не запускай рабочие операции и платные API для проверки. Сообщи, какие зависимости, ключи и настройки ещё нужны.

Особенности этого скилла:
${notes}`:'';
 return {source,command,prompt,notes,claude};
}
