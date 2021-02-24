{ pkgs ? import <nixpkgs> {config.android_sdk.accept_license = true;},
  ANDROID_SDK_ROOT ? "/tmp/sdk"
}:
let
  androidSdk = pkgs.androidenv.androidPkgs_9_0.androidsdk;
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    ## for android
    openjdk8 gradle
    apktool
    androidSdk glibc

    ## for cordova
    nodejs-14_x
  ];

  ANDROID_SDK_ROOT_RO = "${androidSdk}/libexec/android-sdk";

  # override the aapt2 that gradle uses with the nix-shipped version
  GRADLE_OPTS = "-Dorg.gradle.project.android.aapt2FromMavenOverride=${ANDROID_SDK_ROOT}/build-tools/30.0.3/aapt2";

  shellHook = ''
    [ "$CIRCLECI" = "true" ] && set -euxo pipefail

    export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT}"
    [ -d $ANDROID_SDK_ROOT ] && rm -r $ANDROID_SDK_ROOT
    cp -rL $ANDROID_SDK_ROOT_RO $ANDROID_SDK_ROOT
    chmod -R a+w $ANDROID_SDK_ROOT

    npx yarn
    (cd cordova && npm i)
    [ -d cordova/www ] || mkdir cordova/www
    [ -d cordova/platforms ] && echo 'You might want delete ./cordova/platforms'
    [ -d cordova/platforms/android ] || (cd cordova && npx cordova platform add android)
    [ -d cordova/plugins ] && echo 'You might want delete ./cordova/plugins'
    [ -d cordova/plugins/cordova-plugin-inappbrowser ] || (cd cordova && npx cordova plugin add cordova-plugin-inappbrowser)
    [ -d cordova/plugins/cordova-plugin-whitelist ] || (cd cordova && npx cordova plugin add cordova plugin add cordova-plugin-whitelist)

    echo 'You should be able to build the apk:'
    echo '> (cd cordova && npx cordova build android)'
    echo 'The full build is started by:'
    echo '> npx yarn run build-prod-cordova-android'

    ENV=''${ENV:-live}
    set -o allexport && source .circleci/$ENV.env
  '';
}
