// Retired V1.5 endpoint. The V1.6 form uses the EmailJS browser SDK.
export default function handler(_req, res) {
  res.statusCode = 410;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify({ error: 'This endpoint is retired. Please use the website contact form.' }));
}
