#!/bin/zsh

echo -n "Password: "
IFS= read -s -r password
echo "\n"

salt=$(openssl rand -hex 16)

command=$(cat <<'EOF'
const crypto = require("crypto");
const password = process.argv[1];
const salt = Buffer.from(process.argv[2], "hex");
const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
console.log(hash)
EOF
)

hash=$(node -e "$command" -- "$password" "$salt")

echo "salt: $salt"
echo "hash: $hash"
