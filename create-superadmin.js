const mongoose = require('mongoose');

const mongoUrl = 'mongodb://localhost:27017/autoline';

async function createSuperAdmin() {
  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000
    });
    
    const db = mongoose.connection;
    
    // Create auth collection and insert super admin
    const collection = db.collection('auths');
    
    const email = 'superadmin@ootoline.com';
    const password = 'password';
    
    // Check if exists
    const existing = await collection.findOne({ email });
    if (existing) {
      console.log('✅ Super Admin already exists with email:', email);
      await mongoose.disconnect();
      process.exit(0);
    }
    
    // Insert super admin
    const result = await collection.insertOne({
      email,
      password,
      usertype: 'admin',
      is_email_verified: true,
      is_phone_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    console.log('✅ Super Admin created successfully!');
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

createSuperAdmin();
