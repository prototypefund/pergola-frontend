{ pkgs ? import <nixpkgs> {}, lib ? pkgs.stdenv.lib }:
let
  #nodeDependencies = (pkgs.callPackage ./nix/default.nix {}).shell.nodeDependencies;
  #args = (pkgs.callPackage ./nix/default.nix {}).args;
  buildInputs = lib.lists.sublist 1 10 (pkgs.callPackage ./nix/default.nix {}).package.buildInputs;  ## TODO
  buildInputs_node_path = lib.strings.makeSearchPathOutput "" "lib/node_modules" buildInputs;
in
pkgs.stdenv.mkDerivation {
  name = "pergola-frontend";
  src = ./.;
  buildInputs = with pkgs; [nodejs];
  buildPhase = ''
    ${#ln -s ${nodeDependencies}/lib/node_modules ./node_modules
    #export NODE_PATH="${nodeDependencies}/lib/node_modules:${buildInputs_node_path}"
    #export PATH="${nodeDependencies}/bin:$PATH"
    "ls"}
    echo ${buildInputs_node_path}
    echo $NODE_PATH

    echo "${builtins.toJSON buildInputs}"

    exit

    npm rebuild node-sass
    #npm rebuild sass-loader
    rm src/stories/
    npm run build-prod 

    #SKIP_PREFLIGHT_CHECK=true npm run dev

    cp build/build.js $out/
  '';
}
