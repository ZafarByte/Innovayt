const MAX_BODY_LENGTH = 10_000;
const MAX_FIELD_LENGTHS = {
  name: 120,
  email: 254,
  company: 160,
  service: 80,
  budget: 80,
  description: 5_000,
};

const ALLOWED_SERVICES = new Set([
  "Digital Marketing",
  "AI & Automation",
  "Digital Experiences",
  "Business Optimization",
  "Something else",
]);

const ALLOWED_BUDGETS = new Set([
  "",
  "Under ₹1,00,000",
  "₹1,00,000 – ₹5,00,000",
  "₹5,00,000 – ₹10,00,000",
  "₹10,00,000+",
]);

function respond(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body !== undefined) {
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    if (body.length > MAX_BODY_LENGTH) throw new RangeError("Request body is too large.");
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }

  let body = "";
  for await (const chunk of req) {
    body += chunk.toString();
    if (body.length > MAX_BODY_LENGTH) throw new RangeError("Request body is too large.");
  }
  return JSON.parse(body);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function validateSubmission(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Please submit a valid enquiry." };
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return { spam: true };
  }

  const submission = {};
  for (const [field, maximumLength] of Object.entries(MAX_FIELD_LENGTHS)) {
    const value = typeof body[field] === "string" ? body[field].trim() : "";
    if (value.length > maximumLength) {
      return { error: "One or more fields are too long. Please shorten them and try again." };
    }
    submission[field] = value;
  }

  if (!submission.name || !submission.email || !submission.service || !submission.description) {
    return { error: "Please complete all required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)) {
    return { error: "Please enter a valid email address." };
  }

  if (!ALLOWED_SERVICES.has(submission.service) || !ALLOWED_BUDGETS.has(submission.budget)) {
    return { error: "Please select a valid service and budget." };
  }

  return { submission };
}

export default async function contactHandler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return respond(res, 405, { error: "Method not allowed." });
  }

  if (!req.headers["content-type"]?.includes("application/json")) {
    return respond(res, 415, { error: "Content-Type must be application/json." });
  }

  let body;
  try {
    body = await readBody(req);
  } catch (error) {
    if (error instanceof RangeError) {
      return respond(res, 413, { error: "Your enquiry is too large. Please shorten it and try again." });
    }
    if (error instanceof SyntaxError) {
      return respond(res, 400, { error: "Please submit a valid enquiry." });
    }
    console.error("Unable to read contact form request.", error);
    return respond(res, 400, { error: "Unable to read your enquiry. Please try again." });
  }

  const validation = validateSubmission(body);
  if (validation.spam) return respond(res, 200, { ok: true });
  if (validation.error) return respond(res, 400, { error: validation.error });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO || "zafargayas3101@gmail.com";

  if (!apiKey || !from) {
    console.error("Contact form email is not configured. Set RESEND_API_KEY and CONTACT_FROM.");
    return respond(res, 503, { error: "Enquiry delivery is temporarily unavailable." });
  }

  const { name, email, company, service, budget, description } = validation.submission;
  const safeName = name.replace(/[\r\n]+/g, " ");
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    company: escapeHtml(company || "Not provided"),
    service: escapeHtml(service),
    budget: escapeHtml(budget || "Not provided"),
    description: escapeHtml(description).replace(/\n/g, "<br>"),
  };

  let response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New website enquiry from ${safeName}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${company || "Not provided"}`,
          `Service: ${service}`,
          `Budget: ${budget || "Not provided"}`,
          "",
          "Project description:",
          description,
        ].join("\n"),
        html: `<h2>New website enquiry</h2><p><strong>Name:</strong> ${safe.name}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>Company:</strong> ${safe.company}</p><p><strong>Service:</strong> ${safe.service}</p><p><strong>Budget:</strong> ${safe.budget}</p><p><strong>Project description:</strong><br>${safe.description}</p>`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error("Contact form email delivery request failed.", error);
    return respond(res, 502, { error: "We couldn’t send your enquiry right now. Please try again shortly." });
  }

  if (!response.ok) {
    const providerError = await response.text();
    console.error(`Resend rejected contact form email (${response.status}): ${providerError}`);
    return respond(res, 502, { error: "We couldn’t send your enquiry right now. Please try again shortly." });
  }

  return respond(res, 200, { ok: true });
}
