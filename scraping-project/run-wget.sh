#!/bin/sh

mkdir -p ./out

wget --recursive --level=3 --wait=1 --page-requisites --no-check-certificate \
    --random-wait --timestamping \
    --directory-prefix out \
    -o ./out/wget.log \
    http://localhost:5173/

grep "Not Found" ./out/wget.log
