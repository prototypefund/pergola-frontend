We don't want node2nix to do the pinpointing itself, but instead use the existing lockfile (much faster and ensures we have the same versions like when developing without nix). This requires translating the `yarn.lock` into a `package-lock.json`:

```
synp -s yarn.lock -f
npm i  ## ensure the package-lock.json is valid and up to date
```

Since the recursive `devDependencies` of our `dependencies` are cyclic, we can not use `node2nix --development`.
For still including the `devDependencies` in the `node_modules` with all required recursive `dependencies`, but not their `devDependencies`, we provide the `devDependencies` via `supplement.json`:

```
jq '.devDependencies | to_entries | map({(.key): .value})' package.json > supplement.json
```

Finally we can generate the lockfiles used by nix:

```
node2nix -l package-lock.json --supplement-input supplement.json --strip-optional-dependencies
```

Now we can open a reproducable build dev-shell for development:

```
nix-shell -A shell

> npm rebuild node-sass
> npm run dev
> npm run build-prod
```

## Optimization

Dependencies provided by `ǹode2nix --supplement-input` seem to be pinpointed without considering the lockfile.
For speedup, we could either fix this, or simply merge the `devDependencies` into `dependencies` by `jq`.

At he moment we use a single package for all the dependencies. Any little change in the code causes `nix-shell -A shell` to completely reavaluate everything. For quickly building a development shell, we want a build excluding the source directory.
To speedup the build, we should split the package into separate packages for each dependency and merge them into a top level only by setting the joined `NODE_PATH`.
