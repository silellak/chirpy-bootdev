export function middlewareLogResponses(req: any, res: any, next: any) {
  res.on("finish", () => {
    if (res.statusCode != 200) {
      console.log(`[NON-OK] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
    }
  });
  next();
}