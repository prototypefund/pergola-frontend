{
  description = "Build the frontend with nix";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs { system="x86_64-linux"; config.android_sdk.accept_license = true; };
  in
  rec {
    legacyPackages.x86_64-linux = {
      trivial = import ./nix/trivial/shell.nix { inherit pkgs; };
      trivial-android = import ./nix/trivial/android/shell.nix { inherit pkgs; };

      jq = pkgs.jq;
      node2nix = pkgs.nodePackages.node2nix;
      deploy = import ./nix/deploy.nix { inherit pkgs; };

      pergola-frontend-deps = import ./nix/override.nix { inherit pkgs; };
      pergola-frontend = import ./nix/default.nix { inherit pkgs; };
    };

    #defaultPackage.x86_64-linux = legacyPackages.x86_64-linux.pergola-frontend;
    defaultPackage.x86_64-linux = legacyPackages.x86_64-linux.trivial;
  };
}
