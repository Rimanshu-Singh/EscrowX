/**
 * Generates a deterministic on-chain escrow ID from MongoDB project ID and the client's wallet address.
 * It is capped at a maximum of 32 characters to stay within Soroban's string length limits.
 * 
 * @param projectId - The MongoDB ObjectId of the project/listing.
 * @param clientAddress - The public Stellar wallet address of the client.
 * @returns A 32-character maximum deterministic string escrow ID.
 */
export function generateEscrowId(projectId: string, clientAddress: string): string {
  const short = clientAddress.slice(0, 6).toLowerCase();
  const id = `esc_${projectId}_${short}`;
  return id.slice(0, 32);
}
