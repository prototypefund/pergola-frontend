{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
  buildInputs = with pkgs; [ nodejs-14_x ];

  shellHook = ''
    [ -d ./node_modules ] && echo -e 'You might want delete ./node_modules first.\n'

    npx yarn && npm rebuild node-sass

    echo -e '\nFor a production build run:'
    echo '> npx yarn run build-prod'

    ## TODO load env-file depending on $ENV
    source .circleci/live.env
  '';
}
