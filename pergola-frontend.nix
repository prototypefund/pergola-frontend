{ pkgs }:
let
  nodeDependencies = (pkgs.callPackage ./nix/default.nix {}).shell.nodeDependencies;
in
pkgs.stdenv.mkDerivation {
  name = "pergola-frontend";
  src = ./.;
  buildInputs = with pkgs; [nodejs];
  buildPhase = ''
    ln -s ${nodeDependencies}/lib/node_modules ./node_modules
    export PATH="${nodeDependencies}/bin:$PATH"

    npm rebuild node-sass
    npm run build-prod 

    cp build/build.js $out/
  '';
}
