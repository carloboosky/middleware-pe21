import { requireJwt  } from "./auth";
import type { Request, Response, NextFunction } from "express";

describe("requireJwt", () => {
  const createMockResponse = () => {
    const res: Partial<Response> = {};

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res as Response;
  };

  test("debe responder 401 si falta x-api-key", () => {
    const req = {
      headers: {},
    } as Request;

    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    requireJwt(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("debe responder 401 si la clave es incorrecta", () => {
    const req = {
      headers: {
        "x-api-key": "clave-mala",
      },
    } as unknown as Request;

    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    requireJwt(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("debe llamar next() si la clave es válida", () => {
    const req = {
      headers: {
        "x-api-key": "secreto-demo",
      },
    } as unknown as Request;

    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    requireJwt(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});