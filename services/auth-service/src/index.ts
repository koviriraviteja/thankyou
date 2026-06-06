import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@olx-clone/db';
// In a real app we'd use jsonwebtoken, but for now we'll simulate token generation

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// MOCK REDIS STORE FOR OTP
const otpStore = new Map<string, string>();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

app.post('/api/auth/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Simulate OTP generation
  const otp = '123456';
  otpStore.set(phoneNumber, otp);

  // In a real app, send OTP via MSG91 or Twilio here
  console.log(`[Twilio/MSG91 MOCK] Sent OTP ${otp} to ${phoneNumber}`);

  res.json({ message: 'OTP sent successfully' });
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  
  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  const storedOtp = otpStore.get(phoneNumber);
  
  if (storedOtp !== otp) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  // Clear OTP
  otpStore.delete(phoneNumber);

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { phoneNumber }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        phoneNumber,
        verified: true,
      }
    });
  }

  // Generate JWT Token (Mocked for simplicity without 'jsonwebtoken' dependency)
  const token = `mock-jwt-token-for-${user.id}`;

  res.json({ 
    message: 'Verified successfully',
    token,
    user: { id: user.id, phoneNumber: user.phoneNumber }
  });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
