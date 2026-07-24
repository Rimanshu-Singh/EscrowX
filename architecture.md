# EscrowX Architecture Documentation

## System Overview

EscrowX is a decentralized freelance escrow marketplace built on the **Stellar blockchain** using **Soroban smart contracts**. The platform protects clients and freelancers by locking project funds on-chain before a project is published and releasing them only after successful delivery approval or a valid refund/dispute resolution.

```text
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                      │
│  ┌──────────────┐  ┌────────────────┐  ┌────────────────┐      │
│  │ Landing Page │  │Client Dashboard│  │Freelancer Dash │      │
│  └──────────────┘  └────────────────┘  └────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Application Layer (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐        │
│  │ Escrow Hooks │  │Wallet Service│  │ Project / Auth │        │
│  │ & Services   │  │ Integration  │  │     Logic      │        │
│  └──────────────┘  └──────────────┘  └────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌─────────────────────────────┐ ┌───────────────────────────────┐
│       Backend Layer         │ │ Blockchain Integration Layer  │
│ Node.js + Express + MongoDB │ │ Stellar SDK + Freighter + RPC │
│ Projects / Users / Delivery │ │ Transaction Signing / Queries │
└─────────────────────────────┘ └───────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Stellar Blockchain                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                 Escrow Smart Contract                     │  │
│  │ Create │ Fund │ Progress │ Deliver │ Approve │ Disputes  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### 1. Frontend Layer

**Technology Stack:**

* Vite + React
* TypeScript
* Modern responsive UI
* Freighter Wallet integration

**Key Areas:**

```text
Frontend
├── Landing Page
├── Authentication
├── Client Dashboard
├── Freelancer Dashboard
├── Project Marketplace
├── Proposal Management
├── Delivery Workspace
└── Escrow Status UI
```

The frontend allows users to interact with EscrowX while blockchain transactions are signed through their connected wallet.

---

### 2. Backend Layer

**Technology Stack:**

* Node.js
* Express
* MongoDB

The backend manages off-chain application data such as:

```text
Backend
├── User Profiles
├── Project Information
├── Freelancer Proposals
├── Selected Freelancer
├── Delivery Metadata
├── Escrow References
└── Transaction Logs
```

The backend does **not custody project funds**.

Funds remain controlled by the Soroban escrow smart contract.

---

### 3. Blockchain Integration Layer

EscrowX connects the frontend to Stellar through:

```text
Blockchain Integration
├── Stellar SDK
├── Freighter Wallet
├── Soroban RPC
├── Smart Contract Service
└── Blockchain State Queries
```

**Transaction Flow:**

```text
User Action
    ↓
Build Contract Transaction
    ↓
Simulate Transaction
    ↓
Freighter Wallet Signature
    ↓
Submit to Stellar
    ↓
Blockchain Confirmation
    ↓
Backend Sync
    ↓
UI Update
```

Freighter manages transaction signing without exposing private keys to EscrowX.

---

### 4. Smart Contract Layer

EscrowX uses a Soroban smart contract to control the complete escrow lifecycle.

**Core Functions:**

```text
Escrow Contract
├── createEscrow()
├── fundEscrow()
├── getEscrow()
├── markInProgress()
├── markDelivered()
├── approveDelivery()
├── requestRefund()
├── refundEscrow()
├── raiseDispute()
└── resolveDispute()
```

**Contract ID:**

```text
Stellar Testnet Contract ID: CALCCHS44ZJ6U7CFI2NNRIP6IP63XAMNFTGO4RROBGTBF5L7USASFAL7
```

The smart contract acts as the primary trust and fund-control layer.

---

## 5. Core Data Flows

### Project Creation & Funding

```text
Client Dashboard
      ↓
Create Project
      ↓
Continue & Fund
      ↓
createEscrow()
      ↓
fundEscrow()
      ↓
Funds Locked On-Chain
      ↓
Store Escrow ID + Transaction Hash
      ↓
Publish Project
```

A project is published only after the required escrow funding process succeeds.

---

### Freelancer Workflow

```text
Funded Project
      ↓
Freelancer Applies
      ↓
Client Reviews Proposals
      ↓
Select Freelancer
      ↓
markInProgress()
      ↓
IN_PROGRESS
      ↓
Freelancer Submits Delivery
      ↓
markDelivered()
      ↓
DELIVERED
```

---

### Payment Release Flow

```text
DELIVERED
    ↓
