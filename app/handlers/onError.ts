import Logger from "bunyan";

export const handleError = (opts: { logger: Logger }) => (error: Error) => {
  opts.logger.warn(error);
};
