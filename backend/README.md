# API Backend

## Prerequisite: Configuring MongoDB

Before deploying the application, you must ensure your MongoDB instance is properly configured with a user who has full access to the database your application will use. This step is crucial for enabling authenticated connections between your application and MongoDB, enhancing security and access control.

### Step 1: Connect to MongoDB using `mongosh`

Open your terminal and connect to your MongoDB instance by running `mongosh`. If connecting to a local MongoDB instance, simply execute:

```bash
mongosh
```

For remote MongoDB instances, use:

```bash
mongosh "mongodb://yourMongoDBHost:port"
```

Replace `yourMongoDBHost` and `port` with your MongoDB instance's host address and port.

### Step 2: Select or Create Your Database

Switch to your target database by running the `use` command in `mongosh`. If the database does not exist, it will be created when you add a user:

```mongodb
use <YourDatabaseName>
```

Replace `<YourDatabaseName>` with the name of the database your application will use.

### Step 3: Create a User with Full Access

Create a user with a password and assign them the `dbOwner` role to grant full access to the database:

```mongodb
db.createUser({
  user: "<Username>",
  pwd: "<Password>",
  roles: [{ role: "dbOwner", db: "<YourDatabaseName>" }]
})
```

Replace `<Username>`, `<Password>`, and `<YourDatabaseName>` with your chosen username, a strong password, and your database name, respectively.

### Example:

Here's an example command that creates a user `adminUser` with the password `adminPass` for the `myAppDatabase` database:

```mongodb
use myAppDatabase
db.createUser({
  user: "adminUser",
  pwd: "adminPass",
  roles: [{ role: "dbOwner", db: "myAppDatabase" }]
})
```

### Important Notes:

- **Security**: Use strong, unique passwords for database users and consider implementing additional security measures like access control and encrypted connections (TLS/SSL).
- **Roles**: MongoDB offers various built-in roles for fine-grained access control. The `dbOwner` role provides comprehensive access for database management but assess your application's needs to assign the most appropriate roles.
