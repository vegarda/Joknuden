#!/usr/bin/env sh


DOMAIN_NAME="joknuden.no";

CREATE_SYMLINK_COMMAND="ln -sf $PWD/dist /var/www/$DOMAIN_NAME";
echo $CREATE_SYMLINK_COMMAND;
eval $CREATE_SYMLINK_COMMAND;



COPY_NGINX_CONFIG_COMMAND="cp -f $PWD/dist/joknuden.no.conf /etc/nginx/sites-enabled";
echo $COPY_NGINX_CONFIG_COMMAND;
eval $COPY_NGINX_CONFIG_COMMAND;


RELOAD_NGINX_COMMAND="sudo service nginx reload";
echo $RELOAD_NGINX_COMMAND;
eval $RELOAD_NGINX_COMMAND;
