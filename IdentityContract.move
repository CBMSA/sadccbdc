
address 0x1 {
module IdentityContract {
    public fun register_identity(account: address, name: vector<u8>, country: vector<u8>): bool {
        let identity = Identity { name: name, country: country, consented: false };
        move_to(&account, identity);
        true
    }

    public fun verify_identity(account: address): bool {
        let identity = borrow_global<Identity>(account);
        return is_some(identity);
    }

    public fun give_consent(account: address): bool {
        let identity = borrow_global_mut<Identity>(account);
        identity.consented = true;
        true
    }

    struct Identity has store {
        name: vector<u8>,
        country: vector<u8>,
        consented: bool,
    }
}
}
