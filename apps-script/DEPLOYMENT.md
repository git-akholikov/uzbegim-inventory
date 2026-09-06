# Deploy the prototype with Google Apps Script

This deployment displays the prototype as a Google Apps Script web app. It does not yet connect the sample data to Google Sheets.

## Create the Apps Script project

1. Go to https://script.google.com/ and sign in.
2. Select **New project**.
3. Rename the project to `Uzbegim Warehouse Prototype`.
4. Replace the default `Code.gs` contents with `apps-script/Code.gs` from this repo.
5. Select **Add a file > HTML** and name it `Index`.
6. Replace its contents with this repo's `index.html`.
7. Save the project.

`apps-script/appsscript.json` is included for source-controlled development. It is not required for the first manual prototype deployment.

## Deploy as a web app

1. Select **Deploy > New deployment**.
2. Choose **Web app**.
3. Add the description `Warehouse prototype`.
4. For **Execute as**, select yourself for this prototype.
5. Choose the narrowest access option that includes the intended testers.
6. Select **Deploy** and approve the requested permissions.
7. Open the generated web-app URL on a computer and phone.

## After making changes

Save the files, select **Deploy > Manage deployments**, edit the existing deployment, create a new version, and deploy it. Test the deployment URL again.

## Security note

Do not use this sample-data version as the production warehouse database. Real deployment requires server-side authorization, validated writes, transaction locking, audit records, and a defined Google Sheets structure.
