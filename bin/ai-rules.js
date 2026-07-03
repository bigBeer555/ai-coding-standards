#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const packageRoot = path.resolve(__dirname, '..');
const currentDir = process.cwd();
const homeDir = os.homedir();
const installedRulesDirName = '.ai-coding-standards';
const ruleDirs = ['core', 'domains'];

const projectAdapters = [
  {
    name: 'cursor',
    label: 'Cursor Project Rules',
    template: 'adapters/cursor/project-rules.md',
    dest: '.cursor/rules/ai-coding-standards.mdc'
  },
  {
    name: 'cursor-legacy',
    label: 'Cursor Legacy Rules',
    template: 'adapters/cursor/project-rules.md',
    dest: '.cursorrules'
  },
  {
    name: 'opencode',
    label: 'OpenCode / General Agent Rules',
    template: 'adapters/opencode/AGENTS.md',
    dest: 'AGENTS.md'
  },
  {
    name: 'claude',
    label: 'Claude Code Project Rules',
    template: 'adapters/claude/CLAUDE.md',
    dest: 'CLAUDE.md'
  },
  {
    name: 'gemini',
    label: 'Gemini CLI Project Rules',
    template: 'adapters/gemini/GEMINI.md',
    dest: 'GEMINI.md'
  },
  {
    name: 'copilot',
    label: 'GitHub Copilot Project Rules',
    template: 'adapters/copilot/copilot-instructions.md',
    dest: '.github/copilot-instructions.md'
  },
  {
    name: 'windsurf',
    label: 'Windsurf Project Rules',
    template: 'adapters/windsurf/windsurfrules',
    dest: '.windsurfrules'
  }
];

const globalAdapters = [
  {
    name: 'cursor',
    label: 'Cursor Global Rules',
    template: 'adapters/cursor/user-rules.md',
    dest: path.join(homeDir, '.cursor', 'rules', 'ai-coding-standards.md')
  },
  {
    name: 'opencode',
    label: 'OpenCode Global Rules',
    template: 'adapters/opencode/AGENTS.md',
    dest: path.join(homeDir, '.config', 'opencode', 'AGENTS.md')
  },
  {
    name: 'claude',
    label: 'Claude Code Global Rules',
    template: 'adapters/claude/CLAUDE.md',
    dest: path.join(homeDir, '.claude', 'CLAUDE.md')
  },
  {
    name: 'gemini',
    label: 'Gemini CLI Global Rules',
    template: 'adapters/gemini/GEMINI.md',
    dest: path.join(homeDir, 'GEMINI.md')
  },
  {
    name: 'windsurf',
    label: 'Windsurf Global Rules',
    template: 'adapters/windsurf/windsurfrules',
    dest: path.join(homeDir, '.windsurfrules')
  }
];

const agentNames = ['cursor', 'opencode', 'claude', 'gemini', 'copilot', 'windsurf'];
const agentAliases = {
  cursor: ['cursor', 'cursor-legacy'],
  'cursor-legacy': ['cursor-legacy'],
  cursorrules: ['cursor-legacy'],
  opencode: ['opencode'],
  agents: ['opencode'],
  claude: ['claude'],
  'claude-code': ['claude'],
  gemini: ['gemini'],
  'gemini-cli': ['gemini'],
  copilot: ['copilot'],
  github: ['copilot'],
  windsurf: ['windsurf']
};

function normalizeSlash(filePath) {
  return filePath.replace(/\\/g, '/');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getVersion() {
  return readJson(path.join(packageRoot, 'package.json')).version;
}

function parseAgentList(value) {
  return value
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);
}

