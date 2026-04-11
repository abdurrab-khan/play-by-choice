// Constructing the PostgreSQL connection string from environment variables with defaults
export function getPostgresUrl() {
  const dbUser = process.env.POSTGRES_USER || "postgres";
  const dbPassword = process.env.POSTGRES_PASSWORD || "postgres";
  const dbHost = process.env.POSTGRES_HOST || "localhost";
  const dbPort = process.env.POSTGRES_PORT || "5433";
  const dbName = process.env.POSTGRES_DB || "mydb";
  const connectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

  return connectionString;
}
