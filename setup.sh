mongo --eval "db.stats()"

IsMongoRunning=$?   # returns 0 if mongo eval succeeds

if [ $IsMongoRunning -ne 0 ]; then
    echo "mongodb not running"
    exit 1
else
    echo "mongodb running!"
fi

echo "Installing code-server npm modules."
cd src/code-server
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

echo "Creating docker base image"
cd ../../../Dockerfiles/base
sudo docker build -t code-execution.base .

echo "Creating docker php image"
cd ../php
sudo docker build -t code-execution.php .

echo "Ensuring docker php image created successfully"
IsCodeExecutionPhpCreated="$(sudo docker images | grep code-execution.php | wc -l)"

if [ $IsCodeExecutionPhpCreated -ne 1 ]; then
    echo "the docker image for php hasn't been created"
    exit 1
else
    echo "the docker image for php has been created!"
fi
