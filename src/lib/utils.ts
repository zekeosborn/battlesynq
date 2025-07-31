import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatUnits } from 'viem';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(text: string) {
  if (typeof text !== 'string' || text.length === 0) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function shortenAddress(address: string) {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBalance(balance: bigint, decimals: number) {
  const raw = parseFloat(formatUnits(balance, decimals));
  return raw % 1 === 0 ? raw.toString() : raw.toFixed(2);
}
