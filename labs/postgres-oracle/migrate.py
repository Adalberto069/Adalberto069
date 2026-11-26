"""Transfer synthetic lab records from PostgreSQL to an empty Oracle schema."""
import os

import oracledb
import psycopg

oracledb.defaults.fetch_decimals = True

TABLES = (
    ("lab_customer", "id, name", ":1, :2"),
    ("lab_order", "id, customer_id, amount", ":1, :2, :3"),
)


def main():
    with psycopg.connect(os.environ["PG_DSN"]) as source:
        source.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY")
        with oracledb.connect(
            user=os.environ["ORACLE_USER"],
            password=os.environ["ORACLE_PASSWORD"],
            dsn=os.environ["ORACLE_DSN"],
        ) as target:
            with target.cursor() as cursor:
                try:
                    for table, _, _ in TABLES:
                        cursor.execute(f"SELECT COUNT(*) FROM {table}")
                        if cursor.fetchone()[0] != 0:
                            raise RuntimeError("Destination must be empty")
                    counts = {}
                    for table, columns, binds in TABLES:
                        query = f"SELECT {columns} FROM {table} ORDER BY id"
                        expected = source.execute(query).fetchall()
                        if expected:
                            cursor.executemany(
                                f"INSERT INTO {table} ({columns}) VALUES ({binds})",
                                expected,
                            )
                        cursor.execute(query)
                        actual = cursor.fetchall()
                        if expected != actual:
                            raise RuntimeError(f"Data mismatch in {table}")
                        counts[table] = len(actual)
                    target.commit()
                except Exception:
                    target.rollback()
                    raise
    for table, count in counts.items():
        print(f"{table}: {count} records validated")


if __name__ == "__main__":
    main()
