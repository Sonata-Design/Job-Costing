'use server';

import { PrismaClient } from '@prisma/client';
import { appendToSheet } from '@/lib/googleSheets';


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
        maximizerAbId: data.maximizerAbId, // Add the new field
        costItems: {
          create: transformedCostItems
        }
      },
      include: {
        costItems: true
      }
    });
    
    // Push to Google Sheets
    const sheetResult = await appendToSheet(data);
    
    if (!sheetResult.success) {
      console.error('Error updating Google Sheet:', sheetResult.error);
      // Just log the error but don't fail the submission
    }

    // Don't return the Prisma result directly as it may contain non-serializable objects
    // Instead, return a plain JavaScript object with just the data we need
    return {
      success: true,
      message: `Job cost data saved successfully and synced to Google Sheets! ID: ${result.id}`,
      // Convert to a plain object by extracting only the properties we need
      data: {
        id: result.id,
        address: result.address,
        jobNumber: result.jobNumber,
        maximizerId: result.maximizerId,
        maximizerAbId: result.maximizerAbId,
        costItems: result.costItems.map(item => ({
          id: item.id,
          item: item.item,
          vendor: item.vendor,
          value: item.value
        }))
      }
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
