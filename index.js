const queryForm = `
<!DOCTYPE html>
  <html>
  <body>
  <h1>Salesforce Cloudflare Worker Proof of Concept</h1>
  <p>This is all generated using a Cloudflare Worker and the Salesforce REST API.</p>
  <form action="/results" method="post">
    <div>
      <label for="object">Object (API Name)</label>
      <input name="object" id="object" value="Account">
    </div>
    <div>
      <label for="limit">Limit</label>
      <input name="limit" id="limit" value="1">
    </div>
    <div style="padding-top:10px;">
      <button>Query Object</button>
    </div>
  </form>
  </body>
  </html>
`;

addEventListener("fetch", event => {
  const { request } = event;
  const { url } = request;

  if (request.method === "POST") {
    return event.respondWith(handleRequest(request));
  };
  if (url.includes("query")) {
    return event.respondWith(rawHtmlResponse(queryForm));
  } else if (request.method === "GET") {
    return event.respondWith(new Response(`The request was a GET request. To invoke a query, append '/query' to the URL and submit a form.`));
  };
});

async function handleRequest(request) {
  const reqBody = await readRequestBody(request);
  var params = JSON.parse(reqBody);
  const accessToken = await getAccessToken();
  const queryResults = await sfdcQuery(accessToken, params.object, params.limit);
  return new Response(queryResults);
};

/**
 * rawHtmlResponse returns HTML inputted directly into the worker script
 * @param {string} html
 */
function rawHtmlResponse(html) {
  const init = { headers: { "content-type": "text/html;charset=UTF-8", } };
  return new Response(html, init);
};

/**
 * readRequestBody reads in the incoming request body, use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
async function readRequestBody(request) {
  const { headers } = request;
  const contentType = headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return JSON.stringify(await request.json());
  } else if (contentType.includes("application/text")) {
    return await request.text();
  } else if (contentType.includes("text/html")) {
    return await request.text();
  } else if (contentType.includes("form")) {
    const formData = await request.formData();
    const body = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    };
    return JSON.stringify(body);
  } else {
    const myBlob = await request.blob();
    const objectURL = URL.createObjectURL(myBlob);
    return objectURL;
  };
};

async function getAccessToken() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "password");
  urlencoded.append("client_id", client_id);
  urlencoded.append("client_secret", client_secret);
  urlencoded.append("username", username);
  urlencoded.append("password", password);

  var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
  };

  const response = await fetch(baseUrl + "/services/oauth2/token", requestOptions);
  const responseBody = await response.json();
  return responseBody.access_token;
};

async function sfdcQuery(accessToken, object, limit) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders
  };

  const response = await fetch(baseUrl + `/services/data/v51.0/query/?q=SELECT FIELDS(ALL) FROM ${object} ORDER BY CreatedDate DESC LIMIT ${limit}`, requestOptions);
  return response.text();
};