const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const mongoUrl = 'mongodb://localhost:27017/autoline';

async function createAdminWithHashedPassword() {
  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000
    });
    
    const db = mongoose.connection;
    const collection = db.collection('auths');
    
    const email = 'superadmin@ootoline.com';
    const password = 'password';
    
    // Check if already exists
    const existing = await collection.findOne({ email });
    if (existing) {
      console.log('Super Admin already exists, updating password...');
      
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Update with hashed password
      await collection.updateOne(
        { email },
        { $set: { password: hashedPassword, updated_at: new Date() } }
      );
      
      console.log('✅ Password updated for superadmin@ootoline.com');
    } else {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Insert super admin with hashed password
      await collection.insertOne({
        email,
        password: hashedPassword,
        usertype: 'admin',
        is_email_verified: true,
        is_phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      console.log('✅ Super Admin created with hashed password!');
    }
    
    console.log('Email: superadmin@ootoline.com');
    console.log('Password: password');
    console.log('User Type: admin');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminWithHashedPassword();
