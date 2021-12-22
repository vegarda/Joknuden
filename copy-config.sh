#!/usr/bin/env sh


DOMAIN_NAME="joknuden.no";

CREATE_SYMLINK_COMMAND="ln -sf $PWD/dist/ /var/www/$DOMAIN_NAME";
echo $CREATE_SYMLINK_COMMAND;
eval $CREATE_SYMLINK_COMMAND;
