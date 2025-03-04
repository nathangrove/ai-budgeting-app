export async function categorizeTransaction(description: string): Promise<string> {
  // Simple categorization logic for demonstration purposes
  if (description.includes('grocery')) {
    return 'Groceries';
  } else if (description.includes('rent')) {
    return 'Rent';
  } else if (description.includes('salary')) {
    return 'Income';
  } else {
    return 'Miscellaneous';
  }
}
