mongo --eval "db.stats()"

IsMongoRunning=$?   # returns 0 if mongo eval succeeds

if [ $IsMongoRunning -ne 0 ]; then
    echo "mongodb not running"
    exit 1
else
    echo "mongodb running!"
fi

echo "Installing code-server npm modules."
cd code-server
npm install

echo "Installing code-worker npm modules."
cd ../code-worker
npm install

echo "Installing data npm modules."
cd ../data
npm install

echo "Installing frontend-server npm modules."
cd ../frontend-server
npm install

echo "Installing bower components."
cd ../frontend-server/static
bower install