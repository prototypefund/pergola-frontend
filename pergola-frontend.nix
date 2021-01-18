{ pkgs ? import <nixpkgs> {}, lib ? pkgs.stdenv.lib }:
let
  nodeDependencies = (pkgs.callPackage ./nix/default.nix {}).shell.nodeDependencies;
  ## when using supplement.json, you get the additional paths like this:
  #buildInputs = lib.lists.sublist 1 10 (pkgs.callPackage ./nix/default.nix {}).package.buildInputs;
  #buildInputs_node_path = lib.strings.makeSearchPathOutput "" "lib/node_modules" buildInputs;
in
pkgs.stdenv.mkDerivation {
  name = "pergola-frontend";
  src = ./.;
  buildInputs = with pkgs; [nodejs python2];
  buildPhase = ''
    ln -s ${nodeDependencies}/lib/node_modules ./node_modules

    echo 'SOOOOOOOOOOOOOOOOOOOOOOOOO :)'
    npm rebuild node-sass
    rm -r ./src/stories
    npm run build-prod 

    #SKIP_PREFLIGHT_CHECK=true npm run dev

    cp build/build.js $out/
  '';
}
