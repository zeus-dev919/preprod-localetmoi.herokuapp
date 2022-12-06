// import Documents from '@/components/Documents';
// import axios from 'axios';

// describe('Documents', () => {
//     var chai = require('chai');
//     var chaiAsPromised = require('chai-as-promised');
//     chai.use(chaiAsPromised);
//     var axiosStub;
//     var sandbox;

//     before(() => {
//         sandbox = sinon.sandbox.create();
//     });

//     beforeEach(() => {
//         axiosStub = sandbox.stub(axios, 'get');
//     });

//     afterEach(() => {
//         axiosStub.restore();
//     });

//     after(() => {
//         sandbox.restore();
//     });
//     it('Retrieve Rib', () => {
//         $cookies.set('SALESFORCE_USER_TOKEN', 'mycookie');
//         localStorage.setItem('sageCode', 'mySageCode');
//         var queryBase = process.env.SALESFORCE_QUERY_BASE + '?q=SELECT+Banque__c+,+Code_BIC__c+,+IBAN__c+from+Account+WHERE+Code_Sage__c+=+\'' + localStorage.getItem('sageCode') + '\'';
//         var url = process.env.SALESFORCE_ROOT_API + queryBase;
//         Documents.methods.retrieve_rib();
//         assert(axiosStub.calledOnceWith(url));
//     });

//     it('Retrieve Documents', () => {
//         $cookies.set('SALESFORCE_USER_TOKEN', 'mycookie');
//         $cookies.set('SALESFORCE_ACCOUNT_ID', 'mycookie');
//         let accountId = $cookies.get('SALESFORCE_ACCOUNT_ID');
//         var queryBase = process.env.SALESFORCE_QUERY_BASE + "?q=SELECT+Commentaire__c+,+Contrat_Partenaire__c+,+Name+,+Type_de_piece__c+,+Url__c+,+CreatedDate+,+Statut__c+FROM+Pieces_Jointes__c+WHERE+Compte__c+=+'" + accountId + "'";
//         var url = process.env.SALESFORCE_ROOT_API + queryBase;
//         Documents.methods.retrieve_documents();
//         assert(axiosStub.calledOnceWith(url));
//     });

//     it('Parse Attachment', () => {
//         const attachment = {
//             Type_de_piece__c: 'type',
//             Url__c: '["link"]',
//             CreatedDate: 'date'
//         };
//         Documents.methods.parse_attachment(attachment);
//     });  
// });
