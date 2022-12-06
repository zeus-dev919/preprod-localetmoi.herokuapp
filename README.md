# local-moi

> A Vue.js project
> Requirement : Node.js (>=8.x preferred), npm version 6+ and Git.

## Environment variables

 - LOCALETMOI_BASE_URL            -> Local & Moi base url
 - SESSION_TTL                    -> User session lifetime in seconds (optional, defaults to 3600) 
 - LOCALFR_API_BASE_URL           -> LOCALFR API base url
 - LOCALFR_API_TOKEN_ENDPOINT     -> LOCALFR API oauth token endpoint (optional, defaults to "/oauth/token")
 - AT_INTERNET_API_BASE_URL       -> AT Internet Smart Access API base url
 - AT_INTERNET_API_VERSION        -> AT Internet Smart Access API version (optional, defaults to "v2")
 - AT_INTERNET_API_FORMAT         -> AT Internet Smart Access API format (optional, defaults to "json")
 - AT_INTERNET_API_USERNAME       -> AT Internet Smart Access API login
 - AT_INTERNET_API_PASSWORD       -> AT Internet API password
 - AT_INTERNET_API2_BASE_URL      -> AT Internet Piano Analytics API url
 - AT_INTERNET_API2_USERNAME      -> AT Internet Piano Analytics API username
 - AT_INTERNET_API2_PASSWORD      -> AT Internet Piano Analytics API password
 - AT_INTERNET_API2_SITE_ID       -> AT Internet Piano Analytics API SiteId
 - AT_INTERNET_MIGRATION_DATE     -> AT Internet toggle date from old (Smart Access) to new (Piano Analytics) service (format: YYYY-MM-DD)
 - MANDRILL_BASE_URL              -> Mandrill API base url
 - MANDRILL_MAIL_FROM             -> Local & Moi mail sender address
 - MANDRILL_MAIL_RESET            -> Local & Moi reset password mail sender address
 - MANDRILL_MAIL_TO               -> Local & Moi billing infos receiver address
 - AMAZON_ACCESS_KEY_ID           -> AWS access key id
 - AMAZON_SECRET_ACCESS_KEY       -> AWS secret access key
 - S3_BUCKET                      -> AWS S3 bucket name
 - S3_REGION                      -> AWS S3 region
 - S3_FOLDER                      -> AWS S3 folder
 - SALESFORCE_AUDIENCE            -> Salesforce authentication audience
 - SALESFORCE_TOKEN_ENDPOINT      -> Salesforce token endpoint (optional, defaults to "/services/oauth2/token")
 - SALESFORCE_CLIENT_ID           -> Salesforce oauth2 client_id
 - SALESFORCE_CLIENT_SECRET       -> Salesforce oauth2 client_secret
 - SALESFORCE_PRIVATE_KEY         -> Salesfroce application private key for request signing
 - SALESFORCE_USERNAME            -> Salesforce username
 - SALESFORCE_API_BASE_ENDPOINT   -> Salesforce API base endpoint (optional, defaults to "/services/data")
 - SALESFORCE_API_VERSION         -> Salesforce API version (optional, defaults to "v45.0")
 - SALESFORCE_OWNER_ID            -> Owner ID for Sandbox
 - SALESFORCE_RECORD_TYPE_ID      -> Record type id for "Production"
 - SALESFORCE_BRIEF_EVENT_RECORD_TYPE_ID -> Event Brief Record type id
 - SALESFORCE_CLICK_COLLECT_BRIEF_EVENT_RECORD_TYPE_ID -> Click & collect Event Brief Record type id
 - SALESFORCE_NDD_TASK_RECORD_TYPE_ID -> Task Tracking RecordTypeId for Domain Name transfer
 - MICRO_WEB_SERVICES_API_URL     -> Micro web service URL 
 - WEBTOOL_BASE_URL               -> Webtool base url
 - WEBTOOL_TOKEN_CONNECTION       -> Webtool token endpoint (optional, defaults to "/oauth/token_connection")
 - WEBTOOL_PASSWORD_KEY           -> Webtool encryption key
 - DROPBOX_TOKEN                  -> Dropbox AccessToken Authentication
 - DROPBOX_FOLDER                 -> Dropbox Root folder
 - ALLOWED_UPLOAD_EXTENSIONS      -> Files extensions allowed to upload in Dropbox (format: jpg,txt,json,pdf, ...)
 - TOOLBOX_URL                    -> Toolbox base URL by default (if autologin link generation failed)
 - TOOLBOX_AUTOLOGIN_URL          -> Toolbox URL for autologin
 - TOOLBOX_API_BASE_URL           -> Toolbox API base URL
 - TOOLBOX_API_SECRET_KEY         -> Toolbox API secret key
 - TOOLBOX_API_IV                 -> Toolbox API hexadecimal initialization vector
 - CLICK_AND_COLLECT_URL = "https://boutique-clickandcollect.fr" -> Teds shop url
 - CLICK_AND_COLLECT_PREFIX_URL = "https://boutique" -> Teds partner prefix url
 - CLICK_AND_COLLECT_API_BASE_URL -> Teds api authorize url
 - CLICK_AND_COLLECT_API_TOKEN_ENDPOINT -> Teds api token endpoint
 - CLICK_AND_COLLECT_CLIENT_ID -> Teds api client Id
 - CLICK_AND_COLLECT_CLIENT_SECRET -> Teds api client secret
 - CLICK_AND_COLLECT_SCOPE -> Teds api scope
 - CLICK_AND_COLLECT_STATE -> Teds api state
 - ADPLORER_CUSTOMER_WSDL_URL -> Adplorer WSDL for Customer API call
 - ADPLORER_ORDER_WSDL_URL -> Adplorer WSDL for Order API call
 - ADPLORER_REPORT_WSDL_URL -> Adplorer WSDL for Report API call
 - ADPLORER_API_USERNAME -> Adplorer API username
 - ADPLORER_API_PASSWORD -> Adplorer API password
 - ADPLORER_NEW_CAMPAIGN_URL -> Adplorer NEW campaign url
 - STRIPE_TUTORIAL_URL -> Stripe tutorial URL
 - VIVA_WALLET_TUTORIAL_URL -> Viva Wallet tutorial URL
 - QRCODE_GENERATOR_CREATE_URL -> QR code generator URL for QR code creation
 - QRCODE_GENERATOR_TOKEN -> QR code generator token for API calls
 