Client Reviews Work
    ↓
Approve Project
    ↓
approveDelivery()
    ↓
Smart Contract Releases Funds
    ↓
Freelancer Wallet
    ↓
COMPLETED
```

Funds move according to the smart contract rather than through an EscrowX-controlled wallet.

---

### Refund & Dispute Flow

```text
Project / Delivery Issue
        ↓
requestRefund() / raiseDispute()
        ↓
      DISPUTED
       ↙     ↘
refundEscrow() resolveDispute()
      ↓             ↓
  REFUNDED     COMPLETED / REFUNDED
```

The contract validates permissions and escrow state before allowing fund movement.

---

## 6. State Management

### Frontend State

```text
├── Wallet Connection
├── Authentication
├── User Role
├── Transaction Loading
├── Project Data
└── Error / Success Messages
```

### Backend State

```text
├── Users
├── Projects
├── Proposals
├── Deliveries
├── Escrow IDs
└── Transaction References
```

### Blockchain State — Source of Truth

```text
├── Escrow Status
├── Client Address
├── Freelancer Address
├── Locked Funds
└── Escrow Lifecycle
```

The blockchain acts as the authoritative source for on-chain escrow state.

---

## 7. Security Architecture

### Non-Custodial Escrow

```text
Client Wallet
      ↓
Soroban Smart Contract
      ↓
Locked Funds
```

EscrowX does not directly custody project funds.

### Wallet Security

* Private keys never stored by EscrowX
* Transactions signed through Freighter
* User approval required for blockchain transactions

### Smart Contract Security

* Role-based authorization
* State-based execution
* Invalid state transitions prevented
* Fund movement controlled by contract rules

---

## 8. Escrow State Machine

### Primary Flow

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

### Revision Flow

```text
DELIVERED
      ↓
REVISION_REQUESTED
      ↓
DELIVERED
      ↓
COMPLETED
```

### Dispute Flow

```text
DELIVERED
      ↓
DISPUTED
     ↙ ↘
REFUNDED COMPLETED
```

---

## 9. Deployment Architecture

### Frontend

```text
React + Vite
     ↓
Production Build
     ↓
Vercel
```

### Backend

```text
Node.js + Express
      ↓
Cloud Hosting
      ↓
MongoDB
```

### Blockchain

```text
Soroban Rust Contract
      ↓
Stellar CLI Deployment
      ↓
Stellar Testnet
      ↓
Soroban RPC
```

---

## 10. Technology Decisions

| Component      | Technology                | Purpose                                          |
| -------------- | ------------------------- | ------------------------------------------------ |
| Blockchain     | Stellar                   | Fast and low-cost blockchain transactions        |
| Smart Contract | Soroban / Rust            | Secure escrow lifecycle and fund control         |
| Frontend       | Vite + React + TypeScript | Fast and modern Web3 frontend                    |
| Backend        | Node.js + Express         | Application API and business logic               |
| Database       | MongoDB                   | Projects, users, proposals and delivery metadata |
| Wallet         | Freighter                 | Stellar wallet connection and signing            |
| Deployment     | Vercel                    | Frontend deployment                              |

---

## Architecture Principle

EscrowX follows one fundamental rule:

```text
No Escrow Created
        ↓
Nothing Exists

No Escrow Funding
        ↓
No Funded Project Publication

No Valid Approval / Resolution
        ↓
Locked Funds Do Not Move
```

The complete architecture separates **application data** from **fund custody**.

```text
Frontend / Backend
        ↓
Application Data

Soroban Smart Contract
        ↓
Escrow State + Fund Control
```

This makes EscrowX a **non-custodial, blockchain-enforced freelance escrow marketplace**.

---

## Glossary

* **Escrow:** Funds locked until predefined conditions are completed
* **Soroban:** Stellar's smart contract platform
* **Freighter:** Stellar browser wallet
* **XLM:** Native asset of the Stellar network
* **RPC:** Interface used to communicate with blockchain nodes
* **Escrow ID:** Unique identifier for an escrow agreement
* **Transaction Hash:** Unique blockchain transaction reference
* **Non-Custodial:** Platform does not directly control user funds

---

## References

* [Stellar Documentation](https://developers.stellar.org)
* [Soroban Documentation](https://developers.stellar.org/docs/build/smart-contracts)
* [Freighter Documentation](https://docs.freighter.app)
