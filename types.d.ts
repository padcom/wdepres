/** Workspace definition */
export interface Workspace {
  /** Path to workspace */
  path: string
  /** package.json location */
  filename: string
  /** package.json content */
  package: {
    /** Package name */
    name: string
    /** Package version */
    version?: string
    /** transitive dependencies */
    dependencies: (Workspace | string)[]
    /** dev dependencies */
    devDependencies: (Workspace | string)[]
    /** peer dependencies */
    peerDependencies: (Workspace | string)[]
    /** bundled dependencies */
    bundledDependencies: (Workspace | string)[]
    /** optional dependencies */
    optionalDependencies: (Workspace | string)[]
    /** extension dependencies */
    extensionDependencies: (Workspace | string)[]
    /** workspace dependencies */
    workspaceDependencies: Workspace[]
  }
}

/**
 * Resolve dependencies in workspace
 *
 * @param {String} workspace path to workspace
 * @returns {Promise<Workspace[]>} list of trees or tree (if pkg was specified) of resolved packages
 */
export function deps(workspace: string): Promise<Workspace[]>
