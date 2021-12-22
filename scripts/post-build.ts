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
    listen [::]:80;

    listen 443 ssl;
    listen [::]:443 ssl;

    ssl_certificate /etc/letsencrypt/live/${ domainName }/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${ domainName }/privkey.pem;

    server_name ${ domainName } www.${ domainName };

    root /var/www/${ domainName };
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
`;

// console.log(nginxSiteFile);



const serviceFilePath = `${ distDirPath }/../${ nginxSiteFileName }`;
fs.writeFileSync(serviceFilePath, nginxSiteFile);

const copyServiceFilePath = `${ __dirname }/../copy-config.sh`;
fs.chmodSync(copyServiceFilePath, 0o665);
