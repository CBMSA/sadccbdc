CREATE TABLE cbdc_faqs (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  question VARCHAR2(500),
  answer VARCHAR2(1000)
);

CREATE TABLE cbdc_wallets (
  id_number VARCHAR2(20) PRIMARY KEY,
  phone VARCHAR2(20),
  wallet_address VARCHAR2(100)
);