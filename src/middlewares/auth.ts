import type { Request, Response, NextFunction } from "express";
import { createHmac, timingSafeEqual } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

function base64urlDecode(str: string): string {
  return Buffer.from(
    str.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString("utf8");
}

export function requireJwt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token ausente" });
  }

  const token = authHeader.substring(7);

  const parts = token.split(".");

  if (parts.length !== 3) {
    return res.status(401).json({ error: "Token malformado" });
  }

  const headerB64 = parts[0]!;
  const payloadB64 = parts[1]!;
  const sigB64 = parts[2]!;

  try {
    const header = JSON.parse(base64urlDecode(headerB64));

    // Rechazar alg:none
    if (header.alg !== "HS256") {
      return res.status(401).json({
        error: "Algoritmo no permitido",
      });
    }

    const expectedSig = createHmac("sha256", JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64url");

    const receivedBuffer = Buffer.from(sigB64, "utf8");
    const expectedBuffer = Buffer.from(expectedSig, "utf8");

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
      return res.status(401).json({
        error: "Firma invalida",
      });
    }

    const claims = JSON.parse(base64urlDecode(payloadB64));

    const now = Math.floor(Date.now() / 1000);

    if (claims.exp && claims.exp < now) {
      return res.status(401).json({
        error: "Token expirado",
      });
    }

    if (!claims.sub) {
      return res.status(401).json({
        error: "Claim sub ausente",
      });
    }

    (req as Request & { user?: unknown }).user = {
      sub: claims.sub,
      scope: claims.scope ?? "",
    };

    next();
  } catch {
    return res.status(401).json({
      error: "Token invalido",
    });
  }
}