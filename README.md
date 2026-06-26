# 🚀 EscrowX - Decentralized Freelance Escrow Marketplace 

A **next-generation decentralized freelance escrow system** built on **Stellar blockchain + Soroban smart contracts**, enabling trustless hiring, milestone-based delivery, and secure fund locking between clients and freelancers.

---

## 🌟 What is EscrowX?

EscrowX is a **Web3 freelance marketplace system** where:

- Clients MUST fund escrow before publishing a job
- Freelancers work only on funded projects
- Funds are locked inside smart contracts (not platform wallets)
- Payment is released ONLY after client approval

👉 This removes scams, chargebacks, and trust issues in freelancing.

---

## ⚠️ Current Problem (Real World)

Traditional platforms like Fiverr / Upwork:

- Client can cancel after receiving work
- Freelancer can be scammed
- Platform controls funds (centralized risk)
- No real ownership or transparency

---

## 💡 EscrowX Solution

EscrowX solves one of the biggest problems in freelancing: **trust**.

Clients often fear paying before receiving quality work, while freelancers fear completing work without getting paid. EscrowX eliminates this trust gap by locking funds inside a **Soroban Smart Contract** before work begins. The payment remains securely locked on-chain until the client approves the delivery or requests a refund, ensuring a transparent, secure, and decentralized workflow for both parties.

---
## 🧠 Real World Example

👉 John hires a designer

Old System:
John receives logo → refuses payment ❌ scam

EscrowX System:
John funds escrow → cannot access work until approval ✔ safe

---
# ✅ Project Completion Checklist

## ⚙️ Core Smart Contract Functions

✔ `createEscrow()` — Create escrow agreement on-chain

✔ `fundEscrow()` — Lock client funds inside the smart contract

✔ `getEscrow()` — Read escrow details and current status

✔ `markInProgress()` — Move escrow to **IN_PROGRESS**

✔ `markDelivered()` — Mark work as **DELIVERED**

✔ `approveDelivery()` — Release locked funds to freelancer

✔ `refundEscrow()` — Return locked funds back to client

---


## 🔄 Escrow State Machine

✔ PENDING

✔ FUNDED

✔ IN_PROGRESS

✔ DELIVERED

✔ COMPLETED

✔ REFUNDED

---

## 🎯 Current MVP Status

🟢 Smart Contract: Complete

🟢 Frontend Integration: Complete

🟢 Escrow Lifecycle: Complete

🟢 Delivery Workflow: Complete

🟢 Approval Workflow: Complete

🟢 Refund Workflow: Complete

🟢 Blockchain Synchronization: Complete

🟢 Production-Ready 

---


## 🏆 Stellar Journey to Master
## 🧭 Belt System Progress
 
| Level | Belt | Focus | Status |
|-------|------|-------|--------|
| ⚪️ Level 1 | White Belt | Wallets & transactions | ✅ Completed |
| 🟡 Level 2 | Yellow Belt | Multi-wallet, contracts & events | ✅ Completed |
| 🟠 Level 3 | Orange Belt | Mini dApp + tests | ✅ Completed |
| 🟢 Level 4 | Green Belt | Advanced contracts & production readiness | ✅ Completed |
| 🔵 Level 5 | Blue Belt | Real MVP (5+ users) | 🔜 Upcoming |
| ⚫️ Level 6 | Black Belt | Scale + Demo Day readiness | 🔜 Upcoming |
 
---

## 🟢 Current Status: GREEN BELT (Completed)

 ## 📋 Contract Addresses (Testnet)

| Name | Address |
|------|---------|
| 💎 Main Escrow Contract (v2) | `CALCCHS44ZJ6U7CFI2NNRIP6IP63XAMNFTGO4RROBGTBF5L7USASFAL7` |

---

## 🔗 Transaction Hashes (Testnet)

| Action | TX Hash |
|--------|---------|
| Contract Deploy ID | `CALCCHS44ZJ6U7CFI2NNRIP6IP63XAMNFTGO4RROBGTBF5L7USASFAL7` |
## 📸 Demo Screenshots
<img width="2551" height="1312" alt="Screenshot 2026-06-26 180236" src="https://github.com/user-attachments/assets/fe843108-59a0-4419-a853-92e087b9eddf" />

