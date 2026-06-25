import {
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  Memo,
} from '@stellar/stellar-sdk';

import { STELLAR_CONFIG } from '../config/stellar.config';

export interface FundTxResult {
  txHash: string;
  success: boolean;
}

export async function buildAndSubmitFundTx(
  senderAddress: string,
  amountXLM: string,
  escrowId: string,
  signTransaction: (xdr: string) => Promise<string>
): Promise<FundTxResult> {

  // 1. Load sender account from Horizon testnet
  const server = new Horizon.Server(STELLAR_CONFIG.HORIZON_URL);
  const sourceAccount = await server.loadAccount(senderAddress);

  // 2. Build transaction
  // - Send XLM to treasury wallet
  // - Add memo with escrowId for tracking
  // - Base fee: 100 stroops
  // - Timeout: 30 seconds
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: '100',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: STELLAR_CONFIG.TREASURY_WALLET,
        asset: Asset.native(), // XLM
        amount: amountXLM,
      })
    )
    .addMemo(Memo.text(`escrow:${escrowId}`.slice(0, 28))) // Stellar memo max 28 chars
    .setTimeout(30)
    .build();

  // 3. Convert to XDR for Freighter to sign
  const xdr = transaction.toXDR();

  // 4. Sign via Freighter (triggers popup)
  const signedXdr = await signTransaction(xdr);

  // 5. Submit signed transaction to Stellar testnet
  const submittedTx = await server.submitTransaction(
    TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET)
  );

  return {
    txHash: submittedTx.hash,
    success: true,
  };
}
