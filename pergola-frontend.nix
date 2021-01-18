{ pkgs ? import <nixpkgs> {}, lib ? pkgs.stdenv.lib }:
let
  nodeDependencies = (pkgs.callPackage ./nix/default.nix {}).package;
  #nodeDependencies = (pkgs.callPackage ./nix/default.nix {}).shell.nodeDependencies;
  ## when using supplement.json, you get the additional paths like this:
  #buildInputs = lib.lists.sublist 1 10 (pkgs.callPackage ./nix/default.nix {}).package.buildInputs;
  #buildInputs_node_path = lib.strings.makeSearchPathOutput "" "lib/node_modules" buildInputs;
in
pkgs.stdenv.mkDerivation {
  name = "pergola-frontend";
  src = ./.;
  buildInputs = with pkgs; [
    nodejs
    python2  ## required by gyp
    coreutils  ## required by cross-env
  ];
  buildPhase = ''
    ln -s ${nodeDependencies}/lib/node_modules ./node_modules

    npm rebuild node-sass

    test -d ./src/stories && rm -r ./src/stories

    NODE_ENV=production node ./build/build.js


    ls /usr/bin || echo '/usr/bin doesnt exist'

    npm run build-prod || echo 'todo'

    #SKIP_PREFLIGHT_CHECK=true npm run dev


    cp build/build.js $out/
  '';
}
