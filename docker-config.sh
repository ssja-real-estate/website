#!/bin/sh

DOCKER_USERNAME=""
if [ -z ${2+x} ];
then DOCKER_USERNAME="";
else DOCKER_USERNAME="$2/";
fi

APP_NAME=`jq -rM .name package.json`
VERSION=`jq -rM .version package.json`
PORT=3000



case ${1:-'tag'} in
	tag)
		echo "$DOCKER_USERNAME$APP_NAME:$VERSION"
		break
		;;
	name)
		echo $APP_NAME
		break
		;;
	port)
		echo $PORT
		break
		;;
esac	

	

	
