import * as fs from 'fs';
import { execSync } from 'child_process';
import { exit } from 'process';


console.log('build.ts');

console.log('process.platform', process.platform);

if (process.platform === 'win32') {
    // exit();
}


const distDirPath = `${ __dirname }/../dist`;

const domainName = 'joknuden.no';

const nginxSiteFileName = `${ domainName }.conf`;

const nginxSiteFile = `

server {

    listen 80;

    server_name ${ domainName } www.${ domainName };

    return 301 https://${ domainName }$request_uri;

}

server {

    listen 443 ssl;

    ssl_certificate /etc/letsencrypt/live/${ domainName }/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${ domainName }/privkey.pem;

    server_name ${ domainName } www.${ domainName };

    root /var/www/${ domainName };
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://localhost:445/api;
    }

    location /ws {
        proxy_pass https://localhost:445/ws;
        #proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

}

`;

// console.log(nginxSiteFile);



const serviceFilePath = `${ distDirPath }/${ nginxSiteFileName }`;
console.log(serviceFilePath);
fs.writeFileSync(serviceFilePath, nginxSiteFile);

const copyServiceFilePath = `${ __dirname }/../copy-config.sh`;
fs.chmodSync(copyServiceFilePath, 0o775);
