use soroban_sdk::{contracttype, Address};

#[derive(Clone, Debug, PartialEq, Eq)]
#[contracttype]
pub struct Escrow {
    pub id: u64,
    pub client: Address,
    pub freelancer: Address,
    pub amount: i128,
    pub status: u32,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[repr(u32)]
pub enum Status {
    Pending = 0,
    Funded = 1,
    InProgress = 2,
    Delivered = 3,
    RevisionRequested = 4,
    Approved = 5,
    Disputed = 6,
    Refunded = 7,
    Completed = 8,
}
