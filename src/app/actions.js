'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function submitJobCostData(data) {
  try {
    // Transform costItems to the format expected by Prisma
    const transformedCostItems = data.costItems.map(item => ({
      item: item.item,
      vendor: item.vendor,
      value: parseFloat(item.value)
    }));

    // Create the job cost entry with nested cost items
    const result = await prisma.jobCost.create({
      data: {
        address: data.address,
        jobNumber: data.jobNumber,
        maximizerId: data.maximizerId,
        costItems: {
          create: transformedCostItems
        }
      },
      include: {
        costItems: true
      }
    });

    return {
      success: true,
      message: `Job cost data saved successfully with ID: ${result.id}`,
      data: result
    };
  } catch (error) {
    console.error('Error saving job cost data:', error);
    return {
      success: false,
      message: `Failed to save job cost data: ${error.message}`,
      error
    };
  }
}
