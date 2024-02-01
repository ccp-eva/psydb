jq -s 'map([.dependencies, .devDependencies]) | transpose | map(add) | {dependencies: .[0], devDependencies: .[1]}' $(ls */package.json)

