CONF="study-crud"

node src/run.js \
    -c ./configs/$CONF.js \
    -o ./dumps/tiny_$(date +%Y-%m-%d__%H%M)__$CONF
