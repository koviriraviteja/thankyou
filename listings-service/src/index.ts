import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'listings-service' });
});

app.get('/api/listings', async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' }
    });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

app.listen(PORT, () => {
  console.log(`Listings service running on port ${PORT}`);
});
