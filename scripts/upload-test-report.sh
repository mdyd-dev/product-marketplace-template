set -eu

UPLOAD_HOST=https://tests.qa0.oregon.platformos.com
UPLOAD_PATH=api/app_builder/marketplace_releases/sync

REPORT_PATH=$(echo $MPKIT_URL | cut -d'/' -f3)/$(date +'%Y-%m-%d-%H-%M-%S')

curl -sSf -XPUT $UPLOAD_HOST/$UPLOAD_PATH -H "Authorization: Token $MPKIT_TOKEN" \
  -F "marketplace_builder_file_body=@test-report.html" \
  -F "path=app/views/pages/$REPORT_PATH/index.liquid" \
  -o /dev/null

echo test report uploaded: $UPLOAD_HOST/$REPORT_PATH