## Analytics 
<img width="2551" height="1305" alt="Screenshot 2026-06-26 175627" src="https://github.com/user-attachments/assets/385bd30b-9aa6-4c10-bd1e-d00c116c7534" />

---
## 🧠 HIGH LEVEL SYSTEM ARCHITECTURE
```mermaid
 flowchart TD

A[User Browser / Frontend Next.js] --> B[Auth Layer]
B --> C{Wallet Connected?}

C -- No --> C1[Block Access + Show Connect Wallet]
C -- Yes --> D[JWT Auth Server]

D --> E[Role Based Router]

E --> F1[Client Dashboard]
E --> F2[Freelancer Dashboard]
E --> F3[Arbitrator Dashboard]
E --> F4[Admin Panel]

F1 --> G1[Job / Escrow Creation]
F2 --> G2[Job Browsing / Delivery]
F3 --> G3[Dispute Resolution]
F4 --> G4[System Control]

G1 --> H[Backend API Layer]
G2 --> H
G3 --> H
G4 --> H

H --> I[MongoDB Database]

H --> J[Socket.IO Realtime Layer]

H --> K[Stellar SDK Service]
K --> L[Soroban Smart Contract]

L --> M[Stellar Blockchain]

J --> A

```
---
## 🏗️ USER WORKFLOW ARCHITECT
```mermaid
sequenceDiagram

participant U as User
participant L as Landing Page
participant W as Wallet Connect
participant A as Auth System
participant B as Backend API
participant D as Database
participant S as Smart Contract
participant X as Stellar Blockchain

U->>L: Open EscrowX
L->>U: Show Client / Freelancer CTA

U->>W: Connect Wallet (MANDATORY)

W->>A: Wallet Signature Verification

A->>B: Check User Exists

alt New User
B->>D: Create User (email + wallet + role)
A->>U: Redirect Signup
else Existing User
A->>U: Redirect Signin
end

U->>A: Login (email + password + wallet)
A->>B: Validate credentials + wallet match
B->>D: Fetch user
B->>A: JWT token

A->>U: Redirect Role Dashboard

U->>B: Create Escrow / Job
B->>S: Create Smart Contract Escrow
S->>X: Lock Funds

U->>B: Submit Work
B->>S: Update contract state

U->>B: Approve / Dispute
B->>S: Release / Refund funds
S->>X: Transfer XLM / USDC
```
---
## ⛓ SMART CONTRACT ARCHITECTURE

```mermaid

flowchart TD

SC[Escrow Smart Contract]

SC --> C1[createEscrow]
SC --> C2[fundEscrow]
SC --> C3[markInProgress]
SC --> C4[markDelivered]
SC --> C5[approveDelivery]
SC --> C6[requestRefund]
SC --> C7[refundEscrow]
SC --> C8[raiseDispute]
SC --> C9[resolveDispute]
SC --> C10[getEscrow]
```
---

## 💳 Blockchain Integration

✔ Freighter Wallet integration

✔ Wallet transaction signing

✔ On-chain transaction execution

✔ Transaction hash captured

✔ Smart contract invocation

✔ Read-only contract queries

✔ Frontend synchronized with blockchain state

---

## 🖥️ Frontend Integration

✔ React + TypeScript integration

✔ Smart contract service layer

✔ Reusable contract hooks

✔ Escrow status synchronization

✔ Delivery workflow connected

✔ Approval workflow connected

✔ Refund workflow connected

✔ Real-time UI state updates

---

## 🔐 Security

✔ Funds never remain under platform control

✔ Funds locked directly inside Soroban Smart Contract

✔ Blockchain acts as the single source of truth

✔ Escrow lifecycle validation implemented

✔ Invalid state transitions prevented

---

## 🏗 Tech Stack

Frontend
- Vite + TypeScript
- React UI
- Freighter Wallet Integration

