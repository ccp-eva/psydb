echo $1
for i in $(find * -maxdepth 0 -type d); do
    echo "START WHY $i";
    # parenthesis open subshell
    (cd $i; rush-pnpm why --color $1)
    echo "END WHY $i";
done

