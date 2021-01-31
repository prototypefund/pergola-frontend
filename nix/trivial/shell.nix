{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
  buildInputs = with pkgs; [ nodejs-14_x ];

  shellHook = ''
    [ -d node_modules ] && echo -e 'You might want delete ./node_modules first.\n'

    [ -d node_modules/node-sass ] && npm rebuild node-sass
    npx yarn

    echo -e '\nFor a production build run:'
    echo '> npx yarn run build-prod'

    ENV=''${ENV:-live}
    set -o allexport && source .circleci/$ENV.env
  '';
}
