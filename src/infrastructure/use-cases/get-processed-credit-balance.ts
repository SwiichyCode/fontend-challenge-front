import creditRepository from "@/infrastructure/data-access/credit";

export async function getProcessedCreditBalance(userId: string) {
  const credit = await creditRepository.getCredit(userId);

  if (!credit) {
    return {
      challenge_amount: 0,
      design_amount: 0,
    };
  }

  return {
    challenge_amount: credit.challenge_amount,
    design_amount: credit.design_amount,
  };
}