function parseArgs(rawArgs) {
  const args = [...rawArgs];
  const options = {
    force: false,
    target: currentDir,
    agents: []
  };
  const positionals = [];

  while (args.length > 0) {
    const arg = args.shift();

    if (arg === '--force' || arg === '-f') {
      options.force = true;
      continue;
    }

    if (arg === '--target' || arg === '-t') {
      const target = args.shift();
      if (!target) {
        throw new Error('Missing value for --target.');
      }
      options.target = path.resolve(currentDir, target);
      continue;
    }

    if (arg.startsWith('--target=')) {
      options.target = path.resolve(currentDir, arg.slice('--target='.length));
      continue;
    }

    if (arg === '--agent' || arg === '--agents' || arg === '--adapter' || arg === '--adapters' || arg === '--model' || arg === '--models') {
      const agentList = args.shift();
      if (!agentList) {
        throw new Error(`Missing value for ${arg}.`);
      }
      options.agents.push(...parseAgentList(agentList));
      continue;
    }

    if (arg.startsWith('--agent=')) {
      options.agents.push(...parseAgentList(arg.slice('--agent='.length)));
      continue;
    }

    if (arg.startsWith('--agents=')) {
      options.agents.push(...parseAgentList(arg.slice('--agents='.length)));
      continue;
    }

    if (arg.startsWith('--adapter=')) {
      options.agents.push(...parseAgentList(arg.slice('--adapter='.length)));
      continue;
    }

    if (arg.startsWith('--adapters=')) {
      options.agents.push(...parseAgentList(arg.slice('--adapters='.length)));
      continue;
    }

    if (arg.startsWith('--model=')) {
      options.agents.push(...parseAgentList(arg.slice('--model='.length)));
      continue;
    }

    if (arg.startsWith('--models=')) {
      options.agents.push(...parseAgentList(arg.slice('--models='.length)));
      continue;
    }

    positionals.push(arg);
  }

  return { positionals, options };
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyFile(source, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(source, dest);
}

function copyDir(sourceDir, destDir) {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source directory does not exist: ${sourceDir}`);
  }

  ensureDir(destDir);

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const source = path.join(sourceDir, entry.name);
    const dest = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyDir(source, dest);
      continue;
    }

    if (entry.isFile()) {
      copyFile(source, dest);
    }
  }
}

function copyRules(targetRoot) {
  const standardsRoot = path.join(targetRoot, installedRulesDirName);

  for (const dir of ruleDirs) {
    copyDir(path.join(packageRoot, dir), path.join(standardsRoot, dir));
  }

  return standardsRoot;
}

function compileTemplate(templateRelativePath, standardsRoot) {
  const templatePath = path.join(packageRoot, templateRelativePath);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Adapter template does not exist: ${templateRelativePath}`);
  }

  const prefix = normalizeSlash(standardsRoot);
  const content = fs.readFileSync(templatePath, 'utf8');

  return content.replace(/`(core|domains)\/([\w-]+\.md)`/g, (_, folder, file) => {
    return `\`${prefix}/${folder}/${file}\``;
  });
}

function getAvailableAgentNames(adapters) {
  const availableAdapterNames = new Set(adapters.map((adapter) => adapter.name));

  return agentNames.filter((agentName) => {
    return agentAliases[agentName].some((adapterName) => availableAdapterNames.has(adapterName));
  });
}

function selectAdapters(adapters, requestedAgents, scopeLabel) {
  const requested = [...new Set(requestedAgents.flatMap(parseAgentList))];

  if (requested.length === 0) {
    return adapters;
  }

  const availableAdapterNames = new Set(adapters.map((adapter) => adapter.name));
  const selectedAdapterNames = new Set();

  for (const agentName of requested) {
    const adapterNames = agentAliases[agentName];

    if (!adapterNames) {
      throw new Error(`Unknown Agent: ${agentName}. Supported: ${agentNames.join(', ')}`);
    }

    const matchedAdapterNames = adapterNames.filter((adapterName) => availableAdapterNames.has(adapterName));

    if (matchedAdapterNames.length === 0) {
      throw new Error(`${scopeLabel} does not support Agent: ${agentName}. Available: ${getAvailableAgentNames(adapters).join(', ')}`);
    }

    for (const adapterName of matchedAdapterNames) {
      selectedAdapterNames.add(adapterName);
    }
  }

  return adapters.filter((adapter) => selectedAdapterNames.has(adapter.name));
}

