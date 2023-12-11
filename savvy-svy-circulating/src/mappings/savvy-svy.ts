import { Transfer } from "../../generated/SavvySVY/SVY";
import { createTransferEvent } from "../helpers/savvySvy";
import { getOrCreateAccount } from "../helpers/account";

export function handleTransferred(event: Transfer): void {
  createTransferEvent(event);
  let accountFrom = getOrCreateAccount(event.params.from.toHexString());
  accountFrom.svyAmount = accountFrom.svyAmount.minus(event.params.value);
  accountFrom.save();

  let accountTo = getOrCreateAccount(event.params.to.toHexString());
  accountTo.svyAmount = accountTo.svyAmount.plus(event.params.value);
  accountTo.save();
}
