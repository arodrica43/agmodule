#!/bin/bash
# A sample Bash script, by Ryan
to=~/Documentos/feina/dev/deploy/gamification-app/
cp -r agmodule $to
cp db.sqlite3 $to
cp LICENSE $to
cp -r media $to
cp requirements.txt $to
cp -r apps $to
cp favicon.ico $to
cp manage.py $to
cp README.md $to
cp -r static $to
cp -r .gitignore $to
cp -r Procfile $to
cd ~/Documentos/feina/dev/deploy/gamification-app/
#Replace https://agmodule.herokuapp.com/ domain by <EC2> domain
#grep -rl https://agmodule.herokuapp.com/ . | xargs sed -i 's/https:\/\/agmodule.herokuapp.com\//<EC2>/g'
echo "+ Gamification-App local dir updated"
git status
git pull
git add .
git commit -m "Automatic Production Deploy"
git push origin master
echo "+ Gamification-App GitLab updated"