# angelscripts-update-deps

Updates package.json (dev)depdencies using `npm` command line under the hood.

## setup

    $ cd myproject
    $ npm install git@github.com:outbounder/angelscripts-update-deps.git

## usage

    $ angel update deps

    not wanted, will update  0.0.1   organic-dna-fsloader 
    not latest, will update  0.0.2   organic-dna-fsloader 
    do you accept? [y,Y] y

    organic-dna-fsloader@0.0.1 node_modules/organic-dna-fsloader
    ├── organic-dna-branches@0.0.1
    └── glob@4.0.5 (once@1.3.0, inherits@2.0.1, graceful-fs@3.0.2, minimatch@1.0.0)
    organic-dna-fsloader@0.0.2 node_modules/organic-dna-fsloader
    └── glob@4.0.5 (once@1.3.0, inherits@2.0.1, graceful-fs@3.0.2, minimatch@1.0.0)
    updating 2 dep(s) done.