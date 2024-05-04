vercel --prod >deployment-url.txt 2>error.txt
 
code=$?
if [ $code -eq 0 ]; then
    deploymentUrl=`cat deployment-url.txt`
    echo $deploymentUrl
else
    errorMessage=`cat error.txt`
    echo "There was an error: $errorMessage"
fi