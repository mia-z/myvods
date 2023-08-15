import winston, { format, transports } from "winston";

const { combine, printf } = format;

const linePrint = printf(({ level, message, label, timestamp }) => {
    return `[${timestamp}] [${label}] [${level}]: ${message.source} - ${message.text}`; 
});

const timeFormat = "YYYY/MM/DD - HH:mm:ss.SSS";

const logger = winston.createLogger({
    format: combine(format.label({ label: "Server" }), format.colorize(), format.timestamp({ format: timeFormat }), linePrint),
    defaultMeta: { service: "SvelteKit/Server" },
    transports: [
        new transports.Console()
    ]
});

export default logger;