{ pkgs ? import <nixpkgs> {config.android_sdk.accept_license = true;},
  ANDROID_SDK_ROOT ? "/tmp/sdk"
}:
let
  androidSdk = pkgs.androidenv.androidPkgs_9_0.androidsdk;
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    apktool gradle
    androidSdk glibc
  ];

  ANDROID_SDK_ROOT_RO = "${androidSdk}/libexec/android-sdk";

  # override the aapt2 that gradle uses with the nix-shipped version
  GRADLE_OPTS = "-Dorg.gradle.project.android.aapt2FromMavenOverride=${ANDROID_SDK_ROOT}/build-tools/30.0.3/aapt2";

  shellHook = ''
    export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT}"
    [ -d $ANDROID_SDK_ROOT ] && rm -r $ANDROID_SDK_ROOT
    cp -rL $ANDROID_SDK_ROOT_RO $ANDROID_SDK_ROOT
    chmod -R a+w $ANDROID_SDK_ROOT

    echo 'You should be able to build the apk:'
    echo '> (cd cordova && npx cordova build android)'
  '';
}
