### Requirements
- mongodb instance running
- EvE Online application key/secret

### Setup
- Update src/config/secureConfig with your
  - API key
  - API Secret
  - MongoDB path


### Updating static data files 
- `npm run update-static-data`

### Running locally for development
- `npm install`
- setup the test DB for local testing `run npm run setup-test-db`
- `npm run start:dev`
- Open http://localhost:8000/


###  Cronjobs
While using this serve, it's useful to have these two cronjobs running
- Delete all DB backs older than 10 day
- Delete all log files older than 5 days


### Running locally for production
- `npm install`
- `npm run build`

### Release a new version
Below are the commands used to deploy the app to production/staging.
```
#ssh to your server first, duh :)  
rm -rf ./projects/evefinance #or wherever you choose to depoy the app
git clone git@github.com:IamTheHttp/evefinance.git
cd evefinance #or wherever you choose to depoy the app
npm install
DEV_ENV=production npm run build:front
rm -rf /var/www/html/evefinance #or wherever you host your HTML files from
mkdir /var/www/html/evefinance  #or wherever you host your HTML files from

# Copy build files into your apache (or whatever server you use to host HTML)
cp -a ~/projects/evefinance/dist/. /var/www/html/evefinance
# Clean the logs (I preferred cleaning the logs after every deploy) 
rm ~/projects/evefinance/log.txt
# Brute force solution to kill the existing thread
# I was too lazy to do it in a more correct way.
killall -9 node
echo 'Starting server'
DEV_ENV=production npm run start:back /dev/null 2>&1 & disown	
```