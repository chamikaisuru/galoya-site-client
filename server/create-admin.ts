import { config } from "dotenv";
import { storage } from "./storage";
import { hashPassword } from "./auth";
import readline from "readline";

config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdmin() {
  console.log("\n🔐 Create Admin User\n");

  try {
    const username = await question("Enter admin username: ");
    const password = await question("Enter admin password: ");
    const confirmPassword = await question("Confirm password: ");

    if (!username || !password) {
      console.error("❌ Username and password are required!");
      rl.close();
      process.exit(1);
    }

    if (password !== confirmPassword) {
      console.error("❌ Passwords do not match!");
      rl.close();
      process.exit(1);
    }

    if (password.length < 8) {
      console.error("❌ Password must be at least 8 characters!");
      rl.close();
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      console.error(`❌ User '${username}' already exists!`);
      rl.close();
      process.exit(1);
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await storage.createUser({
      username,
      password: hashedPassword,
    });

    console.log(`\n✅ Admin user created successfully!`);
    console.log(`   Username: ${user.username}`);
    console.log(`   User ID: ${user.id}`);
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin:", error);
    rl.close();
    process.exit(1);
  }
}

createAdmin();