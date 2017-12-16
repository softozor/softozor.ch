#! /bin/bash

npm run build

scp -r dist/* michella@softozor.ch:~/www/www.softozor.ch/

