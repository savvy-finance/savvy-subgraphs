import {
  Transfer as TransferEvent
} from "../../generated/SavvyProtocolToken/SavvyProtocolToken";
import { getOrCreateAccount } from "../helpers/account";
import { getSvyBalanceInUSD } from "../utils/tokens";

export function handleTransfer(event: TransferEvent): void {
  const sender = getOrCreateAccount(event.params.from);
  const receiver = getOrCreateAccount(event.params.to);
  const svyAmount = event.params.value;
  sender.svyBalance = sender.svyBalance.minus(svyAmount);
  sender.svyBalanceUSD = getSvyBalanceInUSD(sender.svyBalance);
  receiver.svyBalance = receiver.svyBalance.plus(svyAmount);
  receiver.svyBalanceUSD = getSvyBalanceInUSD(receiver.svyBalance);

  sender.save();
  receiver.save();
}