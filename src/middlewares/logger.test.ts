import { requestLogger } from "./logger";
import type { Request, Response, NextFunction } from "express";

describe("requestLogger", () => {
  test("debe llamar a next() al recibir una petición", () => {
    const req = {
      method: "GET",
      path: "/health",
    } as Request;

    const res = {
      on: jest.fn(),
      statusCode: 200,
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    requestLogger(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("debe registrar el método y la ruta correctamente", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    let finishCallback: () => void = () => {};

    const req = {
      method: "GET",
      path: "/health",
    } as Request;

    const res = {
      statusCode: 200,
      on: jest.fn((event: string, callback: () => void) => {
        if (event === "finish") {
          finishCallback = callback;
        }
        return res;
      }),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    requestLogger(req, res, next);

    finishCallback();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("GET /health")
    );

    consoleSpy.mockRestore();
  });
});