function writeAdapter(adapter, dest, standardsRoot, force) {
  if (fs.existsSync(dest) && !force) {
    return { status: 'skipped', adapter, dest };
  }

  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, compileTemplate(adapter.template, standardsRoot), 'utf8');

  return { status: 'written', adapter, dest };
}

function installProject(options, requestedAgents = []) {
  const targetRoot = path.resolve(options.target);
  const standardsRoot = copyRules(targetRoot);
  const selectedAdapters = selectAdapters(projectAdapters, [...options.agents, ...requestedAgents], 'project');
  const results = selectedAdapters.map((adapter) => {
    return writeAdapter(adapter, path.join(targetRoot, adapter.dest), installedRulesDirName, options.force);
  });

  printInstallResult('Project-level rules installed', standardsRoot, results);
}

function installGlobal(options, requestedAgents = []) {
  const standardsRoot = copyRules(homeDir);
  const selectedAdapters = selectAdapters(globalAdapters, [...options.agents, ...requestedAgents], 'global');
  const results = selectedAdapters.map((adapter) => {
    return writeAdapter(adapter, adapter.dest, standardsRoot, options.force);
  });

  printInstallResult('Global rules installed', standardsRoot, results);
}

function syncProject(options) {
  const targetRoot = path.resolve(options.target);
  const standardsRoot = copyRules(targetRoot);
  console.log(`Project-level rule files synced: ${standardsRoot}`);
}

function syncGlobal() {
  const standardsRoot = copyRules(homeDir);
  console.log(`Global rule files synced: ${standardsRoot}`);
}

function printInstallResult(title, standardsRoot, results) {
  console.log(`✅ ${title}`);
  console.log(`Rule files: ${standardsRoot}`);
  console.log('Entry files:');

  for (const result of results) {
    const status = result.status === 'written' ? 'written' : 'skipped';
    console.log(`- ${status} ${result.adapter.label}: ${result.dest}`);
  }

  const skipped = results.filter((result) => result.status === 'skipped');
  if (skipped.length > 0) {
    console.log('Existing entries were skipped; use --force to overwrite.');
  }
}

function listRules() {
  console.log('Available rules:');

  for (const dir of ruleDirs) {
    const dirPath = path.join(packageRoot, dir);
    for (const file of fs.readdirSync(dirPath).filter((name) => name.endsWith('.md')).sort()) {
      console.log(`- ${dir}/${file}`);
    }
  }

  console.log('\nAvailable adapters:');
  for (const adapter of projectAdapters) {
    console.log(`- project:${adapter.name} -> ${adapter.dest}`);
  }
  for (const adapter of globalAdapters) {
    console.log(`- global:${adapter.name} -> ${adapter.dest}`);
  }
}

