export interface ProviderRpcError extends Error {
	message: string;
	code: number;
	data?: unknown;
}

export interface SwapType {
  tokenPair: string[],
  amount: number,
  slippage?: string
}

export interface Product {
  title: string;
  amount: number;
  currency: string;
}