# EscrowX User Guide

Welcome to **EscrowX** — Your decentralized freelance escrow marketplace powered by the Stellar blockchain and Soroban smart contracts!

EscrowX protects both clients and freelancers by locking project funds securely inside a smart contract before work begins. Funds are released only when the required escrow conditions are satisfied.

> **Core Rule:** No funding = no published project. No approval = no payment release.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Setting Up Your Wallet](#setting-up-your-wallet)
3. [Understanding EscrowX](#understanding-escrowx)
4. [Client Guide](#client-guide)
5. [Creating and Funding a Project](#creating-and-funding-a-project)
6. [Freelancer Guide](#freelancer-guide)
7. [Applying to a Project](#applying-to-a-project)
8. [Selecting a Freelancer](#selecting-a-freelancer)
9. [Project Delivery](#project-delivery)
10. [Approving Work and Releasing Payment](#approving-work-and-releasing-payment)
11. [Refunds](#refunds)
12. [Disputes](#disputes)
13. [Admin Functions](#admin-functions)
14. [Escrow Lifecycle](#escrow-lifecycle)
15. [Troubleshooting](#troubleshooting)
16. [FAQ](#faq)

---

# Getting Started

## Prerequisites

Before using EscrowX, you'll need:

1. **Freighter Wallet** — Browser wallet for Stellar
2. **Stellar Testnet XLM** — Required for transactions and network fees
3. **Modern Web Browser** — Chrome, Firefox, Edge, or another supported Chromium-based browser
4. **EscrowX Account** — Register as a Client or Freelancer
5. **Connected Wallet** — Required before accessing blockchain-powered actions

---

## 1. Install Freighter Wallet

1. Visit the official Freighter Wallet website.
2. Install the extension for your browser.
3. Create a new Stellar wallet or import an existing wallet.
4. Securely save your recovery phrase.
5. Never share your recovery phrase or private key with anyone.

> EscrowX will never ask for your wallet recovery phrase or secret key.

---

## 2. Switch to Stellar Testnet

EscrowX currently operates using the **Stellar Testnet** environment.

1. Open the Freighter extension.
2. Open wallet settings.
3. Find the network configuration.
4. Select **Testnet**.
5. Confirm that your wallet is connected to the correct network before using EscrowX.

---

## 3. Fund Your Testnet Wallet

You need test XLM to pay blockchain transaction fees and interact with Soroban smart contracts.

1. Copy your Stellar wallet address from Freighter.
2. Fund the account using a Stellar Testnet funding service such as Friendbot.
3. Wait for the account to activate.
4. Confirm that your test XLM balance appears in Freighter.

Testnet XLM has **no real monetary value** and is intended only for development and testing.

---

# Setting Up Your Wallet

## Connecting Your Wallet

1. Visit the EscrowX homepage.
2. Click **Connect Wallet**.
3. Freighter will request permission to connect.
4. Approve the connection.
5. Your connected wallet address will appear in the interface.

A connected wallet is required before accessing protected Client or Freelancer functionality.

---

## Disconnecting Your Wallet

1. Find your connected wallet indicator.
2. Click the disconnect/exit icon.
3. Your wallet session will be disconnected.
4. Protected blockchain functionality will become unavailable until you reconnect.

---

## Wallet Security

EscrowX follows a non-custodial architecture.

EscrowX does **not**:

* Store your private key
* Store your recovery phrase
* Sign transactions without wallet approval
* Hold project payments inside a platform-controlled wallet

Every blockchain transaction must be authorized through your connected wallet.

---

# Understanding EscrowX

## What is EscrowX?

EscrowX is a decentralized freelance marketplace with an integrated blockchain escrow system.

It combines the marketplace experience of traditional freelance platforms with a decentralized payment protection layer powered by **Stellar and Soroban smart contracts**.

The fundamental workflow is:

```text
Client Creates Project
        ↓
Create Escrow On-Chain
        ↓
Client Funds Escrow
        ↓
Funds Locked in Smart Contract
        ↓
Project Published
        ↓
Freelancers Apply
        ↓
Client Selects Freelancer
        ↓
Work Begins
        ↓
Freelancer Delivers
        ↓
Client Reviews
        ↓
Client Approves
        ↓
Smart Contract Releases Payment
        ↓
Freelancer Receives Funds
```

---

## Why EscrowX Uses Escrow

Traditional freelance transactions require trust.

A freelancer may worry:

> "What if I finish the work and the client doesn't pay?"

A client may worry:

> "What if I pay first and the freelancer disappears?"

EscrowX solves both problems.

Before a project becomes available to freelancers, the client funds an on-chain escrow.

The funds remain locked until the smart contract allows them to move.

```text
Client Wallet
      ↓
Soroban Smart Contract
      ↓
Funds Locked On-Chain
      ↓
Approval / Valid Refund / Dispute Resolution
      ↓
Client or Freelancer Wallet
```

The platform itself does not custody project funds.

---

# Client Guide

Clients can use EscrowX to:

* Create projects
* Define project requirements
* Set budgets and deadlines
* Fund escrow agreements
* Publish funded projects
* Review freelancer proposals
* Select freelancers
* Monitor project progress
* Review submitted work
* Approve deliveries
* Release payments
* Request refunds when allowed
* Raise disputes when necessary

---

# Creating and Funding a Project

## Prerequisites

Before creating a funded project:

* Wallet must be connected
* Freighter must be available
* Wallet must be on the correct Stellar network
* Wallet must have sufficient balance
* Client account must be authenticated

---

## Steps to Create a Project

### 1. Open the Client Dashboard

Log into EscrowX as a **Client**.

Navigate to the project creation section.

---

### 2. Enter Project Details

Provide the required information, such as:

* Project title
* Project description
* Required skills
* Budget
* Delivery deadline
* Additional requirements

Review everything carefully before continuing.

---

### 3. Click "Continue & Fund"

EscrowX follows a strict:

> **Fund Before Publish**

model.

Clicking **Continue & Fund** begins the blockchain escrow process.

---

### 4. Create Escrow On-Chain

EscrowX invokes:

```text
createEscrow()
```

or the corresponding contract method:

```text
create_escrow()
```

This creates a unique escrow agreement on the Soroban smart contract.

The escrow contains the required project and participant information needed by the contract.

---

### 5. Fund the Escrow

After successful escrow creation, EscrowX invokes:

```text
fundEscrow()
```

or:

```text
fund_escrow()
```

Freighter will ask you to authorize the blockchain transaction.

Review the transaction carefully and approve it.

---

### 6. Funds Are Locked

After successful funding:

```text
Client Wallet
      ↓
fundEscrow()
      ↓
Soroban Smart Contract
      ↓
LOCKED FUNDS
```

The funds are **not transferred to an EscrowX treasury wallet**.

They remain controlled by the smart contract.

---

### 7. Blockchain Confirmation

EscrowX records and synchronizes relevant information such as:

* Escrow ID
* Transaction hash
* Contract information
* Blockchain escrow status
* Project funding status

---

### 8. Project Is Published

The project is published to the marketplace **only after successful escrow creation and funding**.

```text
createEscrow() SUCCESS
        ↓
fundEscrow() SUCCESS
        ↓
Store Escrow Data
        ↓
Publish Project
```

If escrow creation or funding fails, the project must not be treated as a successfully funded marketplace listing.

---

# Freelancer Guide

Freelancers can:

* Browse funded projects
* Review project requirements
* Submit proposals
* Track applications
* Work on accepted projects
* Submit deliverables
* Upload files and links
* Receive blockchain-secured payments

The major advantage for freelancers is simple:

> Projects available through the funded workflow already have payment secured through escrow.

---

# Applying to a Project

## Steps to Apply

1. Connect your wallet.
2. Log into your Freelancer account.
3. Browse available projects.
4. Open a project.
5. Review:

   * Requirements
   * Budget
   * Skills
   * Deadline
6. Click **Apply** or **Submit Proposal**.
7. Enter your proposal information.
8. Submit the application.

The client can then review your proposal.

---

# Selecting a Freelancer

After receiving applications, the client can review freelancer proposals.

## Client Selection Flow

```text
Project Published
      ↓
Freelancers Apply
      ↓
Client Reviews Applications
      ↓
Client Selects Freelancer
      ↓
markInProgress()
      ↓
Project = IN_PROGRESS
```

When the appropriate freelancer is selected, EscrowX updates the project workflow and invokes the corresponding smart contract transition.

```text
markInProgress()
```

or:

```text
mark_in_progress()
```

The escrow status changes to:

```text
IN_PROGRESS
```

Both parties can then continue through the project workspace.

---

# Project Delivery

Once selected, the freelancer completes the agreed work.

Depending on the project, deliverables may include:

* Project files
* Images
* Documents
* ZIP archives
* Demo URLs
* Deployed application links
* GitHub repository links
* Additional delivery notes

---

## Submitting Work

### 1. Open the Active Project

Navigate to your active project or delivery workspace.

### 2. Add Deliverables

Upload or provide all required project materials.

### 3. Submit Delivery

Click the delivery submission action.

EscrowX invokes:

```text
markDelivered()
```

or:

```text
mark_delivered()
```

### 4. Blockchain Status Updates

The escrow transitions:

```text
IN_PROGRESS
      ↓
DELIVERED
```

The blockchain now contains an immutable state transition showing that delivery was submitted.

---

# Approving Work and Releasing Payment

After the freelancer submits the project, the client reviews the delivery.

The client should verify:

* Required features
* Files
* Quality
* Project requirements
* Demo links
* Repository links
* Any agreed deliverables

---

## Approving the Project

If everything is satisfactory:

1. Open the delivered project.
2. Review all submitted materials.
3. Click **Approve Project**.
4. Confirm the wallet transaction when requested.

EscrowX invokes:

```text
approveDelivery()
```

or:

```text
approve_delivery()
```

The smart contract validates the escrow state and authorization.

If valid:

```text
Locked Escrow Funds
        ↓
approveDelivery()
        ↓
Freelancer Wallet
```

The escrow transitions:

```text
DELIVERED
    ↓
COMPLETED
```

The payment is released directly according to the smart contract rules.

---

# Refunds

EscrowX includes refund functionality for situations where a valid refund is allowed by the contract lifecycle.

Relevant contract functions include:

```text
requestRefund()
refundEscrow()
```

or:

```text
request_refund()
refund_escrow()
```

---

## Requesting a Refund

When permitted:

1. Open the relevant escrow/project.
2. Select the refund option.
3. Provide any required information.
4. Confirm the request.
5. Approve the blockchain transaction.

The contract validates whether the refund action is allowed in the current escrow state.

---

## Refund Execution

When a refund is valid and executed:

```text
Locked Escrow Funds
        ↓
refundEscrow()
        ↓
Client Wallet
```

The escrow may transition to:

```text
REFUNDED
```

depending on the contract workflow.

Funds cannot be arbitrarily withdrawn while locked.

The smart contract determines whether a refund operation is valid.

---

# Disputes

When the client and freelancer cannot resolve a disagreement normally, EscrowX supports a dispute workflow.

Relevant functions include:

```text
raiseDispute()
resolveDispute()
```

or:

```text
raise_dispute()
resolve_dispute()
```

---

## Raising a Dispute

A dispute may involve situations such as:

* Delivery disagreements
* Incomplete work
* Project requirement conflicts
* Refund disagreements
* Other escrow-related conflicts

When permitted:

1. Open the relevant project.
2. Select **Raise Dispute**.
3. Provide the required dispute information.
4. Submit the dispute.
5. Confirm the blockchain transaction.

The escrow transitions to:

```text
DISPUTED
```

Funds remain protected by the escrow contract while the dispute is unresolved.

---

# Admin Functions

Admins/arbitrators are responsible for permitted dispute-resolution operations.

Admins do **not** freely control escrow funds.

Their actions remain constrained by smart contract logic.

---

## Resolve a Dispute

The authorized admin can:

1. Open the disputed escrow.
2. Review the dispute.
3. Review relevant project and delivery information.
4. Determine the appropriate resolution.
5. Execute the resolution through the contract.

Relevant function:

```text
resolveDispute()
```

or:

```text
resolve_dispute()
```

Depending on the resolution, the escrow may transition toward:

```text
DISPUTED
   ↓
COMPLETED
```

or:

```text
DISPUTED
   ↓
REFUNDED
```

The final fund movement is executed according to smart contract rules.

---

# Escrow Lifecycle

## Primary Successful Flow

```text
PENDING
   ↓
FUNDED
   ↓
IN_PROGRESS
   ↓
DELIVERED
   ↓
COMPLETED
```

### Meaning

**PENDING**

Escrow has been created but the complete funded workflow has not yet been finalized.

**FUNDED**

Client funds are securely locked in the Soroban smart contract.

**IN_PROGRESS**

A freelancer has been selected and work is underway.

**DELIVERED**

The freelancer has submitted the work.

**COMPLETED**

The client approved the delivery and payment was released according to the contract.

---

## Revision Flow

Where supported by the active application/contract workflow:

```text
DELIVERED
      ↓
REVISION_REQUESTED
      ↓
DELIVERED
      ↓
COMPLETED
```

The freelancer can address requested changes and submit the updated delivery again.

---

## Dispute Flow

```text
DELIVERED
      ↓
DISPUTED
     ↙ ↘
REFUNDED COMPLETED
```

The final outcome depends on the valid dispute resolution.

---

# Smart Contract Functions

EscrowX uses Soroban smart contracts to enforce the escrow lifecycle.

| Function            | Purpose                          |
| ------------------- | -------------------------------- |
| `createEscrow()`    | Create a new escrow agreement    |
| `fundEscrow()`      | Lock client funds in escrow      |
| `getEscrow()`       | Read current escrow information  |
| `markInProgress()`  | Move project into active work    |
| `markDelivered()`   | Record project delivery          |
| `approveDelivery()` | Approve work and release payment |
| `requestRefund()`   | Request a refund                 |
| `refundEscrow()`    | Execute a valid refund           |
| `raiseDispute()`    | Move an escrow into dispute      |
| `resolveDispute()`  | Resolve a disputed escrow        |

Equivalent contract implementations may use snake_case naming such as:

```text
create_escrow()
fund_escrow()
get_escrow()
mark_in_progress()
mark_delivered()
approve_delivery()
request_refund()
refund_escrow()
raise_dispute()
resolve_dispute()
```

---

# Role Permissions

## Client

Clients can perform permitted actions such as:

```text
createEscrow()
fundEscrow()
approveDelivery()
requestRefund()
raiseDispute()
```

---

## Freelancer

Freelancers can perform permitted actions such as:

```text
markInProgress()
markDelivered()
```

depending on the exact application workflow and contract authorization.

---

## Admin / Arbitrator

Authorized administrators can perform permitted dispute-resolution actions such as:

```text
resolveDispute()
```

Smart contract authorization prevents unauthorized users from executing protected functions.

---

# Blockchain Synchronization

EscrowX treats blockchain state as the authoritative source for escrow lifecycle information.

The synchronization architecture follows:

```text
React Frontend
      ↓
Freighter Wallet
      ↓
Soroban Smart Contract
      ↓
Stellar Blockchain State
      ↓
Backend Synchronization
      ↓
Updated UI
```

The backend may store application metadata such as:

* Project information
* User profiles
* Proposals
* Delivery metadata
* Escrow references
* Transaction hashes
* Contract references

However, escrow fund control and blockchain lifecycle validation remain governed by the smart contract.

---

# Security Model

EscrowX follows several important security principles.

## 1. Non-Custodial Fund Management

Project funds are not intended to remain inside a platform-controlled treasury wallet.

```text
Client
   ↓
Soroban Escrow Contract
   ↓
Locked
```

---

## 2. State-Based Execution

Actions are permitted only when the escrow is in an appropriate state.

For example:

```text
PENDING → FUNDED
```

is valid when funding requirements are satisfied.

A transition attempting to bypass required lifecycle stages should be rejected by contract validation.

---

## 3. Role-Based Authorization

Different actions belong to different participants.

```text
Client
Freelancer
Admin
```

Unauthorized wallet addresses should not be able to execute protected escrow operations.

---

## 4. Wallet-Controlled Transactions

Blockchain transactions require wallet authorization.

EscrowX never requires users to provide private keys to the application.

---

# Core EscrowX Rules

```text
If escrow is not created
→ Nothing exists on-chain.

If escrow is not funded
→ Project must not be treated as a funded published listing.

If work is not approved
→ Normal approval payment release does not occur.

If a dispute exists
→ Resolution follows the permitted dispute workflow.

If a transaction is invalid
→ Smart contract validation rejects it.
```

The most important rule is:

> **No escrow created = nothing exists. No funding = no funded listing. No approval = normal payment release does not happen.**

---

# Troubleshooting

## Wallet Won't Connect

**Problem:** Clicking **Connect Wallet** does nothing.

### Solutions

1. Ensure Freighter is installed.
2. Make sure the extension is enabled.
3. Unlock your wallet.
4. Verify the correct network is selected.
5. Refresh EscrowX.
6. Disconnect and reconnect if necessary.

---

## Wrong Network

**Problem:** EscrowX cannot execute transactions or shows a network-related error.

### Solution

1. Open Freighter.
2. Check the currently selected network.
3. Switch to the Stellar network required by the current EscrowX deployment.
4. Reconnect your wallet.
5. Retry the operation.

---

## Account Not Found / Unfunded Wallet

**Problem:** Stellar reports that your account does not exist.

A new Stellar account must be activated before it exists on-chain.

### Solutions

1. Verify the connected wallet address.
2. Confirm you are using the correct network.
3. Check the address on a Stellar explorer.
4. If using Testnet, fund a new account with Testnet XLM.
5. Reconnect and retry.

If you already funded the account, verify that EscrowX and Freighter are using the **same network**.

---

## Continue & Fund Fails

Possible reasons include:

* Wallet disconnected
* Wrong network
* Insufficient balance
* Escrow creation failed
* Funding transaction rejected
* User rejected wallet signature
* Smart contract validation failed

### Important

A project should not be considered successfully published through the funded workflow unless the required escrow creation and funding steps complete successfully.

---

## Transaction Rejected in Freighter

If you click **Reject** in Freighter, the transaction will not execute.

Retry the action and approve the transaction if you want to continue.

Never approve a wallet transaction you do not understand.

---

## Freelancer Cannot Apply

Possible reasons:

* Wallet is disconnected
* User is not authenticated as a Freelancer
* Project is unavailable
* Project is no longer accepting proposals
* Project state has changed

Refresh the project and verify your account and wallet status.

---

## Cannot Start Project

Possible reasons:

* Freelancer has not been correctly selected
* Escrow is not funded
* Escrow is in the wrong state
* Wallet is unauthorized
* Blockchain synchronization is incomplete

Check the current escrow status before retrying.

---

## Cannot Submit Delivery

Possible reasons:

* Project is not `IN_PROGRESS`
* Connected wallet is not authorized
* Required delivery information is missing
* Previous transaction is still pending
* Contract rejected an invalid state transition

Refresh the project and verify the blockchain status.

---

## Cannot Approve Delivery

Possible reasons:

* Delivery has not been submitted
* Escrow is not `DELIVERED`
* Connected wallet is not the authorized client
* Transaction was rejected
* Contract validation failed

Only valid escrow states can proceed to approval.

---

## Payment Not Received Immediately

After approval:

1. Wait for blockchain confirmation.
2. Refresh the application.
3. Check the escrow status.
4. Verify the transaction hash.
5. Check the freelancer wallet using a Stellar explorer.

Do not repeat approval transactions without first verifying whether the previous transaction succeeded.

---

## UI Status Doesn't Match Blockchain

EscrowX synchronizes blockchain information with frontend/backend application state.

If the UI appears outdated:

1. Refresh the page.
2. Reconnect your wallet.
3. Wait for blockchain confirmation.
4. Check the transaction using a Stellar explorer.
5. Reload the project.

The blockchain escrow state should be treated as the authoritative source for on-chain escrow status.

---

# FAQ

## What is EscrowX?

EscrowX is a decentralized freelance escrow marketplace built using Stellar and Soroban smart contracts.

It protects clients and freelancers through blockchain-enforced escrow payments.

---

## How does EscrowX protect freelancers?

Clients fund the escrow before a project enters the funded marketplace workflow.

This gives freelancers verifiable assurance that the project's payment has been secured according to the escrow contract.

---

## How does EscrowX protect clients?

Funds are not immediately paid to the freelancer.

They remain locked in escrow while the project is being completed.

Normal payment release occurs after the required approval conditions are satisfied.

---

## Does EscrowX hold my money?

No.

The architecture is designed so project funds are locked through the Soroban smart contract rather than held in a traditional platform-controlled treasury wallet.

---

## When is a project published?

The core EscrowX workflow is:

```text
Create Project
      ↓
Create Escrow
      ↓
Fund Escrow
      ↓
Confirm Blockchain Transaction
      ↓
Store Escrow Reference
      ↓
Publish Project
```

A project should not be treated as successfully funded/published through this workflow if escrow funding fails.

---

## Can a freelancer see whether a project is funded?

The platform synchronizes escrow information with project state so funded projects can be represented accordingly.

The underlying escrow status can also be verified using blockchain state.

---

## When does the freelancer receive payment?

In the standard successful workflow:

```text
Freelancer Delivers
      ↓
Client Reviews
      ↓
Client Approves
      ↓
approveDelivery()
      ↓
Smart Contract Releases Funds
      ↓
Freelancer Receives Payment
```

---

## Can the client take the money back anytime?

No.

Once funds are locked in escrow, fund movement must follow the smart contract's permitted lifecycle.

Refunds must satisfy the appropriate contract conditions.

---

## What happens if the client and freelancer disagree?

A dispute can be raised when permitted by the escrow workflow.

The escrow enters a disputed state and an authorized resolution process determines the permitted outcome.

---

## Can EscrowX administrators steal escrow funds?

The platform architecture is designed so admins do not have unrestricted control over escrow funds.

Admin/arbitrator actions must follow the authorization and dispute-resolution logic implemented by the smart contract.

---

## What happens if a freelancer never delivers?

The funds remain governed by the escrow contract rather than automatically being released simply because time has passed.

Available refund or dispute mechanisms depend on the implemented escrow rules and current state.

---

## What happens if the client refuses to approve valid work?

The dispute workflow can be used when applicable.

```text
DELIVERED
    ↓
DISPUTED
    ↓
Resolution
```

The resolution determines the permitted final outcome.

---

## Are transactions transparent?

Blockchain transactions and contract interactions recorded on Stellar can be independently verified using blockchain explorers and contract state.

Application-specific private information should not be assumed to be private merely because the payment workflow uses blockchain.

---

## Does EscrowX store my private key?

No.

Wallet signing occurs through Freighter.

Never enter your wallet recovery phrase or secret key into EscrowX.

---

## What blockchain does EscrowX use?

EscrowX uses:

* **Stellar**
* **Soroban Smart Contracts**

The current development/testing deployment uses the configured Stellar testing environment before production/mainnet deployment.

---

## What are the main smart contract functions?

```text
createEscrow()
fundEscrow()
getEscrow()
markInProgress()
markDelivered()
approveDelivery()
requestRefund()
refundEscrow()
raiseDispute()
resolveDispute()
```

Together, these functions manage the escrow lifecycle from creation through completion, refund, or dispute resolution.

---

# Quick Reference Card

```text
┌─────────────────────────────────────────────────────────────┐
│                  ESCROWX QUICK REFERENCE                    │
├─────────────────────────────────────────────────────────────┤
│ Blockchain:              Stellar                            │
│ Smart Contracts:         Soroban                            │
│ Wallet:                  Freighter                          │
│ Main Roles:              Client / Freelancer / Admin        │
│                                                            │
│ FUNDING FLOW                                                │
│ Create Escrow → Fund Escrow → Publish Project              │
│                                                            │
│ STANDARD FLOW                                               │
│ PENDING → FUNDED → IN_PROGRESS → DELIVERED → COMPLETED     │
│                                                            │
│ DISPUTE FLOW                                                │
│ DELIVERED → DISPUTED → COMPLETED / REFUNDED                │
│                                                            │
│ FUND STORAGE                                                │
│ Client → Soroban Contract → Locked On-Chain                │
│                                                            │
│ CORE RULES                                                  │
│ No Escrow  = Nothing Exists                                │
│ No Funding = No Funded Published Listing                   │
│ No Approval = No Normal Payment Release                    │
│                                                            │
│ SECURITY                                                    │
│ Non-Custodial Escrow                                       │
│ Wallet-Signed Transactions                                 │
│ Role-Based Authorization                                   │
│ State-Based Contract Execution                             │
└─────────────────────────────────────────────────────────────┘
```

---

# Complete EscrowX Flow

```text
CLIENT
  │
  ├── Create Project
  │
  ├── Continue & Fund
  │
  ▼
createEscrow()
  │
  ▼
fundEscrow()
  │
  ▼
FUNDS LOCKED ON-CHAIN
  │
  ▼
PROJECT PUBLISHED
  │
  ▼
FREELANCERS APPLY
  │
  ▼
CLIENT SELECTS FREELANCER
  │
  ▼
markInProgress()
  │
  ▼
IN_PROGRESS
  │
  ▼
FREELANCER COMPLETES WORK
  │
  ▼
SUBMIT DELIVERY
  │
  ▼
markDelivered()
  │
  ▼
DELIVERED
  │
  ├──────────────────────────────┐
  │                              │
  ▼                              ▼
CLIENT APPROVES              DISPUTE / REFUND FLOW
  │                              │
  ▼                              ▼
approveDelivery()            Contract Validation
  │                              │
  ▼                              ▼
FUNDS RELEASED              Resolution
  │                         ↙          ↘
  ▼                    REFUNDED     COMPLETED
FREELANCER WALLET
  │
  ▼
COMPLETED
```

---

**Project:** EscrowX
**Version:** 1.0
**Blockchain:** Stellar
**Smart Contracts:** Soroban
**Current Environment:** Stellar Testnet
**Architecture:** Decentralized Non-Custodial Freelance Escrow Marketplace

---

**EscrowX — Trustless Work. Guaranteed Payments.**

> Instead of trusting people with payments, EscrowX trusts transparent, enforceable smart contract rules.
