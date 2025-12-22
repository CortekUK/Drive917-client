-- Fix rental_create_charge to include tenant_id
CREATE OR REPLACE FUNCTION "public"."rental_create_charge"("r_id" "uuid", "due" "date", "amt" numeric) RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
declare
  rc record;
  cid uuid;
begin
  select * into rc from rentals where id=r_id;

  -- Upsert against the unique index (one charge per rental+due_date)
  insert into ledger_entries(
    customer_id, rental_id, vehicle_id, entry_date,
    type, category, amount, due_date, remaining_amount, tenant_id
  )
  values(
    rc.customer_id, rc.id, rc.vehicle_id, due,
    'Charge', 'Rental', amt, due, amt, rc.tenant_id
  )
  on conflict on constraint ux_rental_charge_unique
  do update set
    amount = excluded.amount,
    remaining_amount = excluded.amount,
    tenant_id = excluded.tenant_id;

  -- return the existing/new id
  select id into cid
  from ledger_entries
  where rental_id = rc.id
    and type='Charge'
    and category='Rental'
    and due_date = due;

  return cid;
end;
$$;

-- Also add a trigger to auto-set tenant_id on ledger_entries if missing
CREATE OR REPLACE FUNCTION set_ledger_entry_tenant_id()
RETURNS TRIGGER AS $$
BEGIN
  -- If tenant_id is not set, try to get it from the rental
  IF NEW.tenant_id IS NULL AND NEW.rental_id IS NOT NULL THEN
    SELECT tenant_id INTO NEW.tenant_id
    FROM rentals
    WHERE id = NEW.rental_id;
  END IF;

  -- If still null and customer_id is set, try to get from customer
  IF NEW.tenant_id IS NULL AND NEW.customer_id IS NOT NULL THEN
    SELECT tenant_id INTO NEW.tenant_id
    FROM customers
    WHERE id = NEW.customer_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS set_ledger_entry_tenant_trigger ON ledger_entries;
CREATE TRIGGER set_ledger_entry_tenant_trigger
  BEFORE INSERT ON ledger_entries
  FOR EACH ROW
  EXECUTE FUNCTION set_ledger_entry_tenant_id();

-- Same for payment_applications
CREATE OR REPLACE FUNCTION set_payment_application_tenant_id()
RETURNS TRIGGER AS $$
BEGIN
  -- If tenant_id is not set, try to get it from the payment
  IF NEW.tenant_id IS NULL AND NEW.payment_id IS NOT NULL THEN
    SELECT tenant_id INTO NEW.tenant_id
    FROM payments
    WHERE id = NEW.payment_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_payment_application_tenant_trigger ON payment_applications;
CREATE TRIGGER set_payment_application_tenant_trigger
  BEFORE INSERT ON payment_applications
  FOR EACH ROW
  EXECUTE FUNCTION set_payment_application_tenant_id();
