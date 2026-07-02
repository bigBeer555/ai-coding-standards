#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const packageRoot = path.resolve(__dirname, '..')
const packageJson = require('../package.json')
const rulesInstallDir = '.ai-coding-standards'

const ruleFiles = [
  'core/scope.md',
  'core/coding.md',
  'core/comments.md',
  'core/decision.md',
  'core/review.md',
  'domains/vue.md',
  'domains/uniapp.md',
  'domains/react.md',
  'domains/performance.md',
  'domains/architecture.md',
  'domains/git.md',
  'domains/interview.md',
  'domains/output.md'
]

const adapters = {
  'cursor-project': {
    source: 'adapters/cursor/project-rules.md',
    target: '.cursor/rules/ai-coding-standards.mdc',
    description: 'Cursor 项目级规则入口',
    frontmatter: '---\ndescription: AI Coding Standards shared project rules\nalwaysApply: true\n---\n\n'
  },
  'cursor-user': {
    source: 'adapters/cursor/user-rules.md',
    target: 'cursor-user-rules.md',
    description: 'Cursor 用户级规则入口'
  },
  opencode: {
    source: 'adapters/opencode/AGENTS.md',
    target: 'AGENTS.md',
    description: 'OpenCode Agent 规则入口'
  }
}

function printHelp() {
  console.log(`AI Coding Standards CLI

Usage:
  ai-rules list
  ai-rules show <rule-or-adapter-path>
  ai-rules install <adapter> [--target <dir>] [--force]
  ai-rules --version

Adapters:
  cursor-project   安装入口到目标项目 .cursor/rules/ai-coding-standards.mdc
  cursor-user      生成 cursor-user-rules.md，手动复制到 Cursor User Rules
  opencode         安装入口到目标项目 AGENTS.md

说明:
  规则正文会安装到目标项目 .ai-coding-standards/，避免覆盖业务项目的 core/ 或 domains/ 目录。

Examples:
  ai-rules list
  ai-rules show core/scope.md
  ai-rules show adapters/opencode/AGENTS.md
  ai-rules install cursor-project --target .
  ai-rules install opencode --target . --force`)
}

function parseOptions(args) {
  const options = {
    target: process.cwd(),
    force: false,
    values: []
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--force') {
      options.force = true
      continue
    }

    if (arg === '--target') {
      const target = args[index + 1]

      if (!target) {
        fail('缺少 --target 参数值')
      }

      options.target = path.resolve(process.cwd(), target)
      index += 1
      continue
    }

    options.values.push(arg)
  }

  return options
}

function fail(message) {
  console.error(`Error: ${message}`)
  process.exit(1)
}

function resolvePackagePath(relativePath) {
  const fullPath = path.resolve(packageRoot, relativePath)
  const isPackageRoot = fullPath === packageRoot
  const isInsidePackageRoot = fullPath.startsWith(`${packageRoot}${path.sep}`)

  if (!isPackageRoot && !isInsidePackageRoot) {
    fail('路径超出规则包范围')
  }

  return fullPath
}

function readPackageFile(relativePath) {
  const fullPath = resolvePackagePath(relativePath)

  if (!fs.existsSync(fullPath)) {
    fail(`文件不存在：${relativePath}`)
  }

  return fs.readFileSync(fullPath, 'utf8')
}

function copyDirectory(sourceDir, targetDir, force) {
  fs.mkdirSync(targetDir, { recursive: true })

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name)
    const targetPath = path.join(targetDir, entry.name)

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath, force)
      continue
    }

    ensureWritable(targetPath, force)
    fs.copyFileSync(sourcePath, targetPath)
  }
}

function ensureWritable(targetPath, force) {
  if (!fs.existsSync(targetPath)) {
    return
  }

  if (force) {
    return
  }

  fail(`目标文件已存在：${targetPath}。如需覆盖，请添加 --force`)
}

function listRules() {
  console.log('Rules:')
  for (const ruleFile of ruleFiles) {
    console.log(`  - ${ruleFile}`)
  }

  console.log('\nAdapters:')
  for (const adapterName of Object.keys(adapters)) {
    console.log(`  - ${adapterName}: ${adapters[adapterName].description}`)
  }
}

function showFile(relativePath) {
  console.log(readPackageFile(relativePath))
}

function installAdapter(adapterName, options) {
  const adapter = adapters[adapterName]

  if (!adapter) {
    fail(`未知适配器：${adapterName}`)
  }

  const targetRoot = options.target
  const targetRulesRoot = path.join(targetRoot, rulesInstallDir)
  const targetCore = path.join(targetRulesRoot, 'core')
  const targetDomains = path.join(targetRulesRoot, 'domains')
  const targetAdapter = path.join(targetRoot, adapter.target)
  const adapterBody = readPackageFile(adapter.source).replace(/`(core|domains)\//g, `\`${rulesInstallDir}/$1/`)
  const adapterContent = `${adapter.frontmatter || ''}${adapterBody}`

  fs.mkdirSync(path.dirname(targetAdapter), { recursive: true })
  ensureWritable(targetAdapter, options.force)

  copyDirectory(resolvePackagePath('core'), targetCore, options.force)
  copyDirectory(resolvePackagePath('domains'), targetDomains, options.force)
  fs.writeFileSync(targetAdapter, adapterContent)

  console.log(`已安装 ${adapterName}`)
  console.log(`规则目录：${targetRulesRoot}`)
  console.log(`入口文件：${targetAdapter}`)
}

function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (!command || command === '--help' || command === '-h') {
    printHelp()
    return
  }

  if (command === '--version' || command === '-v' || command === 'version') {
    console.log(packageJson.version)
    return
  }

  if (command === 'list') {
    listRules()
    return
  }

  if (command === 'show') {
    const filePath = args[1]

    if (!filePath) {
      fail('缺少要查看的规则文件路径')
    }

    showFile(filePath)
    return
  }

  if (command === 'install') {
    const options = parseOptions(args.slice(1))
    const adapterName = options.values[0]

    if (!adapterName) {
      fail('缺少适配器名称')
    }

    installAdapter(adapterName, options)
    return
  }

  fail(`未知命令：${command}`)
}

main()