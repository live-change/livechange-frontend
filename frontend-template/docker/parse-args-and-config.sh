VERSION=`echo "console.log(require('./package.json').version)" | node`
NAME=`echo "console.log(require('./package.json').name.split('/').pop())" | node`

DEPLOYMENT=${1:-dev}
echo "DEPLOYMENT=${DEPLOYMENT}"

PROJECT_NAME=${NAME}

if [ "$DEPLOYMENT" == "master" ]; then

fi
