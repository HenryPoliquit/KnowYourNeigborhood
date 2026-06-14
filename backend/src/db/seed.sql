-- Optional sample data. Run after schema.sql.
SET search_path TO kyn;

INSERT INTO stores (name, phone_number, locality, latitude, longitude)
VALUES
  ('Corner Grocery', '+65 6123 4567', 'Tampines, Singapore', 1.353699, 103.943760),
  ('Neighbourhood Bakery', '+65 6987 6543', 'Bedok, Singapore', 1.323976, 103.930216),
  ('Quiapo Sari-Sari Store', '+63 2 8123 4567', 'Quiapo, Manila', 14.598400, 120.983600),
  ('Poblacion Mini Mart', '+63 2 8765 4321', 'Makati', 14.565400, 121.034500),
  ('Cubao Corner Eatery', '+63 2 8222 3344', 'Quezon City', 14.619000, 121.053000),
  ('Colon Street Bakeshop', '+63 32 412 5566', 'Cebu City', 10.294900, 123.901900),
  ('Lahug Neighborhood Grocer', '+63 32 233 7788', 'Cebu City', 10.334000, 123.898000)
ON CONFLICT DO NOTHING;
