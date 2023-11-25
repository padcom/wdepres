#!/usr/bin/env node

import { join, resolve } from 'node:path'
import { program } from 'commander'
import printTree from 'print-tree'
import { deps } from './index.mjs'

async function main(path, { project, workspace }) {
  const result = await deps(path)

  const root = (
    project
    ? [result.find(prj => prj.package.name === project)]
    : workspace
      ? [result.find(prj => resolve(prj.path) === resolve(join(path, workspace)))]
      : result
  ).filter(x => x)

  printTree(
    { package: { name: path, workspaceDependencies: root } },
    node => node?.package?.name + (node?.package?.version ? `@${node?.package?.version}` : '') || '',
    node => node?.package?.workspaceDependencies || [],
  )
}

program
  .argument('[path]', 'Path to workspace root', '.')
  .option('-p, --project <name>', 'Optional project name to resolve dependencies for')
  .option('-w, --workspace <name>', 'Optional workspace path to resolve dependencies for')
  .action(main)
  .parse(process.argv)
