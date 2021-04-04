# Serverless Computation of Salesforce Data With Cloudflare Workers:
This project is a proof of concept for seamlessly deploying scalable serverless applications that integrate with Salesforce by leveraging Cloudflare Workers. The Cloudflare Edge Network and Cloudflare Workers make it easy and affordable to develop performative applications that deliver low latency, save bandwidth, mitigate Salesforce CPU usage and reduce the risk of hitting Salesforce Execution Governors/Limits without having to configure and maintain infrastructure. 

This example uses the Salesforce REST API to query and return all field values of the last created records for a given object (limited to 200 records).

## Installation:
1. Sign up for a free Cloudflare Workers account: `https://dash.cloudflare.com/sign-up/workers`
2. Install Wrangler: `npm i @cloudflare/wrangler -g`
3.  Clone this repository.
4. Change directory: `cd ./sfdc-worker`
5. Authorize Wrangler: `wrangler login`
6. Retrieve your Account Id: `wrangler whoami`
7. Open `wrangler.toml` and replace `<ACCOUNT_ID>` with your Account Id.
8. Set environment variables (secrets):
    1. `wrangler secret put client_id`
        1. Enter Salesforce Connected App consumer key.
    2. `wrangler secret put client_secret`
        1. Enter Salesforce Connected App consumer secret.
    3. `wrangler secret put username`
        1. Enter Salesforce username.
    4. `wrangler secret put password`
        1. Enter Salesforce password (you may need to append security token).
    5. `wrangler secret put baseUrl`
        1. Enter Salesforce URL (i.e https://<myDomain>.my.salesforce.com).
9. Run locally: `wrangler dev`

## How to use:
After installation and running `wrangler dev`:

Submit HTML Form:
```
localhost:8787/query
```
GET:
```
curl --location --request GET 'localhost:8787'
```
POST:
```
curl --location --request POST 'localhost:8787' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'object=Account' \
--data-urlencode 'limit=10'
```

## To do:
- Try and use webpack to support node modules in order to leverage Lightning Web Components framework, SLDS and JSforce
- Convert query results to JSON instead of text
- Add functionality for GET requests to '/'
- Add appropriate error handling
- Look into better Auth flow
- Evaluate security

## References:
- https://developers.cloudflare.com/workers/
- https://developers.cloudflare.com/workers/examples/read-post
- https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_list.htm