import { colorize, consoleColors } from "../utils/colorsConsole";
import { NextFunction, Request, Response } from "express";

function statusColorize(statusCode: number): string {
	if (statusCode >= 200 && statusCode < 300) return consoleColors.fgGreen;
	if (statusCode >= 300 && statusCode < 400) return consoleColors.fgYellow;
	if (statusCode >= 400 && statusCode < 500) return consoleColors.fgRed;
	return consoleColors.fgMagenta;
}

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const timeStamp = new Date().toLocaleString();

	console.log(`Request: ${colorize(`[${timeStamp}]`, consoleColors.fgCyan)} ${req.method} - ${req.url} // IP: ${req.ip}`);

	const start = Date.now();

	res.on('finish', () => {
		const duration = Date.now() - start;
		console.log(`Response: ${colorize(`[${timeStamp}]`, consoleColors.fgCyan)} ${colorize(`${res.statusCode}`, statusColorize(res.statusCode))} - ${duration} ms`);
	});

	next();
}
