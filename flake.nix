{
  description = "Combined ecommerce and development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
    flake-utils.url = "github:numtide/flake-utils";
    android-nixpkgs.url = "github:tadfisher/android-nixpkgs";
  };

  outputs = { self, nixpkgs, systems, flake-utils, android-nixpkgs }:
    let
      eachSystem = f: nixpkgs.lib.genAttrs (import systems) (system: f system);
    in
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config = {
            android_sdk.accept_license = true;
            allowUnfree = true;
          };
        };

        pinnedJDK = pkgs.jdk17;
        androidBuildToolsVersion = "34.0.0";
        androidNdkVersion = "26.1.10909125";
        androidComposition = pkgs.androidenv.composeAndroidPackages {
          cmdLineToolsVersion = "8.0";
          toolsVersion = "26.1.1";
          platformToolsVersion = "34.0.4";
          buildToolsVersions = [ androidBuildToolsVersion "33.0.1" ];
          includeEmulator = false;
          emulatorVersion = "30.3.4";
          platformVersions = [ "34" ];
          includeSources = false;
          includeSystemImages = false;
          systemImageTypes = [ "google_apis_playstore" ];
          abiVersions = [ "armeabi-v7a" "arm64-v8a" ];
          cmakeVersions = [ "3.10.2" "3.22.1" ];
          includeNDK = true;
          ndkVersions = [ androidNdkVersion ];
          useGoogleAPIs = false;
          useGoogleTVAddOns = false;
          includeExtras = [
            "extras;google;gcm"
          ];
        };
        androidSdk = androidComposition.androidsdk;
      in
      {
        devShells = {
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              nodejs
              docker
              docker-compose
              nodePackages.node2nix
              fish
              nodePackages.pnpm
              yarn
              nodePackages.typescript
              nodePackages.typescript-language-server
              postgresql_16
              pinnedJDK
              androidSdk
              pkg-config
            ];

            shellHook = ''
              export PNPM_HOME="/media/teamdisk/projects/pnpm"
              case ":$PATH:" in
                *":$PNPM_HOME:"*) ;;
                *) export PATH="$PNPM_HOME:$PATH" ;;
              esac

              export LD_LIBRARY_PATH="${pkgs.libxml2.out}/lib:$LD_LIBRARY_PATH"
              export JAVA_HOME="${pinnedJDK}"
              export ANDROID_SDK_ROOT="${androidSdk}/libexec/android-sdk"
              export ANDROID_NDK_ROOT="$ANDROID_SDK_ROOT/ndk-bundle"
              export GRADLE_OPTS="-Dorg.gradle.project.android.aapt2FromMavenOverride=$ANDROID_SDK_ROOT/build-tools/${androidBuildToolsVersion}/aapt2"
            '';
          };
        };
      });
}
