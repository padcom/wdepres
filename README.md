# `wdepres` - Workspace Dependency Resolver

This small package has just one purpose: resolve inter-project dependencies between workspace projects

I have tried really hard to find some documentation as to how to do it directly with NPM but there is nothing. While writing the [mrdr](https://npmjs.com/package/mrdr) I was in dire need to get the tree of dependent projects so that `mrdr` knows which projects to run first.

Since that capability was not present I created one and now it is available to you too, if you need it.

## Command-line interface

The application can be started directly using npx:

```
Usage: npx wdepres@latest [options] [path]

Arguments:
  path                    Path to workspace root (default: ".")

Options:
  -p, --project <name>    Optional project name to resolve dependencies for
  -w, --workspace <name>  Optional workspace path to resolve dependencies for
  -h, --help              display help for command
```

## API

There is one function exported from this library, called `deps`. It takes as an argument path to the root of a workspace and produces an array of resolved workspaces.

The returned list of objects contain:

- `path: string` - path to the workspace package
- `filename: string` - filename (including `path`) to `package.json` of the workspace package
- `package: Workspace` - a workspace package object containing all of the contents of package's `package.json` plus `workspaceDependencies` - a concatenated list of all `*Dependencies` keys resolved to a Workspace object
