use soroban_sdk::Env;
use crate::types::Escrow;
use crate::errors::Error;

#[derive(Clone)]
#[soroban_sdk::contracttype]
pub enum DataKey {
    Escrow(u64),
    Admin,
    Token,
}

pub fn save_escrow(env: &Env, escrow: &Escrow) {
    let key = DataKey::Escrow(escrow.id);
    env.storage().instance().set(&key, escrow);
}

pub fn get_escrow(env: &Env, id: u64) -> Result<Escrow, Error> {
    let key = DataKey::Escrow(id);
    if !env.storage().instance().has(&key) {
        return Err(Error::EscrowNotFound);
    }
    Ok(env.storage().instance().get(&key).unwrap())
}

pub fn update_escrow(env: &Env, escrow: &Escrow) {
    save_escrow(env, escrow);
}

pub fn set_admin(env: &Env, admin: &soroban_sdk::Address) {
    env.storage().instance().set(&DataKey::Admin, admin);
}

pub fn get_admin(env: &Env) -> Option<soroban_sdk::Address> {
    env.storage().instance().get(&DataKey::Admin)
}

pub fn set_token(env: &Env, token: &soroban_sdk::Address) {
    env.storage().instance().set(&DataKey::Token, token);
}

pub fn get_token(env: &Env) -> Option<soroban_sdk::Address> {
    env.storage().instance().get(&DataKey::Token)
}
