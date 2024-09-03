import axios from 'axios';
import { SigningStargateClient } from '@cosmjs/stargate';
import { Validator } from '../data/validator.json'; // Define your types or import them if they are defined elsewhere

export const fetchStakingInfo = async (
  client: SigningStargateClient | null,
  account: any,
  validators: Validator[]
): Promise<{ stakedAmount: string; stakedValidator: Validator | null; error: string | null }> => {
  if (!account) return { stakedAmount: '0', stakedValidator: null, error: null };

  try {
    const response = await axios.get(`https://lcd.testnet.osmosis.zone/cosmos/staking/v1beta1/delegations/${account.address}`);
    const data = response.data;

    if (data.delegation_responses && data.delegation_responses.length > 0) {
      const delegation = data.delegation_responses[0].delegation;
      const validatorAddress = delegation.validator_address;
      const amount = data.delegation_responses[0].balance.amount;
      const validator = validators.find(v => v.operator_address === validatorAddress);

      return {
        stakedAmount: amount ? amount : '0',
        stakedValidator: validator || null,
        error: null
      };
    } else {
      return { stakedAmount: '0', stakedValidator: null, error: null };
    }
  } catch (err) {
    return { stakedAmount: '0', stakedValidator: null, error: `Failed to fetch staking info: ${err.message}` };
  }
};

export const fetchRewards = async (
  account: any,
  validators: Validator[]
): Promise<{ reward: string; stakedValidator: Validator | null; error: string | null }> => {
  if (!account) return { reward: '0', stakedValidator: null, error: null };

  try {
    const response = await axios.get(`https://lcd.testnet.osmosis.zone/cosmos/distribution/v1beta1/delegators/${account.address}/rewards`);
    const data = response.data;

    if (data.rewards && data.rewards.length > 0) {
      let totalReward = 0;

      for (const reward of data.rewards) {
        totalReward += reward.reward.reduce((acc: number, curr: any) => acc + parseFloat(curr.amount), 0);
      }

      const validatorAddress = data.rewards[0].validator_address;
      const validator = validators.find(v => v.operator_address === validatorAddress);

      return {
        reward: totalReward.toString(),
        stakedValidator: validator || null,
        error: null
      };
    } else {
      return { reward: '0', stakedValidator: null, error: null };
    }
  } catch (error) {
    return { reward: '0', stakedValidator: null, error: `Failed to fetch rewards: ${error.message}` };
  }
};
