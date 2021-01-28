{ pkgs }:
(pkgs.writeScriptBin "deploy" ''
  #!${pkgs.runtimeShell} -xe
  export PATH="${pkgs.stdenv.lib.makeBinPath (with pkgs; [github-release])}"

  [ -n "$GITHUB_TOKEN" ]

  export GITHUB_USER="$CIRCLE_PROJECT_USERNAME"
  export GITHUB_REPO="$CIRCLE_PROJECT_REPONAME"
  export TAG="''${CIRCLE_TAG:-$CIRCLE_BRANCH}"
  export RELEASE_NAME="''${CIRCLE_TAG:-$CIRCLE_SHA1}"

  export FILE="$1"
  export NAME="$2"

  github-release release -t $TAG -n $RELEASE_NAME
  github-release upload -t $TAG -f "$FILE" -n "$NAME"
'')
