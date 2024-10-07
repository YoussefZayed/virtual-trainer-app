{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
  };

  outputs =
    { systems, nixpkgs, ... }@inputs:
    let
      eachSystem = f: nixpkgs.lib.genAttrs (import systems) (system: f nixpkgs.legacyPackages.${system});


    in
    {
      devShells = eachSystem (pkgs: {
        default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs
            pkgs.docker
            pkgs.docker-compose
            pkgs.nodePackages.node2nix
            pkgs.fish
            # You can set the major version of Node.js to a specific one instead
            # of the default version
            # pkgs.nodejs-22_x

            # It is possible to use bun instead of node.
            # pkgs.bun

            # Optionally, you can add yarn or pnpm for package management for node.
            pkgs.nodePackages.pnpm
            pkgs.yarn

            pkgs.nodePackages.typescript
            pkgs.nodePackages.typescript-language-server
            pkgs.postgresql_16
          ];

          shellHook = ''
            export PNPM_HOME="/media/teamdisk/projects/pnpm"
            case ":$PATH:" in
            *":$PNPM_HOME:"*) ;;
            *) export PATH="$PNPM_HOME:$PATH" ;;
            esac

            export DATABASE_URL=postgresql://postgres:postgres@localhost:6500/virtual_trainer_db
            export JWT_SECRET=your_jwt_secret_key
            export GOOGLE_CLIENT_ID=your_google_client_id
            export GOOGLE_CLIENT_SECRET=your_google_client_secret
            export STRIPE_SECRET_KEY=your_stripe_secret_key
          
          '';

        };
      });
    };
}
