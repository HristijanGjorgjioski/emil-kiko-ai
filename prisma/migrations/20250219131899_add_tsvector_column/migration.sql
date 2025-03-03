-- Enable PostgreSQL text search extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA public;
CREATE EXTENSION IF NOT EXISTS unaccent SCHEMA public;

-- Add a tsvector column (but NOT GENERATED ALWAYS)
ALTER TABLE "Movie" ADD COLUMN tsv tsvector;

-- Function to update tsvector column
CREATE FUNCTION movie_tsvector_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.tsv = to_tsvector(
    'english', 
    coalesce(NEW.name, '') || ' ' ||
    coalesce(array_to_string(NEW.genre, ' '), '') || ' ' ||
    coalesce(NEW.director, '') || ' ' ||
    coalesce(array_to_string(NEW.cast, ' '), '') || ' ' ||
    coalesce(NEW.setting, '') || ' ' ||
    coalesce(NEW.plot, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update tsv on insert/update
CREATE TRIGGER trigger_movie_tsvector
BEFORE INSERT OR UPDATE ON "Movie"
FOR EACH ROW EXECUTE FUNCTION movie_tsvector_update();

-- Create a GIN index to optimize search queries
CREATE INDEX idx_movie_tsv ON "Movie" USING GIN (tsv);