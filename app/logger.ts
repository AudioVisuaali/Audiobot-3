import { ApolloServerPlugin } from "apollo-server-plugin-base";
import bunyan from "bunyan";

import { Config } from "~/config";
import { Context } from "~/context";

export const apolloServerLogger: ApolloServerPlugin<Context> = {
  requestDidStart: (requestContext) => {
    requestContext.context.logger.info(
      {
        url: requestContext.request.http?.url,
        graphqlQuery: requestContext.request.query,
      },
      "Apollo requestDidStart",
    );

    return {
      didEncounterErrors: (requestContext) => {
        requestContext.context.logger.error(
          {
            errors: requestContext.errors.map((error) => ({
              ...error,
              name: error.name,
              stack: error.stack, // force logging stack
            })),
          },
          "Apollo didEncounterErrors",
        );
      },
    };
  },
};

export const createLogger = (opts: { config: Config }) =>
  bunyan.createLogger({
    name: "graphql-boilerplate-api",
    streams: [
      ...(opts.config.stdoutLogging
        ? [{ level: "info" as const, stream: process.stdout }]
        : []),
    ],
  });
