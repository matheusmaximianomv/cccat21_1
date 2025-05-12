import Deposit from "../../application/Deposit";
import GetAccount from "../../application/GetAccount";
import HttpServer from "../http/HttpServer";
import Signup from "../../application/Signup";
import Withdraw from "../../application/Withdraw";

export default class AccountController {
  static config(
    httpServer: HttpServer,
    signup: Signup,
    deposit: Deposit,
    withdraw: Withdraw,
    getAccount: GetAccount
  ) {
    httpServer.route("post", "/signup", async (_params: any, body: any) => {
      const input = body;
      const output = await signup.execute(input);
      return output;
    });

    httpServer.route("post", "/deposit", async (_params: any, body: any) => {
      const input = body;
      await deposit.execute(input);
    });

    httpServer.route("post", "/withdraw", async (_params: any, body: any) => {
      const input = body;
      await withdraw.execute(input);
    });

    httpServer.route(
      "get",
      "/accounts/:accountId",
      async (params: any, _body: any) => {
        const accountId = params.accountId;
        const output = await getAccount.execute(accountId);
        return output;
      }
    );
  }
}
