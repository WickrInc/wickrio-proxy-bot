if [ -f "/usr/local/nvm/nvm.sh" ]; then
  . /usr/local/nvm/nvm.sh
  nvm use 18
fi

npm run transpile
rsync -r --exclude-from 'exclude-list.txt' . centos@172.22.36.163:/home/centos/containers/toren-ent-proxy-bot/clients/torenproxy_fdr8-gorilla.dev.secmv.net/integration/wickrio-broadcast-bot/
