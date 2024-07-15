for y in 2021 2022 2023 2024; do
    for m in 01 02 03 04 05 06 07 08 09 10 11 12; do
        for d in 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31; do
            mkdir -p mongodb-dumps/"${y}-${m}-${d}"__1234
            mkdir -p mongodb-dumps/"${y}-${m}-${d}"__2222
        done
    done
done