## Import the environment 

You need to import the env file (listed below) into the application with the right data (need to ask for it) and then type the command into the terminal (in the project folder) to link it:

```bash
source .env
```

## Run the App

If start for the first time, you need to install the dependencies: 

``` bash
# install dependencies
npm install
```
And then run this command to start the app:

```
# run the app
npm run run-local
```

### Troubleshoot

If you modify some environment variables, you need to run this script again or it won't be updated :

```bash
source .env
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080 with dev env
npm run dev

# serve with hot reload at localhost:8080 with preprod env
npm run preprod

# start node server.js
npm run start

# start preprop node server-preprod.js
npm run start-preprod

# build for production with minification
npm run build

# build for local with minification
npm run build-local

# build for preprod with minification
npm run build-preprod

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests with karma
npm run unit

# run linter eslint
npm run lint

# run all tests
npm test

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
```
## Add a new entity

To add a new entity relation from client database follow the step below:

If the relation is OneToOne :

- In the account.store.js file

Add the setter in the mutations object (example with partnerAutoImmo relation)
```
setPartnerAutoImmo(state, {entityValue}) {
    state.currentPartner.partnerAutoImmo = entityValue;
},
```
```
// Manage entities updates
'Partner',
'PartnerBoutique',
'PartnerHotelResto',
'PartnerAutoImmo',
'PartnerShop',
'BookEngine',
'DeliveryMode',
'Agenda'
```

if the relation is OneToMany :

- In the account.store.js file

Add the getter / setter / remove (example with siteTrees relation)

```
setSiteTree(state, {entityValue}) {
    let found = false;
    state.currentPartner.sites[0].siteTrees.forEach(function (item, index) {
        if (item.id === entityValue.id) {
            found = true;
            state.currentPartner.sites[0].siteTrees[index] = entityValue;
        }
    });

    if (!found) {
        state.currentPartner.sites[0].siteTrees.push(entityValue);
    }
},
addSiteTree(state, {entityValue}) {
    let found = false;
    state.currentPartner.sites[0].siteTrees.forEach(function (item, index) {
        if (!item.id && entityValue.name === item.name) {
            found = true;
            state.currentPartner.sites[0].siteTrees[index] = entityValue;
        }
    });

    if (!found) {
        state.currentPartner.sites[0].siteTrees.push(entityValue);
    }
},
removeSiteTree(state, {deletedEntity}) {
    let index = state.currentPartner.sites[0].siteTrees.findIndex(item => item.id === deletedEntity.id);
    if (-1 !== index) {
        state.currentPartner.sites[0].siteTrees.splice(index, 1);
    }
},
```

Need to check if the relation to add is linked to Partner. If yes then add the relation into the partnerRelations in (partnershipFolderDatas.js). Same for siteRelations.

```
const partnerRelations = [
    'paymentModes',
    'deliveryModes',
    'sites',
    'campaignOptions',
    'openingRanges',
    'socialNetworks',
    'portals',
    'bookEngines',
    'shopProducts',
    'footages',
    'spokenLanguages'
];
```

Then add the name of the entity in the function (updatePartnerPropertyFromForm in the same file, line 274).
```
// Manage entities updates
'Partner',
'PartnerBoutique',
'PartnerHotelResto',
'PartnerAutoImmo',
'PartnerShop',
'BookEngine',
'DeliveryMode',
'Agenda'
```

and also

```
// Manage entities updates/creation
'Site',
'CampaignOption',
'SiteTree',
'Footage',
'Banner',
'OpeningRange',
'SocialNetwork',
'AgendaService',
'AgendaResource',
'AgendaMember',
'AgendaVisio'
```

Then in the function (deletePartnerPropertyFromForm, line 403):

```
'CampaignOption',
'SiteTree',
'Footage',
'OpeningRange',
'AgendaService',
'AgendaResource',
'AgendaMember',
'AgendaVisio'
```

After that, go to localfrApi.service.js.

And the create / update / delete function entity

If the relation is OneToOne, don't need to add the create and delete function, but only updateEntity.

```
updatePartnerHotelResto: (id, data) => updateEntity('partner_hotel_restos', id, data),
createSiteTree: (data) => createEntity('site_trees', data),
deleteSiteTree: (data) => deleteEntity('site_trees', data),
```

Finally, call the function updatePartnerPropertyFromForm into the component to update data.
```
...mapActions('account', ['updatePartnerPropertyFromForm']),
```

# References
- [Toolbox API doc](https://platform.appyourself.com/api/_doc)
- [Klixi dev platform](https://platform.appyourself.com/fr/developer/api) (secured area)
- [CryptoJS](https://cryptojs.gitbook.io/docs/)
