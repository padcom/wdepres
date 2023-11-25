#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { glob } from 'glob'

async function parse(source) {
  if (typeof source === 'string') {
    return JSON.parse(source)
  } else if (source instanceof Buffer) {
    return JSON.parse(source.toString())
  } else {
    throw new Error('Unknown type of source')
  }
}

async function read(filename) {
  return parse(await readFile(filename))
}

function resolve(dependencies, packages) {
  return dependencies.map(dependency => packages.find(pkg => pkg.package.name === dependency) || dependency)
}

export async function deps(workspace) {
  const root = await read(join(workspace, 'package.json'))

  const workspaces = (await Promise.all((root.workspaces || [])
    .flatMap(pattern => glob(pattern, { cwd: workspace }))))
    .flat()
    .map(path => join(workspace, path)
  )

  const packages = await Promise.all(workspaces
    .map(workspace => ({
      path: workspace,
      filename: join(workspace, 'package.json'),
    }))
    .filter(({ path, filename }) => existsSync(filename))
    .map(async ({ path, filename }) => ({
      path,
      filename,
      package: await read(filename),
    }))
  )

  const isResolved = entry => typeof entry !== 'string'

  return [...packages]
    .map((workspace, idx, list) => {
      workspace.package.dependencies = resolve(Object.keys(workspace.package.dependencies || {}), list)
      workspace.package.devDependencies = resolve(Object.keys(workspace.package.devDependencies || {}), list)
      workspace.package.peerDependencies = resolve(Object.keys(workspace.package.peerDependencies || {}), list)
      workspace.package.bundledDependencies = resolve(Object.keys(workspace.package.bundledDependencies || {}), list)
      workspace.package.optionalDependencies = resolve(Object.keys(workspace.package.optionalDependencies || {}), list)
      workspace.package.extensionDependencies = resolve(Object.keys(workspace.package.extensionDependencies || {}), list)

      return workspace
    })
    .map(workspace => {
      workspace.package.workspaceDependencies = [
        ...workspace.package.dependencies,
        ...workspace.package.devDependencies,
        ...workspace.package.peerDependencies,
        ...workspace.package.bundledDependencies,
        ...workspace.package.optionalDependencies,
        ...workspace.package.extensionDependencies,
      ].filter(isResolved)

      return workspace
    })
}
