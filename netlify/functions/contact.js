import contactHandler from "../../api/contact.js";

export async function handler(event) {
  const headers = Object.fromEntries(
    Object.entries(event.headers || {}).map(([name, value]) => [name.toLowerCase(), value]),
  );
  const requestBody = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : event.body || "";
  const req = {
    method: event.httpMethod,
    headers,
    body: requestBody,
  };
  const res = {
    statusCode: 200,
    headers: {},
    body: "",
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(body = "") {
      this.body = body;
    },
  };

  await contactHandler(req, res);

  return {
    statusCode: res.statusCode,
    headers: res.headers,
    body: res.body,
  };
}