function showRule(rulePath) {
  if (!rulePath || !/^(core|domains)\/[\w-]+\.md$/.test(rulePath)) {
    throw new Error('Please specify a rule path, e.g.: ai-rules show core/scope.md');
  }

  const fullPath = path.join(packageRoot, rulePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Rule does not exist: ${rulePath}`);
  }

  console.log(fs.readFileSync(fullPath, 'utf8'));
}

function checkExists(label, targetPath) {
  const status = fs.existsSync(targetPath) ? 'found' : 'missing';
  console.log(`- ${label}: ${status} ${targetPath}`);
}

function doctor(options) {
  const targetRoot = path.resolve(options.target);
  const projectStandardsRoot = path.join(targetRoot, installedRulesDirName);
  const globalStandardsRoot = path.join(homeDir, installedRulesDirName);

  console.log('AI Coding Standards Doctor\n');

  console.log('Project:');
  checkExists('rules', projectStandardsRoot);
  for (const adapter of projectAdapters) {
    checkExists(adapter.label, path.join(targetRoot, adapter.dest));
  }

  console.log('\nGlobal:');
  checkExists('rules', globalStandardsRoot);
  for (const adapter of globalAdapters) {
    checkExists(adapter.label, adapter.dest);
  }
}

function printHelp() {
  console.log(`AI Coding Standards Toolkit v${getVersion()}

Usage:
  ai-rules install project [agent...] [--target .] [--force]
  ai-rules install global [agent...] [--force]
  ai-rules install all [agent...] [--target .] [--force]
  ai-rules install project --agent cursor,claude [--target .]
  ai-rules install project --model gemini [--target .]
  ai-rules sync project [--target .]
  ai-rules sync global
  ai-rules sync all [--target .]
  ai-rules doctor [--target .]
  ai-rules list
  ai-rules show core/scope.md
  ai-rules --version

Supported Agents:
  cursor, opencode, claude, gemini, copilot, windsurf

Notes:
  install project   Copies rule files to the target project's .ai-coding-standards/ and writes entry files for the specified Agents.
  install global    Copies rule files to the user home .ai-coding-standards/ and writes entry files for the specified Agents.
  When no Agent is specified, all entries for the current scope are installed by default.
  sync              Syncs rule files only, without overwriting entry files.
  --force           Allows overwriting of existing entry files.`);
}

function normalizeLegacyCommand(positionals) {
  const [command] = positionals;

  if (!command) {
    return ['help'];
  }

  if (command === 'cursor') {
    return ['install', 'project', 'cursor'];
  }

  if (command === 'global') {
    return ['install', 'global'];
  }

  if (command === 'all') {
    return ['install', 'all'];
  }

  return positionals;
}

function normalizeScope(scope) {
  const aliases = {
    'cursor-project': 'project',
    'cursor-user': 'global',
    opencode: 'project'
  };

  return aliases[scope] || scope;
}

function getLegacyInstallAgents(rawScope) {
  const aliases = {
    'cursor-project': ['cursor'],
    'cursor-user': ['cursor'],
    opencode: ['opencode']
  };

  return aliases[rawScope] || [];
}

function run(positionals, options) {
  const [command, rawScope, ...positionAgentArgs] = normalizeLegacyCommand(positionals);
  const scope = normalizeScope(rawScope);
  const requestedAgents = [...getLegacyInstallAgents(rawScope), ...positionAgentArgs];

  if (command === '--version' || command === '-v' || command === 'version') {
    console.log(getVersion());
    return;
  }

  if (command === '--help' || command === '-h' || command === 'help') {
    printHelp();
    return;
  }

  if (command === 'list') {
    listRules();
    return;
  }

  if (command === 'show') {
    showRule(scope);
    return;
  }

  if (command === 'doctor') {
    doctor(options);
    return;
  }

  if (command === 'install') {
    if (scope === 'project') {
      installProject(options, requestedAgents);
      return;
    }

    if (scope === 'global') {
      installGlobal(options, requestedAgents);
      return;
    }

    if (scope === 'all') {
      selectAdapters(projectAdapters, [...options.agents, ...requestedAgents], 'project');
      selectAdapters(globalAdapters, [...options.agents, ...requestedAgents], 'global');
      installProject(options, requestedAgents);
      installGlobal(options, requestedAgents);
      return;
    }

    throw new Error('install only supports project, global, all.');
  }

  if (command === 'sync') {
    if (!scope || scope === 'project') {
      syncProject(options);
      return;
    }

    if (scope === 'global') {
      syncGlobal();
      return;
    }

    if (scope === 'all') {
      syncProject(options);
      syncGlobal();
      return;
    }

    throw new Error('sync only supports project, global, all.');
  }

  if (requestedAgents.length > 0) {
    throw new Error(`Unrecognized argument: ${requestedAgents.join(' ')}`);
  }

  throw new Error(`Unrecognized command: ${positionals.join(' ')}`);
}

try {
  const { positionals, options } = parseArgs(process.argv.slice(2));
  run(positionals, options);
} catch (error) {
  console.error(`❌ ${error.message}`);
  console.error('Run ai-rules --help to see usage.');
  process.exitCode = 1;
}