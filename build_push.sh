
PASSWORD=$1

make password=$PASSWORD login
make stage=prod build
make stage=prod push

