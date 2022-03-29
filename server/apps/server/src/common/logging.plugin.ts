import { Plugin } from "@nestjs/apollo";
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from "apollo-server-plugin-base";
import { Logger } from "@nestjs/common";
import prettyFormat from "pretty-format";

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger(LoggingPlugin.name);

  async serverWillStart() {
    this.logger.log("Server starting");
  }

  async requestDidStart(): Promise<GraphQLRequestListener> {
    // this.logger.log("Request started");

    return {
      parsingDidStart: async (requestContext) => {
        const req = requestContext.request;
        this.logger.debug(
          [
            "REQUEST",
            `OP '${req.operationName}'`,
            `VARS ${prettyFormat(req.variables)}`,
            // `QUERY ${req.query}`,
          ].join("\n")
        );
      },

      willSendResponse: async (requestContext) => {
        this.logger.debug(
          [
            "RESPONSE",
            prettyFormat(requestContext.response, { maxDepth: 6 }),
          ].join("\n")
        );
      },
    };
  }
}