Backend
- Node.js + Express
- MongoDB 
- Transaction logging

Blockchain Layer
- Stellar Testnet
- Soroban Smart Contracts

---

## ⛓ SMART CONTRACT (SOROBAN)

Contract ID (Testnet)
UPCOMING / NOT SET YET

---

## ⚙️ Contract Functions

- createEscrow()
- fundEscrow()
- markInProgress()
- markDelivered()
- approveDelivery()
- requestRefund()
- refundEscrow()
- raiseDispute()
- resolveDispute()
- getEscrow()

---
```text
## 📊 ESCROW STATE MACHINE

PENDING
  ↓
FUNDED
  ↓
IN_PROGRESS
  ↓
DELIVERED
  ↓
COMPLETED

---

Revision Flow:

DELIVERED
  ↓
REVISION_REQUESTED
  ↓
DELIVERED
  ↓
COMPLETED

---

Dispute Flow:

DELIVERED
  ↓
DISPUTED
  ↓
REFUNDED

OR

DELIVERED
  ↓
DISPUTED
  ↓
COMPLETED

---

## 🔥 WHY EscrowNotFound HAPPENS

Continue & Fund
   ↓
Money sent
   ↓
createEscrow() NOT called
   ↓
Escrow does not exist
   ↓
markDelivered() → EscrowNotFound

---

# ✅ CORRECT RULE

Continue & Fund
   ↓
createEscrow()
   ↓
fundEscrow()
   ↓
Store escrowId in DB
   ↓
Publish listing ONLY AFTER SUCCESS
```
---

## 🔗 FRONTEND ↔ CONTRACT FLOW

Frontend NEVER stores money.

React UI
↓
Freighter Wallet
↓
Soroban Smart Contract
↓
Blockchain State
↓
Backend Sync
↓
UI Update

---

## 🎯 FUNCTION MAPPING

Create Escrow → createEscrow()
Fund Escrow → fundEscrow()
Start Work → markInProgress()
Deliver Work → markDelivered()
Approve Work → approveDelivery()
Request Refund → requestRefund()
Refund → refundEscrow()
Raise Issue → raiseDispute()
Resolve Issue → resolveDispute()
View Status → getEscrow()

---

## 👥 ROLE SYSTEM

Client:
- createEscrow
- fundEscrow
- approveDelivery
- requestRefund
- raiseDispute

Freelancer:
- markInProgress
- markDelivered

Admin:
- resolveDispute

---

## 📦 PROJECT STRUCTURE

frontend/
 ├── src/
 │   ├── app/
 │   ├── components/
 │   ├── hooks/
 │   ├── lib/
 │   ├── config/
 │   └── assets/

contracts/
 ├── escrow-contract/
 │   ├── src/
 │   │   ├── lib.rs
 │   │   ├── types.rs
 │   │   ├── storage.rs
 │   │   ├── escrow.rs
 │   │   ├── errors.rs

---

## 🧾 FUNDING FLOW

Step 1:
Continue & Fund clicked

Step 2:
createEscrow()

Step 3:
fundEscrow()

Step 4:
Funds go:

Client Wallet
↓
Soroban Contract (LOCKED)

NOT treasury wallet ❌

---

## 🔐 SECURITY MODEL

- No direct treasury wallet
- Funds locked in contract
- State-based execution only
- No bypass allowed

---

## 📈 CURRENT STATUS

Level 3 (Orange Belt)

Completed:
✔ Wallet integration  
✔ Contract deployment  
✔ Escrow creation  
✔ Funding flow  
✔ Basic state machine  
✔ getEscrow working  

In Progress:
- Delivery system
- UI workflow
- dispute module

---

## 🚀 NEXT ROADMAP

- Delivery Vault system
- File locking system
- Real-time escrow tracker
- Dispute system
- Production mainnet deployment

---

## 🧠 FINAL VISION

EscrowX = Fiverr + Upwork + Blockchain escrow trust layer

---

## ⚡ CORE RULE

If escrow not created → nothing exists  
If escrow not funded → not visible  
If not approved → money never moves
