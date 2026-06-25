import { useState } from 'react';
import { signTransaction, isConnected as freighterIsConnected } from '@stellar/freighter-api';
import { Horizon, TransactionBuilder, Networks, Operation, Asset, Memo } from '@stellar/stellar-sdk';
import axios from 'axios';
import { STELLAR_CONFIG } from '../config/stellar.config';

export function useFundEscrow() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [step, setStep] = useState<'idle' | 'building' | 'signing' | 'submitting' | 'confirming' | 'done' | 'error'>('idle');

  async function fundEscrow(
    escrowId: string,
    amountXLM: string,
    senderAddress: string
  ): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    setTxHash(null);

    // Check if Freighter is installed
    try {
      const isInstalled = await freighterIsConnected();
      if (!isInstalled) {
        setError('Please install the Freighter wallet extension to continue.');
        setStep('error');
        setIsLoading(false);
        return false;
      }
    } catch (e) {
      setError('Please install the Freighter wallet extension to continue.');
      setStep('error');
      setIsLoading(false);
      return false;
    }

    // Step A: Building Transaction
    setStep('building');
    let xdr: string;
    try {
      const server = new Horizon.Server(STELLAR_CONFIG.HORIZON_URL);
      let sourceAccount;
      try {
        sourceAccount = await server.loadAccount(senderAddress);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Could not load wallet. Make sure you have XLM on Testnet.');
        } else {
          setError('Stellar network error. Please try again in a moment.');
        }
        setStep('error');
        setIsLoading(false);
        return false;
      }

      // Build the transaction
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

      xdr = transaction.toXDR();
    } catch (err: any) {
      console.error('Error building transaction:', err);
      setError('Stellar network error. Please try again in a moment.');
      setStep('error');
      setIsLoading(false);
      return false;
    }

    // Step B: Signing Transaction
    setStep('signing');
    let signedXdr: string;
    try {
      // Call signTransaction with correct network passphrase
      const res = await signTransaction(xdr, {
        networkPassphrase: STELLAR_CONFIG.NETWORK_PASSPHRASE,
      });
      if (!res) {
        setError('You cancelled the transaction. No funds were sent.');
        setStep('error');
        setIsLoading(false);
        return false;
      }
      if (res.error) {
        throw new Error(res.error);
      }
      signedXdr = res.signedTxXdr;
    } catch (err: any) {
      console.error('Error signing transaction:', err);
      const msg = err.message || '';
      if (msg.includes('User rejected') || msg.includes('cancel') || msg.includes('declined') || msg.includes('User cancelled')) {
        setError('You cancelled the transaction. No funds were sent.');
      } else {
        setError('Transaction rejected by user.');
      }
      setStep('error');
      setIsLoading(false);
      return false;
    }

    // Step C: Submitting Transaction
    setStep('submitting');
    let submittedHash: string;
    try {
      const server = new Horizon.Server(STELLAR_CONFIG.HORIZON_URL);
      const submittedTx = await server.submitTransaction(
        TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET)
      );
      submittedHash = submittedTx.hash;
    } catch (err: any) {
      console.error('Error submitting transaction:', err);
      const resultCodes = err.response?.data?.extras?.result_codes;
      const operationsResultCodes = resultCodes?.operations || [];
      if (resultCodes?.transaction === 'tx_insufficient_balance' || operationsResultCodes.includes('op_underfunded')) {
        setError('Insufficient XLM balance. Please fund your Testnet wallet.');
      } else {
        setError('Stellar network error. Please try again in a moment.');
      }
      setStep('error');
      setIsLoading(false);
      return false;
    }

    // Step D: Confirming on Backend
    setStep('confirming');
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('escrowx_token') || '';
      
      const response = await axios.put(
        `http://localhost:5000/api/escrows/${escrowId}/fund`,
        { txHash: submittedHash },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed to confirm');
      }
    } catch (err: any) {
      console.error('Error confirming transaction on backend:', err);
      const status = err.response?.status;
      if (status === 401) {
        setError('Session expired. Please reconnect your wallet.');
      } else if (status === 403) {
        setError('You are not authorized to fund this escrow.');
      } else if (status === 404) {
        setError('Escrow not found. It may have been deleted.');
      } else if (status === 500) {
        setError('Server error while confirming. Transaction was sent — contact support with your txHash.');
      } else {
        setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      }
      setStep('error');
      setIsLoading(false);
      return false;
    }

    // Step E: Done
    setTxHash(submittedHash);
    setStep('done');
    setIsLoading(false);
    return true;
  }

  const reset = () => {
    setStep('idle');
    setError(null);
    setTxHash(null);
    setIsLoading(false);
  };

  return { fundEscrow, isLoading, error, txHash, step, reset };
}
